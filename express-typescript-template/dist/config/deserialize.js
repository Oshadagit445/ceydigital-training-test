"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = deserialize;
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("./db"));
// Check whether the user is still exists on the database
async function deserialize(id, done) {
    try {
        const q = ``;
        const result = await db_1.default.query(q, [id]);
        if (result.rows.length) {
            const [user] = result.rows;
            if (user)
                return done(null, user);
        }
        return done(null, null);
    }
    catch (error) {
        return done(error, null);
    }
}
//# sourceMappingURL=deserialize.js.map