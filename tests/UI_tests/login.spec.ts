import { test, expect } from "@playwright/test";
import { PageObjectManager } from "../../lib/pages/pageObjectManager";

test.describe("Login @auth", () => {
    test("Login as Customer", async ({ page }) => {
        const pages = new PageObjectManager(page);
        await pages.loginPage.open();
        await pages.loginPage.loginAs(
            process.env.CUSTOMER_USERNAME!,
            process.env.CUSTOMER_PASSWORD!,
        );
    });
    
    test("Login as Administrator", async ({ page }) => {
        const pages = new PageObjectManager(page);
        await pages.loginPage.open();
        await pages.loginPage.loginAs(
            process.env.ADMIN_USERNAME!,
            process.env.ADMIN_PASSWORD!,
        );
    });
    
    test("Login as Guest", async ({ page }) => {
        const pages = new PageObjectManager(page);
        await pages.loginPage.open();
        await pages.loginPage.loginAs(
            process.env.GUEST_USERNAME!,
            process.env.GUEST_PASSWORD!,            
        );
    });
});
