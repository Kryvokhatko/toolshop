import { expect } from '@playwright/test';
import { test } from '../../lib/fixtures/api.fixtures';
import { validateSchema } from '../../lib/utils/schemaValidator';

let authToken: string;

test.beforeAll(async ({ api }) => {
    const response = await api
        .path('/users/login')
        .body({
            email: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
        })
        .postRequest(200);

    await validateSchema('users', 'POST_users_login', response);
    expect(response).toHaveProperty('access_token');
    expect(response.token_type).toBe('bearer');
    authToken = response.access_token;
});

test.describe('Users API', { tag: ['@api'] }, () => {
    test('GET Retrieve all users', { tag: ['@smoke'] }, async ({ api }) => {
        const response = await api
            .path('/users')
            .headers({
                Authorization: `bearer ${authToken}`,
                'Content-Type': 'application/json',
            })
            .getRequest(200);
        await validateSchema('users', 'GET_users', response);
        expect(response).toHaveProperty('current_page');
    });

    test('GET Retrieve current user info', { tag: ['@smoke'] }, async ({ api }) => {
        const response = await api
            .path('/users/me')
            .headers({
                Authorization: `bearer ${authToken}`,
                'Content-Type': 'application/json',
            })
            .getRequest(200);
        await validateSchema('users', 'GET_users_me', response);
        expect(response).toHaveProperty('first_name');
    });

    /*
    Test case flow:
    POST /users/register    Create new Customer (unique email per run)
    GET  /users/{id}        Retrieve Customer, verify initial data
    PUT  /users/{userId}    Update Customer last name
    GET  /users/{id}        Verify update applied
    DELETE /users/{userId}  Delete Customer
    GET  /users/{id}        Confirm 404 — deletion verified
    */
    test('User lifecycle: register, read, update and delete', { tag: ['@regression'] }, async ({ api, request }) => {
        const uniqueEmail = `test_user_${Date.now()}@toolshop.test`;
        const newUserPayload = {
            first_name: process.env.CUSTOMER_FIRST_NAME ?? 'Customer',
            last_name: process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser',
            address: {
                street: 'Street 28',
                city: 'Kyiv',
                state: 'Kyiv',
                country: 'Ukraine',
                postal_code: '03088',
            },
            phone: '12345678',
            dob: '2000-02-22',
            password: process.env.CUSTOMER_PASSWORD,
            email: uniqueEmail,
        };
        const authHeaders = {
            Authorization: `bearer ${authToken}`,
            'Content-Type': 'application/json',
        };

        // POST /users/register
        const responseRegister = await api
            .path('/users/register')
            .body(newUserPayload)
            .postRequest(201);
        await validateSchema('users', 'POST_users_register', responseRegister);
        const userId = responseRegister.id.toString();

        // GET /users/{id} — verify initial state
        const responseCustomerBefore = await api
            .path(`/users/${userId}`)
            .headers(authHeaders)
            .getRequest(200);
        await validateSchema('users', 'GET_users_userId', responseCustomerBefore);
        expect(responseCustomerBefore.last_name).toBe(newUserPayload.last_name);

        // PUT /users/{userId} — update last name
        const responseUpdate = await api
            .path(`/users/${userId}`)
            .headers(authHeaders)
            .body({ ...newUserPayload, last_name: 'Modified' })
            .putRequest(200);
        await validateSchema('users', 'PUT_users_userId', responseUpdate);
        expect(responseUpdate).toHaveProperty('success');

        // GET /users/{id} — verify update applied
        const responseCustomerAfter = await api
            .path(`/users/${userId}`)
            .headers(authHeaders)
            .getRequest(200);
        expect(responseCustomerAfter.last_name).toBe('Modified');

        // DELETE /users/{userId}
        const apiUrl = process.env.API_URL ?? 'https://api.practicesoftwaretesting.com';
        const deleteResponse = await request.delete(`${apiUrl}/users/${userId}`, {
            headers: { Authorization: `bearer ${authToken}` },
        });
        expect(
            deleteResponse.ok(),
            `DELETE /users/${userId} failed with status ${deleteResponse.status()}`,
        ).toBeTruthy();

        // GET /users/{id} — confirm deletion (expect 404)
        const responseAfterDelete = await request.get(`${apiUrl}/users/${userId}`, {
            headers: { Authorization: `bearer ${authToken}` },
        });
        expect(responseAfterDelete.status()).toBe(404);
    });
});
