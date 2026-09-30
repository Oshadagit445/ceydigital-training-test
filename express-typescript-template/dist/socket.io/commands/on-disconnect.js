"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.on_disconnect = on_disconnect;
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../../config/db"));
const util_1 = require("../util");
async function on_disconnect(io, socket, reason) {
    (0, util_1.log)(socket.id, `disconnected (${reason})`);
    try {
        const q = ``;
        const res = await db_1.default.query(q, []);
    }
    catch (error) {
        (0, util_1.log_error)(error);
    }
}
//# sourceMappingURL=on-disconnect.js.map