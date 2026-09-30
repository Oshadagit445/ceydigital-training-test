import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

/**
 * POST /api/auth/register
 * body: { full_name, email, password }
 */
router.post("/register", async (req, res) => {
  const { full_name, email, password } = req.body ?? {};
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "full_name, email, password required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query<{ id: number; full_name: string; email: string }>(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email`,
      [full_name, email, password_hash]
    );
    const user = rows[0];

    // log them in right away
    req.session.userId = user.id;
    res.status(201).json({ user });
  } catch (err: any) {
    if (err.code === "23505") {
      // unique_violation on email
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const { rows } = await pool.query<{
    id: number;
    full_name: string;
    email: string;
    password_hash: string;
  }>(
    `SELECT id, full_name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  const user = rows[0];
  // Always run bcrypt.compare to avoid user-enumeration timing leaks
  const hash = user?.password_hash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const ok = await bcrypt.compare(password, hash);

  if (!user || !ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Regenerate session id on login to prevent session fixation
  req.session.regenerate((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Session error" });
    }
    req.session.userId = user.id;
    req.session.save((err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: "Session error" });
      }
      res.json({
        user: { id: user.id, full_name: user.full_name, email: user.email },
      });
    });
  });
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("sid");
    res.json({ ok: true });
  });
});

/**
 * GET /api/auth/me
 */
router.get("/me", requireAuth, async (req, res) => {
  const { rows } = await pool.query<{ id: number; full_name: string; email: string }>(
    `SELECT id, full_name, email FROM users WHERE id = $1`,
    [req.session.userId]
  );
  if (!rows[0]) {
    // User was deleted but session still valid — clean up.
    req.session.destroy(() => {});
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({ user: rows[0] });
});

export default router;
