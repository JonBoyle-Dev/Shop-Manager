# Shop Manager — Household Shopping App

React + Vite + Tailwind + Supabase household app. Family members pick their name (no login), tick items they want, log purchases/usage, and the app learns shelf life over time. **Current scope: phases 1-6 of the 14-phase roadmap.**

## Structure
```
Shop-Manager/
├── supabase/
│   ├── schema.sql       # tables, enums, indexes — run first
│   ├── functions.sql    # learned-shelf-life trigger — run second
│   ├── policies.sql     # RLS (enabled, permissive — no auth exists) — run third
│   └── seed.sql         # 13 categories + ~50 starter items — run fourth
└── src/
    ├── lib/
    │   ├── supabase.ts      # client singleton, no generic Database type (hand-typed per hook instead)
    │   ├── constants.ts     # diet/allergy tag vocabulary, kept in sync by hand with seed.sql
    │   └── shelfLife.ts     # pure expiry-estimate helpers
    ├── types/database.ts    # hand-written row types, no generated schema
    ├── context/MemberContext.tsx   # current member, localStorage-persisted
    ├── hooks/                # one file per table, react-query wrapped
    ├── components/{members,tick-list,purchases,usage,common,layout}/
    └── pages/                 # route-level screens, mostly thin wrappers over components/
```

## Data model
`categories` (13 fixed rows) → `items` (diet_tags/allergy_tags as `text[]`, array-overlap filtering) → `members` (diet_preferences/allergies, same tag vocabulary) → `selections` (a member's pending/fulfilled tick) → `purchases` (expiry tracking, usage status).

## Key design decisions
- **No auth.** Household-scale trust — member selection is just picking a name, persisted in localStorage. RLS stays *enabled* with permissive `USING (true)` policies rather than disabled, to avoid tripping Supabase's security linter and to document the openness as intentional.
- **Shelf-life learning is server-side.** `functions.sql`'s trigger recomputes `items.learned_shelf_life_days` as a running mean whenever a purchase is marked `finished`, so it stays consistent regardless of which family member's device logs the usage.
- **Only one pending selection per member/item.** Enforced via a partial unique index (`selections_one_pending_per_member_item`), not a table constraint — re-requesting after fulfilment is a new row.
- **Allergy filtering is automatic and cannot be toggled off** on the tick list (medical safety); diet-preference filtering is an optional "match my diet" toggle.
- **Marking an item "finished" re-flags it as needed**, requested by whoever logged the usage (`useRequestItem`), since the schema requires a `member_id` on every selection.

## Out of scope for this build
Photo inventory log, till slip/receipt logging (with or without OCR), reminders/weekly digest, recipe matching engine, fringe-item UI polish. These are phases 7-14 of the original roadmap — see the user's original plan doc for the full spec if picking this back up.

## Local dev
See [README.md](README.md) for setup. Requires a real Supabase project — `.env.local` with placeholder/unreachable URLs will leave queries stuck in a "paused" fetchStatus (TanStack Query's offline-detection pause), not a clean error state.
