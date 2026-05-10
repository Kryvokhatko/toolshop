"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = validateSchema;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const SCHEMA_BASE_PATH = './lib/responseSchemas';
const ajv = new ajv_1.default({ allErrors: true }); //keep continue validation after the first error
async function validateSchema(dirName, fileName, responseBody) {
    const schemaPath = path_1.default.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);
    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);
    const valid = validate(responseBody);
    if (!valid) {
        throw new Error(`Schema validation "${fileName}_schema.json" failed:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n\n` +
            `Actual response body: \n` +
            `${JSON.stringify(responseBody, null, 4)}`);
    }
    ;
}
;
async function loadSchema(schemaPath) {
    try {
        const schemaContent = await promises_1.default.readFile(schemaPath, 'utf8');
        return JSON.parse(schemaContent);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Fail to read the schema file: ${errorMessage}`);
    }
    ;
}
;
