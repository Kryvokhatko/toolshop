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

    async mockOrdersResponse(url: Parameters<Page['route']>[0], payload: unknown, status = 200) {
        await this.route(url, async (route) => {
            await route.fulfill({ 
                status,
                contentType: 'application/json',
                body: JSON.stringify(payload),
            });
        });
    };

    //Not used it tests, to be done later
    //overrides: {} - optional configuration object parameter
    async mockOrdersRequest(url: Parameters<Page['route']>[0], overrides: {
        method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        headers?: Record<string, string>;
        postData?: string; // request body to send
        nextUrl?: string //if you want to change destination
    } = {}) {
        await this.route(url, async (route) => {
            const request = route.request();// original intercepted request object
            
            await route.continue({ //forward to server modified
                method: overrides.method ?? request.method(), //use override method if provided, otherwise keep original method
                headers: {...request.headers(), ...(overrides.headers ?? {})}, //start with original headers
                postData: overrides.postData, //send new body only if provided
                url: overrides.nextUrl ?? request.url(), //change reroute only if nextUrl provided
            });
        });
    };
};