"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutPage = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
class CheckoutPage extends basePage_1.BasePage {
    navCartButton = this.page.locator('[data-test="nav-cart"]');
    stepsIndicator = this.page.locator('.steps-4.steps-indicator');
    proceedStep1Button = this.page.locator('[data-test="proceed-1"]');
    proceedStep2Button = this.page.locator('[data-test="proceed-2"]');
    proceedStep3Button = this.page.locator('[data-test="proceed-3"]');
    loginMessage = this.page.locator('app-login');
    paymentMethodSelect = this.page.locator('[data-test="payment-method"]');
    creditCardNumberInput = this.page.locator('[data-test="credit_card_number"]');
    expirationDateInput = this.page.locator('[data-test="expiration_date"]');
    cvvInput = this.page.locator('[data-test="cvv"]');
    cardHolderInput = this.page.locator('[data-test="card_holder_name"]');
    finishButton = this.page.locator('[data-test="finish"]');
    paymentSuccessMessage = this.page.locator('[data-test="payment-success-message"]');
    orderConfirmation = this.page.locator('#order-confirmation');
    constructor(page) {
        super(page);
    }
    ;
    async openFromCart() {
        await this.navCartButton.click();
        await (0, test_1.expect)(this.page).toHaveURL(/\/checkout(?:[/?#]|$)/);
        await (0, test_1.expect)(this.stepsIndicator).toBeVisible();
    }
    ;
    async verifyItemInCart(itemName) {
        await (0, test_1.expect)(this.page.locator('tbody')).toContainText(itemName);
    }
    ;
    async proceedToPaymentStep() {
        await this.proceedStep1Button.click();
        await (0, test_1.expect)(this.loginMessage).toContainText('you are already logged in. You can proceed to checkout.');
        await this.proceedStep2Button.click();
        await (0, test_1.expect)(this.page.getByRole('heading', { name: 'Billing Address' })).toBeVisible();
        await this.proceedStep3Button.click();
        await (0, test_1.expect)(this.page.getByRole('heading', { name: 'Payment' })).toBeVisible();
    }
    ;
    async fillCreditCard(details) {
        await this.paymentMethodSelect.selectOption('credit-card');
        await this.creditCardNumberInput.fill(details.cardNumber);
        await this.expirationDateInput.fill(details.expiration);
        await this.cvvInput.fill(details.cvv);
        await this.cardHolderInput.fill(details.cardHolder);
    }
    ;
    async completePaymentAndCaptureInvoice() {
        await this.finishButton.click();
        await (0, test_1.expect)(this.paymentSuccessMessage).toContainText('Payment was successful');
        await this.finishButton.click();
        await (0, test_1.expect)(this.orderConfirmation).toContainText('Thanks for your order! Your invoice number is');
        const confirmationText = (await this.orderConfirmation.innerText()).trim();
        const invoiceMatch = confirmationText.match(/INV-\d+/); //one or more digits
        // For debugging
        (0, test_1.expect)(invoiceMatch, `Invoice number not found in confirmation text: ${confirmationText}`).not.toBeNull();
        return invoiceMatch[0];
    }
    ;
}
exports.CheckoutPage = CheckoutPage;
;
