import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class MessagesPage extends BasePage {
    readonly pageTitle: Locator = this.page.locator('[data-test="page-title"]');
    readonly statusBadge: Locator = this.page.locator(".badge.rounded-pill.bg-info");

    constructor(page: Page) {
        super(page);
    };

    private async waitForMessageDetail() {
        await this.page.waitForURL(/\/messages\/[^/]+$/, { timeout: 10000 });
        await expect(this.page.locator('app-message-detail')).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    }

    // Admin opens a message by matching the customer name in the first column (admin table has Name as td[0])
    async adminOpensMessage(userName = `${process.env.CUSTOMER_FIRST_NAME ?? 'Customer'} ${process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser'}`) {
        const rows = this.page.locator("tbody tr");
        await expect(rows.first()).toBeVisible({ timeout: 10000 });

        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const name = (await row.locator("td").nth(0).innerText()).trim();
            if (name !== userName) continue;
            // First matching row is the latest one because table is newest-first
            await row.getByRole("link", { name: "Details" }).click();
            await this.waitForMessageDetail();
            return;
        }
        throw new Error(`No messages found for user "${userName}"`);
    };

    async customerOpensLatestMessage() {
        const rows = this.page.locator("tbody tr");
        await expect(rows.first()).toBeVisible({ timeout: 10000 });
        await rows.first().getByRole("link", { name: "Details" }).click();
        await this.waitForMessageDetail();
    };

    // Open exact thread by id (works for both admin and customer lists)
    async opensMessageById(messageId: string) {
        const detailsLink = this.page.locator(`a[href$="/messages/${messageId}"]`, { hasText: "Details" }).first();
        await expect(detailsLink).toBeVisible({ timeout: 10000 });
        await detailsLink.click();
        await this.waitForMessageDetail();
    }

    // Verify status of message
    async verifyStatus(status: "IN_PROGRESS" | "RESOLVED" ) {
        const firstRow = this.page.locator("tbody tr").first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        const statusActual = (await firstRow.locator("td").nth(2).innerText()).trim();
        expect(statusActual).toEqual(status);
    };

    // Reuse BasePage.open() instead of duplicating page.goto() logic
    async open(user: string) {
        await super.open(`${user}/messages`);
        await expect(this.pageTitle).toBeVisible();
    };

};