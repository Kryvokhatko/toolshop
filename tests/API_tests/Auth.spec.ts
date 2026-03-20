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
    .postRequest(200);

    console.log(response);
    expect(response).toHaveProperty('access_token');
    expect(response.token_type).toBe("bearer");
});

//Login as Customer, if Customer doesn't exist - register it
test("Login as Customer and if need register it", async ({ api }) => {
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
/*    
    const loginData = {
        email: process.env.CUSTOMER_USERNAME,
        password: process.env.CUSTOMER_PASSWORD,
    };
*/
    const response = await api
    .path("/users/register")
    .body(customerData)
    .postRequest(201);
    
    console.log(response);

});