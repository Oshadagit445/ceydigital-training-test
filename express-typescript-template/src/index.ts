import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";
import usersRoutes from "./routes/users";

import { pool } from "./db";
import authRoutes from "./routes/auth";
/*import "./types/session.d";*/ // side-effect: brings in module augmentation

dotenv.config();

const app = express();

// ---- CORS -------------------------------------------------------------
// Only needed if frontend and backend are on different origins.
// If you use the Vite proxy (recommended), you can delete this block.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // http://localhost:5173
    credentials: true,                 // MUST be true for cookies
  })
);

// ---- Body / cookie parsing -------------------------------------------
app.use(express.json());
app.use(cookieParser());

// ---- Session ----------------------------------------------------------
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,                       // reuse the existing pg Pool
      tableName: "user_sessions", // this table is auto-created
      createTableIfMissing: true,
    }),
    name: "sid",                  // cookie name
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,     // don't create sessions for anonymous hits
    cookie: {
      httpOnly: true,
      sameSite: "lax",            // fine for same-site localhost:5173 -> :4000 via proxy
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ---- Routes -----------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---- Start ------------------------------------------------------------
const port = Number(process.env.PORT) || 4000;
app.listen(port, () =>
  console.log(`Backend listening on http://localhost:${port}`)
);
