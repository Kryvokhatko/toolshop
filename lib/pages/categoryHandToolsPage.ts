import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from "./basePage";

export class CategoryHandToolsPage extends BasePage {
    readonly pageButton3: Locator = this.page.getByRole('button', { name: 'Page-3' });
    readonly tapeMeasure5mCard: Locator = this.page.locator('[data-test^="product-"]', {
        has: this.page.locator('[data-test="product-name"]', { hasText: 'Tape Measure 5m' }),
    }).first();
    readonly categoryHandTools: Locator = this.page.getByRole('heading', { name: 'Category: Hand Tools' });
    
    constructor(page: Page) {
        super(page);
    };

    async openPage3() {
        await expect(this.pageButton3).toBeVisible();
        await this.pageButton3.click();
    };

    async assertCategoryHandToolPageLoaded() {
        await expect(this.page).toHaveURL(/\/category\/hand-tools(?:[/?#]|$)/);
        await expect(this.categoryHandTools).toBeVisible();
    };

    async openTapeMeasure5m() {
        await expect(this.tapeMeasure5mCard).toBeVisible();
        await this.tapeMeasure5mCard.click();
    };

};