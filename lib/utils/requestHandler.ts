export class RequestHandler {
    private apiUrl: string;
    private apiPath: string = "";
    private queryParams: object = {};
    private apiHeaders: object = {};
    private apiBody: object = {};

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

    headers(headers: object) {
        this.apiHeaders = headers;
        return this;
    };

    body(body: object) {
        this.apiBody = body;
        return this;
    };
    

};