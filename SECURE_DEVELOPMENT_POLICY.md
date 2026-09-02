# FlightOps Secure Delivery Factory — Secure Development Policy

[English](SECURE_DEVELOPMENT_POLICY.md) | [Français](SECURE_DEVELOPMENT_POLICY.fr.md) | [中文](SECURE_DEVELOPMENT_POLICY.zh-CN.md)

> [!IMPORTANT]
> **Current operating mode (2026-09-02):** this repository is showcase-only and has no active AWS integration or deployment target. Release automation must stop after local build and verification. It must not request cloud credentials, contact staging or production, upload a deployable artifact, or deploy. Any AWS, Amplify, OIDC, Environment approval, post-deployment test or production-monitoring requirement elsewhere in this document is retained as historical policy context and is superseded by this notice.

## 1. Document control

| Field | Value |
| --- | --- |
| Version | 1.1 |
| Effective date | 2026-07-17 |
| Policy owner | ZHENG Qianyuan |
| Review frequency | Quarterly and after material changes |
| Applies to | Application code, dependencies and build-only CI/CD workflows |

## 2. Purpose

This policy defines how the FlightOps Secure Delivery Factory is designed, developed, tested, reviewed and released securely.

It establishes a Secure Software Development Life Cycle (SSDLC) in which security and quality controls apply throughout development, rather than only before production deployment.

The policy supports practices associated with ISO 27001, including risk-based change control, access control, secure development, vulnerability management, environment separation and evidence retention.

It does not by itself constitute ISO 27001 certification.

## 3. Scope

This policy applies to:

- React and TypeScript application code;
- automated tests and test data;
- npm dependencies and the lockfile;
- GitHub Actions workflows;
- GitHub repository and branch rules;
- build-only release automation;
- CI, security and test evidence;
- historical deployment evidence retained for audit and portfolio context;
- AI-assisted contributions.

The application is a demonstration system. Only fictional, non-sensitive data is permitted. Real flight, aircraft, passenger, employee or operational information is outside the approved scope.

## 4. Policy language

- **MUST** indicates a mandatory requirement.
- **MUST NOT** indicates a prohibited practice.
- **SHOULD** indicates a recommended practice that may be omitted only for a documented reason.
- **MAY** indicates an optional practice.

## 5. Roles and responsibilities

### Repository owner

The repository owner MUST:

- maintain this policy;
- manage repository and Environment access;
- maintain protected branch and required-check settings;
- review security-sensitive changes;
- approve or reject policy exceptions;
- triage identified vulnerabilities;
- ensure remediation is completed and verified;
- review security and quality indicators;
- authorize production releases.

### Contributors

Contributors MUST:

- work through branches and pull requests;
- follow secure coding requirements;
- include appropriate automated tests;
- review dependency changes;
- respond to CI and security findings;
- avoid committing secrets or sensitive data;
- treat AI-generated code as untrusted until reviewed and tested.

### Automated platform controls

GitHub Actions provides automated enforcement but does not replace human accountability. Automated controls MUST fail visibly when mandatory quality, security, test or deployment requirements are not satisfied.

### Separation-of-duties limitation

This is a personal project, so the repository owner may also be the developer and production approver. This limitation is accepted for the demonstration scope. A team or production system SHOULD require an independent reviewer for security-sensitive changes and production releases.

## 6. Secure Development Life Cycle

### 6.1 Planning

Before implementation, each change SHOULD identify:

- its purpose and expected behavior;
- affected components and environments;
- whether it introduces new data, dependencies, secrets or permissions;
- required tests;
- possible security consequences;
- acceptance criteria.

Changes introducing authentication, persistent storage, backend APIs, personal data or real operational data MUST receive a new security review before implementation.

### 6.2 Design

Design decisions MUST follow these principles:

- least privilege;
- minimal data collection;
- secure defaults;
- separation of staging and production;
- explicit trust boundaries;
- reproducible builds;
- traceability from source commit to deployed release;
- defense in depth;
- failure that prevents an unsafe release.

Security controls SHOULD be proportional to the sensitivity and operational impact of the component.

### 6.3 Implementation

Implementation work MUST:

- occur on a dedicated branch;
- be submitted through a pull request;
- remain focused and reviewable;
- use TypeScript safety features where applicable;
- validate untrusted input;
- avoid unsafe raw HTML rendering;
- avoid exposing implementation details or secrets in errors;
- include or update tests for changed behavior;
- avoid unrelated dependency or workflow changes.

