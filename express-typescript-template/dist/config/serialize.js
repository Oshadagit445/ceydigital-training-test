"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = serialize;
// Parse the user id to deserialize function
function serialize($user, done) {
    done(null, ($user && $user.id) || null);
}
//# sourceMappingURL=serialize.js.map