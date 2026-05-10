"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const basePage_1 = require("./basePage");
class HomePage extends basePage_1.BasePage {
    signInLnk = this.page.locator('[data-test="nav-sign-in"]');
    contactLnk = this.page.locator('[data-test="nav-contact"]');
    constructor(page) {
        super(page);
    }
    ;
}
exports.HomePage = HomePage;
;
