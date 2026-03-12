import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import { BasePage } from './basePage';

export class ContactPage extends BasePage {
    readonly pageHeader: Locator = this.page.getByTitle("Contact");
    readonly contactFormHeader: Locator = this.page.locator("div.row.mb-3");
    readonly firstName: Locator = this.page.getByPlaceholder('Your first name *');
    readonly lastName: Locator = this.page.getByPlaceholder('Your last name *');
    readonly email: Locator = this.page.getByPlaceholder('Your email *');
    readonly subjectSelector: Locator = this.page.locator('[data-test="subject"]');
    readonly message: Locator = this.page.locator('[data-test="message"]');
    readonly attachmentButton: Locator = this.page.locator('[data-test="attachment"]');
    readonly sendButton: Locator = this.page.locator('[data-test="contact-submit"]');

    constructor(page: Page) {
        super(page);
    };

    // Reuse BasePage.open() instead of duplicating page.goto() logic
    async open() {
        await super.open('/contact');
        await expect(this.contactFormHeader).toBeVisible();
    };

    async completeContactFormLoggedIn(subjectSelector: string, messageText: string, attachedFileName: string) {
        const customerFullName = `${process.env.CUSTOMER_FIRST_NAME ?? 'Customer'} ${process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser'}`;
        // wait until profile autofill is ready (prevents empty Name in fast runs)
        await expect(this.contactFormHeader).toContainText(customerFullName, { timeout: 5000 });
        
        await this.subjectSelector.selectOption(subjectSelector);
        await this.message.fill(messageText);
        await expect(this.message).toHaveValue(messageText);

        const pathToFile = path.resolve(process.cwd(), 'tests', 'testData', attachedFileName);  //safely joins into one normalized full path
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.attachmentButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(pathToFile);

        //gets the uploaded file name from the <input type="file"> element in the browser.
        const selectedFileName = await fileChooser.element().evaluate((input: any) => input.files?.[0]?.name);
        /**More details:
        fileChooser.element() → returns the actual file input element handle
        .evaluate((input) => ...) → runs that function in the page context (inside browser)
        input.files → FileList selected in the input.
        ?.[0]?.name → safely gets first file name (optional chaining avoids crash if no file).
        */
        expect(selectedFileName).toBe(attachedFileName);
    };

    // Reuse BasePage.submit() instead of duplicating sendButton.click() logic
    async sendContactForm() {
        await super.submit(this.sendButton);
    };
};