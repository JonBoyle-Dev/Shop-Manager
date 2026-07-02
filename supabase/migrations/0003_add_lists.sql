-- Run once against an existing project that already ran schema.sql + migration 0002.
-- Adds a "lists" concept: separate persistent named lists (Household, Holiday,
-- Xmas Week, etc.), including private lists visible only to their owner.

create table lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_private boolean not null default false,
  owner_member_id uuid references members(id) on delete cascade,
  created_at timestamptz not null default now(),
  check ((is_private and owner_member_id is not null) or (not is_private and owner_member_id is null))
);
create index lists_owner_idx on lists (owner_member_id);

alter table lists enable row level security;
create policy "public all lists" on lists for all using (true) with check (true);

-- Existing selections all move onto one default shared list.
insert into lists (name, is_private) values ('Household', false);

alter table selections add column list_id uuid references lists(id) on delete cascade;
update selections set list_id = (select id from lists where name = 'Household' and is_private = false limit 1);
alter table selections alter column list_id set not null;
create index selections_list_idx on selections (list_id);

drop index if exists selections_one_pending_per_member_item;
create unique index selections_one_pending_per_list_member_item
  on selections (list_id, member_id, item_id)
  where status = 'pending';
