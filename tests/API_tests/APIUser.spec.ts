import { test, expect } from '@playwright/test';

test("Login as Customer", async ({request}) => {
    const response = await request.post('/') 

});