import { test as base, expect } from '@playwright/test';
import { RequestHandler } from '../utils/requestHandler';
import { APILogger } from '../utils/logger';

type TestFixtures = {
    api: RequestHandler,
};

export const test = base.extend<TestFixtures>({
    api: async({request}, use) => {
        //executed as a precondition for test
        const defaultApiUrl = process.env.API_URL || '';
        const logger = new APILogger();
        const requestHandler = new RequestHandler(request, defaultApiUrl, logger);
        await use(requestHandler);
        //executed after the test
    },
});