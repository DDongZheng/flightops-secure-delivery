# FlightOps Secure Delivery Factory — Delivery Evidence

## 1. Document information

| Field | Value |
| --- | --- |
| Evidence baseline | `7d2d92cb67ffc49469fbe46081d05ce3f812a2b8` |
| Verified on | 2026-07-17 |
| Repository | [DDongZheng/flightops-secure-delivery](https://github.com/DDongZheng/flightops-secure-delivery) |
| Production | [Flight Readiness Dashboard](https://main.d2lh4ktwzmstsc.amplifyapp.com/) |
| Staging | [Staging environment](https://staging.d2lh4ktwzmstsc.amplifyapp.com/) |

## 2. Purpose and evidence boundaries

This document provides traceable evidence for the quality, security and delivery controls implemented by the project.

The evidence combines:

- committed workflow and test configuration;
- protected pull request results;
- GitHub Actions execution records;
- GitHub Ruleset and Environment configuration;
- AWS Amplify deployment verification;
- post-deployment test results;
- retained workflow artifacts.

GitHub run and pull request links provide the durable evidence index. Downloadable artifacts are retained for seven days and therefore provide short-term supporting evidence rather than a permanent audit archive.

This project demonstrates practices associated with secure software delivery. The evidence does not claim ISO 27001 certification.

## 3. Delivery control flow

```text
Pull Request
  → Reusable CI
  → Reusable Security
  → Strict required checks
  → Protected main
  → Reusable CI + Reusable Security
  → Promote the same commit to staging
  → Explicit Amplify staging deployment
  → Verify deployed commit
  → Staging Playwright smoke tests
  → Production Environment approval
  → Explicit Amplify production deployment
  → Verify deployed commit
  → Production Playwright smoke tests
```

## 4. Implementation evidence index

| Capability | Pull request | Merge commit | Remote evidence |
| --- | --- | --- | --- |
| Reusable CI, reusable security and protected PR orchestration | [PR #9](https://github.com/DDongZheng/flightops-secure-delivery/pull/9) | `d663cfaadee5b0fec8a5ba8eeb3671705a255a64` | PR checks and merge history |
| Playwright end-to-end coverage | [PR #10](https://github.com/DDongZheng/flightops-secure-delivery/pull/10) | `aebb922ce0297540e4cacb51b0df9ccd4bda61e0` | [Successful Release](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29545534479) |
| Staging promotion, deployment verification and smoke tests | [PR #11](https://github.com/DDongZheng/flightops-secure-delivery/pull/11) | `60da1f0f5f7236fcd84433840b44119696c8bcc0` | [Successful Release](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29548058402) |
| Production approval, deployment verification and smoke tests | [PR #12](https://github.com/DDongZheng/flightops-secure-delivery/pull/12) | `5d6e363c19a5b166978e6829aeda8c75ac9deecb` | [Approval validation Release](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29549715697) |
| Multilingual secure development policy | [PR #13](https://github.com/DDongZheng/flightops-secure-delivery/pull/13) | `1143fef5f8f51d67ca9b81484dbf73ea51ea8e53` | [Successful end-to-end Release](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29552177587) |
| Traceable quality, security and deployment evidence | [PR #14](https://github.com/DDongZheng/flightops-secure-delivery/pull/14) | `7d2d92cb67ffc49469fbe46081d05ce3f812a2b8` | [Successful end-to-end Release](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29553327771) |

## 5. Quality and test evidence

### 5.1 Latest verified result

The latest complete Release for commit `7d2d92cb67ffc49469fbe46081d05ce3f812a2b8` recorded:

| Control | Result |
| --- | --- |
| ESLint | Passed |
| Unit and component test files | 3 passed |
| Unit and component tests | 17 passed |
| Production build | Passed |
| SonarQube analysis and Quality Gate | Passed |
| CI Playwright tests | 2 passed in 4.7 seconds |
| Staging Playwright tests | 2 passed in 2.2 seconds |
| Production Playwright tests | 2 passed in 2.2 seconds |

Source: [Release run #29553327771](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29553327771).

### 5.2 Coverage

The V8 coverage result recorded by the latest Release was:

| Metric | Result | Required threshold |
| --- | ---: | ---: |
| Statements | 93.65% | 80% |
| Branches | 93.10% | 80% |
| Functions | 100% | 80% |
| Lines | 93.44% | 80% |

The thresholds are enforced in `vitest.config.ts`. The HTML and LCOV reports are uploaded as the `coverage-report` artifact.

### 5.3 Test layers

| Layer | Implementation | Evidence |
| --- | --- | --- |
| Domain unit tests | Vitest tests for readiness calculation | Included in the 17 passing tests |
| React component tests | React Testing Library tests for the application and mission form | Included in the 17 passing tests |
| CI end-to-end tests | Playwright with Chromium against the production build | `playwright-report` |
| Staging smoke tests | Playwright against the deployed staging URL | `staging-playwright-report` |
| Production smoke tests | Playwright against the deployed production URL | `production-playwright-report` |
| Scheduled availability check | Daily HTTP and application-shell verification | [Successful scheduled smoke test](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29495983302) |

## 6. Security evidence

### 6.1 Pull request security gates

PR #14 completed all seven reported checks successfully:

- `CI / Quality checks`;
- `Security / CodeQL analysis`;
- `Security / Dependency review`;
- `Security / npm audit`;
- `Security / Secret scan`;
- GitHub CodeQL;
- SonarCloud Code Analysis.

Source: [PR #14 checks](https://github.com/DDongZheng/flightops-secure-delivery/pull/14/checks).

Dependency Review intentionally runs only for pull request events. It passed on PR #14 and was correctly skipped in the later push-triggered Release.

### 6.2 Security control coverage

| Risk area | Control | Enforcement or schedule |
| --- | --- | --- |
| Static application security | CodeQL for JavaScript and TypeScript | Pull requests, releases and weekly scheduled workflow |
| Code quality and security findings | SonarQube Quality Gate | Required CI path |
| Vulnerable dependency changes | GitHub Dependency Review | Pull requests; High severity blocks |
| Installed dependency vulnerabilities | `npm audit --audit-level=high` | Pull requests, releases and scheduled security workflow |
| Secret exposure | Gitleaks with full repository history | Pull requests, releases and scheduled security workflow |
| Dependency obsolescence | Dependabot for npm and GitHub Actions | Weekly |
| Supply-chain reproducibility | Committed lockfile and `npm ci` | All CI and release builds |
| Cloud credential exposure | GitHub OIDC and temporary AWS credentials | Staging and production deployment jobs |

### 6.3 Least-privilege observations

- Workflow permissions default to `contents: read`.
- Write access to repository contents is limited to the staging promotion job.
- `id-token: write` is limited to staging and production jobs that assume AWS roles.
- Staging and production use separate GitHub Environments and separate AWS roles.
- The deployment roles are limited to `amplify:StartJob` and `amplify:GetJob` for their target branch jobs.
- Long-lived AWS access keys are not used by the deployment workflow.

## 7. Repository governance evidence

The active `Protect main` Ruleset applies to the default branch and enforces:

- pull requests before merge;
- resolution of review conversations;
- prevention of branch deletion;
- prevention of non-fast-forward updates;
- strict required status checks against the latest target branch.

The six required status checks are:

1. `CI / Quality checks`;
2. `Security / CodeQL analysis`;
3. `Security / Dependency review`;
4. `Security / Secret scan`;
5. `Security / npm audit`;
6. `SonarCloud Code Analysis`.

The current Ruleset does not require an approving pull request review (`required_approving_review_count` is `0`). Automated gates and conversation resolution are enforced, but independent human approval is not claimed.

## 8. Environment and approval evidence

### Staging

- GitHub Environment: `staging`;
- allowed deployment branch policy: `main`;
- no manual approval is required;
- the job starts only after CI and security succeed.

### Production

- GitHub Environment: `production`;
- allowed deployment branch policy: `main`;
- required reviewer: `DDongZheng`;
- self-review prevention is disabled for this personal project;
- the production job depends on successful staging deployment and smoke tests.

The production control is a real approval gate, but it is not independent separation of duties because the project owner can approve their own deployment.

The approval behavior was explicitly validated in [Release run #29549715697](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29549715697): the production job waited for approval before AWS credentials were configured and the production deployment began.

## 9. Deployment integrity evidence

The latest end-to-end Release deployed commit:

```text
7d2d92cb67ffc49469fbe46081d05ce3f812a2b8
```

The Release recorded the following integrity checks:

| Stage | Verification | Result |
| --- | --- | --- |
| Staging branch promotion | Remote `staging` SHA equals `github.sha` | Passed |
| Amplify staging deployment | Returned `commitId` equals `github.sha` | Passed |
| Staging smoke tests | Two Playwright scenarios | Passed |
| Production approval | Production Environment gate | Approved before job execution |
| Amplify production deployment | Returned `commitId` equals `github.sha` | Passed |
| Production smoke tests | Two Playwright scenarios | Passed |

Source: [Release run #29553327771](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29553327771).

Both Amplify branches have Auto-build disabled. GitHub Actions explicitly starts each deployment, waits for the Amplify terminal status and rejects a mismatched commit.

## 10. Artifact evidence

The latest Release generated:

| Artifact | Purpose | Retention |
| --- | --- | ---: |
| `coverage-report` | HTML and LCOV coverage evidence | 7 days |
| `playwright-report` | CI end-to-end report, traces and failure media when applicable | 7 days |
| `staging-playwright-report` | Post-staging deployment test evidence | 7 days |
| `production-playwright-report` | Post-production deployment test evidence | 7 days |
| `gitleaks-results.sarif` | Secret scanning result | GitHub-managed run artifact |

Artifacts are accessible from the [latest Release summary](https://github.com/DDongZheng/flightops-secure-delivery/actions/runs/29553327771).

## 11. Control traceability

| Objective | Implemented control | Verifiable evidence |
| --- | --- | --- |
| Prevent unverified changes from reaching `main` | Pull request Ruleset and six strict required checks | PR #14 and `Protect main` Ruleset |
| Enforce repeatable quality checks | Reusable CI workflow | PR and Release quality jobs |
| Detect application and dependency risks | CodeQL, SonarQube, Dependency Review and npm audit | PR #14 checks |
| Detect committed secrets | Gitleaks | PR and Release secret-scan jobs |
| Verify browser behavior before merge | CI Playwright tests | `playwright-report` |
| Verify the release in staging | Explicit deploy, commit verification and Playwright | Release staging job |
| Require production authorization | GitHub `production` Environment | Deployment approval history |
| Avoid long-lived AWS credentials | GitHub OIDC | AWS credential configuration steps |
| Limit deployment authority | Separate least-privilege roles | Staging and production job configuration |
| Prevent deployment of the wrong commit | Branch SHA and Amplify `commitId` comparison | Release job logs |
| Verify production after deployment | Production Playwright tests | `production-playwright-report` |
| Detect later availability failure | Daily scheduled smoke test | Production Smoke Test workflow history |

## 12. Known limitations

- The project is maintained by one person, so pull request review and production approval do not provide independent separation of duties.
- Pull request approval count is currently zero; automated required checks remain enforced.
- Workflow artifacts are retained for seven days and are not a permanent audit archive.
- Third-party GitHub Actions use explicit version tags rather than full immutable commit SHAs.
- The Gitleaks action currently produces a Node.js 20 deprecation warning while still completing successfully.
- Monitoring is limited to GitHub workflow status, scheduled smoke tests and Amplify deployment records; there is no centralized observability or alert-management platform.
- There is no automated production rollback.
- The application is a public, in-memory demonstration using fictional data and must not be treated as a real flight operations system.

These limitations are accepted for the current portfolio scope and are documented in the Secure Development Policy.

## 13. Local reproduction

Use the project-supported Node.js 24 runtime and run:

```bash
npm ci
npm run lint
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:e2e
```

Local results supplement but do not replace the protected GitHub and deployment evidence recorded above.

## 14. Verification conclusion

The recorded evidence demonstrates that the project:

- applies automated quality and security gates before merge;
- uses a protected and traceable release path;
- deploys the same verified commit through staging and production;
- requires a production Environment approval;
- uses temporary, least-privilege AWS credentials;
- validates both environments after deployment;
- retains short-term test, coverage and security artifacts;
- documents its governance limitations without claiming controls that are not configured.
