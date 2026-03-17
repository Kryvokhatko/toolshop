import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutPage extends BasePage {
    readonly navCartButton: Locator = this.page.locator('[data-test="nav-cart"]');
    readonly stepsIndicator: Locator = this.page.locator('.steps-4.steps-indicator');
    readonly proceedStep1Button: Locator = this.page.locator('[data-test="proceed-1"]');
    readonly proceedStep2Button: Locator = this.page.locator('[data-test="proceed-2"]');
    readonly proceedStep3Button: Locator = this.page.locator('[data-test="proceed-3"]');
    readonly loginMessage: Locator = this.page.locator('app-login');
    readonly paymentMethodSelect: Locator = this.page.locator('[data-test="payment-method"]');
    readonly creditCardNumberInput: Locator = this.page.locator('[data-test="credit_card_number"]');
    readonly expirationDateInput: Locator = this.page.locator('[data-test="expiration_date"]');
    readonly cvvInput: Locator = this.page.locator('[data-test="cvv"]');
    readonly cardHolderInput: Locator = this.page.locator('[data-test="card_holder_name"]');
    readonly finishButton: Locator = this.page.locator('[data-test="finish"]');
    readonly paymentSuccessMessage: Locator = this.page.locator('[data-test="payment-success-message"]');
    readonly orderConfirmation: Locator = this.page.locator('#order-confirmation');

    constructor(page: Page) {
        super(page);
    };

    async openFromCart() {
        await this.navCartButton.click();
        await expect(this.page).toHaveURL(/\/checkout(?:[/?#]|$)/);
        await expect(this.stepsIndicator).toBeVisible();
    };

    async verifyItemInCart(itemName: string) {
        await expect(this.page.locator('tbody')).toContainText(itemName);
    };

    async proceedToPaymentStep() {
        await this.proceedStep1Button.click();
        await expect(this.loginMessage).toContainText('you are already logged in. You can proceed to checkout.');

        await this.proceedStep2Button.click();
        await expect(this.page.getByRole('heading', { name: 'Billing Address' })).toBeVisible();

        await this.proceedStep3Button.click();
        await expect(this.page.getByRole('heading', { name: 'Payment' })).toBeVisible();
    };

    async fillCreditCard(details: { cardNumber: string; expiration: string; cvv: string; cardHolder: string; }) {
        await this.paymentMethodSelect.selectOption('credit-card');
        await this.creditCardNumberInput.fill(details.cardNumber);
        await this.expirationDateInput.fill(details.expiration);
        await this.cvvInput.fill(details.cvv);
        await this.cardHolderInput.fill(details.cardHolder);
    };

    async completePaymentAndCaptureInvoice(): Promise<string> {
        await this.finishButton.click();
        await expect(this.paymentSuccessMessage).toContainText('Payment was successful');

        await this.finishButton.click();
        await expect(this.orderConfirmation).toContainText('Thanks for your order! Your invoice number is');

        const confirmationText = (await this.orderConfirmation.innerText()).trim();
        const invoiceMatch = confirmationText.match(/INV-\d+/);//one or more digits
        // For debugging
        expect(invoiceMatch, `Invoice number not found in confirmation text: ${confirmationText}`).not.toBeNull();
        return invoiceMatch![0];
    };
};
