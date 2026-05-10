import { expect } from '@playwright/test';
import { test } from '../../lib/fixtures/api.fixtures';

test.describe('Authentication', { tag: ['@smoke', '@api'] }, () => {
    test('Login as Admin via RequestHandler', async ({ api }) => {
        const response = await api
            .path('/users/login')
            .body({
                email: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            })
            .postRequest(200);
        expect(response).toHaveProperty('access_token');
        expect(response.token_type).toBe('bearer');
    });

    // Raw Playwright request — baseline comparison to the custom RequestHandler above
    test('Login as Admin via raw Playwright request', async ({ request }) => {
        const response = await request.post('/users/login', {
            data: {
                email: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        expect(response.status()).toBe(200);
        expect(response.statusText()).toBe('OK');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('access_token');
        expect(responseBody.token_type).toBe('bearer');
    });
});
