import { isString } from '../guards';

export enum Scope {
  Import = 'import',
  File = 'file',
  All = 'all',
}

export const SCOPES: string[] = [Scope.Import, Scope.File, Scope.All];

export const isScope = (value: unknown): value is Scope =>
  isString(value) && SCOPES.includes(value);

export const isFileScope = (value: Scope): value is Scope.File | Scope.All =>
  [Scope.All, Scope.File].includes(value);

export const isImportScope = (
  value: Scope,
): value is Scope.Import | Scope.All =>
  [Scope.All, Scope.Import].includes(value);
