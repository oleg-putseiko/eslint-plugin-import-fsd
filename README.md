<div align="center">

# eslint-plugin-import-fsd

[![Latest Release](https://badgen.net/github/release/oleg-putseiko/eslint-plugin-import-fsd?icon=github&cache=240)](https://github.com/oleg-putseiko/eslint-plugin-import-fsd/releases)
[![Total Downloads](https://badgen.net/npm/dt/eslint-plugin-import-fsd?icon=npm&cache=240)](https://www.npmjs.com/package/eslint-plugin-import-fsd)
[![Install Size](https://badgen.net/packagephobia/install/eslint-plugin-import-fsd?color=purple&cache=240)](https://www.npmjs.com/package/eslint-plugin-import-fsd)
[![License](https://badgen.net/npm/license/eslint-plugin-import-fsd?color=black&cache=240)](./LICENSE.md)

</div>

**Contents:**

- [Getting started](#getting-started)
- [Settings](#settings)
  - [rootDir](#rootdir)
  - [aliases](#aliases)
- [Rules](#rules)
  - [no-denied-layers](#no-denied-layers)

## Getting started

Install `eslint-plugin-import-fsd` to your repository as dev dependency:

```bash
npm install eslint-config-woofmeow --save-dev

pnpm install eslint-config-woofmeow --save-dev

yarn add eslint-config-woofmeow --dev
```

In your ESLint configuration file specify the directory where your FSD layers are located:

```js
export default {
  settings: {
    fsd: {
      rootDir: `${__dirname}/src`,
    },
  },
};
```

Add the `eslint-plugin-import-fsd` to the list of ESLint configuration plugins:

```js
export default {
  plugins: ['import-fsd'],
};
```

## Settings

### rootDir

Defines a directory that follows the FSD methodology. This option is required.

The value must be an absolute path to a folder with the layers.
Files and folders lying directly in this directory will be considered as layers.

For example, if your FSD layers are located in the `src` folder in the same directory
as the ESLint configuration file, the the `rootDir` option should be set as follow:

```js
export default {
  settings: {
    fsd: {
      rootDir: `${__dirname}/src`,
    },
  },
};
```

### aliases

Defines import path aliases.

A path associated with an alias can be absolute or relative to the root directory specified using option [`rootDir`](#rootdir).
Other values will be ignored.

An alias pattern can contain a `*` wildcard that matches any string. If it's present,
the matching part will be substituted into the path associated with the alias.

This option will not make aliases work, it tells the plugin which aliases are used in your project.

```js
export default {
  settings: {
    fsd: {
      rootDir: __dirname,
      aliases: {
        // @/features/foo -> <rootDir>/src/features/foo
        '@/*': './src/*',

        // bar -> <rootDir>/vendor/bar
        bar: './vendor/bar',

        // baz -> <rootDir>/src/baz_1
        '*': './src/baz_1',
        'baz/*': './src/baz_2',
        'baz/qux/*': './src/baz_3',

        // qux -> /qux
        qux: '/qux',
      },
    },
  },
};
```

## Rules

### no-denied-layers

Prevents import from a denied layer for a current one.

FSD layers have the following hierarchy, in which the first layer having the highest rank and the last one has the lowest:

1. `app`
2. `processes`
3. `pages`
4. `widgets`
5. `features`
6. `entities`
7. `shared`

A module of each layer has access only to layers located strictly lower in hierarchy:

| Layer       | Available layers                                                  |
| ----------- | ----------------------------------------------------------------- |
| `app`       | `processes`, `pages`, `widgets`, `features`, `entities`, `shared` |
| `processes` | `pages`, `widgets`, `features`, `entities`, `shared`              |
| `pages`     | `widgets`, `features`, `entities`, `shared`                       |
| `widgets`   | `features`, `entities`, `shared`                                  |
| `features`  | `entities`, `shared`                                              |
| `entities`  | `shared`                                                          |
| `shared`    | no one                                                            |

At the same time, each slice does not have access to other slices defined on the same layer. But each segment module has access to other segments within its slice.

Example:

```js
// .eslint.config.js

export default {
  plugins: ['import-fsd'],
  settings: {
    fsd: {
      rootDir: `${__dirname}/src`,
      aliases: {
        '@/*': './*',
      },
    },
  },
  rules: {
    'import-fsd/no-denied-layers': 'error',
  },
};
```

```ts
// @/features/foo/bar/qwe.js

// 📛 Error (denied layers)
import foo from '@/app/bar/baz';
import foo from '@/pages/bar/baz';
import foo from '@/widgets/bar/baz';

// ✅ OK
import foo from '@/entities/bar/baz';
import foo from '@/shared/bar/baz';

// 📛 Error (denied slices)
import foo from '@/features/bar/baz';
import foo from '@/features/qux/baz';

// ✅ OK
import foo from '@/features/foo/baz';
```

To make migration to FSD easier, there is an `ignores` option tha allows you to exclude the import from a listed layers from being checked by this rule:

```js
// .eslint.config.js

export default {
  ...

  rules: {
    'import-fsd/no-denied-layers': [
      'error',
      {
        ignores: ['widgets', 'features'],
      },
    ],
  },
};
```

```ts
// @/features/foo/bar/qwe.js

// 📛 Error (denied layers)
import foo from '@/app/bar/baz';
import foo from '@/pages/bar/baz';

// ✅ OK
import foo from '@/widgets/bar/baz'; // Ignored
import foo from '@/features/bar/baz'; // Ignored
import foo from '@/entities/bar/baz';
import foo from '@/shared/bar/baz';
```
