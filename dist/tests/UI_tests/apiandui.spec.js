"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)("Validate product data is visible in UI from API", async ({ page, request }) => {
    const response = await request.get("https://api.practicesoftwaretesting.com/products");
    await (0, test_1.expect)(response.ok()).toBeTruthy();
    const products = await response.json();
    await page.goto("/");
    // Wait for the data to load in before making assertions
    await (0, test_1.expect)(page.locator(".skeleton").first()).not.toBeVisible();
    //console.log(products);
    const productGrid = page.locator(".col-md-9");
    for (const product of products.data) {
        await (0, test_1.expect)(productGrid).toContainText(product.name);
        //console.log(product.price.toString());
        await (0, test_1.expect)(productGrid).toContainText(product.price.toString());
    }
    //OR just to compare speed of execution
    await Promise.all(products.data.map(async (product) => {
        await (0, test_1.expect)(productGrid).toContainText(product.name);
        //console.log(product.price.toString());
        await (0, test_1.expect)(productGrid).toContainText(product.price.toString());
    }));
});
