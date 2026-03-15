import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from "./basePage";

export class CategoryHandToolsPage extends BasePage {
    readonly pageButton3: Locator = this.page.getByRole('button', { name: 'Page-3' });
    readonly tapeMeasure5m: Locator = this.page.locator('[data-test="product-01KKNS6904MBRB16A1EZ9MY1BA"]');
    
    constructor(page: Page) {
        super(page);
    };


};