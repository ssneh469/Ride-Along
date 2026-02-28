# RideAlong

A full-stack ride-sharing web app with a React frontend and a Node.js/Express backend backed by SQLite via Prisma.

## Project Structure

```
RideAlong/
├── backend/      # Express API server (Node.js + Prisma + SQLite)
└── frontend/     # React SPA (Vite + Tailwind CSS)
```

---

## Backend

**Stack:** Node.js · Express · Prisma ORM · SQLite · JWT auth · bcrypt

### Setup

```bash
cd backend
npm install
```

Copy the environment file and configure it:

```bash
cp .env.example .env   # or create .env manually
```

**.env**
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=5000
```

Run database migrations and (optionally) seed data:

```bash
npm run db:migrate
npm run seed
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login and receive JWT |
| GET | `/api/auth/me` | ✓ | Get current user profile |
| GET | `/api/rides` | — | List available rides (filterable by `source`, `destination`) |
| POST | `/api/rides` | ✓ | Create / offer a ride |
| GET | `/api/rides/my/offered` | ✓ | List rides you're driving |
| GET | `/api/rides/:id` | — | Get a single ride |
| PATCH | `/api/rides/:id/cancel` | ✓ | Cancel a ride (driver only) |
| GET | `/api/bookings` | ✓ | List your bookings |
| POST | `/api/bookings` | ✓ | Book a ride |
| GET | `/api/bookings/:id` | ✓ | Get a single booking |
| PATCH | `/api/bookings/:id/cancel` | ✓ | Cancel a booking |
| GET | `/api/stats` | — | Public platform stats |
| GET | `/api/health` | — | Health check |

---

## Frontend

**Stack:** React 19 · Vite · Tailwind CSS v4 · React Router · Framer Motion

### Setup

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

> **Note:** The frontend proxies all `/api` requests to the backend at `http://localhost:5000`. Make sure the backend is running before using the app.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Sign in |
| `/register` | Create an account |
| `/dashboard` | Your bookings and quick actions (protected) |
| `/book` | Search and book a ride (protected) |
| `/offer` | Offer a ride (protected) |

---

## Running the Full App

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Then open `http://localhost:3000` in your browser.
