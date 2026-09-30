"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport_local_1 = require("passport-local");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const db_1 = tslib_1.__importDefault(require("../db"));
/**
 * Passport strategy for authenticate with username and password
 * http://www.passportjs.org/packages/passport-local/
 */
exports.default = new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, async (email, password, cb) => {
    try {
        const q = `SELECT id, first_name, last_name, email, username, password,
                        date_created, date_updated
                 FROM users WHERE email = $1`;
        const result = await db_1.default.query(q, [email]);
        if (result.rows.length) {
            const [user] = result.rows;
            if (user && await bcrypt_1.default.compare(password, user.password)) {
                delete user.password;
                return cb(null, user);
            }
        }
        return cb(null, false);
    }
    catch (error) {
        return cb(error);
    }
});
//# sourceMappingURL=passport-local.js.map