import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
    readonly productTitle: Locator = this.page.getByRole('heading', { name: 'Tape Measure 5m' });
    readonly addToCartButton: Locator = this.page.locator('[data-test="add-to-cart"]');

    constructor(page: Page) {
        super(page);
    };

    async assertProductOpened() {
        await expect(this.page).toHaveURL(/\/product\/[A-Za-z0-9]+(?:[/?#]|$)/);
        await expect(this.productTitle).toBeVisible();
    };

    async addToCart() {
        await this.addToCartButton.click();
        await expect(this.page.getByRole('alert')).toContainText('Product added to shopping cart.');
    };
};
