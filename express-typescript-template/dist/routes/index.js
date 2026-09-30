"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const router = express_1.default.Router({ strict: false });
const release = fs_1.default.readFileSync(path_1.default.join(__dirname, "../../release"), "utf8").trim();
router.use((req, res, next) => {
    try {
        res.locals.release = release;
        res.locals.user = req.user;
    }
    catch (error) {
        console.error(error);
    }
    next();
});
router.get("/", (req, res) => {
    res.render("index");
});
router.get(["/admin", "/admin/**"], (req, res) => {
    if (req.isAuthenticated())
        return res.render("admin");
    res.redirect("/");
});
exports.default = router;
//# sourceMappingURL=index.js.map