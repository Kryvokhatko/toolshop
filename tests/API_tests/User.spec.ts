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

test("GET Retrieve all users ", async ({ api }) => {
    const response = await api
    .path("/users")
    .headers({
        "Authorization": `bearer ${authToken}`,
        "Content-Type": "application/json",
    })
    .getRequest(200);
    expect(response).toHaveProperty("current_page");
});

test("GET Retrieve current customer info", async ({ api }) => {
    const response = await api
    .path("/users/me")
    .headers({
        "Authorization": `bearer ${authToken}`,
        "Content-Type": "application/json",
    })
    .getRequest(200);
    expect(response).toHaveProperty("first_name");
});

/*
Test case flow:
POST /users/register Create new Customer
GET /users/{id} Retrieve specific Customer info
PUT /users/{userId} Update specific Customer
GET /users/{id} Retrieve specific Customer info
DELETE /users/{userId} Delete specific Customer
*/
test("PUT Create, modify and delete Customer", async ({ api }) => {
    //POST /users/register Create new Customer
    const customerData = {
        "first_name": "Customer",
        "last_name": "UniqueUser",
        "address": {
            "street": "Street 28",
            "city": "Kyiv",
            "state": "Kyiv",
            "country": "Ukraine",
            "postal_code": "03088"
        },
        "phone": "12345678",
        "dob": "2000-02-22",
        "password": "S@psMWqq20",
        "email": "customer@ukr.net"
    };

    const responseRegister = await api
    .path("/users/register")
    .body(customerData)
    .postRequest(201);
    const userId = responseRegister.id.toString();


    //GET /users/{id} Retrieve specific Customer info
    const responseCustomerBefore = await api
    .path(`/users/${userId}`)
    .headers({
        "Authorization": `bearer ${authToken}`,
        "Content-Type": "application/json",
    })
    .getRequest(200);
    expect(responseCustomerBefore.last_name).toContain("UniqueUser");

    //PUT /users/{userId} Update specific Customer
    const responseUpdate = await api
    .path(`/users/${userId}`)
    .headers({
        "Authorization": `bearer ${authToken}`,
        "Content-Type": "application/json",
    })
    .body({
        "first_name": "Modified",
        "last_name": "Modified",
        "address": {
            "street": "Street 28",
            "city": "Kyiv",
            "state": "Kyiv",
            "country": "Ukraine",
            "postal_code": "03088"
        },
        "phone": "12345678",
        "dob": "2000-02-22",
        "password": "S@psMWqq20",
        "email": "customer@ukr.net"
    })
    .putRequest(200);
    expect(responseUpdate).toHaveProperty("success");
    //.log(responseUpdate.first_name);

    //GET /users/{id} Retrieve specific Customer info
    const responseCustomerAfter = await api
    .path(`/users/${userId}`)
    .headers({
        "Authorization": `bearer ${authToken}`,
        "Content-Type": "application/json",
    })
    .getRequest(200);
    expect(responseCustomerAfter.last_name).toContain("Modified");

    
});