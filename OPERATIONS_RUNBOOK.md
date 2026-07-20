# Production Operations Runbook

[English](OPERATIONS_RUNBOOK.md) | [Français](OPERATIONS_RUNBOOK.fr.md) | [简体中文](OPERATIONS_RUNBOOK.zh-CN.md)

## Purpose

This runbook describes how the FlightOps Secure Delivery Factory monitors Production availability and responds to a failed check.

Production URL:

<https://main.d2lh4ktwzmstsc.amplifyapp.com/>

The monitoring workflow is defined in `.github/workflows/smoke-test.yml`.

## Availability objective

The operational objective is to:

- run one automated Production check each day;
- investigate every completed check that fails;
- restore service through the existing controlled delivery process;
- record detection and recovery evidence in a GitHub Issue.

A successful check confirms that the endpoint returns a successful HTTP response after redirects and that the returned HTML contains the React root element and frontend asset references.

This is an internal project objective, not a customer-facing service-level agreement.

## Schedule and incident lifecycle

The workflow runs daily at `07:23 UTC` and can also be started manually.

It manages an Issue with this fixed title:

```text
[Operational Monitor] Production availability failure
```

The lifecycle is:

```text
Healthy check
  → No open incident

First failed check
  → Create an incident Issue

Repeated failed check
  → Add evidence to the existing Issue

Recovered check
  → Add a recovery comment
  → Close the Issue
```

Only one open Issue with this title should exist at a time.

## Failure evidence

For a failed check, the workflow records:

- the Production URL and UTC check time;
- the workflow event and whether the failure was simulated;
- a link to the GitHub Actions run;
- the available response headers, returned HTML, and smoke-test log.

Failure artifacts are retained for three days.

## Initial response

When an incident is created or updated:

1. Open the workflow run linked from the Issue.
2. Check whether `Controlled simulation` is `true`.
3. Review the failed step and `smoke-test.log`.
4. Determine whether the HTTP request or application-shell validation failed.
5. Review the latest Release workflow and Production deployment.
6. Run the Production Smoke Test manually with failure simulation disabled.
7. Keep the Issue open until an automated healthy check closes it.

Do not close the Issue based only on a successful browser visit.

## Investigation

For an HTTP failure:

1. Review the HTTP status and error in the workflow log.
2. Inspect `response-headers.txt` when available.
3. Test the Production URL from a separate browser or network.
4. Review the latest Release workflow.
5. Confirm that the Amplify Production branch is still `main`.

For an application-shell failure:

1. Inspect `production.html`.
2. Confirm that it contains `id="root"` and a `/assets/` reference.
3. Check whether Amplify returned an error page with a successful HTTP status.
4. Review recent changes to `index.html`, the Vite build, and Amplify configuration.

## Recovery

Recovery must use the existing controlled delivery path.

Do not:

- edit Production files manually;
- bypass required checks or Production Environment approval;
- force-push a deployment branch;
- create new AWS resources;
- use long-lived AWS credentials.

After corrective action:

1. Run the Production Smoke Test manually without failure simulation.
2. Confirm that the check succeeds.
3. Confirm that a recovery comment is added to the incident.
4. Confirm that the incident is closed.
5. Preserve the Issue and workflow links as evidence.

A dedicated controlled rollback workflow will be introduced separately. Until then, do not improvise an unreviewed rollback.

## Controlled monitoring drill

The incident lifecycle can be tested without disrupting Production.

To simulate detection:

1. Manually run the Production Smoke Test.
2. Set `simulate_failure` to `true`.
3. Confirm that the run fails intentionally.
4. Confirm that an incident Issue and failure artifact are created.

To simulate recovery:

1. Run the workflow again with `simulate_failure` set to `false`.
2. Confirm that the Production check succeeds.
3. Confirm that the incident receives a recovery comment and is closed.

The simulation changes only the monitoring result. It does not modify Production.

## Monitoring automation failure

If the workflow cannot manage the Issue:

1. Review the failed GitHub API step.
2. Confirm that the workflow grants `issues: write`.
3. Confirm that repository policy allows the workflow token to write Issues.
4. Create or update the incident manually if Production is unavailable.
5. Correct the automation through the normal pull request process.

The workflow uses the repository-scoped `GITHUB_TOKEN`; no personal access token is required.

## Known limitations

- GitHub Actions schedules are not real-time monitoring and can be delayed or dropped.
- Scheduled workflows run only from the default branch.
- Public-repository schedules may be disabled after 60 days without repository activity.
- One daily sample cannot measure continuous availability.
- The check validates reachability and the application shell, not every user journey.
- A GitHub outage can affect both monitoring and Issue reporting.
- GitHub Issues provide no guaranteed paging or response time.
- This personal project has no independent on-call team or separation of operational duties.

Workflow success is not proof of continuous Production availability, and no enterprise SLA is claimed.

## Cost constraints

This control uses a public repository, a standard GitHub-hosted runner, GitHub Actions, GitHub Issues, the repository `GITHUB_TOKEN`, and free command-line tools.

It introduces no commercial monitoring platform, paid runner, new AWS resource, paid incident-management service, or trial-dependent service. Failure artifacts are created only when needed and retained for three days.

GitHub references:

- <https://docs.github.com/en/actions/concepts/billing-and-usage>
- <https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows>
- <https://docs.github.com/en/actions/concepts/security/github_token>

## Evidence checklist

Retain links to:

- the failed monitoring run;
- the operational incident Issue;
- repeated-failure comments, when applicable;
- the successful recovery run;
- the recovery comment and closed Issue;
- the corrective Release or rollback run, when applicable.
