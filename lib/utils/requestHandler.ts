import { APIRequestContext, APIResponse } from "@playwright/test";
import { expect } from '@playwright/test';
import { APILogger } from "./logger";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export class RequestHandler {
    private request: APIRequestContext;
    private logger: APILogger;
    private defaultApiUrl: string | undefined; //baseUrl
    private apiUrl: string;
    private apiPath: string = "";
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
        this.request = request;
        this.defaultApiUrl = apiBaseUrl;
        this.logger = logger;
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

/* to show the difference for the Design Pattern "Template Method" structure

    async postRequest(statusCode: number) {
        const url = this.createUrl();
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody);
        const response = await this.request.post(url, {
            data: this.apiBody
        });
        this.cleanupFields();
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest);
        expect(actualStatus).toEqual(statusCode);
        return responseJSON;
    };

    async getRequest(statusCode: number) {
        const url = this.createUrl();
        this.logger.logRequest('GET', url, this.apiHeaders);
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        });
        this.cleanupFields();
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest);
        expect(actualStatus).toEqual(statusCode);
        return responseJSON;
    };

    async putRequest(statusCode: number) {
        const url = this.createUrl();
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody);
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });
        this.cleanupFields();
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest);
        expect(actualStatus).toEqual(statusCode);
        return responseJSON;
    };
*/
    // Public methods are now wrappers around the template method
    async getRequest(statusCode: number) {
        return this.executeRequest("GET", statusCode, false, this.getRequest);
    };

    async postRequest(statusCode: number) {
        return this.executeRequest("POST", statusCode, true, this.postRequest);
    };

    async putRequest(statusCode: number) {
        return this.executeRequest("PUT", statusCode, true, this.putRequest);
    };

    async deleteRequest(statusCode: number) {
        return this.executeRequest("DELETE", statusCode, false, this.deleteRequest);
    };

    async patchRequest(statusCode: number) {
        return this.executeRequest("PATCH", statusCode, true, this.patchRequest);
    };

    // Template Method: fixed algorithm skeleton with same flow for all HTTP verbs
    private async executeRequest(method: HttpMethod, expectedStatusCode: number, includeBody: boolean, calledMethod: Function ) {
        const url = this.createUrl();
        this.logger.logRequest(method, url, this.apiHeaders, this.apiBody);
        const response = await this.sendRequest(method, url, includeBody);
        this.cleanupFields();
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, expectedStatusCode, calledMethod);
        expect(actualStatus).toEqual(expectedStatusCode);
        return responseJSON;
    };

    //Behavioral Polymorphism (single method, multiple behaviors based on argument)
    private async sendRequest(method: HttpMethod, url: string, includeBody: boolean): Promise<APIResponse> {
        const options = includeBody ? { headers: this.apiHeaders, data: this.apiBody } : { headers: this.apiHeaders};
        switch (method) {
            case "GET": 
                return this.request.get(url, {headers: this.apiHeaders});
            case "POST": 
                return this.request.post(url, {data: this.apiBody});
            case "PUT": 
                return this.request.put(url, options);
            case "DELETE": 
                return this.request.delete(url, options);
            case "PATCH": 
                return this.request.patch(url, options);
        };
    };

    private createUrl() {
        const url = new URL(`${this.apiUrl ?? this.defaultApiUrl}${this.apiPath}`);
        for(const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value);
        }
        return url.toString();
    };

    private statusCodeValidator(actualStatusCode: number, expectedStatusCode: number, calledMethod: Function) {
        if(actualStatusCode !== expectedStatusCode) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status code was ${expectedStatusCode} but received ${actualStatusCode}\n\nRecent API activity: \n${logs}`);
            // To show an error where test failed (method)
            Error.captureStackTrace(error, calledMethod);
            throw error;
        };
    };

    private cleanupFields() {
        this.apiBody = {};
        this.apiHeaders = {};
        this.apiPath = '';
        this.queryParams = {};
    };
};