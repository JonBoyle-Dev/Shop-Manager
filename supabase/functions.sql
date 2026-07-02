-- Shop Manager — server-side business logic
-- Run after schema.sql

-- Recomputes items.learned_shelf_life_days as a running mean of
-- (used_date - purchase_date) whenever a purchase is marked finished.
-- Server-side so the average stays consistent no matter which family
-- member's device logs the usage.
create or replace function update_learned_shelf_life()
returns trigger as $$
declare
  v_actual_days numeric;
  v_current_avg numeric;
  v_sample_count int;
begin
  if new.usage_status = 'finished' and new.used_date is not null
     and (old.usage_status is distinct from 'finished' or old.used_date is null) then

    v_actual_days := (new.used_date - new.purchase_date);

    select learned_shelf_life_days into v_current_avg
    from items where id = new.item_id;

    select count(*) into v_sample_count
    from purchases
    where item_id = new.item_id and usage_status = 'finished' and used_date is not null;

    update items
    set learned_shelf_life_days =
      case
        when v_current_avg is null or v_sample_count <= 1 then v_actual_days
        else ((v_current_avg * (v_sample_count - 1)) + v_actual_days) / v_sample_count
      end
    where id = new.item_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_update_learned_shelf_life
after update on purchases
for each row
execute function update_learned_shelf_life();
