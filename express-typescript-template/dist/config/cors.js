"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCorsOrigin = resolveCorsOrigin;
exports.corsOptions = corsOptions;
/**
 * `*` means reflect the request origin.
 * Passing ["*"] to the cors package requires an exact match, so a browser
 * origin such as http://localhost:5173 is rejected and the preflight response
 * has no Access-Control-Allow-Origin header.
 */
function resolveCorsOrigin(value = "*") {
    const origins = value.split(",").map((origin) => origin.trim()).filter(Boolean);
    if (origins.length === 0 || origins.includes("*")) {
        return true;
    }
    return origins;
}
function corsOptions(value = process.env.SERVER_CORS || process.env.SOCKET_IO_CORS || "*") {
    return {
        origin: resolveCorsOrigin(value),
        credentials: true
    };
}
//# sourceMappingURL=cors.js.map