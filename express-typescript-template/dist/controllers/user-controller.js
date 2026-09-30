"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
const tslib_1 = require("tslib");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const db_1 = tslib_1.__importDefault(require("../config/db"));
const utils_1 = require("../shared/utils");
const constants_1 = require("../shared/constants");
const server_response_1 = require("../shared/server-response");
/*export async function create(req: Request, res: Response) {
  try {
    const q = ``;
    const result = await db.query(q, []);
    const [data] = result.rows;
    res.status(200).send(new ServerResponse(true, data));
  } catch (error: any) {
    log_error(error);
    res.status(500).send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}

export async function get(req: Request, res: Response) {
  try {
    const q = ``;
    const result = await db.query(q, []);
    res.status(200).send(new ServerResponse(true, result.rows));
  } catch (error: any) {
    log_error(error);
    res.status(500).send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const q = ``;
    const result = await db.query(q, []);
    const [data] = result.rows;
    res.status(200).send(new ServerResponse(true, data));
  } catch (error: any) {
    log_error(error);
    res.status(500).send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}

export async function update(req: Request, res: Response) {
  try {
    const q = ``;
    const result = await db.query(q, []);
    res.status(200).send(new ServerResponse(true, result.rows));
  } catch (error: any) {
    log_error(error);
    res.status(500).send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}

export async function deleteById(req: Request, res: Response) {
  try {
    const q = ``;
    const result = await db.query(q, []);
    res.status(200).send(new ServerResponse(true, result.rows));
  } catch (error: any) {
    log_error(error);
    res.status(500).send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}*/
const SALT_ROUNDS = 10;
async function create(req, res) {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const q = `INSERT INTO users (full_name, email, password)
               VALUES ($1, $2, $3)
               RETURNING id, full_name, email, date_created, date_updated`;
        const result = await db_1.default.query(q, [
            name,
            email || null,
            hashedPassword
        ]);
        const [data] = result.rows;
        res.status(201).send({
            message: "Account created successfully",
            user: {
                id: String(data.id),
                name: data.full_name,
                email: data.email
            },
            success: true,
            data
        });
    }
    catch (error) {
        (0, utils_1.log_error)(error);
        if (error.code === constants_1.DUPLICATE_KEY_VALUE) {
            return res.status(409).send({ message: "Email or username already exists" });
        }
        res.status(500).send(new server_response_1.ServerResponse(false, null, constants_1.DEFAULT_ERROR_MESSAGE));
    }
}
//# sourceMappingURL=user-controller.js.map