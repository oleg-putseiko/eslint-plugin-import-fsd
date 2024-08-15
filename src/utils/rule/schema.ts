import { type JSONSchema4 } from 'json-schema';

import { SCOPES } from './scope';

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

export const SCOPED_SCHEMA: JSONSchema4 = {
  ...BASE_SCHEMA,
  properties: {
    ...BASE_SCHEMA.properties,
    scope: { enum: SCOPES },
  },
};
