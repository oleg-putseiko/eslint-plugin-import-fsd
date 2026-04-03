import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { extractFileContext, extractImportContext } from '../utils/rule/context';
import { Scope, isScope, isFileScope, isImportScope } from '../utils/rule/scope';
import { SCOPED_SCHEMA } from '../utils/rule/schema';

const extractScope = (context: Rule.RuleContext): Scope => {
  const scope = context.options.at(0)?.scope ?? Scope.All;

  return isScope(scope) ? scope : Scope.All;
};

const extractIgnores = (context: Rule.RuleContext): string[] => {
  const ignores = context.options.at(0)?.ignores ?? [];

  return isStringArray(ignores) ? ignores : [];
};

export const noUnknownLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from an unknown layer.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-unknown-layers',
    },
    schema: [SCOPED_SCHEMA],
    messages: {
      unknownFileLayer: "Unknown file layer '{{ layer }}'.",
      unknownImportLayer: "Unknown layer '{{ layer }}'.",
    },
  },
  create(ruleContext) {
    const listener: Rule.RuleListener = {};

    const fileCtx = extractFileContext(ruleContext);

    const scope = extractScope(ruleContext);
    const ignoredLayers = extractIgnores(ruleContext);

    if (!fileCtx?.layer) return listener;

    if (isFileScope(scope)) {
      const isUnknown = fileCtx.layerIndex < 0;
      const isIgnored = ignoredLayers.includes(fileCtx.layer);

      if (isUnknown && !isIgnored) {
        listener.Program = (node) => {
          ruleContext.report({
            node,
            messageId: 'unknownFileLayer',
            data: { layer: fileCtx.layer },
          });
        };
      }
    }

    if (isImportScope(scope)) {
      listener.ImportDeclaration = (node) => {
        const importCtx = extractImportContext(node, fileCtx);

        if (!importCtx?.layer) return;

        const isUnknown = importCtx.layerIndex < 0;
        const isIgnored = ignoredLayers.includes(importCtx.layer);

        if (isUnknown && !isIgnored) {
          ruleContext.report({
            node,
            messageId: 'unknownImportLayer',
            data: { layer: importCtx.layer },
          });
        }
      };
    }

    return listener;
  },
};
