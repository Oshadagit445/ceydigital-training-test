# Ceydigital Auth Training

A full-stack authentication reference app for training purposes: a React + Vite + TypeScript frontend, an Express + TypeScript backend, and a PostgreSQL database. It demonstrates session-based login, account creation, protected routes, and profile management — end to end, with no third-party auth provider.

## Overview

The app is a small, self-contained authentication system. Users can register, log in, view a dashboard, update their profile, and change their password. Sessions are stored server-side in Postgres and identified by an HTTP-only cookie, so no tokens are ever exposed to JavaScript.

## Overall Function

- Sign up — the user submits full name, email, and password. The backend hashes the password with bcrypt and inserts a row into users.

- Log in — the backend verifies the password against the stored hash and creates a session row in user_sessions. A signed sid cookie is set on the browser.

- Authenticated requests — the browser automatically sends the sid cookie on every request. The backend looks up the session, attaches req.session.userId, and lets the request through.

- Log out — the session row is deleted and the cookie cleared.

- Page refresh — the frontend calls GET /api/auth/me on mount. If the session is valid, the user is restored; otherwise they are redirected to /login.

## Project Structure

ceydigital-auth/
├── backend/
│ ├── src/
│ │ ├── index.ts # Express app, session, CORS, route mounting
│ │ ├── db.ts # pg Pool
│ │ ├── middleware/
│ │ │ └── requireAuth.ts # rejects unauthenticated requests
│ │ ├── routes/
│ │ │ ├── auth.ts # /register, /login, /logout, /me
│ │ │ └── users.ts # /me, /me/password
│ │ └── types/
│ │ └── session.ts # augments express-session with userId
│ ├── .env
│ ├── package.json
│ └── tsconfig.json
│
└── frontend/
├── src/
│ ├── api/client.ts # apiFetch wrapper (sets credentials: "include")
│ ├── components/
│ │ ├── common/PasswordInput.tsx
│ │ ├── layout/AuthLayout.tsx
│ │ ├── layout/AppLayout.tsx
│ │ └── routing/RequireAuth.tsx
│ ├── context/AuthContext.tsx
│ ├── features/auth/
│ │ ├── types.ts
│ │ └── validation.ts
│ ├── pages/
│ │ ├── HomePage.tsx
│ │ ├── LoginPage.tsx
│ │ ├── SignupPage.tsx
│ │ ├── DashboardPage.tsx
│ │ ├── ProfilePage.tsx
│ │ ├── SettingsPage.tsx
│ │ └── NotFoundPage.tsx
│ ├── App.tsx
│ └── main.tsx
├── vite.config.ts # dev proxy: /api → http://localhost:4000
└── package.json

## Database Schema

- users — created manually:

create table users (
id serial primary key,
full_name varchar(150) not null,
email varchar(255) unique not null,
password_hash varchar(255) not null,
date_created timestamp default now(),
date_updated timestamp default now()
);

- user_sessions — created automatically by connect-pg-simple on first backend start:

create table "user_sessions" (
"sid" varchar not null,
"sess" json not null,
"expire" timestamp(6) not null,
constraint "session_pkey" primary key ("sid")
);

## Running Locally Prerequisites

- Node.js 18+

- PostgreSQL 14+ running on localhost:5432

- A database with the users table created

## Create backend/.env:

PORT=4000

DATABASE_URL=postgres://postgres:postgres@localhost:5432/mydb

SESSION_SECRET=replace_with_a_long_random_string

NODE_ENV=development

CLIENT_ORIGIN=http://localhost:5173

## Known Limitations

This is a training project. It intentionally omits: email verification, password reset, rate limiting, CSRF tokens (mitigated by SameSite=Lax but not eliminated), multi-factor auth, account lockout, audit logging, and an admin interface.

## License

Training material — internal use.
