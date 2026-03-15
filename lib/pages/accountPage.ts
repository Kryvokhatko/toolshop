import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { PageObjectManager } from './pageObjectManager';

export class AccountPage extends BasePage {
    readonly categoriesSelector: Locator = this.page.locator('[data-test="nav-categories"]');
    readonly handToolsItem: Locator = this.page.locator('[data-test="nav-hand-tools"]');


    constructor(page: Page) {
        super(page);
    };
};