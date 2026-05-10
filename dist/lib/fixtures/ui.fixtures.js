"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const test_1 = require("@playwright/test");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const contactPage_1 = require("../pages/contactPage");
const loginPage_1 = require("../pages/loginPage");
const pageObjectManager_1 = require("../pages/pageObjectManager");
function getAuthStatePath(fileName) {
    return path_1.default.resolve(process.cwd(), '.auth', fileName);
}
;
function ensureAuthStateExists(filePath) {
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error(`Auth state not found: ${filePath}. Run setup project first: npx playwright test --project=setup`);
    }
    ;
}
;
exports.test = test_1.test.extend({
    //Browser context for guest
    guestContext: async ({ browser }, use) => {
        const context = await browser.newContext();
        await use(context);
        await context.close();
    },
    //Create page for guest interactions
    guestPage: async ({ guestContext }, use) => {
        const page = await guestContext.newPage();
        await use(page);
    },
    //Create page object for contact page interactions
    guestContactPage: async ({ guestPage }, use) => {
        await use(new contactPage_1.ContactPage(guestPage));
    },
    //Create page object manager for guest interactions
    guestPageObjects: async ({ guestPage }, use) => {
        await use(new pageObjectManager_1.PageObjectManager(guestPage));
    },
    //Browser context for customer
    customerContext: async ({ browser }, use) => {
        const statePath = getAuthStatePath('customer.json');
        ensureAuthStateExists(statePath);
        const context = await browser.newContext({ storageState: statePath });
        await use(context);
        await context.close();
    },
    //Create page for customer interactions
    customerPage: async ({ customerContext }, use) => {
        const page = await customerContext.newPage();
        await use(page);
    },
    //Create page object for contact page interactions
    customerContactPage: async ({ customerPage }, use) => {
        await use(new contactPage_1.ContactPage(customerPage));
    },
    //Create page object manager for customer interactions
    customerPageObjects: async ({ customerPage }, use) => {
        await use(new pageObjectManager_1.PageObjectManager(customerPage));
    },
    //Browser context for admin
    adminContext: async ({ browser }, use) => {
        const statePath = getAuthStatePath('admin.json');
        ensureAuthStateExists(statePath);
        const context = await browser.newContext({ storageState: statePath });
        await use(context);
        await context.close();
    },
    //Create page for admin interactions
    adminPage: async ({ adminContext }, use) => {
        const page = await adminContext.newPage();
        await use(page);
    },
    //Create page object for login page interactions
    adminLoginPage: async ({ adminPage }, use) => {
        await use(new loginPage_1.LoginPage(adminPage));
    },
    //Create page object manager for admin interactions
    adminPageObjects: async ({ adminPage }, use) => {
        await use(new pageObjectManager_1.PageObjectManager(adminPage));
    },
});
