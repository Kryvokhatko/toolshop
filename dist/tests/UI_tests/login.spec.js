"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const pageObjectManager_1 = require("../../lib/pages/pageObjectManager");
test_1.test.describe("Login @auth", () => {
    (0, test_1.test)("Login as Customer", async ({ page }) => {
        const pages = new pageObjectManager_1.PageObjectManager(page);
        await pages.loginPage.open();
        await pages.loginPage.loginAs(process.env.CUSTOMER_USERNAME, process.env.CUSTOMER_PASSWORD);
    });
    (0, test_1.test)("Login as Administrator", async ({ page }) => {
        const pages = new pageObjectManager_1.PageObjectManager(page);
        await pages.loginPage.open();
        await pages.loginPage.loginAs(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    });
    (0, test_1.test)("Login as Guest", async ({ page }) => {
        const pages = new pageObjectManager_1.PageObjectManager(page);
        await pages.loginPage.open();
        await pages.loginPage.loginAs(process.env.GUEST_USERNAME, process.env.GUEST_PASSWORD);
    });
});
