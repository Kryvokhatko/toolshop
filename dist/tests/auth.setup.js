"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const pageObjectManager_1 = require("../lib/pages/pageObjectManager");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getEnv = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Environment variable ${key} is required`);
    return value;
};
(0, test_1.test)("Login and save auth states", async ({ browser }) => {
    const outDir = path_1.default.resolve(process.cwd(), '.auth');
    if (!fs_1.default.existsSync(outDir))
        fs_1.default.mkdirSync(outDir, { recursive: true });
    // Customer
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();
    const customerPages = new pageObjectManager_1.PageObjectManager(customerPage);
    await customerPages.loginPage.open();
    await customerPages.loginPage.loginAs(getEnv('CUSTOMER_USERNAME'), getEnv('CUSTOMER_PASSWORD'), { allowAutoRegister: true });
    await (0, test_1.expect)(customerPage).toHaveURL(/\/account(?:[/?#]|$)/);
    await customerContext.storageState({ path: path_1.default.join(outDir, 'customer.json') });
    await customerContext.close();
    // Admin
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPages = new pageObjectManager_1.PageObjectManager(adminPage);
    await adminPages.loginPage.open();
    await adminPages.loginPage.loginAs(getEnv('ADMIN_USERNAME'), getEnv('ADMIN_PASSWORD'), { allowAutoRegister: false });
    await (0, test_1.expect)(adminPage).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);
    await adminContext.storageState({ path: path_1.default.join(outDir, 'admin.json') });
    await adminContext.close();
});
