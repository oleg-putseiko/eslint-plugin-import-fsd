import { type Rule } from 'eslint';

import { isString, isStringArray } from '../utils/guards';
import { LAYERS, getLayerNames } from '../utils/layers';
import {
  extractFileDataFromContext,
  extractImportDataFromNode,
} from '../utils/rule';

enum Declaration {
  Import = 'import',
  File = 'file',
  All = 'all',
}

const UNKNOWN_FILE_LAYER_MESSAGE = "Unknown file layer '{{ layer }}'.";
const UNKNOWN_IMPORT_LAYER_MESSAGE = "Unknown layer '{{ layer }}'.";

const KNOWN_LAYER_NAMES = LAYERS.flatMap(getLayerNames);

const DECLARATIONS: string[] = [
  Declaration.Import,
  Declaration.File,
  Declaration.All,
];

const isDeclaration = (value: unknown): value is Declaration =>
  isString(value) && DECLARATIONS.includes(value);

export const noUnknownLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from an unknown layer.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-unknown-layers',
    },
    schema: [
      {
        type: 'object',
        properties: {
          declaration: {
            enum: DECLARATIONS,
          },
          ignores: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const ignoredLayers = context.options.at(0)?.ignores ?? [];
    const declaration = context.options.at(0)?.declaration ?? Declaration.All;

    if (!isStringArray(ignoredLayers) || !isDeclaration(declaration)) {
      return {};
    }

    const fileData = extractFileDataFromContext(context);

    if (!fileData?.layer) return {};

    if (
      fileData.layerIndex < 0 &&
      !ignoredLayers.includes(fileData.layer) &&
      (declaration === Declaration.File || declaration === Declaration.All)
    ) {
      return {
        Program(node) {
          if (!fileData?.layer) return;

          context.report({
            node,
            message: UNKNOWN_FILE_LAYER_MESSAGE,
            data: { layer: fileData.layer },
          });
        },
      };
    }

    if (declaration !== Declaration.Import && declaration !== Declaration.All) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const importData = extractImportDataFromNode(node, fileData);

        if (!importData?.layer) return;

        if (
          !ignoredLayers.includes(importData.layer) &&
          !KNOWN_LAYER_NAMES.includes(importData.layer)
        ) {
          context.report({
            node,
            message: UNKNOWN_IMPORT_LAYER_MESSAGE,
            data: { layer: importData.layer },
          });
        }
      },
    };
  },
};
