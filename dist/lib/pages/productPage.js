"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPage = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
class ProductPage extends basePage_1.BasePage {
    productTitle = this.page.getByRole('heading', { name: 'Tape Measure 5m' });
    addToCartButton = this.page.locator('[data-test="add-to-cart"]');
    constructor(page) {
        super(page);
    }
    ;
    async assertProductOpened() {
        await (0, test_1.expect)(this.page).toHaveURL(/\/product\/[A-Za-z0-9]+(?:[/?#]|$)/);
        await (0, test_1.expect)(this.productTitle).toBeVisible();
    }
    ;
    async addToCart() {
        await this.addToCartButton.click();
        await (0, test_1.expect)(this.page.getByRole('alert')).toContainText('Product added to shopping cart.');
    }
    ;
}
exports.ProductPage = ProductPage;
;
