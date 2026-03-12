# ToolShop Playwright Tests

End-to-end Playwright test suite for the Practice Software Testing Toolshop application https://practicesoftwaretesting.com/

## Stack

- Playwright Test
- TypeScript page objects and fixtures
- GitHub Actions for CI

## Project structure

- `lib/pages`: page objects
- `lib/fixtures`: shared Playwright fixtures for guest, customer, and admin contexts
- `tests`: test specs and test data
- `.auth`: generated Playwright storage state files for authenticated sessions

## Prerequisites

- Node.js 20+
- npm 10+

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create a local env file from the example and populate real credentials:

   ```bash
   copy .env.example .env
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. Generate authenticated storage state for admin and customer users:

   ```bash
   npm run test:setup
   ```

## Run tests

- Full suite: `npm test`
- UI mode: `npm run test:ui`
- Headed mode: `npm run test:headed`
- Login tests only: `npm run test:login`
- Message flow only: `npm run test:message`
- API and UI check only: `npm run test:api-ui`
- Open HTML report: `npm run report`

## Manual registration spec

`tests/RegisterUser.spec.ts` is a one-off account bootstrap helper and is excluded from the default suite and CI runs.

Run it only when you intentionally want to create a new customer account:

```bash
set RUN_MANUAL_REGISTER=1
npm run test:register
```

## GitHub setup

Before pushing to GitHub:

1. Initialize git if this folder is not already a repository.
2. Keep `.env`, `.auth`, `playwright-report`, and `test-results` out of version control.
3. Add these repository secrets in GitHub Actions:
   - `UI_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `CUSTOMER_USERNAME`
   - `CUSTOMER_PASSWORD`
   - `GUEST_USERNAME`
   - `GUEST_PASSWORD`
   - `CUSTOMER_FIRST_NAME`
   - `CUSTOMER_LAST_NAME`

## Notes

- The message flow tests share real accounts. Avoid parallelizing those runs unless you isolate test data per run.
- Run `npm run test:setup` again whenever the auth state files become stale.