import { test as setup, expect } from '@playwright/test';
import { PageObjectManager } from "../lib/pages/pageObjectManager";
import fs from 'fs';
import path from 'path';

const getEnv = (key: string): string => {
    const value = process.env[key as keyof NodeJS.ProcessEnv];
    if (!value) throw new Error(`Environment variable ${key} is required`);
    return value;
};

setup("Login and save auth states", async ({ browser }) => {
    const outDir = path.resolve(process.cwd(), '.auth');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // Customer
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();
    const customerPages = new PageObjectManager(customerPage);
    await customerPages.loginPage.open();
    await customerPages.loginPage.loginAs(
        getEnv('CUSTOMER_USERNAME'),
        getEnv('CUSTOMER_PASSWORD'),
        { allowAutoRegister: true }, // only here
    );
    await expect(customerPage).toHaveURL(/\/account(?:[/?#]|$)/);
    await customerContext.storageState({ path: path.join(outDir, 'customer.json') });
    await customerContext.close();

    // Admin
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPages = new PageObjectManager(adminPage);
    await adminPages.loginPage.open();
    await adminPages.loginPage.loginAs(
        getEnv('ADMIN_USERNAME'),
        getEnv('ADMIN_PASSWORD'),
        { allowAutoRegister: false },
    );
    await expect(adminPage).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);
    await adminContext.storageState({ path: path.join(outDir, 'admin.json') });
    await adminContext.close();
});
