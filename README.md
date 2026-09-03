# Lamma

Lamma is a bilingual digital invitation platform built with Next.js and Supabase.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. For zero-cost local AI testing, set `AI_PROVIDER=mock`. This mode does not need `OPENAI_API_KEY` or call OpenAI.
5. Start the app with `npm run dev`.

`OPENAI_API_KEY` is server-only and required only when `AI_PROVIDER=openai`. Never commit `.env.local`.

## Database migration

Review and manually apply the SQL migrations in `supabase/migrations/` to the connected Supabase project using the Supabase CLI or SQL Editor.

## Basic event flow

Authenticated users can create and view only their own events, build invitations, preview them, and publish guest-facing invitations.

Each event can initialize an invitation workspace with editable language-agnostic text and an authenticated preview. Published invitations are available to guests at `/i/[slug]` through a narrow database projection; direct anonymous table access remains disabled.

`NEXT_PUBLIC_APP_URL` must be set to the full local or deployed application origin so published invitation links and canonical metadata use the correct domain.

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
