"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryHandToolsPage = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
class CategoryHandToolsPage extends basePage_1.BasePage {
    pageButton3 = this.page.getByRole('button', { name: 'Page-3' });
    tapeMeasure5mCard = this.page.locator('[data-test^="product-"]', {
        has: this.page.locator('[data-test="product-name"]', { hasText: 'Tape Measure 5m' }),
    }).first();
    categoryButton = this.page.getByRole("button", { name: ' Categories' });
    categoryHandTools = this.page.getByRole('link', { name: 'Hand Tools' });
    categoryHandToolsPage = this.page.getByRole('heading', { name: 'Category: Hand Tools' });
    toolCards = this.page.locator(".col-md-9 .card");
    constructor(page) {
        super(page);
    }
    ;
    async openCategoryHandTools() {
        await super.open('/account');
        this.categoryButton.click();
        this.categoryHandTools.click();
    }
    ;
    async openPage3() {
        await (0, test_1.expect)(this.pageButton3).toBeVisible();
        await this.pageButton3.click();
    }
    ;
    async assertCategoryHandToolPageLoaded() {
        await (0, test_1.expect)(this.page).toHaveURL(/\/category\/hand-tools(?:[/?#]|$)/);
        await (0, test_1.expect)(this.categoryHandToolsPage).toBeVisible();
    }
    ;
    async openTapeMeasure5m() {
        await (0, test_1.expect)(this.tapeMeasure5mCard).toBeVisible();
        await this.tapeMeasure5mCard.click();
    }
    ;
    async assertOnlyOneToolVisible() {
        // Page is loaded
        await (0, test_1.expect)(this.page).toHaveURL(/\/category\/hand-tools(?:[/?#]|$)/);
        await (0, test_1.expect)(this.page.locator('[data-test="page-title"]')).toContainText('Category: Hand Tools');
        //There is only one tool available
        await (0, test_1.expect)(this.toolCards.first().locator('[data-test="product-name"]')).toHaveText('Pliers');
        await (0, test_1.expect)(this.toolCards.first().locator('[data-test="product-price"]')).toHaveText('$199.99');
    }
    ;
}
exports.CategoryHandToolsPage = CategoryHandToolsPage;
;
