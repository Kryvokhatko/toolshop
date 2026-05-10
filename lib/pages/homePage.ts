import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
    readonly signInLnk: Locator = this.page.locator('[data-test="nav-sign-in"]');
    readonly contactLnk: Locator = this.page.locator('[data-test="nav-contact"]');

    constructor(page: Page) {
        super(page);
    };

};