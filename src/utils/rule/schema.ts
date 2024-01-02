import { type Rule } from 'eslint';

import { DECLARATIONS } from './declarations';

type Schema = Rule.RuleMetaData['schema'];

export const BASE_SCHEMA: Schema = {
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

export const DECLARED_SCHEMA: Schema = {
  ...BASE_SCHEMA,
  properties: {
    ...BASE_SCHEMA.properties,
    declaration: {
      enum: DECLARATIONS,
    },
  },
};
