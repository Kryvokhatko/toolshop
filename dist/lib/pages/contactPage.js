"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactPage = void 0;
const test_1 = require("@playwright/test");
const path_1 = __importDefault(require("path"));
const basePage_1 = require("./basePage");
class ContactPage extends basePage_1.BasePage {
    pageHeader = this.page.getByTitle("Contact");
    contactFormHeader = this.page.locator("div.row.mb-3");
    firstName = this.page.getByPlaceholder('Your first name *');
    lastName = this.page.getByPlaceholder('Your last name *');
    email = this.page.getByPlaceholder('Your email *');
    subjectSelector = this.page.locator('[data-test="subject"]');
    message = this.page.locator('[data-test="message"]');
    attachmentButton = this.page.locator('[data-test="attachment"]');
    sendButton = this.page.locator('[data-test="contact-submit"]');
    constructor(page) {
        super(page);
    }
    ;
    // Reuse BasePage.open() instead of duplicating page.goto() logic
    async open() {
        await super.open('/contact');
        await this.assertLoaded();
    }
    ;
    async assertLoaded() {
        await (0, test_1.expect)(this.page).toHaveURL(/\/contact(?:[/?#]|$)/);
        await (0, test_1.expect)(this.contactFormHeader).toBeVisible();
    }
    ;
    async completeContactFormLoggedIn(subjectSelector, messageText, attachedFileName) {
        const customerFullName = `${process.env.CUSTOMER_FIRST_NAME ?? 'Customer'} ${process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser'}`;
        // wait until profile autofill is ready (prevents empty Name in fast runs)
        await (0, test_1.expect)(this.contactFormHeader).toContainText(customerFullName, { timeout: 5000 });
        await this.subjectSelector.selectOption(subjectSelector);
        await this.message.fill(messageText);
        await (0, test_1.expect)(this.message).toHaveValue(messageText);
        const pathToFile = path_1.default.resolve(process.cwd(), 'tests', 'testData', attachedFileName); //safely joins into one normalized full path
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await super.submit(this.attachmentButton);
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(pathToFile);
        //gets the uploaded file name from the <input type="file"> element in the browser.
        const selectedFileName = await fileChooser.element().evaluate((input) => input.files?.[0]?.name);
        /**More details:
        fileChooser.element() → returns the actual file input element handle
        .evaluate((input) => ...) → runs that function in the page context (inside browser)
        input.files → FileList selected in the input.
        ?.[0]?.name → safely gets first file name (optional chaining avoids crash if no file).
        */
        (0, test_1.expect)(selectedFileName).toBe(attachedFileName);
    }
    ;
    // Reuse BasePage.submit() instead of duplicating sendButton.click() logic
    async sendContactForm() {
        await super.submit(this.sendButton);
    }
    ;
}
exports.ContactPage = ContactPage;
;
