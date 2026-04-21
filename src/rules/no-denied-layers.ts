import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards.js';
import { type Layer, LAYERS } from '../utils/layers.js';
import { extractFileContext, extractImportContext } from '../utils/rule/context.js';
import { BASE_SCHEMA } from '../utils/rule/schema.js';

const extractIgnores = (context: Rule.RuleContext): string[] => {
  const ignores = context.options.at(0)?.ignores ?? [];

  return isStringArray(ignores) ? ignores : [];
};

export const noDeniedLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from a denied layer for a current one.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-denied-layers',
    },
    schema: [BASE_SCHEMA],
    messages: {
      deniedLayer: "Access to layer '{{ deniedLayer }}' from '{{ fileLayer }}' is denied.",
      deniedSlice: "Access to slice '{{ deniedSlice }}' from '{{ fileSlice }}' is denied.",
    },
  },
  create(context) {
    const fileCtx = extractFileContext(context);
    const ignores = extractIgnores(context);

    if (!fileCtx || fileCtx.layerIndex < 0) return {};

    const deniedLayers = LAYERS.slice(0, fileCtx.layerIndex + 1).flatMap((item) => item.names);

    return {
      ImportDeclaration(node) {
        const importCtx = extractImportContext(node, fileCtx);

        if (!importCtx || importCtx.layerIndex < 0) return;

        const hasLayers = !!fileCtx.layer && !!importCtx.layer;
        const shouldIgnore = !!importCtx.layer && ignores.includes(importCtx.layer);

        if (!hasLayers || shouldIgnore) return;

        const data = {
          fileLayer: fileCtx.layer,
          fileSlice: fileCtx.slice,
          deniedLayer: importCtx.layer,
          deniedSlice: importCtx.slice,
        };

        const isSameLayer = hasLayers && fileCtx.layer === importCtx.layer;

        if (isSameLayer) {
          const layer = LAYERS[fileCtx.layerIndex] as Layer | undefined;

          if (layer?.hasSlices) {
            if (!fileCtx.slice || !importCtx.slice) {
              context.report({ messageId: 'deniedLayer', node, data });
              return;
            }

            if (fileCtx.slice !== importCtx.slice) {
              context.report({ messageId: 'deniedSlice', node, data });
              return;
            }
          }

          return;
        }

        const isLayerDenied =
          hasLayers && !!importCtx.layer && deniedLayers.includes(importCtx.layer);

        if (isLayerDenied) context.report({ messageId: 'deniedLayer', node, data });
      },
    };
  },
};
