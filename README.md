# Lamma

Lamma is a bilingual digital invitation platform built with Next.js and Supabase.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Start the app with `npm run dev`.

`SUPABASE_SECRET_KEY` and `OPENAI_API_KEY` are reserved for future server-only features and are not used by the current application.

## Database migration

Apply the SQL migrations in `supabase/migrations/` to the connected Supabase project using the Supabase CLI or the SQL Editor. They create the protected profiles, events, and invitation foundation tables with their RLS policies and maintenance triggers.

## Basic event flow

Authenticated users can create and view only their own events from the dashboard. The current flow collects an occasion, title, and optional date, venue, and location URL; invitation-building features are intentionally not included yet.

Each event can now initialize a minimal invitation workspace with editable Arabic and English text, a locale-aware preview, and an authenticated preview-only route. Public guest access is intentionally not included yet.

## Supabase Auth configuration

In Supabase Dashboard → Authentication → URL Configuration:

- Set the Site URL to your deployed application URL.
- Add `http://localhost:3000/auth/callback` to Redirect URLs for local development.
- Add your deployed `/auth/callback` URL to Redirect URLs.

Magic-link email authentication must be enabled. To use Google sign-in, configure the Google provider and its OAuth credentials in Supabase Dashboard → Authentication → Providers.

## Scripts

- `npm run dev` — start the development server
- `npm run lint` — run ESLint
- `npm run build` — create a production build
