"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const api_fixtures_1 = require("../../lib/fixtures/api.fixtures");
const schemaValidator_1 = require("../../lib/utils/schemaValidator");
let authToken;
api_fixtures_1.test.beforeAll(async ({ api }) => {
    const response = await api
        .path('/users/login')
        .body({
        email: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
    })
        .postRequest(200);
    (0, test_1.expect)(response).toHaveProperty('access_token');
    (0, test_1.expect)(response.token_type).toBe('bearer');
    authToken = response.access_token;
});
api_fixtures_1.test.describe('Reports API', { tag: ['@regression', '@api'] }, () => {
    (0, api_fixtures_1.test)('GET average sales per month — structure and schema', async ({ api }) => {
        const response = await api
            .path('/reports/average-sales-per-month')
            .headers({
            Authorization: `bearer ${authToken}`,
            'Content-Type': 'application/json',
        })
            .getRequest(200);
        await (0, schemaValidator_1.validateSchema)('reports', 'GET_reports', response);
        (0, test_1.expect)(Array.isArray(response)).toBe(true);
        (0, test_1.expect)(response).toHaveLength(12);
        (0, test_1.expect)(response).toEqual(test_1.expect.arrayContaining([
            test_1.expect.objectContaining({
                month: test_1.expect.any(Number),
                average: test_1.expect.any(Number),
                amount: test_1.expect.any(Number),
            }),
        ]));
        for (const reportMonth of response) {
            (0, test_1.expect)(reportMonth.month).toBeGreaterThanOrEqual(1);
            (0, test_1.expect)(reportMonth.month).toBeLessThanOrEqual(12);
            (0, test_1.expect)(reportMonth.average).toBeGreaterThanOrEqual(0);
            (0, test_1.expect)(reportMonth.amount).toBeGreaterThanOrEqual(0);
        }
    });
});
