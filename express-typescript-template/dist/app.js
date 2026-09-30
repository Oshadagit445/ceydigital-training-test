"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_errors_1 = tslib_1.__importDefault(require("http-errors"));
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const uglify_js_1 = tslib_1.__importDefault(require("uglify-js"));
const cors_2 = require("./config/cors");
const db_1 = tslib_1.__importDefault(require("./config/db"));
const passport_2 = tslib_1.__importDefault(require("./config/passport"));
const index_1 = tslib_1.__importDefault(require("./routes/index"));
const api_router_1 = tslib_1.__importDefault(require("./routes/api-router"));
const auth_router_1 = tslib_1.__importDefault(require("./routes/auth-router"));
const public_router_1 = tslib_1.__importDefault(require("./routes/public-router"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, cors_1.default)((0, cors_2.corsOptions)()));
function isLoggedIn(req, res, next) {
    return req.user ? next() : next((0, http_errors_1.default)(401));
}
(0, passport_2.default)(passport_1.default);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("pug").filters = {
    /**
     * ```pug
     * script
     *   :minify_js
     *     // JavaScript Syntax
     * ```
     * @param {String} text
     * @param {Object} options
     */
    minify_js(text) {
        if (!text)
            return;
        // return text;
        return uglify_js_1.default.minify({ "script.js": text }).code;
    }
};
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "pug");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
// Can be enabled if needed
// app.use("/css", sassMiddleware({
//   src: path.join(__dirname, "scss"),
//   dest: path.join(__dirname, "public/css"),
//   outputStyle: "compressed",
//   indentedSyntax: false, // true = .sass and false = .scss
//   sourceMap: true
// }));
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'");
    next();
});
if (process.env.NODE_ENV === "production") {
    app.get("*.js", (req, res, next) => {
        if (req.header("Accept-Encoding")?.includes("br")) {
            req.url = `${req.url}.br`;
            res.set("Content-Encoding", "br");
            res.set("Content-Type", "application/javascript; charset=UTF-8");
        }
        else if (req.header("Accept-Encoding")?.includes("gzip")) {
            req.url = `${req.url}.gz`;
            res.set("Content-Encoding", "gzip");
            res.set("Content-Type", "application/javascript; charset=UTF-8");
        }
        next();
    });
}
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pgSession = require("connect-pg-simple")(express_session_1.default);
app.set("trust proxy", 1);
app.use((0, express_session_1.default)({
    store: new pgSession({
        pool: db_1.default.pool,
        tableName: "pg_sessions"
    }),
    secret: process.env.SESSION_SECRET || [], // session secret
    cookie: {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        // secure: true,
        // domain: 'express-ts.com',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    },
    proxy: true,
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/auth", auth_router_1.default);
app.use("/public", public_router_1.default);
app.use("/api/v1", isLoggedIn, api_router_1.default);
app.use("/", index_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;
//# sourceMappingURL=app.js.map