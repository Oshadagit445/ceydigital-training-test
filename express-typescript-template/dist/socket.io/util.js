"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.log_error = log_error;
/** [Socket IO] Log a socket io debug log */
function log(id, value) {
    console.log(`[${id}] ${value}`);
}
/** [Socket IO] Log a socket io error */
function log_error(error) {
    console.trace(`[SOCKET.IO]`, error);
}
//# sourceMappingURL=util.js.map