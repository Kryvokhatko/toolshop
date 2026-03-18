import { test, expect } from '@playwright/test';

test("Login as Admin", async ({request}) => {
    const loginData = {
        email: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
    };

    const response = await request.post('/users/login', {
        data: loginData,
    });
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe("OK");
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('access_token');
    expect(responseBody.token_type).toBe("bearer");
});