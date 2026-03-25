import { Page } from '@playwright/test';
import { ContactPage } from './contactPage';
import { HomePage } from './homePage';
import { LoginPage } from './loginPage';
import { RegisterPage } from './registerPage';
import { MessagesPage } from './messagesPage';
import { AccountPage } from './accountPage';
import { MessageDetails } from './messageDetails';
import { CategoryHandToolsPage } from './categoryHandToolsPage';
import { ProductPage } from './productPage';
import { CheckoutPage } from './checkoutPage';
import { AdminOrdersPage } from './adminOrdersPage';

export class PageObjectManager {
    readonly homePage: HomePage;
    readonly loginPage: LoginPage;
    readonly contactPage: ContactPage;
    readonly registerPage: RegisterPage;
    readonly messagesPage: MessagesPage;
    readonly accountPage: AccountPage;
    readonly messageDetails: MessageDetails;
    readonly categoryHandToolsPage: CategoryHandToolsPage;
    readonly productPage: ProductPage;
    readonly checkoutPage: CheckoutPage;
    readonly adminOrdersPage: AdminOrdersPage;

    constructor(page: Page) {
      this.homePage = new HomePage(page);
      this.loginPage = new LoginPage(page);
      this.contactPage = new ContactPage(page);
      this.registerPage = new RegisterPage(page);
      this.messagesPage = new MessagesPage(page);
      this.accountPage = new AccountPage(page);
      this.messageDetails = new MessageDetails(page);
      this.categoryHandToolsPage = new CategoryHandToolsPage(page);
      this.productPage = new ProductPage(page);
      this.checkoutPage = new CheckoutPage(page);
      this.adminOrdersPage = new AdminOrdersPage(page);
    };
};