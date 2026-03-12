import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export type RegisterData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  street: string;
  postCode: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  password: string;
};

export class RegisterPage extends BasePage {
    readonly pageHeader: Locator = this.page.getByText("Customer registration");
    readonly firstName: Locator = this.page.locator("#first_name");
    readonly lastName: Locator = this.page.locator("#last_name");
    readonly dateOfBirth: Locator = this.page.getByPlaceholder("YYYY-MM-DD");
    readonly street: Locator = this.page.getByPlaceholder("Your Street *");
    readonly postCode: Locator = this.page.getByPlaceholder("Your Postcode *");
    readonly city: Locator = this.page.getByPlaceholder("Your City *");
    readonly state: Locator = this.page.getByPlaceholder("Your State *");
    readonly country: Locator = this.page.locator("#country");
    readonly phone: Locator = this.page.getByPlaceholder("Your phone *");
    readonly email: Locator = this.page.getByPlaceholder("Your email *");
    readonly password: Locator = this.page.getByPlaceholder("Your password");
    readonly registerButton: Locator = this.page.getByRole("button", { name: "Register"});

    constructor(page: Page) {
        super(page);
    };

    async completeRegisterForm(data: RegisterData) {
        await this.firstName.fill(data.firstName);
        await this.lastName.fill(data.lastName);
        await this.dateOfBirth.fill(data.dateOfBirth);
        await this.street.fill(data.street);
        await this.postCode.fill(data.postCode);
        await this.city.fill(data.city);
        await this.state.fill(data.state);
        await this.country.selectOption(data.country);
        await this.phone.fill(data.phone);
        await this.email.fill(data.email);
        await this.password.fill(data.password);
    };

    // reuse BasePage.submit() instead of duplicating click() logic
    async register() {
        await this.submit(this.registerButton);
    };
};