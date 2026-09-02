# Cloud Retirement Checklist

This checklist separates repository changes from external account cleanup. Removing deployment code prevents future repository-triggered deployments, but it does not delete resources that already exist in AWS or configuration stored in GitHub.

## Repository controls

- [x] Remove automatic release triggers.
- [x] Remove AWS CLI deployment commands.
- [x] Remove `id-token: write` and AWS credential configuration.
- [x] Remove the Amplify build specification.
- [x] Remove scheduled checks against the hosted application.
- [x] Remove operational Issue automation tied to the hosted application.
- [x] Retain only a manually triggered, build-only release demonstration.
- [x] Do not upload a release artifact from the demonstration workflow.
- [x] Remove CI report artifact uploads to avoid retained workflow storage.
- [x] Remove GitHub Actions dependency caching to avoid retained cache storage.

## GitHub cleanup

Complete these items in the repository settings after the repository change is merged:

- [ ] Remove AWS-specific repository and Environment variables, including `AWS_REGION`, `AWS_ROLE_ARN`, `AMPLIFY_APP_ID`, `AMPLIFY_BRANCH` and `AMPLIFY_URL` where present.
- [ ] Remove AWS-specific secrets if any were created.
- [ ] Remove or archive the `staging` and `production` GitHub Environments if they are no longer needed as historical configuration.
- [ ] Delete the remote `staging` deployment-pointer branch if it is no longer needed.
- [ ] Confirm that no other workflow, webhook or external integration can trigger a deployment.

## AWS account cleanup

Complete these items in the AWS account. Verify resource ownership before deletion; do not delete resources shared with another project.

- [ ] Disable any remaining Amplify automatic builds.
- [ ] Disconnect the GitHub repository from the Amplify application.
- [ ] Delete the Amplify application and its branches if they are dedicated to this project.
- [ ] Delete the project-specific staging and production IAM roles after confirming nothing else assumes them.
- [ ] Remove project-specific OIDC trust relationships that are no longer used.
- [ ] Review the AWS account for project-specific logs, domains or other resources created during the exercise.
- [ ] Check the AWS Billing console after cleanup and confirm that no project-related usage remains.

## Final verification

- [ ] Opening the GitHub Actions Release Demonstration shows a manual trigger only.
- [ ] The workflow source contains no `aws` command, AWS action, Amplify identifier or cloud credential permission.
- [ ] A manual demonstration run builds and tests the application but performs no deployment.
- [ ] The README states that the project has no hosted environment.
- [ ] Historical evidence is clearly labeled as retired and is not presented as current operation.
- [ ] AWS account cleanup has been independently verified in the AWS console.

## Important boundary

The repository can disable automation, but only the AWS account owner can confirm that previously created cloud resources and billing exposure have been removed. Do not treat the repository change alone as proof that the AWS account is fully retired.
