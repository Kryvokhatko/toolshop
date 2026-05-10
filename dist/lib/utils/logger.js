"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APILogger = void 0;
// Helps to see more details in reports if test fails
class APILogger {
    recentLogs = [];
    //body?: any - optional parameter
    logRequest(method, url, headers, body) {
        const logEntry = { method, url, headers, body };
        this.recentLogs.push({ type: 'Request Details', data: logEntry });
    }
    ;
    logResponse(statusCode, body) {
        const logEntry = { statusCode, body };
        this.recentLogs.push({ type: 'Response Details', data: logEntry });
    }
    ;
    //log - a row in recentLogs[]
    getRecentLogs() {
        const logs = this.recentLogs.map(log => {
            return `====== ${log.type} ======\n${JSON.stringify(log.data, null, 4)}`;
        }).join('\n\n');
        return logs;
    }
    ;
}
exports.APILogger = APILogger;
;
