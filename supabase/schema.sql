-- Shop Manager — core schema (phases 1-6)
-- Run in the Supabase SQL editor in this order: schema.sql, functions.sql, policies.sql, seed.sql

create extension if not exists "pgcrypto";

create type need_or_want as enum ('need', 'want');
create type selection_status as enum ('pending', 'fulfilled');
create type usage_status as enum ('active', 'partially_used', 'finished');

create table categories (
  id text primary key,
  label text not null,
  sort_order int not null default 0
);

create table items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id text not null references categories(id),
  diet_tags text[] not null default '{}',
  allergy_tags text[] not null default '{}',
  need_or_want need_or_want not null default 'want',
  default_shelf_life_days int,
  learned_shelf_life_days numeric,
  default_replenish_days int,
  purchase_frequency_days int,
  fringe boolean not null default false,
  created_at timestamptz not null default now(),
  unique (name, category_id)
);
create index items_category_idx on items (category_id);

create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  diet_preferences text[] not null default '{}',
  allergies text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table selections (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  item_id uuid not null references items(id) on delete cascade,
  date_requested timestamptz not null default now(),
  status selection_status not null default 'pending'
);
create index selections_item_idx on selections (item_id);
create index selections_member_idx on selections (member_id);
create index selections_status_idx on selections (status);
-- Only one pending request per member/item at a time; re-requesting after
-- fulfilment is a new row, so this is a partial unique index, not a table constraint.
create unique index selections_one_pending_per_member_item
  on selections (member_id, item_id)
  where status = 'pending';

create table purchases (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  purchase_date date not null default current_date,
  estimated_expiry date,
  previous_stock_extended boolean not null default false,
  used_date date,
  usage_status usage_status not null default 'active',
  created_at timestamptz not null default now()
);
create index purchases_item_idx on purchases (item_id);
create index purchases_status_idx on purchases (usage_status);
