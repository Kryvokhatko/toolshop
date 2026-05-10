"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
const pageObjectManager_1 = require("./pageObjectManager");
class LoginPage extends basePage_1.BasePage {
    pageHeader = this.page.getByRole('heading', { name: 'Login' });
    registerYourAccountLnk = this.page.locator('[data-test="register-link"]');
    emailAddressFld = this.page.locator("#email");
    passwordFld = this.page.getByPlaceholder("Your password");
    loginButton = this.page.locator('[data-test="login-submit"]');
    constructor(page) {
        super(page);
    }
    ;
    // Reuse BasePage.open() instead of duplicating page.goto() logic
    async open() {
        await super.open("/auth/login");
        await (0, test_1.expect)(this.page).toHaveURL("/auth/login", { timeout: 15000 });
    }
    ;
    async loginAs(username, password, options = {}) {
        const allowAutoRegister = options.allowAutoRegister ?? false;
        await this.completeLoginForm(username, password);
        const invalidMessage = this.page.getByText('Invalid email or password');
        const attemptLogin = async () => {
            const result = await Promise.race([
                this.page.waitForURL((url) => !/\/auth\/login(?:[/?#]|$)/
                    .test(url.pathname), { timeout: 10000 })
                    .then(() => 'success'),
                invalidMessage
                    .waitFor({ state: 'visible', timeout: 10000 })
                    .then(() => 'invalid'),
            ]);
            return result;
        };
        let result = await attemptLogin();
        if (result === 'invalid' && allowAutoRegister) {
            await this.registerYourAccountLnk.click();
            const pom = new pageObjectManager_1.PageObjectManager(this.page);
            await pom.registerPage.completeRegisterForm({
                firstName: process.env.CUSTOMER_FIRST_NAME ?? 'Customer',
                lastName: process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser',
                dateOfBirth: '2000-02-22',
                street: 'Street 28',
                postCode: '03088',
                houseNumber: '29',
                city: 'Kyiv',
                state: 'Kyiv',
                country: 'Ukraine',
                phone: '12345678',
                email: username,
                password,
            });
            await pom.registerPage.register();
            await (0, test_1.expect)(this.page).toHaveURL(/\/auth\/login(?:[/?#]|$)/, { timeout: 10000 });
            await this.completeLoginForm(username, password);
        }
        ;
        await (0, test_1.expect)(invalidMessage).not.toBeVisible();
        // Ensure login actually transitioned away from /auth/login
        await (0, test_1.expect)(this.page).not.toHaveURL(/\/auth\/login(?:[/?#]|$)/, { timeout: 10000 });
    }
    ;
    async completeLoginForm(username, password) {
        await this.emailAddressFld.clear();
        await this.emailAddressFld.fill(username);
        await this.passwordFld.fill(password);
        await super.submit(this.loginButton);
    }
    ;
}
exports.LoginPage = LoginPage;
;
