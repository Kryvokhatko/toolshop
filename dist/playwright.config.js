"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const uiBaseURL = process.env.UI_URL?.trim() || "https://practicesoftwaretesting.com";
const apiBaseURL = process.env.API_URL?.trim() || "https://api.practicesoftwaretesting.com";
exports.default = (0, test_1.defineConfig)({
    testDir: './tests',
    timeout: 100000,
    //testIgnore: ['**/RegisterUser.spec.ts'],
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['html'], ['list']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        baseURL: uiBaseURL,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },
        {
            name: 'chromium',
            use: { ...test_1.devices['Desktop Chrome'], baseURL: uiBaseURL },
            dependencies: ['setup'],
        },
        {
            name: "api",
            testMatch: /tests\/API_tests\/.*\.spec\.(ts|js)/,
            use: { baseURL: apiBaseURL }
        }
    ],
    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
