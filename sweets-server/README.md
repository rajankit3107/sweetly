## Ankit Sweets — Backend (Node.js + TypeScript + Express + MongoDB)

This repository contains the backend for Ankit Sweets, built with Express 5, TypeScript, Mongoose, Jest, and Zod. The server lives in `sweets-server/`.

### Features

- **Auth**: JWT-based authentication endpoints under `/api/auth`
- **Users**: User-facing sweet operations under `/api/user`
- **Admin**: Admin-only sweet management under `/api/admin`
- **Healthcheck**: `/health`
- **Testing**: Jest + Supertest with in-memory MongoDB

### Tech Stack

- Node.js, Express 5, TypeScript
- MongoDB with Mongoose
- Jest, Supertest, mongodb-memory-server
- Zod validation

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A running MongoDB instance or Atlas connection string

### Install Dependencies

```bash
cd sweets-server
npm install
```

### Environment Variables

Create a `.env` file inside `sweets-server/` with the following variables:

```env
# Server
PORT=3000

# Database
MONGO_URL=mongodb://localhost:27017/mymongodb
```

Notes:

- `MONGO_URL` is required. The app will fail to start if it’s missing.
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` are used to seed an initial admin user on startup. If not set, seeding is skipped.

### Build and Run

```bash
cd sweets-server

# Build TypeScript and start
npm run dev

# Or run in two steps
npm run build
npm start
```

The server reads `PORT` (default 3000) and exposes:

- Health: `GET /health`
- Auth routes: mounted at `/api/auth`
- User routes: mounted at `/api/user`
- Admin routes: mounted at `/api/admin`

### Scripts

- `npm run build` — TypeScript build to `dist/`
- `npm start` — Run compiled code (`node dist/index.js`)
- `npm run dev` — Build then start
- `npm test` — Jest tests with in-memory MongoDB
- `npm run test:watch` — Watch mode

---

## API Overview

High-level route mounts (see `sweets-server/src/app.ts`):

- `GET /health` — Healthcheck
- `POST /api/auth/...` — Authentication endpoints
- `... /api/user/...` — User endpoints
- `... /api/admin/...` — Admin endpoints (require admin auth)

Refer to controllers and routes in `sweets-server/src/routes` and `sweets-server/src/controllers` for specifics.

---

## Testing

Jest is configured to use an in-memory MongoDB instance. No local MongoDB needed for tests.

```bash
cd sweets-server
npm test
```

Key config:

- `sweets-server/jest.config.ts` — Jest + ts-jest setup
- `sweets-server/src/tests/setup.ts` — In-memory MongoDB lifecycle

---

## Project Structure

```
sweets-server/
  src/
    app.ts                # Express app setup and route mounts
    index.ts              # Entry point: DB connect, seed admin, start server
    config/
      db.ts               # Mongoose connection using MONGO_URL
      seedAdmin.ts        # Seeds admin from ADMIN_USERNAME/PASSWORD
    routes/               # authRoutes.ts, userRoutes.ts, adminRoutes.ts
    controllers/          # Request handlers
    services/             # Business logic (auth, sweets)
    middlewares/          # Error handling, auth, validation
    models/               # Mongoose models (User, Sweet)
    validators/           # Zod schemas
    utils/                # Helpers (getEnv, asyncHandler, apiError)
    tests/                # Jest tests + setup
  dist/                   # Build output
```

---

## Notes and Tips

- Ensure `.env` is present before `npm run dev` so DB connect and admin seeding work.
- Admin seeding logs a message and is idempotent. It will skip if admin exists or if env vars are missing.
- Error handling middleware is registered last in `app.ts` and applies to all routes.

---

## License

ISC License. See `sweets-server/package.json` for details.
