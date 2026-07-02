-- Shop Manager — Row Level Security
-- Run after functions.sql
--
-- No auth/login exists (open, name-only member selection — household-scale
-- trust, no PII beyond first names). RLS stays enabled with permissive
-- policies rather than disabled outright: it avoids tripping Supabase's
-- security advisor and documents the openness as intentional rather than
-- an oversight. Only the anon/publishable key is ever used client-side.

alter table categories enable row level security;
alter table items enable row level security;
alter table members enable row level security;
alter table lists enable row level security;
alter table selections enable row level security;
alter table purchases enable row level security;

create policy "public read categories" on categories for select using (true);

create policy "public read items" on items for select using (true);
create policy "public insert items" on items for insert with check (true);
create policy "public update items" on items for update using (true) with check (true);

create policy "public all members" on members for all using (true) with check (true);
-- "Private" lists are a soft, app-level filter (client only queries lists it
-- shouldn't hide), not a DB-enforced boundary — consistent with the rest of
-- this app's open, no-auth, household-trust model.
create policy "public all lists" on lists for all using (true) with check (true);
create policy "public all selections" on selections for all using (true) with check (true);
create policy "public all purchases" on purchases for all using (true) with check (true);
