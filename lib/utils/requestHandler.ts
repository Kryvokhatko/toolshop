import { APIRequestContext } from "@playwright/test";
import { expect } from '@playwright/test';

export class RequestHandler {
    private request: APIRequestContext;
    private defaultApiUrl: string;
    private apiUrl: string;
    private apiPath: string = "";
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};

    constructor(request: APIRequestContext, apiBaseUrl: string) {
        this.request = request;
        this.defaultApiUrl = apiBaseUrl;
    };

    //fluent interface design to chain methods
    url(url: string) {
        this.apiUrl = url;
        return this;
    };

    path(path: string) {
        this.apiPath = path;
        return this;
    };

    params(params: object) {
        this.queryParams = params;
        return this;
    };

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    };

    body(body: object) {
        this.apiBody = body;
        return this;
    };

    async postRequest(statusCode: number) {
        const url = this.createUrl();
        const response = await this.request.post(url, {
            data: this.apiBody
        });
        expect(response.status()).toBe(statusCode);
        const responseJSON = await response.json();
        return responseJSON;
    };

    private createUrl() {
        const url = new URL(`${this.apiUrl ?? this.defaultApiUrl}${this.apiPath}`);
        for(const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value);
        }
        return url.toString();
    };
    

};