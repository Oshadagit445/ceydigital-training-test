"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const express_validator_1 = require("express-validator");
const server_response_1 = require("../shared/server-response");
const user_controller = tslib_1.__importStar(require("../controllers/user-controller"));
const signupValidation = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be a valid email address")
        .isLength({ max: 255 }).withMessage("Email must be at most 255 characters"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6, max: 255 }).withMessage("Password must be 6–255 characters"),
    (0, express_validator_1.body)("name")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 100 }).withMessage("Full name must be at most 100 characters"),
];
function validateSignup(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const fieldErrors = {};
        for (const err of errors.array()) {
            if (err.type === "field" && !fieldErrors[err.path]) {
                fieldErrors[err.path] = err.msg;
            }
        }
        return res.status(400).send(new server_response_1.ServerResponse(false, { fieldErrors, data: errors.array() }, "Validation failed"));
    }
    next();
}
function toClientUser(user) {
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
        || user.username
        || user.email;
    return {
        id: String(user.id),
        name,
        email: user.email
    };
}
const auth_router = express_1.default.Router();
auth_router.get("/verify", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).send(new server_response_1.ServerResponse(false, { authenticated: false, user: null }, "Unauthorized"));
    }
    res.send(new server_response_1.ServerResponse(true, { authenticated: true, user: toClientUser(req.user) }, "Authenticated"));
});
auth_router.get("/me", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).send(new server_response_1.ServerResponse(false, null, "Unauthorized"));
    }
    res.send(new server_response_1.ServerResponse(true, toClientUser(req.user)));
});
auth_router.post("/signup", signupValidation, validateSignup, user_controller.create);
exports.default = auth_router;
//# sourceMappingURL=auth-router.js.map