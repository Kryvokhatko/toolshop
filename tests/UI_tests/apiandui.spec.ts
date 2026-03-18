import { test, expect } from "@playwright/test";

test("Validate product data is visible in UI from API", async ({ page }) => {
    let products: any;
    await test.step("intercept /products", async () => {
        await page.route("https://api.practicesoftwaretesting.com/products**", async (route) => {
            const response = await route.fetch();
            products = await response.json();
            await route.continue();
        });
    });
    await page.goto("/");
    // Wait for the data to load in before making assertions
    await expect(page.locator(".skeleton").first()).not.toBeVisible();
    
    //console.log(products);
    const productGrid = page.locator(".col-md-9");

    for(const product of products.data) {
        await expect(productGrid).toContainText(product.name);
        //console.log(product.price.toString());
        await expect(productGrid).toContainText(product.price.toString());
    };
    //OR, just to compare speed of execution
    await Promise.all(products.data.map(async (product: { name: string; price: string }) => {
        await expect(productGrid).toContainText(product.name);
        //console.log(product.price.toString());
        await expect(productGrid).toContainText(product.price.toString());
    }))
});