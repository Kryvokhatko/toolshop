import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { PageObjectManager } from './pageObjectManager';

export class AccountPage extends BasePage {
    readonly categoriesSelector: Locator = this.page.locator('[data-test="nav-categories"]');
    readonly handToolsItem: Locator = this.page.locator('[data-test="nav-hand-tools"]');

    constructor(page: Page) {
        super(page);
    };

    async open() {
        await super.open('/account');
        await this.assertPageLoaded();
    };
    
    async assertPageLoaded() {
        await expect(this.page).toHaveURL(/\/account(?:[/?#]|$)/);
        await expect(this.categoriesSelector).toBeVisible();
    };

    async selectCategory() {
        await this.categoriesSelector.click();
        await this.handToolsItem.click();
    };
};