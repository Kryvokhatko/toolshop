"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountPage = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
class AccountPage extends basePage_1.BasePage {
    categoriesSelector = this.page.locator('[data-test="nav-categories"]');
    handToolsItem = this.page.locator('[data-test="nav-hand-tools"]');
    constructor(page) {
        super(page);
    }
    ;
    async open() {
        await super.open('/account');
        await this.assertPageLoaded();
    }
    ;
    async assertPageLoaded() {
        await (0, test_1.expect)(this.page).toHaveURL(/\/account(?:[/?#]|$)/);
        await (0, test_1.expect)(this.categoriesSelector).toBeVisible();
    }
    ;
    async selectCategory() {
        await this.categoriesSelector.click();
        await this.handToolsItem.click();
    }
    ;
}
exports.AccountPage = AccountPage;
;
