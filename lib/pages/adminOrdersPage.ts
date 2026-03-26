import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class AdminOrdersPage extends BasePage {
    readonly orderStatusSelect: Locator = this.page.locator('[data-test="order-status"]');
    readonly updateStatusButton: Locator = this.page.locator('[data-test="update-status-submit"]');
    readonly editButton: Locator = this.page.locator(".btn.btn-sm.btn-primary.mx-2");

    constructor(page: Page) {
        super(page);
    };

    async openDashboard() {
        await this.page.goto('/admin/dashboard');
        await expect(this.page).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);
        await expect(this.page.getByRole('heading', { name: 'Latest orders' })).toBeVisible();
    };

    async openEditForInvoice(invoiceNumber: string) {
        const latestOrdersRow = this.page.getByRole('row').filter({ hasText: invoiceNumber }).first();
        await expect(latestOrdersRow).toBeVisible();
        await latestOrdersRow.getByRole('link', { name: 'Edit' }).click();
        await expect(this.page).toHaveURL(/\/admin\/orders\/edit\/[A-Za-z0-9]+(?:[/?#]|$)/);
    };

    async updateStatus(status: 'COMPLETED' | 'IN_PROGRESS' | 'NEW') {
        await this.orderStatusSelect.selectOption(status);
        await this.updateStatusButton.click();
        await expect(this.page.getByRole('alert')).toContainText('Status updated!');
    };

    async openOrdersList() {
        await this.page.goto('/admin/orders');
        await expect(this.page).toHaveURL(/\/admin\/orders(?:[/?#]|$)/);
    };

    async verifyInvoiceStatus(invoiceNumber: string, status: string) {
        const row = this.page.getByRole('row').filter({ hasText: invoiceNumber }).first();
        await expect(row).toBeVisible();
        await expect(row).toContainText(status);
    };

    async assertNoOrdersVisible() {
        // Page is loaded
        await expect(this.page).toHaveURL(/\/admin\/orders(?:[/?#]|$)/);
        await expect(this.page.locator('[data-test="page-title"]')).toContainText('Order');
        // No order rows rendered
        await expect(this.editButton).toHaveCount(0);        
    };

};
