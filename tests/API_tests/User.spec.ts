import { test, expect } from '@playwright/test';

let authToken: any; 
test.beforeAll(async ({ request }) => {
    const loginData = {
        email: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
    };
    const loginResponse = await request.post('/users/login', {
        data: loginData 
    });
    const loginBody = await loginResponse.json();
    authToken = loginBody.access_token;
});

test("GET Retrieve all users", async ({ request }) => {
    const response = await request.get('/users', {
        headers: {
            "Authorization": `bearer ${authToken}`,
            "Content-Type": "application/json"
        }
    });
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("current_page");
});

test("GET Retrieve current customer info", async ({ request }) => {
    const response = await request.get("/users/me", {
        headers: {
            "Authorization": `bearer ${authToken}`,
            "Content-Type": "application/json"
        },
        data: {},
    });
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe("OK");

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("first_name");
});