"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHandler = void 0;
const test_1 = require("@playwright/test");
class RequestHandler {
    request;
    logger;
    defaultApiUrl; //baseUrl
    apiUrl;
    apiPath = "";
    queryParams = {};
    apiHeaders = {};
    apiBody = {};
    constructor(request, apiBaseUrl, logger) {
        this.request = request;
        this.defaultApiUrl = apiBaseUrl;
        this.logger = logger;
    }
    ;
    //fluent interface design to chain methods
    url(url) {
        this.apiUrl = url;
        return this;
    }
    ;
    path(path) {
        this.apiPath = path;
        return this;
    }
    ;
    params(params) {
        this.queryParams = params;
        return this;
    }
    ;
    headers(headers) {
        this.apiHeaders = headers;
        return this;
    }
    ;
    body(body) {
        this.apiBody = body;
        return this;
    }
    ;
    // Public methods are now wrappers around the template method
    async getRequest(statusCode) {
        return this.executeRequest("GET", statusCode, false, this.getRequest);
    }
    ;
    async postRequest(statusCode) {
        return this.executeRequest("POST", statusCode, true, this.postRequest);
    }
    ;
    async putRequest(statusCode) {
        return this.executeRequest("PUT", statusCode, true, this.putRequest);
    }
    ;
    async deleteRequest(statusCode) {
        return this.executeRequest("DELETE", statusCode, false, this.deleteRequest);
    }
    ;
    async patchRequest(statusCode) {
        return this.executeRequest("PATCH", statusCode, true, this.patchRequest);
    }
    ;
    // Template Method: fixed algorithm skeleton with same flow for all HTTP verbs
    async executeRequest(method, expectedStatusCode, includeBody, calledMethod) {
        const url = this.createUrl();
        this.logger.logRequest(method, url, this.apiHeaders, this.apiBody);
        const response = await this.sendRequest(method, url, includeBody);
        this.cleanupFields();
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, expectedStatusCode, calledMethod);
        (0, test_1.expect)(actualStatus).toEqual(expectedStatusCode);
        return responseJSON;
    }
    ;
    //Behavioral Polymorphism (single method, multiple behaviors based on argument)
    async sendRequest(method, url, includeBody) {
        const options = includeBody ? { headers: this.apiHeaders, data: this.apiBody } : { headers: this.apiHeaders };
        switch (method) {
            case "GET":
                return this.request.get(url, { headers: this.apiHeaders });
            case "POST":
                return this.request.post(url, { data: this.apiBody });
            case "PUT":
                return this.request.put(url, options);
            case "DELETE":
                return this.request.delete(url, options);
            case "PATCH":
                return this.request.patch(url, options);
        }
        ;
    }
    ;
    createUrl() {
        const url = new URL(`${this.apiUrl ?? this.defaultApiUrl}${this.apiPath}`);
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value);
        }
        return url.toString();
    }
    ;
    statusCodeValidator(actualStatusCode, expectedStatusCode, calledMethod) {
        if (actualStatusCode !== expectedStatusCode) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status code was ${expectedStatusCode} but received ${actualStatusCode}\n\nRecent API activity: \n${logs}`);
            // To show an error where test failed (method)
            Error.captureStackTrace(error, calledMethod);
            throw error;
        }
        ;
    }
    ;
    cleanupFields() {
        this.apiBody = {};
        this.apiHeaders = {};
        this.apiPath = '';
        this.queryParams = {};
    }
    ;
}
exports.RequestHandler = RequestHandler;
;
