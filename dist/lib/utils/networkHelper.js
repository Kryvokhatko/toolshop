"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkHelper = void 0;
const basePage_1 = require("../pages/basePage");
class NetworkHelper extends basePage_1.BasePage {
    constructor(page) {
        super(page);
    }
    ;
    // Typed wrapper around Playwright route()
    // Parameters<Page['route']>[0] - take the first parameter type from Page.route() method
    // Parameters<Page['route']>[1] - take the second parameter type from Page.route() which is a function
    //Parametric Polymorphism - method accepts multiple different types for the same parameter position
    //async route(url: string | RegExp | ((url: URL) => boolean), fn: (route: Route) => Promise<void>)
    //Replaced  by
    async route(url, fn) {
        await this.page.route(url, fn);
    }
    ;
    async unroute(url, fn) {
        await this.page.unroute(url, fn);
    }
    ;
    async mockOrdersResponse(url, payload, status = 200) {
        await this.route(url, async (route) => {
            await route.fulfill({
                status,
                contentType: 'application/json',
                body: JSON.stringify(payload),
            });
        });
    }
    ;
    //Not used in tests, to be done later
    //overrides: {} - optional configuration object parameter
    //Parametric Polymorphism - method accepts multiple different types for the same parameter position
    async mockOrdersRequest(url, overrides = {}) {
        await this.route(url, async (route) => {
            const request = route.request(); // original intercepted request object
            await route.continue({
                method: overrides.method ?? request.method(), //use override method if provided, otherwise keep original method
                headers: { ...request.headers(), ...(overrides.headers ?? {}) }, //start with original headers
                postData: overrides.postData, //send new body only if provided
                url: overrides.nextUrl ?? request.url(), //change reroute only if nextUrl provided
            });
        });
    }
    ;
}
exports.NetworkHelper = NetworkHelper;
;
