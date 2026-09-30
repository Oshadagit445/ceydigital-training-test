/*import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { body, validationResult } from "express-validator";
import { ServerResponse } from "../shared/server-response";
import * as user_controller from "../controllers/user-controller";

const signupValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email must be a valid email address")
    .isLength({ max: 255 }).withMessage("Email must be at most 255 characters"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6, max: 255 }).withMessage("Password must be 6–255 characters"),
  body("name")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Full name must be at most 100 characters"),
];

function validateSignup(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors: Record<string, string> = {};
    for (const err of errors.array()) {
      if (err.type === "field" && !fieldErrors[err.path]) {
        fieldErrors[err.path] = err.msg;
      }
    }
    return res.status(400).send(
      new ServerResponse(false, { fieldErrors, data: errors.array() }, "Validation failed")
    );
  }
  next();
}

function toClientUser(user: any) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
    || user.username
    || user.email;
  return {
    id: String(user.id),
    name,
    email: user.email
  };
}

const auth_router = express.Router();

auth_router.get("/verify", (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send(
      new ServerResponse(false, { authenticated: false, user: null }, "Unauthorized")
    );
  }
  res.send(
    new ServerResponse(true, { authenticated: true, user: toClientUser(req.user) }, "Authenticated")
  );
});

auth_router.get("/me", (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send(new ServerResponse(false, null, "Unauthorized"));
  }
  res.send(new ServerResponse(true, toClientUser(req.user)));
});

auth_router.post("/signup", signupValidation, validateSignup, user_controller.create);

export default auth_router;
*/
