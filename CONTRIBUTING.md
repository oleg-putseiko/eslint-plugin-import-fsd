# Contributing to eslint-plugin-import-fsd

This guide outlines the development process and coding standards for `eslint-plugin-import-fsd`. As an open-source project, adherence to these guidelines ensures code quality, stability, and a welcoming environment for all contributors.

## ❗ Before You Start

Before writing your first line of code, you **MUST** read and understand the following documents:

- **[LICENSE](./LICENSE.md)**: To understand the terms under which this project is distributed.
- **[SECURITY.md](./SECURITY.md)**: To learn how to report vulnerabilities privately and handle security patches.
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**: To understand our professional standards and communication etiquette.
- **[README.md](./README.md)**: For a deep dive into the project's architecture, rules, configs, and usage.
- **[scripts/README.md](./scripts/README.md)**: For a deep dive into the project's automation scripts, maintenance workflows, and internal DevOps tools.

## 🛠️ Prerequisites

To ensure a consistent development environment, the following tools are required:

- **Volta**: To automatically manage Node.js and Yarn versions.
- **Node.js**: 24.x.x _(or as specified in package.json)_
- **Yarn**: 4.x.x _(Berry)_

Run `yarn setup` from the root directory to initialize the environment. This command runs `yarn install` and configures Git hooks via Husky (`yarn setup:husky`).

## 🌿 Branching Strategy and Workflow

We follow a structured flow to ensure that the `main` branch always remains stable.

1. **Fork & Clone**: Fork the repository and clone it to your local machine.
2. **Feature Branches**: Create a branch from `canary` for any change.
   - Format: `feat/description`, `fix/description`, or `refactor/description`.
3. **Pull Requests (PR)**: All changes must be submitted via a PR targeting the **`canary`** branch. PRs targeting `main` will be closed or redirected.
4. **The `canary` Branch**: This is our integration and pre-release branch. Code here is tested by early adopters.
5. **The `main` Branch**: Releases are made by maintainers by merging `canary` into `main`. Direct commits to `main` are strictly prohibited.

## 📝 Commit Message Standard

This project enforces the [**Conventional Commits**](https://www.conventionalcommits.org/) standard via `commitlint`.

**If your commit message does not follow the standard, your push/PR will be automatically rejected.**

### Format

`<type>(<optional-scope>): <subject>`

### Allowed Types:

- `feat`: A new feature, rule, or config (Triggers a MINOR version bump).
- `fix`: A bug fix or rule correction (Triggers a PATCH version bump).
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code.
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `build`: Changes that affect the build system or external dependencies.
- `ci`: Changes to our CI configuration files and scripts.
- `chore`: Other changes that don't modify src or test files.
- `__wip__`: Work in progress. Used for intermediate commits. These must be squashed or amended before merging into `canary` and do not trigger version bumps.

## 🏗️ Project Structure

- **`src/`**: Source code for the ESLint plugin, internal rules, and exported configurations.
- **`tests/`**: Unit and integration tests for the plugin rules and configurations.
- **`dist/`**: Compiled output directory (ignored by Git).
- **`coverage/`**: Auto-generated test coverage reports (ignored by Git).
- **`scripts/`**: Internal utility scripts used for development (e.g., dependency audits). These are not published to npm.

## ⌨️ Available Commands

Run these commands from the root directory:

### 🛠️ Core Commands

- `yarn setup` — Initialize the environment (installs dependencies and configures Husky hooks).
- `yarn build` — Compile the plugin and generate TypeScript definitions.
- `yarn lint` — Run ESLint to check for code issues.
- `yarn lint:fix` — Run ESLint and Prettier, automatically fixing auto-fixable issues.
- `yarn format` — Check if files are formatted correctly.
- `yarn format:fix` — Format all files using Prettier.
- `yarn typecheck` — Validate TypeScript types without emitting compiled files.

### 🧹 Maintenance & Utilities

- `yarn deps:audit` — Run a dependency audit using our internal scripts.

## 🧪 Quality Control

Before pushing your changes and opening a PR, please run:

- `yarn lint:fix` — To ensure code style compliance.
- `yarn typecheck` — To ensure TypeScript integrity.
- `yarn build` — To verify that the plugin compiles correctly.

---

Thank you for contributing to `eslint-plugin-import-fsd`!
