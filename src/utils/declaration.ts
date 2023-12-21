import { isString } from '@/utils/guards';

export enum Declaration {
  Import = 'import',
  File = 'file',
  All = 'all',
}

export const DECLARATIONS: string[] = [
  Declaration.Import,
  Declaration.File,
  Declaration.All,
];

export const isDeclaration = (value: unknown): value is Declaration =>
  isString(value) && DECLARATIONS.includes(value);

export const isFileDeclaration = (value: Declaration) =>
  [Declaration.File, Declaration.All].includes(value);

export const isImportDeclaration = (value: Declaration) =>
  [Declaration.Import, Declaration.All].includes(value);
