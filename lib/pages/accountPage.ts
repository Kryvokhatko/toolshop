import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { PageObjectManager } from './pageObjectManager';

export class AccountPage extends BasePage {
    constructor(page: Page) {
        super(page);
    };
};