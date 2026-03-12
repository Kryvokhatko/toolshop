import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { PageObjectManager } from './pageObjectManager';

type LoginOptions = {
    allowAutoRegister?: boolean;
}

export class LoginPage extends BasePage {
    readonly pageHeader: Locator = this.page.getByRole('heading', { name: 'Login' });
    readonly registerYourAccountLnk: Locator = this.page.locator('[data-test="register-link"]');
    readonly emailAddressFld: Locator = this.page.getByPlaceholder("Your email");
    readonly passwordFld: Locator = this.page.getByPlaceholder("Your password");
    readonly loginButton: Locator = this.page.locator('[data-test="login-submit"]');

    constructor(page: Page) {
        super(page);
    };

    // Reuse BasePage.open() instead of duplicating page.goto() logic
    async open() {
        await super.open("/auth/login");
        await expect(this.page).toHaveURL(/\/auth\/login(?:[/?#]|$)/, { timeout: 15000 });

        try {
            await Promise.any([
                this.pageHeader.waitFor({ state: 'visible', timeout: 15000 }),
                this.emailAddressFld.waitFor({ state: 'visible', timeout: 15000 }),
                this.loginButton.waitFor({ state: 'visible', timeout: 15000 }),
            ]);
        } catch {
            throw new Error(`Login screen did not become ready at URL: ${this.page.url()}`);
        }
    };

    async loginAs(username: string, password: string, options: LoginOptions = {}) {
        const allowAutoRegister = options.allowAutoRegister ?? false;
        await this.completeLoginForm(username, password);
        const invalidMessage = this.page.getByText('Invalid email or password');

        const attemptLogin = async () => {
            const result = await Promise.race([
                this.page.waitForURL((url) => !/\/auth\/login(?:[/?#]|$)/.test(url.pathname), { timeout: 10000 })
                .then(() => 'success' as const), invalidMessage
                .waitFor({ state: 'visible', timeout: 10000 })
                .then(() => 'invalid' as const),
            ]);
            return result;
        }
        let result = await attemptLogin();
        if(result === 'invalid' && allowAutoRegister) {
            await this.registerYourAccountLnk.click();
            const pom = new PageObjectManager(this.page);
            await pom.registerPage.completeRegisterForm({
                firstName: process.env.CUSTOMER_FIRST_NAME ??'Customer',
                lastName: process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser',
                dateOfBirth: '2000-02-22',
                street: 'Street',
                postCode: '03088',
                city: 'Kyiv',
                state: 'Kyiv',
                country: 'UA',
                phone: '12345678',
                email: username,
                password,
            });
            await pom.registerPage.register();
            await expect(this.page).toHaveURL(/\/auth\/login(?:[/?#]|$)/, { timeout: 10000 });
            await this.completeLoginForm(username, password);
        };
        await expect(invalidMessage).not.toBeVisible();
        // Ensure login actually transitioned away from /auth/login
        await expect(this.page).not.toHaveURL(/\/auth\/login(?:[/?#]|$)/, { timeout: 10000 });
    };

    async completeLoginForm(username: string, password: string) {
        await this.emailAddressFld.fill(username);
        await this.passwordFld.fill(password);
        await this.loginButton.click();
    };

};