"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPage = void 0;
const basePage_1 = require("./basePage");
class RegisterPage extends basePage_1.BasePage {
    pageHeader = this.page.getByText("Customer registration");
    firstName = this.page.locator("#first_name");
    lastName = this.page.locator("#last_name");
    dateOfBirth = this.page.getByPlaceholder("YYYY-MM-DD");
    street = this.page.getByPlaceholder("Your Street *");
    postCode = this.page.getByPlaceholder("Your Postcode *");
    houseNumber = this.page.getByPlaceholder("e.g. 42 *");
    city = this.page.getByPlaceholder("Your City *");
    state = this.page.getByPlaceholder("Your State *");
    country = this.page.locator("#country");
    phone = this.page.getByPlaceholder("Your phone *");
    email = this.page.getByPlaceholder("Your email *");
    password = this.page.getByPlaceholder("Your password");
    registerButton = this.page.getByRole("button", { name: "Register" });
    constructor(page) {
        super(page);
    }
    ;
    async completeRegisterForm(data) {
        await this.firstName.fill(data.firstName);
        await this.lastName.fill(data.lastName);
        await this.dateOfBirth.fill(data.dateOfBirth);
        await this.street.fill(data.street);
        await this.postCode.fill(data.postCode);
        await this.houseNumber.fill(data.houseNumber);
        await this.city.fill(data.city);
        await this.state.fill(data.state);
        await this.country.selectOption(data.country);
        await this.phone.fill(data.phone);
        await this.email.fill(data.email);
        await this.password.fill(data.password);
    }
    ;
    // reuse BasePage.submit() instead of duplicating click() logic
    async register() {
        await this.submit(this.registerButton);
    }
    ;
}
exports.RegisterPage = RegisterPage;
;
