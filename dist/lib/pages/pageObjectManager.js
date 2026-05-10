"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageObjectManager = void 0;
const contactPage_1 = require("./contactPage");
const homePage_1 = require("./homePage");
const loginPage_1 = require("./loginPage");
const registerPage_1 = require("./registerPage");
const messagesPage_1 = require("./messagesPage");
const accountPage_1 = require("./accountPage");
const messageDetails_1 = require("./messageDetails");
const categoryHandToolsPage_1 = require("./categoryHandToolsPage");
const productPage_1 = require("./productPage");
const checkoutPage_1 = require("./checkoutPage");
const adminOrdersPage_1 = require("./adminOrdersPage");
class PageObjectManager {
    homePage;
    loginPage;
    contactPage;
    registerPage;
    messagesPage;
    accountPage;
    messageDetails;
    categoryHandToolsPage;
    productPage;
    checkoutPage;
    adminOrdersPage;
    constructor(page) {
        this.homePage = new homePage_1.HomePage(page);
        this.loginPage = new loginPage_1.LoginPage(page);
        this.contactPage = new contactPage_1.ContactPage(page);
        this.registerPage = new registerPage_1.RegisterPage(page);
        this.messagesPage = new messagesPage_1.MessagesPage(page);
        this.accountPage = new accountPage_1.AccountPage(page);
        this.messageDetails = new messageDetails_1.MessageDetails(page);
        this.categoryHandToolsPage = new categoryHandToolsPage_1.CategoryHandToolsPage(page);
        this.productPage = new productPage_1.ProductPage(page);
        this.checkoutPage = new checkoutPage_1.CheckoutPage(page);
        this.adminOrdersPage = new adminOrdersPage_1.AdminOrdersPage(page);
    }
    ;
}
exports.PageObjectManager = PageObjectManager;
;
