"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrdersPage = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
class AdminOrdersPage extends basePage_1.BasePage {
    orderStatusSelect = this.page.locator('[data-test="order-status"]');
    updateStatusButton = this.page.locator('[data-test="update-status-submit"]');
    editButton = this.page.locator(".btn.btn-sm.btn-primary.mx-2");
    constructor(page) {
        super(page);
    }
    ;
    async openDashboard() {
        await this.page.goto('/admin/dashboard');
        await (0, test_1.expect)(this.page).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);
        await (0, test_1.expect)(this.page.getByRole('heading', { name: 'Latest orders' })).toBeVisible();
    }
    ;
    async openEditForInvoice(invoiceNumber) {
        const latestOrdersRow = this.page.getByRole('row').filter({ hasText: invoiceNumber }).first();
        await (0, test_1.expect)(latestOrdersRow).toBeVisible();
        await latestOrdersRow.getByRole('link', { name: 'Edit' }).click();
        await (0, test_1.expect)(this.page).toHaveURL(/\/admin\/orders\/edit\/[A-Za-z0-9]+(?:[/?#]|$)/);
    }
    ;
    async updateStatus(status) {
        await this.orderStatusSelect.selectOption(status);
        await this.updateStatusButton.click();
        await (0, test_1.expect)(this.page.getByRole('alert')).toContainText('Status updated!');
    }
    ;
    async openOrdersList() {
        await this.page.goto('/admin/orders');
        await (0, test_1.expect)(this.page).toHaveURL(/\/admin\/orders(?:[/?#]|$)/);
    }
    ;
    async verifyInvoiceStatus(invoiceNumber, status) {
        const row = this.page.getByRole('row').filter({ hasText: invoiceNumber }).first();
        await (0, test_1.expect)(row).toBeVisible();
        await (0, test_1.expect)(row).toContainText(status);
    }
    ;
    async assertNoOrdersVisible() {
        // Page is loaded
        await (0, test_1.expect)(this.page).toHaveURL(/\/admin\/orders(?:[/?#]|$)/);
        await (0, test_1.expect)(this.page.locator('[data-test="page-title"]')).toContainText('Order');
        // No order rows rendered
        await (0, test_1.expect)(this.editButton).toHaveCount(0);
    }
    ;
}
exports.AdminOrdersPage = AdminOrdersPage;
;
