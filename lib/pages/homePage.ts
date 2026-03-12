import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { PageObjectManager } from './pageObjectManager';

export class HomePage extends BasePage {
    readonly signInLnk: Locator = this.page.locator('[data-test="nav-sign-in"]');
    readonly contactLnk: Locator = this.page.locator('[data-test="nav-contact"]');

    constructor(page: Page) {
        super(page);
    };

};