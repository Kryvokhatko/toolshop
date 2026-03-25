import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from "./basePage";

export class CategoryHandToolsPage extends BasePage {
    readonly pageButton3: Locator = this.page.getByRole('button', { name: 'Page-3' });
    readonly tapeMeasure5mCard: Locator = this.page.locator('[data-test^="product-"]', {
        has: this.page.locator('[data-test="product-name"]', { hasText: 'Tape Measure 5m' }),
    }).first();
    readonly categoryButton: Locator = this.page.getByRole("button", {name: ' Categories'});
    readonly categoryHandTools: Locator = this.page.getByRole('link', { name: 'Hand Tools' });
    readonly categoryHandToolsPage: Locator = this.page.getByRole('heading', { name: 'Category: Hand Tools' });
    readonly toolCards: Locator = this.page.locator(".col-md-9 .card");
    
    constructor(page: Page) {
        super(page);
    };

    async openCategoryHandTools() {
        await super.open('/account');
        this.categoryButton.click();
        this.categoryHandTools.click();
    };

    async openPage3() {
        await expect(this.pageButton3).toBeVisible();
        await this.pageButton3.click();
    };

    async assertCategoryHandToolPageLoaded() {
        await expect(this.page).toHaveURL(/\/category\/hand-tools(?:[/?#]|$)/);
        await expect(this.categoryHandToolsPage).toBeVisible();
    };

    async openTapeMeasure5m() {
        await expect(this.tapeMeasure5mCard).toBeVisible();
        await this.tapeMeasure5mCard.click();
    };

    async assertOnlyOneToolVisible() {
        // Page is loaded
        await expect(this.page).toHaveURL(/\/category\/hand-tools(?:[/?#]|$)/);
        await expect(this.page.locator('[data-test="page-title"]')).toContainText('Category: Hand Tools');
        //There is only one tool available
        await expect(this.toolCards.first().locator('[data-test="product-name"]')).toHaveText('Pliers');
        await expect(this.toolCards.first().locator('[data-test="product-price"]')).toHaveText('$199.99');    
    };

};