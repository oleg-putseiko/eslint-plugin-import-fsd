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
  - [overrides](#overrides)
- [Rules](#rules)
  - [no-denied-layers](#no-denied-layers)
  - [no-deprecated-layers](#no-deprecated-layers)
  - [no-unknown-layers](#no-unknown-layers)
- [Configs](#configs)
  - [recommended](#recommended)
  - [recommended-legacy](#recommended-legacy)

## Getting started

Install `eslint-plugin-import-fsd` to your repository as dev dependency:

```bash
npm install eslint-plugin-import-fsd --save-dev

pnpm install eslint-plugin-import-fsd --save-dev

yarn add eslint-plugin-import-fsd --dev
```

In your ESLint configuration file, add `eslint-plugin-import-fsd` to the list of plugins:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  {
    plugins: {
      'import-fsd': importFsdPlugin,
    },
  },
];
```

Specify the directory where your FSD layers are located:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  {
    plugins: {
      'import-fsd': importFsdPlugin,
    },
    settings: {
      fsd: {
        rootDir: `${__dirname}/src`,
      },
    },
  },
];
```

Configure the plugin [rules](#rules) or use the [recommended configuration](#recommended).

## Settings

### rootDir

Defines a directory that follows the FSD methodology. If not specified, the root directory will default to the directory containing the ESLint configuration file or the path passed with the `cwd` linter option.

The value must be an absolute path to a folder with the layers. Files and folders lying directly in this directory will be considered as layers.

For example, if your FSD layers are located in the `src` folder in the same directory as the ESLint configuration file, the `rootDir` option should be set as follows:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  {
    settings: {
      fsd: {
        rootDir: `${__dirname}/src`,
      },
    },
  },
];
```

### aliases

Tells the plugin which aliases used in your project should be handled.

The path associated with an alias can be absolute or relative to the project root directory. Other values will not be resolved and will be used as is.

Alias patterns can contain the `*` wildcard that matches any string. If it's present, the matching part will be substituted into the path associated with the alias.

If an import path matches multiple aliases, the first match will be applied.

Example:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  {
    settings: {
      fsd: {
        rootDir: `${__dirname}/src`,
        aliases: {
          // @/features/foo/bar -> <__dirname>/src/features/foo/bar
          '@/*': './src/*',

          // foo -> <__dirname>/vendor/foo
          foo: './vendor/foo',

          // bar -> /bar
          bar: '/bar',

          // baz -> baz/qwe
          // qux -> qwe/qwe
          baz: 'baz/qwe',
          '*': 'qwe/qwe',
          qux: 'qux/qwe',
        },
      },
    },
  },
];
```

### overrides

Assigns a layer and slice to a specified import path.

Once a layer and slice are assigned to an import path, it will be considered part of the project's FSD file structure.

Path patterns can contain the `*` wildcard that matches any string.

If an import path matches multiple overrides, the first match will be applied.

Example:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  {
    settings: {
      fsd: {
        overrides: {
          // foo -> features/foo
          foo: { layer: 'features', slice: 'foo' },

          // bar/baz -> features/bar
          'bar/*': { layer: 'features', slice: 'bar' },

          // @baz -> features/qwe
          '*': { layer: 'features', slice: 'qwe' },
          '@baz': { layer: 'features', slice: 'baz' },
        },
      },
    },
  },
];
```

## Rules

### no-denied-layers

Prevents import from a denied layer for a current one.

FSD layers have the following hierarchy, in which the first layer having the highest rank and the last one has the lowest:

1. `app`
2. `processes` _(deprecated)_
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
| `shared`    | —                                                                 |

Each segment module on a slice has access to other segments, but not to other slices on the same layer.

Example:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  {
    plugins: {
      'import-fsd': importFsdPlugin,
    },
    settings: {
      fsd: {
        rootDir: `${__dirname}/src`,
        aliases: {
          '@/*': './src/*',
        },
      },
    },
    rules: {
      'import-fsd/no-denied-layers': 'error',
    },
  },
];
```

```js
/* src/features/foo/bar/qwe.js */

// 📛 Error (denied layers)
import foo from '@/app/foo/bar';
import foo from '@/processes/foo/bar';
import foo from '@/pages/foo/bar';
import foo from '@/widgets/foo/bar';

// ✅ OK
import foo from '@/entities/foo/bar';
import foo from '@/shared/foo/bar';

// 📛 Error (denied slice)
import foo from '@/features/baz/qux';

// ✅ OK
import foo from '@/features/foo/qux';
```

#### Options

- `ignores` - allows you to exclude the import from a listed layers from being checked by the rule.

  Possible value is an array consisting of a layer names.

  Example:

  ```js
  /* eslint.config.js */

  import importFsdPlugin from 'eslint-plugin-import-fsd';

  export default [
    {
      // ...

      rules: {
        'import-fsd/no-denied-layers': [
          'error',
          { ignores: ['pages', 'widgets'] },
        ],
      },
    },
  ];
  ```

  ```js
  /* src/widgets/foo/bar/qwe.js */

  // ✅ OK
  import foo from '@/pages/foo/bar'; // Ignored denied layer
  import foo from '@/widgets/foo/baz'; // Ignored denied slice
  ```

### no-deprecated-layers

Prevents import from deprecated layers.

Previous versions of FSD have different layer names. Version FSD 2 provides new naming:

| Deprecated names                                                    | Recommended names                      |
| ------------------------------------------------------------------- | -------------------------------------- |
| `core`, `init`                                                      | `app` (`apps`)                         |
| `processes` (`process`), `flows` (`flow`), `workflows` (`workflow`) | `app` (`apps`), `features` (`feature`) |
| `screens` (`screen`), `views` (`view`), `layouts` (`layout`)        | `pages` (`page`)                       |
| —                                                                   | `widgets` (`widget`)                   |
| `components` (`component`), `containers` (`container`)              | `features` (`feature`)                 |
| `models` (`model`)                                                  | `entities` (`entity`)                  |
| `common`, `lib` (`libs`)                                            | `shared`                               |

If you are using FSD version 2.0.0 or higher, it's recommended to add this rule to your ESLint configuration to follow the new layer naming.

Example:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  {
    plugins: {
      'import-fsd': importFsdPlugin,
    },
    settings: {
      fsd: {
        rootDir: `${__dirname}/src`,
        aliases: {
          '@/*': './src/*',
        },
      },
    },
    rules: {
      'import-fsd/no-deprecated-layers': 'error',
    },
  },
];
```

```js
/* src/widgets/foo/bar/qwe.js */

// 📛 Error
import foo from '@/components/foo/bar';
import foo from '@/models/foo/bar';
import foo from '@/lib/foo/bar';

// ✅ OK
import foo from '@/features/foo/bar';
import foo from '@/entities/foo/bar';
import foo from '@/shared/foo/bar';
```

#### Options

- `scope` - defines the target scope of the rule check.

  Possible values:

  - `import` - the rule will only check imports
  - `file` - the rule will only check files to see if they are in a deprecated layer
  - `all` (default) - the rule will check both imports and files

- `ignores` - allows you to exclude the import from a listed layers from being checked by the rule.

  Possible value is an array consisting of a layer names.

  Example:

  ```js
  /* eslint.config.js */

  import importFsdPlugin from 'eslint-plugin-import-fsd';

  export default [
    {
      // ...

      rules: {
        'import-fsd/no-deprecated-layers': [
          'error',
          { ignores: ['components', 'models'] },
        ],
      },
    },
  ];
  ```

  ```js
  /* src/widgets/foo/bar/qwe.js */

  // ✅ OK
  import foo from '@/components/foo/bar'; // Ignored deprecated layer
  import foo from '@/models/foo/bar'; // Ignored deprecated layer
  ```

### no-unknown-layers

Prevents import from unknown layers.

The plugin supports layer naming corresponding to FSD version 2 and lower. Some layer names support both plural and singular.

Available layer names:

| Deprecated names                                                    | Recommended names                      |
| ------------------------------------------------------------------- | -------------------------------------- |
| `core`, `init`                                                      | `app` (`apps`)                         |
| `processes` (`process`), `flows` (`flow`), `workflows` (`workflow`) | `app` (`apps`), `features` (`feature`) |
| `screens` (`screen`), `views` (`view`), `layouts` (`layout`)        | `pages` (`page`)                       |
| —                                                                   | `widgets` (`widget`)                   |
| `components` (`component`), `containers` (`container`)              | `features` (`feature`)                 |
| `models` (`model`)                                                  | `entities` (`entity`)                  |
| `common`, `lib` (`libs`)                                            | `shared`                               |

All other layer names are considered unknown.

Example:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  {
    plugins: {
      'import-fsd': importFsdPlugin,
    },
    settings: {
      fsd: {
        rootDir: `${__dirname}/src`,
        aliases: {
          '@/*': './src/*',
        },
      },
    },
    rules: {
      'import-fsd/no-unknown-layers': 'error',
    },
  },
];
```

```js
/* src/widgets/foo/bar/qwe.js */

// 📛 Error
import foo from '@/qwe/foo/bar';
import foo from '@/some-feature/foo/bar';
import foo from '@/cores/foo/bar';

// ✅ OK
import foo from '@/feature/foo/bar';
import foo from '@/features/foo/bar';
import foo from '@/entities/foo/bar';
```

#### Options

- `scope` - defines the target scope of the rule check.

  Possible values:

  - `import` - the rule will only check imports
  - `file` - the rule will only check files to see if they are in an unknown layer
  - `all` (default) - the rule will check both imports and files

- `ignores` - allows you to exclude the import from a listed layers from being checked by the rule.

  Possible value is an array consisting of a layer names.

  Example:

  ```js
  /* eslint.config.js */

  import importFsdPlugin from 'eslint-plugin-import-fsd';

  export default [
    {
      // ...

      rules: {
        'import-fsd/no-unknown-layers': ['error', { ignores: ['qwe'] }],
      },
    },
  ];
  ```

  ```js
  /* src/widgets/foo/bar/qwe.js */

  // ✅ OK
  import foo from '@/qwe/foo/bar'; // Ignored unknown layer
  ```

## Configs

### recommended

Compatible with flat configuration format.

Contains recommended plugin rules configuration:

| Rule                   | Severity | Options |
| ---------------------- | -------- | ------- |
| `no-denied-layers`     | error    | —       |
| `no-deprecated-layers` | warn     | —       |
| `no-unknown-layers`    | error    | —       |

To include the recommended configuration in yours, you need to add it to the list of configurations in your ESLint configuration file:

```js
/* eslint.config.js */

import importFsdPlugin from 'eslint-plugin-import-fsd';

export default [
  importFsdPlugin.configs.recommended,
  // ...
];
```

### recommended-legacy

Compatible with eslintrc configuration format.

Contains recommended plugin rules configuration:

| Rule                   | Severity | Options |
| ---------------------- | -------- | ------- |
| `no-denied-layers`     | error    | —       |
| `no-deprecated-layers` | warn     | —       |
| `no-unknown-layers`    | error    | —       |

To include the recommended configuration in yours, you need to add `plugin:import-fsd/recommended-legacy` to the list of extensions in your ESLint configuration file:

```js
/* .eslintrc.js */

module.exports = {
  extends: ['plugin:import-fsd/recommended-legacy'],
  // ...
};
```
