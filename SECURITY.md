# Security Policy

We take the security of `eslint-plugin-import-fsd` seriously. We appreciate your efforts to responsibly disclose your findings.

## Supported Versions

Below is the list of versions that currently receive security updates.

| Version | Supported | Description                                                      |
| ------- | --------- | ---------------------------------------------------------------- |
| 3.x.x   | ✅        | Upcoming stable release branch. Receives security patches.       |
| 2.x.x   | ✅        | Current stable release branch. Receives security patches.        |
| Canary  | ⚠️        | Pre-release versions (e.g., `3.x.x-canary.x`). See policy below. |
| < 2.0.0 | ❌        | End of life. No longer receives security updates.                |

### Canary Releases Policy

Versions tagged with `canary` are published automatically for testing upcoming features, architectural changes, or dependency updates.

- **No Backports:** Canary versions **do not** receive backported security patches.
- **Forward-Fix Only:** If a vulnerability is discovered in a canary release, the fix will be applied to the `main` branch and released in the next consecutive `canary` or stable release.
- **Usage:** We strongly advise against using `canary` versions in critical production environments. If you are using a canary version and a vulnerability is disclosed, your only remediation path is to upgrade to a newer canary or the latest stable release.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please **do not disclose it publicly** (e.g., by creating a public GitHub issue). Public disclosure could put users at risk before a patch is available.

Please report it privately using one of the following methods:

**Option 1: GitHub Private Vulnerability Reporting (Preferred)**

1. Navigate to the **Security** tab of this repository.
2. Click on **Report a vulnerability** (or use [this direct link](https://github.com/oleg-putseiko/eslint-plugin-import-fsd/security/advisories/new)).
3. Fill in the details, including affected versions, a description of the potential impact, and detailed steps to reproduce the vulnerability.

**Option 2: Email**

1. Send an email to **oleg.putseiko@gmail.com**.
2. Include the word `[SECURITY]` in the subject line.
3. Provide the following details:
   - The package version(s) affected (e.g., `3.0.0` or `3.0.0-canary.1`).
   - A description of the potential impact.
   - Detailed steps to reproduce the vulnerability.

We will acknowledge receipt of your vulnerability report within 48 hours and strive to provide a timeline for a fix. Once the issue is resolved and a patch is released, we will coordinate with you on public disclosure.
