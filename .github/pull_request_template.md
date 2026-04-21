<!--
⚠️ IMPORTANT:

1. Your PR title MUST follow the Conventional Commits standard (e.g., "feat(fsd): add rule for slicing boundaries").
2. Your PR MUST be targeted against the 'canary' branch. PRs targeting 'main' will be closed.
-->

📝 **Description**

<!-- Please include a summary of the changes and the related issue. Describe the rationale behind adding, modifying, or removing an ESLint rule or configuration. -->

🔗 **Related Issue**

<!-- If this PR fixes an open issue, please link it here (e.g., "Closes #123"). Note: Do NOT link public issues for security vulnerabilities. -->

🔍 **Type of Change**

<!-- Please delete options that are not relevant. -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue, e.g., fixing a false positive)
- [ ] ✨ New feature (e.g., new config or rule addition)
- [ ] 💥 Breaking change (e.g., turning a 'warn' into an 'error', or removing a rule entirely)
- [ ] 🛡️ Security fix (e.g., patching a vulnerability or upgrading compromised dependencies)
- [ ] 📚 Documentation update
- [ ] 🛠️ Refactoring / Chore (e.g., dependency updates, internal scripts)

✅ **Checklist**

<!-- Please review this checklist before submitting your PR. -->

- [ ] I have targeted the `canary` branch.
- [ ] My PR title follows the Conventional Commits standard.
- [ ] I have read the `CONTRIBUTING.md` document.
- [ ] I have run `yarn install` to ensure lockfile integrity (if dependencies changed).
- [ ] I have run `yarn typecheck` and `yarn build` successfully.
- [ ] I have run `yarn lint:fix` and my changes generate no new linting errors.

🧪 **How Has This Been Tested?**

<!-- Please describe how you verified your changes. -->

- [ ] Tested locally by applying the updated rule/config to a sample file and verifying the ESLint output.
- [ ] Added or updated unit/integration tests in the `tests/` directory.
- [ ] Verified security patches (if applicable) by checking the updated dependencies (e.g., via `yarn deps:audit`) and ensuring the plugin still compiles and runs correctly.
- [ ] ...
