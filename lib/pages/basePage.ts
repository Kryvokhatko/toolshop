import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    };
    
    async open(path: string) {
        await this.page.goto(path);
    };

    async submit(button: Locator) {
        await expect(button).toBeEnabled({ timeout: 5000});
        await button.click();
    };




    
    //No reference
    async assertPath(path: string) {
        await expect(this.page).toHaveURL(new RegExp(`${path}$`));
    };
    
    //No reference
    async waitForPage(uniqueElement: Locator) {
        await expect(uniqueElement).toBeVisible();
    };
    
}