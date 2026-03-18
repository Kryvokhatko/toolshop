import { expect } from '@playwright/test';
import { test } from '../../lib/fixtures/api.fixtures';

test("Login as Admin", async ({ api }) => {
    const loginData = {
        email: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
    };

    const response = await api
    .path("/users/login")
    .body(loginData)
    .postRequest(200)
    console.log(response);
    expect(response).toHaveProperty('access_token');
    expect(response.token_type).toBe("bearer");
});

//check for test with query parameters


test("Login as Admin OLD", async ({request}) => {
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