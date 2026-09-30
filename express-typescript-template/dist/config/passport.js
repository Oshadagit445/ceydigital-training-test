"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deserialize_1 = require("./deserialize");
const passport_local_1 = tslib_1.__importDefault(require("./passport-strategies/passport-local"));
const serialize_1 = require("./serialize");
/**
 * Use any passport middleware before the serialize and deserialize
 * @param {Passport} passport
 */
exports.default = (passport) => {
    passport.serializeUser(serialize_1.serialize);
    passport.deserializeUser(deserialize_1.deserialize);
    passport.use("local-login", passport_local_1.default);
};
//# sourceMappingURL=passport.js.map