Direct changes to protected `main` MUST NOT be used as the normal development process.

### 6.4 Verification

Every pull request MUST pass the applicable automated controls before merge:

- reproducible dependency installation with `npm ci`;
- ESLint;
- unit and component tests;
- coverage enforcement;
- production build;
- SonarQube analysis and Quality Gate;
- CodeQL analysis;
- dependency review;
- `npm audit`;
- Gitleaks secret scanning;
- Playwright end-to-end tests.

Failures MUST be investigated. A check MUST NOT be disabled or weakened solely to obtain a passing result.

### 6.5 Release

A release demonstration MUST be manually initiated, use a reviewed commit, install dependencies from the committed lockfile, run the defined checks and create an optimized build only inside the ephemeral runner.

It MUST stop after verification. It MUST NOT request cloud credentials, push a deployment branch, contact a hosted environment, upload a deployable artifact or perform a deployment.

### 6.6 Operation and maintenance

The project MUST monitor:

- CI and release-demonstration failures;
- Dependabot updates;
- scheduled security scans;
- SonarQube Quality Gate results;
- unresolved vulnerability findings.

Dependencies, actions and runtime versions SHOULD be updated before they become unsupported or materially obsolete.

## 7. Source control and review

The `main` branch MUST remain protected.

A pull request MUST:

- describe the change;
- remain limited to an understandable scope;
- pass required checks;
- receive the review required by repository rules;
- resolve relevant review comments before merge.

Security-sensitive changes include workflows, permissions, secrets, OIDC or IAM configuration, GitHub Environment configuration, dependencies, input handling, authentication, authorization, deployment logic and security scanning configuration.

Security-sensitive changes SHOULD receive additional manual review focused on permission changes, trust boundaries, bypass opportunities and unintended information disclosure.

## 8. Quality requirements

Changed behavior MUST be covered by an appropriate combination of unit, component, end-to-end and post-deployment smoke tests. Tests MUST be deterministic and MUST NOT depend on real operational data.

Statements, branches, functions and lines MUST each remain at or above the configured 80% coverage threshold. Coverage is a minimum gate, not proof that the application is correct or secure. Critical behavior MUST be tested even when the numerical threshold has already been met.

New code MUST NOT introduce unacceptable reliability, maintainability or security findings under the configured SonarQube Quality Gate. Technical debt and obsolete components SHOULD be reviewed regularly and addressed before they create material delivery or security risk.

## 9. Application security

Application code MUST:

- validate and normalize user-controlled values;
- use framework-provided output escaping;
- avoid `dangerouslySetInnerHTML` unless separately justified and reviewed;
- avoid dynamic code execution;
- avoid embedding credentials or environment secrets in frontend bundles;
- avoid logging sensitive values;
- handle errors without exposing secrets or internal security details;
- use secure, maintained dependencies.

Because the current application is public and unauthenticated, it MUST remain limited to fictional, in-memory demonstration data.

Adding persistence, authentication or backend services requires review of authorization, session handling, data protection, logging, abuse prevention and retention requirements.

## 10. Secrets and credentials

Secrets MUST NOT be:

- committed to source control;
- stored in application source code;
- placed in public documentation;
- exposed in frontend build variables;
- printed in workflow logs;
- included in test reports or artifacts;
- submitted to unapproved AI tools.

Repository and Environment secrets MUST be limited to the workflows and environments that require them.

Cloud deployment credentials MUST NOT be configured while the project has no deployment target. Historical AWS variables, secrets and trust relationships SHOULD be removed from GitHub and AWS after ownership is verified.

If a secret may have been exposed, it MUST be revoked or rotated immediately. The affected history, logs and artifacts MUST be reviewed, and the incident MUST be documented.

## 11. CI/CD security

Workflow permissions MUST:

- be explicitly declared;
- default to read-only access;
- grant write access only to jobs that require it;
- remain scoped to the relevant environment and operation.

The active workflows MUST NOT request `id-token: write`, cloud credentials or deployment write access. The release demonstration MUST remain manual and build-only.

Third-party GitHub Actions MUST come from a reputable and maintained source, use an explicit version, be reviewed before introduction or major upgrade, and operate with minimal permissions. Pinning high-trust release actions to full commit SHAs SHOULD be considered when stronger supply-chain assurance is required.

## 12. Dependency management

