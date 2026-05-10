"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const test_1 = require("@playwright/test");
const requestHandler_1 = require("../utils/requestHandler");
const logger_1 = require("../utils/logger");
exports.test = test_1.test.extend({
    api: async ({ request }, use) => {
        //executed as a precondition for test
        const defaultApiUrl = process.env.API_URL || '';
        const logger = new logger_1.APILogger();
        const requestHandler = new requestHandler_1.RequestHandler(request, defaultApiUrl, logger);
        await use(requestHandler);
        //executed after the test
    },
});
