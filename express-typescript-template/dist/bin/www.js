#!/usr/bin/env node
"use strict";
/**
 * Module dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
global.Promise = require("bluebird");
const socket_io_1 = require("socket.io");
const app_1 = tslib_1.__importDefault(require("../app"));
const cors_1 = require("../config/cors");
const http_1 = tslib_1.__importDefault(require("http"));
const socket_io_2 = require("../socket.io");
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const p = parseInt(val || "0", 10);
    if (isNaN(p)) {
        // named pipe
        return val;
    }
    if (p >= 0) {
        // port number
        return p;
    }
    return false;
}
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT);
app_1.default.set("port", port);
/**
 * Create HTTP server.
 */
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: (0, cors_1.corsOptions)(process.env.SOCKET_IO_CORS)
});
io.on("connection", (socket) => {
    (0, socket_io_2.register)(io, socket);
});
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string"
        ? `Pipe ${port}`
        : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    if (!addr)
        return;
    const bind = typeof addr === "string"
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
//# sourceMappingURL=www.js.map