import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS } from '../utils/layers';
import {
  extractPathContext,
  extractImportContext,
} from '../utils/rule/context';
import {
  Scope,
  isScope,
  isFileScope,
  isImportScope,
} from '../utils/rule/scope';
import { SCOPED_SCHEMA } from '../utils/rule/schema';

const UNKNOWN_FILE_LAYER_MESSAGE = "Unknown file layer '{{ layer }}'.";
const UNKNOWN_IMPORT_LAYER_MESSAGE = "Unknown layer '{{ layer }}'.";

const KNOWN_LAYER_NAMES = LAYERS.flatMap((item) => item.names);

export const noUnknownLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from an unknown layer.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-unknown-layers',
    },
    schema: [SCOPED_SCHEMA],
  },
  create(ruleContext) {
    const listener: Rule.RuleListener = {};

    const scope = ruleContext.options.at(0)?.scope ?? Scope.All;
    const ignoredLayers = ruleContext.options.at(0)?.ignores ?? [];

    if (!isScope(scope) || !isStringArray(ignoredLayers)) {
      return listener;
    }

    const pathContext = extractPathContext(ruleContext);

    if (!pathContext?.layer) return listener;

    if (
      isFileScope(scope) &&
      pathContext.layerIndex < 0 &&
      !ignoredLayers.includes(pathContext.layer)
    ) {
      listener.Program = (node) => {
        if (!pathContext?.layer) return;

        ruleContext.report({
          node,
          message: UNKNOWN_FILE_LAYER_MESSAGE,
          data: { layer: pathContext.layer },
        });
      };
    }

    if (isImportScope(scope)) {
      listener.ImportDeclaration = (node) => {
        const importContext = extractImportContext(node, pathContext);

        if (
          importContext?.layer &&
          !ignoredLayers.includes(importContext.layer) &&
          !KNOWN_LAYER_NAMES.includes(importContext.layer)
        ) {
          ruleContext.report({
            node,
            message: UNKNOWN_IMPORT_LAYER_MESSAGE,
            data: { layer: importContext.layer },
          });
        }
      };
    }

    return listener;
  },
};
