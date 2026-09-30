"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerResponse = void 0;
class ServerResponse {
    done;
    body;
    message;
    constructor(done, body, message = null) {
        this.done = !!done;
        this.body = body === null || body === undefined ? null : body;
        this.message = message && message.toString().trim();
    }
}
exports.ServerResponse = ServerResponse;
//# sourceMappingURL=server-response.js.map