# Shop Manager

A shared household web app for ticking items you want from a pre-loaded list, filtering by diet/allergy, and tracking purchases, usage, and shelf life. No logins — just pick your name.

This build covers phases 1-6 of the full roadmap: foundation, member profiles, tick list, purchase logging, usage logging, and purchase reconciliation/shelf-life learning. Photo inventory, till slips, reminders, and recipe matching are future phases.

## Stack

React + Vite + Tailwind, Supabase (Postgres + free tier), deployed on Vercel.

## Setup

1. Create a free [Supabase](https://supabase.com) project. Note the project URL and anon/publishable key from Project Settings → API.
2. In the Supabase SQL editor, run these files **in order**: `supabase/schema.sql`, `supabase/functions.sql`, `supabase/policies.sql`, `supabase/seed.sql`.
3. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. `npm install`
5. `npm run dev`

## Deploy

Import this repo into [Vercel](https://vercel.com) (framework preset auto-detects Vite) and add the same two env vars in the project settings.

## Structure

```
supabase/       schema, RLS policies, shelf-life trigger, seed data
src/lib/        Supabase client, shared constants, shelf-life calc helpers
src/context/    current member (localStorage-persisted, no auth)
src/hooks/      react-query hooks per table
src/components/ members, tick-list, purchases, usage, common, layout
src/pages/      route-level screens
```
