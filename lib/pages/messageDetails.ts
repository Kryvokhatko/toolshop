import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from "./basePage";

export class MessageDetails extends BasePage {
    //scoping them is still the correct defensive pattern — it makes each page object self-contained and ensures it only ever interacts with its own component.
    readonly messageDetailRoot: Locator = this.page.locator('app-message-detail');
    readonly messageStatusSelector: Locator = this.messageDetailRoot.locator('[data-test="status"]');
    readonly replyMessageTextArea: Locator = this.messageDetailRoot.locator("#message");
    readonly replyButton: Locator = this.messageDetailRoot.locator('[data-test="reply-submit"]');
    readonly repliesHistoryCards: Locator = this.messageDetailRoot.locator('.card.bg-light.text-black.mb-3').filter({ has: this.page.locator('p') });
    readonly cardDetail: Locator = this.messageDetailRoot.locator('.card.bg-secondary.text-white.mb-3');

    constructor (page: Page) {
        super(page);
    };

    // Parse id from current ".../messages/{id}" url
    getCurrentMessageIdFromUrl(): string {
        const pathname = new URL(this.page.url()).pathname;
        const id = pathname.split("/").filter(Boolean).pop();
        if (!id || id === "messages") {
            throw new Error(`Cannot parse message id from URL: ${this.page.url()}`);
        }
        return id;
    };

    // Escape any regex chars just in case
    private escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    // Ensure we are still on the same thread
    async assertMessageId(messageId: string) {
        const safeId = this.escapeRegex(messageId);
        await expect(this.page).toHaveURL(new RegExp(`/messages/${safeId}(\\?.*)?$`));
    };

    async changeStatus(status: "IN_PROGRESS" | "RESOLVED" ) {
        // This area works slowly
        await this.cardDetail.locator(".card-header").first().waitFor({ state: "visible", timeout: 5000 });
        //'Customer UniqueUser | Subject: warranty | NEW'
        await expect(this.messageDetailRoot).toContainText('Customer UniqueUser | Subject: warranty');
        await expect(this.messageStatusSelector).toBeEnabled({ timeout: 5000 });
        await this.messageStatusSelector.selectOption(status);
        // Verify the dropdown value actually changed
        await expect(this.messageStatusSelector).toHaveValue(status);
    };

    async createReply(reply: string) {
        await expect(this.replyMessageTextArea).toBeEnabled({ timeout: 10000 });
        await this.replyMessageTextArea.click();
        await this.replyMessageTextArea.clear();
        await this.replyMessageTextArea.pressSequentially(reply);
        await expect(this.replyMessageTextArea).toHaveValue(reply);
        await this.replyMessageTextArea.press('Tab');
    };

    // Reuse BasePage.submit() instead of duplicating click() logic

    async sendReply(replyText: string, expectedMessageId?: string) {
        if (expectedMessageId) {
            await this.assertMessageId(expectedMessageId);
        }
        //await this.replyButton.click();
        await super.submit(this.replyButton);
        const savedReply = this.repliesHistoryCards.filter({ hasText: replyText }).last();
        await expect(savedReply).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        await this.page.reload();
        await expect(this.messageDetailRoot).toBeVisible({ timeout: 10000 });
        if (expectedMessageId) {
            await this.assertMessageId(expectedMessageId);
        }
        await expect(savedReply).toBeVisible({ timeout: 10000 });
    };

    //To be done next
    //async firstRepliesHistoryVerification() {
    //    const replyCardHeader = await this.repliesHistory.locator(".card-header").first().allTextContents(); // ['John Doe | 2026-03-10 14:01:52']
    //    const cardHeaderText = replyCardHeader[0] ?? "";
    //    const authorName = cardHeaderText.split("|")[0].trim(); //["John Doe ", " 2026-03-10 14:01:52"]
    //    await expect(authorName).toContain("John Doe");
    //};


};