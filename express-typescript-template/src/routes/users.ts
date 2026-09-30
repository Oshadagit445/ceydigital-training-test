import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

/** GET /api/users/me */
router.get("/me", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, full_name, email FROM users WHERE id = $1`,
    [req.session.userId]
  );
  if (!rows[0]) return res.status(404).json({ error: "User not found" });
  res.json({ user: rows[0] });
});

/** PATCH /api/users/me  body: { full_name } */
router.patch("/me", async (req, res) => {
  const { full_name } = req.body ?? {};
  if (typeof full_name !== "string" || full_name.trim().length < 2) {
    return res.status(400).json({ error: "full_name must be at least 2 characters" });
  }
  const { rows } = await pool.query(
    `UPDATE users SET full_name = $1 WHERE id = $2
     RETURNING id, full_name, email`,
    [full_name.trim(), req.session.userId]
  );
  if (!rows[0]) return res.status(404).json({ error: "User not found" });
  res.json({ user: rows[0] });
});

/** PATCH /api/users/me/password  body: { current_password, new_password } */
router.patch("/me/password", async (req, res) => {
  const { current_password, new_password } = req.body ?? {};
  if (typeof current_password !== "string" || typeof new_password !== "string") {
    return res.status(400).json({ error: "current_password and new_password required" });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  const { rows } = await pool.query<{ password_hash: string }>(
    `SELECT password_hash FROM users WHERE id = $1`,
    [req.session.userId]
  );
  if (!rows[0]) return res.status(404).json({ error: "User not found" });

  const ok = await bcrypt.compare(current_password, rows[0].password_hash);
  if (!ok) return res.status(401).json({ error: "Current password is incorrect" });

  const newHash = await bcrypt.hash(new_password, 12);
  await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [
    newHash,
    req.session.userId,
  ]);

  res.json({ ok: true });
});

export default router;
