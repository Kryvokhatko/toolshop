import { APIRequestContext } from "@playwright/test";
import { expect } from '@playwright/test';
import { APILogger } from "./logger";



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
        //this.defaultApiUrl = undefined;
        this.apiPath = '';
        this.queryParams = {};
    };
    

};