"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
const test_1 = require("@playwright/test");
class BasePage {
    page;
    constructor(page) {
        this.page = page;
    }
    ;
    async open(path) {
        await this.page.goto(path);
    }
    ;
    async submit(button) {
        await (0, test_1.expect)(button).toBeEnabled({ timeout: 5000 });
        await button.click();
    }
    ;
}
exports.BasePage = BasePage;