Dependencies MUST be installed using the committed `package-lock.json` and `npm ci` in automated workflows.

Dependency changes MUST be reviewed for necessity, maintenance status, source, publisher, known vulnerabilities, transitive impact, licensing implications and compatibility with the supported Node.js version.

Dependabot MUST remain configured for npm and GitHub Actions updates. High or critical dependency findings MUST block normal release until remediated or covered by an approved, time-limited exception. Unused dependencies SHOULD be removed.

## 13. Vulnerability management

Security findings may originate from CodeQL, SonarQube, dependency review, `npm audit`, Dependabot, Gitleaks, manual review, penetration testing, responsible disclosure or production observation.

Each confirmed vulnerability MUST have a severity, owner, remediation decision, target date, evidence of correction and verification before closure.

| Severity | Required response |
| --- | --- |
| Critical | Immediate triage and containment; remediation targeted within 72 hours |
| High | Remediation targeted within 7 calendar days |
| Medium | Remediation targeted within 30 calendar days |
| Low | Remediation targeted within 90 calendar days or accepted during review |

Active exploitation, credential exposure or unauthorized production access MUST be treated as Critical regardless of the original tool rating.

A finding MUST NOT be closed only because code changed. The correction MUST be verified by a repeated scan, automated test, manual review or appropriate security retest.

## 14. Security incidents

When a security incident is suspected, the repository owner MUST:

1. contain the affected access or release path;
2. stop unsafe deployments when necessary;
3. revoke or rotate affected credentials;
4. preserve relevant logs and evidence;
5. determine the affected commits, workflows and environments;
6. remediate the cause;
7. repeat affected tests and security checks;
8. verify the deployed version;
9. document lessons and required control improvements.

Production restoration MUST NOT bypass mandatory verification unless an approved emergency exception is recorded.

## 15. AI-assisted development

AI tools MAY assist with design, implementation, tests, documentation and review, but they MUST NOT replace human accountability.

Users of AI tools MUST:

- avoid submitting secrets, credentials or sensitive operational data;
- respect source-code confidentiality and tool privacy settings;
- review generated code before accepting it;
- verify dependencies and commands suggested by the tool;
- run the same tests and security controls as for human-written code;
- check for insecure assumptions, hallucinated APIs and excessive permissions;
- retain responsibility for the final change.

AI-generated code MUST be treated as untrusted third-party input until it has been reviewed, tested and scanned. AI output MUST NOT be used to bypass required review, Quality Gates or production approval.

## 16. Evidence and metrics

The following evidence SHOULD be retained or referenced:

- pull request review and check results;
- CI and security workflow logs;
- coverage reports;
- SonarQube results;
- CodeQL and dependency findings;
- Gitleaks results;
- Playwright reports;
- vulnerability remediation records.

The policy owner SHOULD review test coverage, Quality Gate status, CI success rate, open vulnerabilities by severity and age, remediation time, dependency status, technical debt and code complexity.

Artifacts currently retained for seven days provide short-term execution evidence. Longer retention SHOULD be introduced if contractual, regulatory or audit requirements demand it.

## 17. Exceptions

A mandatory control may be bypassed only when delaying the change would create a greater documented risk.

An exception MUST record the affected requirement, reason, security impact, compensating controls, owner, approval, expiration date and follow-up action.

Exceptions MUST be time-limited and reviewed before expiration. Convenience or schedule pressure alone is not sufficient justification.

## 18. Training and continuous improvement

Contributors SHOULD understand secure coding fundamentals, secrets handling, dependency risk, CI/CD permissions, interpretation of security findings, vulnerability remediation and safe use of AI development tools.

Security and quality requirements SHOULD be explained through review feedback, documentation and reusable pipeline controls.

The policy owner MUST periodically assess whether current controls remain effective as tools, threats, architecture and organizational needs evolve.

## 19. Policy review triggers

This policy MUST be reviewed:

- at least quarterly;
- after a security incident;
- after a material workflow or architecture change;
- when authentication, persistence or backend services are introduced;
- when new sensitive data enters scope;
- when deployment roles or OIDC trust policies change;
- when a new cloud or deployment platform is introduced;
- when required security tools are replaced;
- when applicable organizational or regulatory requirements change.

## 20. Compliance

Changes that do not satisfy this policy MUST NOT proceed through the normal release process unless a documented exception has been approved.

The repository owner is responsible for ensuring that the implemented GitHub and AWS controls remain consistent with this policy.
