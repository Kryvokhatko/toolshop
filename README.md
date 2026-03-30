# ToolShop Playwright Tests

End-to-end and API Playwright test suite for Practice Software Testing Toolshop: https://practicesoftwaretesting.com/

## Stack

- Playwright Test
- TypeScript
- Page Object Model + custom fixtures
- GitHub Actions CI

## Project structure

- lib/fixtures: shared fixtures for UI and API tests
- lib/pages: page objects and page object manager
- lib/utils: logger, request handler, network helper, schema validator
- lib/responseSchemas: API response schemas by endpoint/domain
- tests/auth.setup.js: setup project that creates auth storage states
- tests/UI_tests: UI and mixed API+UI scenarios
- tests/API_tests: API-only scenarios
- tests/testData: payloads, message data, builders
- tests/manualTestCases: manual test case docs
- .auth: generated Playwright storage states (admin/customer)

## Prerequisites

- Node.js 20+
- npm 10+

## Local setup

1. Install dependencies

    npm ci

2. Create .env in the project root and populate required credentials

    UI_URL=https://practicesoftwaretesting.com
    API_URL=https://api.practicesoftwaretesting.com
    ADMIN_USERNAME=...
    ADMIN_PASSWORD=...
    CUSTOMER_USERNAME=...
    CUSTOMER_PASSWORD=...
    GUEST_USERNAME=...
    GUEST_PASSWORD=...
    CUSTOMER_FIRST_NAME=Customer
    CUSTOMER_LAST_NAME=UniqueUser

3. Install Playwright browsers

    npx playwright install

4. Generate authenticated storage states (.auth/admin.json and customer.json)

    npm run test:setup

## Run tests

General scripts (currently valid):
- Full suite: npm test
- Setup project only: npm run test:setup
- UI mode: npm run test:ui
- Headed mode: npm run test:headed
- Debug mode: npm run test:debug
- Chromium project: npm run test:chromium
- Open HTML report: npm run report

Targeted runs (recommended commands aligned with current folder layout):
- UI tests folder: npx playwright test tests/UI_tests
- API tests folder: npx playwright test tests/API_tests
- Login tests: npx playwright test login.spec.ts
- Message flow: npx playwright test messageFlow.spec.ts
- API + UI flow: npx playwright test apiandui.spec.ts
- Registration helper: npx playwright test RegisterUser.spec.ts --headed

## API Schema Files

Response schemas are stored under:
- lib/responseSchemas/reports

Current schema example:
- GET_reports_schema.json

Note:
- schemaValidator currently loads schema JSON files, but does not yet validate response payloads against schema rules.

## CI (GitHub Actions)

Workflow file:
- playwright.yml

CI runs:
- npm ci
- npx playwright install --with-deps
- npx playwright test

Required GitHub secrets:
- UI_URL
- ADMIN_USERNAME
- ADMIN_PASSWORD
- CUSTOMER_USERNAME
- CUSTOMER_PASSWORD
- GUEST_USERNAME
- GUEST_PASSWORD
- CUSTOMER_FIRST_NAME
- CUSTOMER_LAST_NAME

Optional/Recommended:
- API_URL (if omitted, project uses default API URL from playwright config)

   - `CUSTOMER_LAST_NAME`

## Notes

- The message flow tests share real accounts. Avoid parallelizing those runs unless you isolate test data per run.
- Run `npm run test:setup` again whenever the auth state files become stale.