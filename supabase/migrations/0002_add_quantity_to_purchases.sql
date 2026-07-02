-- Run once against an existing project that already ran the original schema.sql.
-- Adds quantity tracking to purchases (for batch "log what I bought" flow).

alter table purchases
  add column quantity integer not null default 1 check (quantity > 0);
