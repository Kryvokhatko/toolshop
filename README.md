# ToolShop Playwright Tests

End-to-end and API Playwright test suite for Practice Software Testing Toolshop: https://practicesoftwaretesting.com/

## Stack

- Playwright Test
- TypeScript (strict mode)
- Page Object Model + custom fixtures
- AJV JSON Schema validation
- GitHub Actions CI

## Architecture

```
lib/
├── fixtures/
│   ├── api.fixtures.ts      # Provides `api` (RequestHandler) for API tests
│   └── ui.fixtures.ts       # Provides guest/customer/admin browser contexts + page objects
├── pages/
│   ├── basePage.ts          # Base class: open(), submit()
│   ├── pageObjectManager.ts # Facade — single entry point to all page objects
│   └── *.ts                 # Individual page objects (LoginPage, CheckoutPage, …)
├── utils/
│   ├── requestHandler.ts    # Fluent API client (Template Method pattern)
│   ├── networkHelper.ts     # Typed Playwright route wrappers (network mocking)
│   ├── schemaValidator.ts   # AJV-based JSON Schema validation
│   └── logger.ts            # In-memory request/response logger for test failure context
└── responseSchemas/         # JSON Schema files per endpoint (used by schemaValidator)
```

**Key design patterns:**
- **Fixture system** — custom `test.extend` provides typed, pre-authenticated contexts for each user role (guest, customer, admin)
- **Page Object Model + PageObjectManager Facade** — all page objects instantiated once per test through a single manager; tests stay readable
- **Fluent RequestHandler (Template Method)** — HTTP verb methods (`getRequest`, `postRequest`, …) share a single `executeRequest` skeleton; only the method and body flag differ
- **Builder pattern** — `OrdersPayloadBuilder` constructs paginated response payloads for network mocking
- **AJV Schema Validation** — every API response in the API test suite is validated against a JSON Schema, catching contract regressions automatically

## Project structure

- `lib/fixtures` — shared fixtures for UI and API tests
- `lib/pages` — page objects and page object manager
- `lib/utils` — logger, request handler, network helper, schema validator
- `lib/responseSchemas` — API response schemas by endpoint/domain
- `tests/auth.setup.ts` — setup project that creates auth storage states
- `tests/UI_tests` — UI and mixed API+UI scenarios
- `tests/API_tests` — API-only scenarios
- `tests/testData` — payloads, message data, builders
- `tests/manualTestCases` — manual test case docs
- `.auth` — generated Playwright storage states (admin/customer)

## Prerequisites

- Node.js 20+
- npm 10+

## Local setup

1. Install dependencies

       npm ci

2. Copy `.env.example` to `.env` and populate credentials

       cp .env.example .env

3. Install Playwright browsers

       npx playwright install

4. Generate authenticated storage states (`.auth/admin.json` and `customer.json`)

       npm run test:setup

## Run tests

| Command | What it runs |
|---|---|
| `npm test` | Full suite |
| `npm run test:smoke` | Smoke tests only (`@smoke`) |
| `npm run test:regression` | Regression suite (`@regression`) |
| `npm run test:api` | API project only |
| `npm run test:setup` | Auth setup project |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:headed` | Headed browser mode |
| `npm run test:debug` | Debug mode |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run report` | Open HTML report |

## API Schema Validation

Response schemas live under `lib/responseSchemas/<domain>/`. The `validateSchema(dir, file, body)` utility compiles the schema with AJV and throws a detailed error (including the actual response body) if validation fails. Every API test in the suite validates its response against a schema.

Adding a schema for a new endpoint: create `lib/responseSchemas/<domain>/<METHOD>_<path>_schema.json` following the existing patterns, then call `await validateSchema(dir, file, response)` in the test.

See `APITeamStandard.md` for the team schema conventions.

## CI (GitHub Actions)

Workflow file: `.github/workflows/playwright.yml`

CI steps:
1. `npm ci`
2. `npm run lint` — fails the build on any lint error
3. `npx playwright install --with-deps`
4. `npx playwright test`
5. Upload HTML report artifact (30-day retention)

Required GitHub secrets:
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- `CUSTOMER_USERNAME`, `CUSTOMER_PASSWORD`
- `GUEST_USERNAME`, `GUEST_PASSWORD`
- `CUSTOMER_FIRST_NAME`, `CUSTOMER_LAST_NAME`

Optional: `UI_URL`, `API_URL` (defaults point to practicesoftwaretesting.com)

## Notes

- Message flow tests share real accounts — avoid parallelizing those runs unless you isolate test data per run.
- Run `npm run test:setup` again whenever the auth state files become stale.
- The user lifecycle test (`user.spec.ts`) generates a unique email per run to avoid conflicts with existing accounts.
