"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDetails = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
class MessageDetails extends basePage_1.BasePage {
    //scoping them is still the correct defensive pattern — it makes each page object self-contained and ensures it only ever interacts with its own component.
    messageDetailRoot = this.page.locator('app-message-detail');
    messageStatusSelector = this.messageDetailRoot.locator('[data-test="status"]');
    replyMessageTextArea = this.messageDetailRoot.locator("#message");
    replyButton = this.messageDetailRoot.locator('[data-test="reply-submit"]');
    repliesHistoryCards = this.messageDetailRoot.locator('.card.bg-light.text-black.mb-3').filter({ has: this.page.locator('p') });
    cardDetail = this.messageDetailRoot.locator('.card.bg-secondary.text-white.mb-3');
    constructor(page) {
        super(page);
    }
    ;
    // Parse id from current url "https://practicesoftwaretesting.com/account/messages/01kkxhnxze908gtfgd69bw1596/"
    getCurrentMessageIdFromUrl() {
        const pathname = new URL(this.page.url()).pathname;
        const id = pathname.split("/").filter(x => Boolean(x)).pop(); //["", "account", "messages", "01kkxhnxze908gtfgd69bw1596", ""]
        if (!id || id === "messages") {
            throw new Error(`Cannot parse message id from URL: ${this.page.url()}`);
        }
        return id;
    }
    ;
    // Escape any regex chars just in case
    escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); //escapes special regex metacharacters so they're treated as literal text
    }
    ;
    // Ensure we are still on the same thread
    async assertMessageId(messageId) {
        const safeId = this.escapeRegex(messageId);
        await (0, test_1.expect)(this.page).toHaveURL(new RegExp(`/messages/${safeId}(\\?.*)?$`));
    }
    ;
    async changeStatus(status) {
        // This area works slowly
        await this.cardDetail.locator(".card-header").first().waitFor({ state: "visible", timeout: 5000 });
        //'Customer UniqueUser | Subject: warranty | NEW'
        await (0, test_1.expect)(this.messageDetailRoot).toContainText('Customer UniqueUser | Subject: warranty');
        await (0, test_1.expect)(this.messageStatusSelector).toBeEnabled({ timeout: 5000 });
        await this.messageStatusSelector.selectOption(status);
        // Verify the dropdown value actually changed
        await (0, test_1.expect)(this.messageStatusSelector).toHaveValue(status);
    }
    ;
    async createReply(reply) {
        await (0, test_1.expect)(this.replyMessageTextArea).toBeEnabled({ timeout: 10000 });
        await this.replyMessageTextArea.fill(reply);
        await (0, test_1.expect)(this.replyMessageTextArea).toHaveValue(reply);
    }
    ;
    async sendReply(replyText, expectedMessageId) {
        if (expectedMessageId) {
            await this.assertMessageId(expectedMessageId);
        }
        await super.submit(this.replyButton); // Reuse BasePage.submit() instead of duplicating click() logic
        const savedReply = this.repliesHistoryCards.filter({ hasText: replyText }).last();
        await (0, test_1.expect)(savedReply).toBeVisible({ timeout: 15000 });
        await this.page.waitForLoadState('networkidle', { timeout: 15000 });
        await this.page.reload();
        await (0, test_1.expect)(this.messageDetailRoot).toBeVisible({ timeout: 15000 });
        if (expectedMessageId) {
            await this.assertMessageId(expectedMessageId);
        }
        await (0, test_1.expect)(savedReply).toBeVisible({ timeout: 15000 });
    }
    ;
}
exports.MessageDetails = MessageDetails;
;
