import { expect } from '@playwright/test';
import { test } from '../../lib/fixtures/api.fixtures';

let authToken: string;

test.beforeAll(async ({ api }) => {
    const loginData = {
        email: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
    };

    const response = await api
    .path("/users/login")
    .body(loginData)
    .postRequest(200);

    expect(response).toHaveProperty('access_token');
    expect(response.token_type).toBe("bearer");
    authToken = response.access_token;
});

// GET /reports/average-sales-per-month Get average sales per month
test("Get average sales per month", async ({ api }) => {
    const response = await api
    .path("/reports/average-sales-per-month")
    .headers({
        "Authorization": `bearer ${authToken}`,
        "Content-Type": "application/json",
    })
    .getRequest(200);

    expect(Array.isArray(response)).toBe(true);
    expect(response).toHaveLength(12);
    expect(response).toEqual(expect.arrayContaining([expect.objectContaining({
                month: expect.any(Number),
                average: expect.any(Number),
                amount: expect.any(Number),
            }),
        ])
    );

    for (const reportMonth of response) {
        expect(reportMonth.month).toBeGreaterThanOrEqual(1);
        expect(reportMonth.month).toBeLessThanOrEqual(12);
        expect(reportMonth.average).toBeGreaterThanOrEqual(0);
        expect(reportMonth.amount).toBeGreaterThanOrEqual(0);
    }

    //expect(response).toContainEqual({ month: 1, average: 126.14, amount: 4 });
    //expect(response).toContainEqual({ month: 2, average: 44.29, amount: 4 });
    //expect(response).toContainEqual({ month: 3, average: 855.58, amount: 1 });
});