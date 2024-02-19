import { type JSONSchema4 } from 'json-schema';

import { DECLARATIONS } from './declarations';

export const BASE_SCHEMA: JSONSchema4 = {
  type: 'object',
  properties: {
    ignores: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
};

export const DECLARED_SCHEMA: JSONSchema4 = {
  ...BASE_SCHEMA,
  properties: {
    ...BASE_SCHEMA.properties,
    declaration: {
      enum: DECLARATIONS,
    },
  },
};
