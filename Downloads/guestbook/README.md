# ✦ Guestbook App

A full-stack guestbook built with **React**, **Nest.js**, and **Supabase** — deployed on Vercel.

## Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Frontend    | React + Vite        |
| Backend     | Nest.js (TypeScript) |
| Database    | Supabase (PostgreSQL) |
| Hosting     | Vercel              |

---

## 🚀 Quick Start

### 1. Set Up Supabase

1. Go to [app.supabase.com](https://app.supabase.com) and create a new project
2. Open **SQL Editor** and run the contents of `supabase/migration.sql`
3. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key (for frontend)
   - `service_role` key (for backend — keep secret!)

---

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

Runs at **http://localhost:5173**

---

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_SERVICE_KEY
npm install
npm run start:dev
```

Runs at **http://localhost:3001/api**

### API Endpoints

| Method | URL                  | Description       |
|--------|----------------------|-------------------|
| GET    | `/api/guestbook`     | List all posts    |
| POST   | `/api/guestbook`     | Create a post     |
| DELETE | `/api/guestbook/:id` | Delete a post     |

**POST body example:**
```json
{
  "name": "Ada Lovelace",
  "message": "Hello from the guestbook!"
}
```

---

## ☁️ Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B: Deploy via GitHub

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository
3. Add these **Environment Variables** in Vercel dashboard:

**For the frontend:**
```
VITE_SUPABASE_URL        = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY   = eyJ...
```

**For the backend:**
```
SUPABASE_URL             = https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY     = eyJ...
FRONTEND_URL             = https://your-app.vercel.app
```

4. Click **Deploy** — done!

> **Note:** The Nest.js REST API may not function correctly on Vercel's serverless environment. The frontend connects to Supabase directly using the anon key as a reliable fallback.

---

## 📁 Project Structure

```
guestbook/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── App.jsx         # Main component (form + list)
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Nest.js API
│   ├── src/
│   │   ├── guestbook/      # Guestbook module
│   │   │   ├── dto/
│   │   │   ├── guestbook.controller.ts
│   │   │   ├── guestbook.module.ts
│   │   │   └── guestbook.service.ts
│   │   ├── supabase/       # Supabase client module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/
│   └── migration.sql       # Run this in Supabase SQL Editor
│
├── vercel.json             # Vercel deployment config
├── package.json            # Root monorepo scripts
└── README.md
```

---

## 🔒 Security Notes

- The `anon` key is safe to expose in the frontend — Row Level Security (RLS) controls what it can do
- The `service_role` key bypasses RLS — **never expose it in the frontend**
- All inputs are validated with `class-validator` on the backend and length-limited in the UI
