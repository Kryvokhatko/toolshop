import { test as base, expect, BrowserContext, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { ContactPage } from '../pages/contactPage';
import { LoginPage } from '../pages/loginPage';
import { PageObjectManager } from '../pages/pageObjectManager';

type userContextFixtures = {
    guestContext: BrowserContext;
    guestPage: Page;
    guestContactPage: ContactPage;
    guestPageObjects: PageObjectManager;
    
    customerContext: BrowserContext;
    customerPage: Page;
    customerContactPage: ContactPage;
    customerPageObjects: PageObjectManager;

    adminContext: BrowserContext;
    adminPage: Page;
    adminLoginPage: LoginPage;
    adminPageObjects: PageObjectManager;
};

function getAuthStatePath(fileName: 'customer.json' | 'admin.json') {
    return path.resolve(process.cwd(), '.auth', fileName);
};

function ensureAuthStateExists(filePath: string) {
    if(!fs.existsSync(filePath)) {
        throw new Error(`Auth state not found: ${filePath}. Run setup project first: npx playwright test --project=setup`);
    };
};

export const test = base.extend<userContextFixtures>({
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
        await use(new ContactPage(guestPage));
    },

    //Create page object manager for guest interactions
    guestPageObjects: async ({ guestPage }, use) => {
        await use(new PageObjectManager(guestPage));
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
        await use(new ContactPage(customerPage));
    },

    //Create page object manager for customer interactions
    customerPageObjects: async ({ customerPage }, use) => {
        await use(new PageObjectManager(customerPage));
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
        await use(new LoginPage(adminPage));
    },

    //Create page object manager for admin interactions
    adminPageObjects: async ({ adminPage }, use) => {
        await use(new PageObjectManager(adminPage));
    },
});
