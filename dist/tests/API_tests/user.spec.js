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
    await (0, schemaValidator_1.validateSchema)('users', 'POST_users_login', response);
    (0, test_1.expect)(response).toHaveProperty('access_token');
    (0, test_1.expect)(response.token_type).toBe('bearer');
    authToken = response.access_token;
});
api_fixtures_1.test.describe('Users API', { tag: ['@api'] }, () => {
    (0, api_fixtures_1.test)('GET Retrieve all users', { tag: ['@smoke'] }, async ({ api }) => {
        const response = await api
            .path('/users')
            .headers({
            Authorization: `bearer ${authToken}`,
            'Content-Type': 'application/json',
        })
            .getRequest(200);
        await (0, schemaValidator_1.validateSchema)('users', 'GET_users', response);
        (0, test_1.expect)(response).toHaveProperty('current_page');
    });
    (0, api_fixtures_1.test)('GET Retrieve current user info', { tag: ['@smoke'] }, async ({ api }) => {
        const response = await api
            .path('/users/me')
            .headers({
            Authorization: `bearer ${authToken}`,
            'Content-Type': 'application/json',
        })
            .getRequest(200);
        await (0, schemaValidator_1.validateSchema)('users', 'GET_users_me', response);
        (0, test_1.expect)(response).toHaveProperty('first_name');
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
    (0, api_fixtures_1.test)('User lifecycle: register, read, update and delete', { tag: ['@regression'] }, async ({ api, request }) => {
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
        await (0, schemaValidator_1.validateSchema)('users', 'POST_users_register', responseRegister);
        const userId = responseRegister.id.toString();
        // GET /users/{id} — verify initial state
        const responseCustomerBefore = await api
            .path(`/users/${userId}`)
            .headers(authHeaders)
            .getRequest(200);
        await (0, schemaValidator_1.validateSchema)('users', 'GET_users_userId', responseCustomerBefore);
        (0, test_1.expect)(responseCustomerBefore.last_name).toBe(newUserPayload.last_name);
        // PUT /users/{userId} — update last name
        const responseUpdate = await api
            .path(`/users/${userId}`)
            .headers(authHeaders)
            .body({ ...newUserPayload, last_name: 'Modified' })
            .putRequest(200);
        await (0, schemaValidator_1.validateSchema)('users', 'PUT_users_userId', responseUpdate);
        (0, test_1.expect)(responseUpdate).toHaveProperty('success');
        // GET /users/{id} — verify update applied
        const responseCustomerAfter = await api
            .path(`/users/${userId}`)
            .headers(authHeaders)
            .getRequest(200);
        (0, test_1.expect)(responseCustomerAfter.last_name).toBe('Modified');
        // DELETE /users/{userId}
        const apiUrl = process.env.API_URL ?? 'https://api.practicesoftwaretesting.com';
        const deleteResponse = await request.delete(`${apiUrl}/users/${userId}`, {
            headers: { Authorization: `bearer ${authToken}` },
        });
        (0, test_1.expect)(deleteResponse.ok(), `DELETE /users/${userId} failed with status ${deleteResponse.status()}`).toBeTruthy();
        // GET /users/{id} — confirm deletion (expect 404)
        const responseAfterDelete = await request.get(`${apiUrl}/users/${userId}`, {
            headers: { Authorization: `bearer ${authToken}` },
        });
        (0, test_1.expect)(responseAfterDelete.status()).toBe(404);
    });
});
