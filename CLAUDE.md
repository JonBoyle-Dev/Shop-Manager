# Shop Manager — Household Shopping App

React + Vite + Tailwind + Supabase household app. Family members pick their name (no login), tick items they want, log purchases/usage, and the app learns shelf life over time. **Current scope: phases 1-8 of the 14-phase roadmap, plus an added quantity/batch-purchase-logging feature not in the original plan.**

## Structure
```
Shop-Manager/
├── supabase/
│   ├── schema.sql       # tables, enums, indexes — run first
│   ├── functions.sql    # learned-shelf-life trigger — run second
│   ├── policies.sql     # RLS (enabled, permissive — no auth exists) — run third
│   ├── seed.sql         # 13 categories + ~50 starter items — run fourth
│   └── migrations/      # incremental changes for already-provisioned projects, run in filename order
└── src/
    ├── lib/
    │   ├── supabase.ts      # client singleton, no generic Database type (hand-typed per hook instead)
    │   ├── constants.ts     # diet/allergy tag vocabulary + EXPIRING_SOON_DAYS, kept in sync by hand with seed.sql
    │   └── shelfLife.ts     # pure expiry-estimate helpers (toDateInputValue formats from LOCAL date parts, not toISOString — see below)
    ├── types/database.ts    # hand-written row types, no generated schema
    ├── context/MemberContext.tsx   # current member, localStorage-persisted
    ├── hooks/                # one file per table, react-query wrapped
    ├── components/{members,tick-list,purchases,usage,common,layout}/
    └── pages/                 # route-level screens, mostly thin wrappers over components/
```

## Data model
`categories` (13 fixed rows) → `items` (diet_tags/allergy_tags as `text[]`, array-overlap filtering) → `members` (diet_preferences/allergies, same tag vocabulary) → `selections` (a member's pending/fulfilled tick) → `purchases` (expiry tracking, usage status, quantity).

## Key design decisions
- **No auth.** Household-scale trust — member selection is just picking a name, persisted in localStorage. RLS stays *enabled* with permissive `USING (true)` policies rather than disabled, to avoid tripping Supabase's security linter and to document the openness as intentional.
- **Shelf-life learning is server-side.** `functions.sql`'s trigger recomputes `items.learned_shelf_life_days` as a running mean whenever a purchase is marked `finished`, so it stays consistent regardless of which family member's device logs the usage.
- **Only one pending selection per member/item.** Enforced via a partial unique index (`selections_one_pending_per_member_item`), not a table constraint — re-requesting after fulfilment is a new row.
- **Allergy filtering is automatic and cannot be toggled off** on the tick list (medical safety); diet-preference filtering is an optional "match my diet" toggle.
- **Marking an item "finished" re-flags it as needed**, requested by whoever logged the usage (`useRequestItem`), since the schema requires a `member_id` on every selection.
- **Dates must be formatted from local `Date` parts, not `.toISOString()`.** `toISOString()` converts to UTC, which silently shifts the date backward a day in positive-UTC-offset timezones once round-tripped through a local `Date` construction — this was a real bug found in testing (`toDateInputValue` in `shelfLife.ts` is the fix; reuse it, don't reintroduce `toISOString().slice(0,10)`).
- **Batch purchase logging** (`BatchLogPurchasesModal`) processes items sequentially, one shared date, auto-logging items with no existing stock and reusing `ReconciliationPrompt` per-item for ones that already have active stock. Extending adds the new quantity to the existing batch's quantity rather than replacing it.
- **Manual low-stock flagging** (mentioned in the original plan) has no separate mechanism — it's just the existing want-tick, since that already means "this is needed."
- **Restock-overdue reminders only fire once there's purchase history** for an item (no reminder for "need" items that have simply never been bought yet — that's what ticking is for) and exclude fringe items (no regular cycle to be "overdue" against). Expiring-soon reminders include fringe items.

## Out of scope for this build
Photo inventory log, till slip/receipt logging (with or without OCR), weekly digest view, purchase-frequency learning from receipts, recipe matching engine. These are phases 9-14 of the original roadmap — see the user's original plan doc for the full spec if picking this back up.

## Local dev
See [README.md](README.md) for setup. Requires a real Supabase project — `.env.local` with placeholder/unreachable URLs will leave queries stuck in a "paused" fetchStatus (TanStack Query's offline-detection pause), not a clean error state.
