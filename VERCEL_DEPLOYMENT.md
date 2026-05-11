# TaskFlow AI — Vercel Deployment Guide

## 1. Set Up Your Supabase Database

Run the SQL schema in your Supabase project's SQL editor:

```
db/schema.sql
```

This creates:
- `profiles` table (auto-filled on signup via trigger)
- `projects` table with Row-Level Security (user sees only their own rows)
- `tasks` table with Row-Level Security

## 2. Get Your Supabase Credentials

In your Supabase dashboard → **Project Settings → API**:

| Key | Where to find it |
|-----|-----------------|
| `VITE_SUPABASE_URL` | "Project URL" |
| `VITE_SUPABASE_ANON_KEY` | "anon / public" key |

## 3. Deploy to Vercel

### Option A — Deploy from GitHub (recommended)

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Framework will be **auto-detected** as Vite
4. Add Environment Variables:
   - `VITE_SUPABASE_URL` → your project URL
   - `VITE_SUPABASE_ANON_KEY` → your anon key
5. Click **Deploy**

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts, then add env vars:
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

## 4. Configure Supabase Auth Redirect URLs

In Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://your-project.vercel.app`
- **Redirect URLs**: `https://your-project.vercel.app/**`

This is needed for email confirmation links and password reset emails to work.

## 5. Local Development

```bash
# Create local env file (never commit this)
cp .env.example .env.local
# Fill in your Supabase URL and anon key

npm install
npm run dev
```

## Notes

- **Email confirmations**: Supabase sends a confirmation email on signup by default.
  You can disable this in Supabase → Authentication → Settings → "Enable email confirmations".
- **No VITE_ vars needed at runtime**: These env vars are baked into the static bundle at build time by Vite.
- **Row-Level Security**: All data is automatically scoped per user — users can only see their own projects and tasks.
