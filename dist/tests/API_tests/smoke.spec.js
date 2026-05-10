"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const api_fixtures_1 = require("../../lib/fixtures/api.fixtures");
api_fixtures_1.test.describe('Authentication', { tag: ['@smoke', '@api'] }, () => {
    (0, api_fixtures_1.test)('Login as Admin via RequestHandler', async ({ api }) => {
        const response = await api
            .path('/users/login')
            .body({
            email: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
        })
            .postRequest(200);
        (0, test_1.expect)(response).toHaveProperty('access_token');
        (0, test_1.expect)(response.token_type).toBe('bearer');
    });
    // Raw Playwright request — baseline comparison to the custom RequestHandler above
    (0, api_fixtures_1.test)('Login as Admin via raw Playwright request', async ({ request }) => {
        const response = await request.post('/users/login', {
            data: {
                email: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        (0, test_1.expect)(response.status()).toBe(200);
        (0, test_1.expect)(response.statusText()).toBe('OK');
        const responseBody = await response.json();
        (0, test_1.expect)(responseBody).toHaveProperty('access_token');
        (0, test_1.expect)(responseBody.token_type).toBe('bearer');
    });
});
