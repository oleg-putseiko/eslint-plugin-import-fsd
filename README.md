<div align="center">

# eslint-plugin-import-fsd

[![Latest Release](https://badgen.net/github/release/oleg-putseiko/eslint-plugin-import-fsd?icon=github&cache=240)](https://github.com/oleg-putseiko/eslint-plugin-import-fsd/releases)
[![Total Downloads](https://badgen.net/npm/dt/eslint-plugin-import-fsd?icon=npm&cache=240)](https://www.npmjs.com/package/eslint-plugin-import-fsd)
[![Install Size](https://badgen.net/packagephobia/install/eslint-plugin-import-fsd?color=purple&cache=240)](https://www.npmjs.com/package/eslint-plugin-import-fsd)
[![License](https://badgen.net/npm/license/eslint-plugin-import-fsd?color=black&cache=240)](https://github.com/oleg-putseiko/eslint-plugin-import-fsd/blob/main/LICENSE.md)

</div>

ESLint plugin for following [Feature-Sliced Design](https://feature-sliced.design/) methodology in imports and file locations. Compatible with FSD versions up to 2.

**Contents:**

- [Getting started](#getting-started)
- [Settings](#settings)
  - [rootDir](#rootdir)
  - [aliases](#aliases)
- [Rules](#rules)
  - [no-denied-layers](#no-denied-layers)
  - [no-deprecated-layers](#no-deprecated-layers)
  - [no-unknown-layers](#no-unknown-layers)
- [Configs](#configs)
  - [recommended](#recommended)
- [Migration to FSD](#migration-to-fsd)

## Getting started

Install `eslint-plugin-import-fsd` to your repository as dev dependency:

```bash
npm install eslint-plugin-import-fsd --save-dev

pnpm install eslint-plugin-import-fsd --save-dev

yarn add eslint-plugin-import-fsd --dev
```

In your ESLint configuration file, add `eslint-plugin-import-fsd` to the list of plugins:

```js
export default {
  plugins: ['import-fsd'],
};
```

Specify the directory where your FSD layers are located:

```js
export default {
  plugins: ['import-fsd'],
  settings: {
    fsd: {
      rootDir: `${__dirname}/src`,
    },
  },
};
```

Configure the plugin [rules](#rules) or use the [recommended configuration](#recommended).

## Settings

### rootDir

Defines a directory that follows the FSD methodology. If not specified, the root directory will default to the directory containing the ESLint configuration file or the path passed with the `cwd` linter option.

The value must be an absolute path to a folder with the layers. Files and folders lying directly in this directory will be considered as layers.

For example, if your FSD layers are located in the `src` folder in the same directory as the ESLint configuration file, the `rootDir` option should be set as follows:

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

Tells the plugin which aliases are using in your project.

The path associated with an alias can be absolute or relative to the root directory specified using the option `rootDir`. Other values will not be resolved and will be used as is, because it's possible to identify a third-party package as a layer when it's not.

Alias patterns can contain the `*` wildcard that matches any string. If it's present, the matching part will be substituted into the path associated with the alias.

If an import path matches multiple aliases, the first match will be applied.

Example:

```js
export default {
  settings: {
    fsd: {
      rootDir: __dirname,
      aliases: {
        // @/foo/bar -> <rootDir>/src/foo/bar
        '@/*': './src/*',

        // bar -> <rootDir>/vendor/bar
        bar: './vendor/bar',

        // baz -> /baz
        baz: '/baz',

        // qux -> <rootDir>/src/qux-1
        '*': './src/qux-1',
        qux: './src/qux-2',
        'qux/*': './src/qux-3',
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

A module of each layer has access only to layers located strictly lower in the hierarchy:

| Layer       | Available layers                                                  |
| ----------- | ----------------------------------------------------------------- |
| `app`       | `processes`, `pages`, `widgets`, `features`, `entities`, `shared` |
| `processes` | `pages`, `widgets`, `features`, `entities`, `shared`              |
| `pages`     | `widgets`, `features`, `entities`, `shared`                       |
| `widgets`   | `features`, `entities`, `shared`                                  |
| `features`  | `entities`, `shared`                                              |
| `entities`  | `shared`                                                          |
| `shared`    | no one                                                            |

Each segment module on a slice has access to other segments, but not to other slices on the same layer.

Example:

```js
/* eslint.config.js */

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

```js
/* @/features/foo/bar/qwe.js */

// 📛 Error (denied layers)
import foo from '@/app/bar/baz';
import foo from '@/processes/bar/baz';
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

#### Options

- `ignores` - allows you to exclude the import from a listed layers from being checked by the rule. For more information, see [Migration to FSD](#migration-to-fsd) section.

  Possible value is an array consisting of a layer names.

### no-deprecated-layers

Prevents import from deprecated layers.

Previous versions of FSD have different layer names:

| Version 2   | Previous versions             |
| ----------- | ----------------------------- |
| `app`       | `core`, `init`                |
| `processes` | `flows`, `workflows`          |
| `pages`     | `screens`, `views`, `layouts` |
| `widgets`   | hasn't changed                |
| `features`  | `components`, `containers`    |
| `entities`  | `models`                      |
| `shared`    | `common`, `lib`               |

If you are using FSD version 2.0.0 or higher, it's recommended to add this rule to your ESLint configuration to follow the new layer naming.

Example:

```js
/* eslint.config.js */

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
    'import-fsd/no-deprecated-layers': 'error',
  },
};
```

```js
/* @/widgets/foo/bar/qwe.js */

// 📛 Error
import foo from '@/components/bar/baz';
import foo from '@/models/bar/baz';
import foo from '@/lib/bar/baz';

// ✅ OK
import foo from '@/features/bar/baz';
import foo from '@/entities/bar/baz';
import foo from '@/shared/bar/baz';
```

#### Options

- `declaration` - defines the target scope of the rule check.

  Possible values:

  - `import` - the rule will only check imports
  - `file` - the rule will only check files to see if they are in a deprecated layer
  - `all` (default) - the rule will check both imports and files

- `ignores` - allows you to exclude the import from a listed layers from being checked by the rule. For more information, see [Migration to FSD](#migration-to-fsd) section.

  Possible value is an array consisting of a layer names.

### no-unknown-layers

Prevents import from unknown layers.

The plugin supports layer naming corresponding to FSD version 2 and lower. Some layer names support both plural and singular.

Available layer names:

| Recommended names       | Deprecated names                                             |
| ----------------------- | ------------------------------------------------------------ |
| `app` (`apps`)          | `core`, `init`                                               |
| `processes` (`process`) | `flows` (`flow`), `workflows` (`workflow`)                   |
| `pages` (`page`)        | `screens` (`screen`), `views` (`view`), `layouts` (`layout`) |
| `widgets` (`widget`)    | —                                                            |
| `features` (`feature`)  | `components` (`component`), `containers` (`container`)       |
| `entities` (`entity`)   | `models` (`model`)                                           |
| `shared`                | `common`, `libs` (`lib`)                                     |

All other layer names are considered unknown.

Example:

```js
/* eslint.config.js */

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
    'import-fsd/no-unknown-layers': 'error',
  },
};
```

```js
/* @/widgets/foo/bar/qwe.js */

// 📛 Error
import foo from '@/qwe/bar/baz';
import foo from '@/feature-1/bar/baz';
import foo from '@/cores/bar/baz';

// ✅ OK
import foo from '@/feature/bar/baz';
import foo from '@/features/bar/baz';
import foo from '@/entities/bar/baz';
```

#### Options

- `declaration` - defines the target scope of the rule check.

  Possible values:

  - `import` - the rule will only check imports
  - `file` - the rule will only check files to see if they are in an unknown layer
  - `all` (default) - the rule will check both imports and files

- `ignores` - allows you to exclude the import from a listed layers from being checked by the rule. For more information, see [Migration to FSD](#migration-to-fsd) section.

  Possible value is an array consisting of a layer names.

## Configs

### recommended

Contains recommended plugin rules configuration:

| Rule                   | Severity | Options |
| ---------------------- | -------- | ------- |
| `no-denied-layers`     | error    | —       |
| `no-deprecated-layers` | warn     | —       |
| `no-unknown-layers`    | error    | —       |

To include the recommended configuration in yours, you need to add `plugin:import-fsd/recommended` to the list of extensions in your ESLint configuration file:

```js
export default {
  // ...
  extends: ['plugin:import-fsd/recommended'],
};
```

## Migration to FSD

For ease of migration to FSD, it's recommended to do this layer by layer. Therefore, an `ignores` option is provided for each rule. This option allows you to exclude the import from listed layers from being checked by the rule for which it's configured.

The option value must be an array consisting of layer names.

Example:

```js
/* eslint.config.js */

export default {
  // ...

  rules: {
    'import-fsd/no-denied-layers': [
      'error',
      {
        ignores: ['pages', 'widgets'],
      },
    ],

    'import-fsd/no-deprecated-layers': [
      'error',
      {
        ignores: ['components', 'models'],
      },
    ],

    'import-fsd/no-unknown-layers': [
      'error',
      {
        ignores: ['qwe'],
      },
    ],
  },
};
```

```js
/* @/widgets/foo/bar/qwe.js */

// ✅ OK
import foo from '@/pages/bar/baz'; // Ignored denied layer
import foo from '@/widgets/bar/baz'; // Ignored denied layer

// ✅ OK
import foo from '@/components/bar/baz'; // Ignored deprecated layer
import foo from '@/models/bar/baz'; // Ignored deprecated layer

// ✅ OK
import foo from '@/qwe/bar/baz'; // Ignored unknown layer
```
