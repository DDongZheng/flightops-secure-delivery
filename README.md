# FlightOps Secure Delivery Factory

[![CI](https://github.com/DDongZheng/flightops-secure-delivery/actions/workflows/ci.yml/badge.svg)](https://github.com/DDongZheng/flightops-secure-delivery/actions/workflows/ci.yml)
[![Security](https://github.com/DDongZheng/flightops-secure-delivery/actions/workflows/security.yml/badge.svg)](https://github.com/DDongZheng/flightops-secure-delivery/actions/workflows/security.yml)
[![Production Smoke Test](https://github.com/DDongZheng/flightops-secure-delivery/actions/workflows/smoke-test.yml/badge.svg)](https://github.com/DDongZheng/flightops-secure-delivery/actions/workflows/smoke-test.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DDongZheng_flightops-secure-delivery&metric=alert_status)](https://sonarcloud.io/summary/overall?id=DDongZheng_flightops-secure-delivery)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DDongZheng_flightops-secure-delivery&metric=coverage)](https://sonarcloud.io/summary/overall?id=DDongZheng_flightops-secure-delivery)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DDongZheng_flightops-secure-delivery&metric=security_rating)](https://sonarcloud.io/summary/overall?id=DDongZheng_flightops-secure-delivery)

A small-scale DevSecOps delivery factory for a simulated flight readiness application.

The project demonstrates how GitHub Actions can provide reusable quality, testing and security controls while AWS Amplify remains the AWS-specific continuous deployment and hosting target.

## Live Demo

[Open the Flight Readiness Dashboard](https://main.d2lh4ktwzmstsc.amplifyapp.com/)

The application uses fictional demonstration data only. 

It does not contain real flight, aircraft or operational information.

## Project Objectives

This project demonstrates:

- automated code quality checks;
- unit and component testing;
- test coverage enforcement;
- SonarQube Quality Gates;
- static application security testing;
- dependency vulnerability controls;
- protected Pull Request workflows;
- continuous deployment to AWS Amplify;
- cloud cost monitoring and budget alerts.

## Application Features

The Flight Readiness Dashboard allows a user to:

- view simulated flight missions;
- distinguish Draft, Ready and Blocked missions;
- create a new flight mission;
- complete a flight readiness checklist;
- report a technical issue;
- calculate the mission readiness status automatically.

Readiness rules:

```text
Mission not submitted
→ DRAFT

Mission submitted with an incomplete checklist
→ BLOCKED

Mission submitted with a technical issue
→ BLOCKED

Mission submitted with all checks completed
→ READY
```

⚠️ The application currently stores newly created missions in browser memory. Refreshing the page restores the original demonstration data.



## Architecture

```text
Developer
    |
    v
GitHub Pull Request
    |
    +-- GitHub Actions: lint, tests, coverage and build
    +-- SonarQube Cloud: code quality and Quality Gate
    +-- GitHub Security: CodeQL and dependency checks
    |
    v
Protected main branch
    |
    v
AWS Amplify Hosting
    |
    v
FlightOps web application
```

## Delivery Pipeline

### Pull Request

```text
Pull Request
→ ESLint
→ Unit tests
→ Coverage gate
→ Production build
→ SonarQube analysis
→ CodeQL analysis
→ Dependency review
→ npm audit
→ Merge allowed
```

## CI/CD Responsibilities
### GitHub Actions
GitHub Actions is the orchestration and governance layer. It determines whether a change is eligible to merge.

It runs:
```text
- Dependency installation with npm ci
- ESLint
- Vitest
- V8 test coverage
- An 80% coverage threshold
- The production build
- SonarQube analysis
- CodeQL
- Dependency Review
- npm audit
```
### AWS Amplify
AWS Amplify is the AWS-specific continuous deployment and hosting target.

It can:
```text
- Read the protected main branch
- Use Node.js 24
- Install dependencies reproducibly
- Build the Vite application
- Publish the dist directory
- Serve the application through HTTPS and the AWS CDN
```

## Technology Stack 
### Application
- React
- TypeScript
- Vite
- HTML and CSS

### Testing
- Vitest
- React Testing Livrary
- jsdom
- V8 Coverage
- LCOV

## Quality and Security 
- ESLint
- SonarQube Cloud
- CodeQL
- Dependency Review
- npm audit
- Dependabot

## Delivery and Hosting 
- GitHub Actions 
- GitHub Rulesets
- AWS Aamplify Hosting
- AWS Budgets (1 dollar maximum😁)

## License
This project is intended for learning and portfolio demonstration. 

(Specially for undeerstanding the difference between GitHub Actions and AWS Amplify)


