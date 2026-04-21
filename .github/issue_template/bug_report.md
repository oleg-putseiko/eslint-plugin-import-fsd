---
name: Bug report
about: Create a report to help us improve the ESLint plugin
title: '[BUG] '
labels: bug
assignees: oleg-putseiko
---

<!--
⚠️ SECURITY NOTICE:

If you have discovered a security vulnerability, please DO NOT open a public issue.

Refer to the SECURITY.md file in the root directory for instructions on private reporting.
-->

🐛 **Bug description**

<!-- A clear and concise description of what the bug is (e.g., false positive, conflict between rules, parsing error). -->

🔄 **Reproduction steps**

<!-- Steps to reproduce the behavior: -->

1. Install version '...' of `eslint-plugin-import-fsd`
2. Create a file containing the following code: '...'
3. Run the ESLint command
4. See unexpected error or warning

✅ **Expected behavior**

<!-- A clear and concise description of what you expected to happen (e.g., "The rule `import-fsd/no-denied-layers` should not trigger on this specific syntax"). -->

🖥️ **Environment**

<!-- Please provide your environment details. -->

- OS:
- Node.js Version:
- ESLint Version: <!-- e.g., 9.39.4 -->
- `eslint-plugin-import-fsd` Version: <!-- e.g., 3.0.0 or 3.0.0-canary.2 -->
- Rule(s)/Config(s) used: <!-- e.g., import-fsd/no-restricted-paths, recommended -->

📄 **ESLint Configuration**

<!-- Paste your `eslint.config.mjs` (or `.js`) content below to help us reproduce the issue. -->

```javascript

```

📋 **Code Snippet & Terminal Output**

<!-- Paste the specific code snippet that fails and the exact CLI error output below. -->

Failing code:

```text

```

ESLint CLI Output:

```text

```

➕ **Additional context**

<!-- Add any other context about the problem here. Are you using Prettier alongside ESLint? Do you have any custom rule overrides in your config? -->
