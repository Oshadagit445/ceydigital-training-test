"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const on_disconnect_1 = require("./commands/on-disconnect");
const on_printer_connect_1 = require("./commands/on-printer-connect");
const events_1 = require("./events");
const util_1 = require("./util");
function register(io, socket) {
    (0, util_1.log)(socket.id, "connected");
    socket.on(events_1.SocketEvents.printer_connect, (id) => (0, on_printer_connect_1.on_printer_connect)(io, socket, id));
    // socket.io built-in event
    socket.on("disconnect", (reason) => (0, on_disconnect_1.on_disconnect)(io, socket, reason));
}
//# sourceMappingURL=index.js.map