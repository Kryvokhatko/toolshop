"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesPage = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
class MessagesPage extends basePage_1.BasePage {
    pageTitle = this.page.locator('[data-test="page-title"]');
    statusBadge = this.page.locator(".badge.rounded-pill.bg-info");
    constructor(page) {
        super(page);
    }
    ;
    async waitForMessageDetail() {
        await this.page.waitForURL(/\/messages\/[^/]+$/, { timeout: 10000 }); //there must be an id-like area with one or more characters, none of which can be "/"
        await (0, test_1.expect)(this.page.locator('app-message-detail')).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    }
    // Admin opens a message by matching the customer name in the first column (admin table has Name as td[0])
    async adminOpensMessage(userName = `${process.env.CUSTOMER_FIRST_NAME ?? 'Customer'} ${process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser'}`) {
        const rows = this.page.locator("tbody tr");
        await (0, test_1.expect)(rows.first()).toBeVisible({ timeout: 10000 });
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const name = (await row.locator("td").nth(0).innerText()).trim();
            if (name !== userName)
                continue;
            // First matching row is the latest one because table is newest-first
            await row.getByRole("link", { name: "Details" }).click();
            await this.waitForMessageDetail();
            return;
        }
        throw new Error(`No messages found for user "${userName}"`);
    }
    ;
    async customerOpensLatestMessage() {
        const rows = this.page.locator("tbody tr");
        await (0, test_1.expect)(rows.first()).toBeVisible({ timeout: 10000 });
        await rows.first().getByRole("link", { name: "Details" }).click();
        await this.waitForMessageDetail();
    }
    ;
    // Open exact thread by id (works for both admin and customer messages lists)
    async opensMessageById(messageId) {
        const detailsLink = this.page.locator(`a[href$="/messages/${messageId}"]`, { hasText: "Details" }).first();
        await (0, test_1.expect)(detailsLink).toBeVisible({ timeout: 10000 });
        await super.submit(detailsLink);
        await this.waitForMessageDetail();
    }
    // Verify status of message
    async verifyStatus(status) {
        const firstRow = this.page.locator("tbody tr").first();
        await (0, test_1.expect)(firstRow).toBeVisible({ timeout: 10000 });
        const statusActual = (await firstRow.locator("td").nth(2).innerText()).trim();
        (0, test_1.expect)(statusActual).toEqual(status);
    }
    ;
    // Reuse BasePage.open() instead of duplicating page.goto() logic
    async open(user) {
        await super.open(`${user}/messages`);
        await (0, test_1.expect)(this.pageTitle).toBeVisible();
    }
    ;
}
exports.MessagesPage = MessagesPage;
;
