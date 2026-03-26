import { Page } from '@playwright/test';
import { BasePage } from "../pages/basePage";

export class NetworkHelper extends BasePage {
    constructor(page: Page) {
        super(page);
    };
    
    // Typed wrapper around Playwright route()
    // Parameters<Page['route']>[0] - take the first parameter type from Page.route() method
    // Parameters<Page['route']>[1] - take the second parameter type from Page.route() which is a function
    async route(url: Parameters<Page['route']>[0], fn: Parameters<Page['route']>[1]) {
        await this.page.route(url, fn);
    };

    async unroute(url: Parameters<Page['unroute']>[0], fn?: Parameters<Page['unroute']>[1]) {
        await this.page.unroute(url, fn);
    };

    async mockJson(url: Parameters<Page['route']>[0], payload: unknown, status = 200) {
        await this.route(url, async (route) => {
            await route.fulfill({ 
                status,
                contentType: 'application/json',
                body: JSON.stringify(payload),
            });
        });
    };
};