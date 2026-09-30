"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log_error = log_error;
exports.slugify = slugify;
exports.ordinal_suffix_of = ordinal_suffix_of;
exports.get_duration = get_duration;
exports.create_join_code = create_join_code;
const tslib_1 = require("tslib");
const slugify_1 = tslib_1.__importDefault(require("slugify"));
const moment_1 = tslib_1.__importDefault(require("moment"));
// I used nano id in order to create an small unique id for join codes
// https://www.npmjs.com/package/nanoid
const nanoid_1 = require("nanoid");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const error_codes = require("./postgresql-error-codes");
/**
 * NOTE: Utility functions naming conversion is snake-case
 */
/**
 * Log errors
 * @param error any
 */
function log_error(error) {
    const msg = error_codes[error.code];
    if (msg) {
        console.trace(`ERROR [${error.code}]: ${msg}`);
    }
    else {
        console.error(error);
    }
}
/**
 * String value to a URL-friendly string
 * @param str {String}
 * @returns string
 */
function slugify(str) {
    return (0, slugify_1.default)(str, {
        replacement: "-", // replace spaces with replacement
        remove: /[\/()._]/g, // regex to remove characters
        lower: true, // result in lower case
    });
}
// https://stackoverflow.com/a/13627586/14417945
function ordinal_suffix_of(i) {
    const j = i % 10;
    const k = i % 100;
    if (j == 1 && k != 11) {
        return `${i}st`;
    }
    if (j == 2 && k != 12) {
        return `${i}nd`;
    }
    if (j == 3 && k != 13) {
        return `${i}rd`;
    }
    return `${i}th`;
}
/**
 * Return humanized duration string between the start and end
 * @example 15 minutes, 1 hour
 * @param startDate {string}
 * @param endDate {string}
 * @returns string
 */
function get_duration(startDate, endDate) {
    const start = (0, moment_1.default)(startDate);
    const end = (0, moment_1.default)(endDate);
    const diff = end.diff(start);
    return moment_1.default.duration(diff).humanize();
}
function create_join_code(len) {
    /**
     * Create nanoid instance with a specific alphabet
     * `Alphabet: 0123456789`
     * @returns e.g. 458652
     */
    return (0, nanoid_1.customAlphabet)("0123456789", len)();
}
//# sourceMappingURL=utils.js.map