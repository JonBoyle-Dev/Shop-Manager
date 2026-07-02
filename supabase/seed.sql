-- Shop Manager — starter data
-- Run after policies.sql
--
-- Tag vocabulary (kept in sync by hand with src/lib/constants.ts):
--   diet_tags on items   = diets the item is SUITABLE for: vegetarian, vegan, gluten_free, dairy_free, nut_free
--   allergy_tags on items = allergens the item CONTAINS: dairy, gluten, nuts, shellfish, egg, soy
--   members.diet_preferences uses the same vocabulary as diet_tags
--   members.allergies uses the same vocabulary as allergy_tags

insert into lists (name, is_private) values ('Household', false);

insert into categories (id, label, sort_order) values
  ('fridge_dairy', 'Fridge/Dairy', 10),
  ('fresh_produce', 'Fresh Produce', 20),
  ('meat_poultry_fish', 'Meat/Poultry/Fish', 30),
  ('bakery', 'Bakery', 40),
  ('pantry_dry_goods', 'Pantry/Dry Goods', 50),
  ('frozen', 'Frozen', 60),
  ('beverages', 'Beverages', 70),
  ('snacks_treats', 'Snacks/Treats', 80),
  ('cleaning_products', 'Cleaning Products', 90),
  ('paper_disposables', 'Paper/Disposables', 100),
  ('laundry_care', 'Laundry Care', 110),
  ('bathroom_personal_care', 'Bathroom/Personal Care', 120),
  ('fringe', 'Fringe (occasional/seasonal)', 130);

insert into items (name, category_id, diet_tags, allergy_tags, need_or_want, default_shelf_life_days, default_replenish_days, fringe) values
  -- Fridge/Dairy
  ('Milk (2L)', 'fridge_dairy', '{vegetarian}', '{dairy}', 'need', 7, 7, false),
  ('Cheddar Cheese', 'fridge_dairy', '{vegetarian}', '{dairy}', 'want', 21, 21, false),
  ('Butter', 'fridge_dairy', '{vegetarian}', '{dairy}', 'need', 60, 30, false),
  ('Plain Yoghurt', 'fridge_dairy', '{vegetarian}', '{dairy}', 'want', 14, 14, false),
  ('Eggs (dozen)', 'fridge_dairy', '{vegetarian}', '{egg}', 'need', 21, 14, false),

  -- Fresh Produce
  ('Bananas', 'fresh_produce', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 5, 5, false),
  ('Carrots (1kg)', 'fresh_produce', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 14, 14, false),
  ('Tomatoes', 'fresh_produce', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 7, 7, false),
  ('Onions (1kg)', 'fresh_produce', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 21, 21, false),
  ('Spinach', 'fresh_produce', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'want', 5, 7, false),
  ('Avocados', 'fresh_produce', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'want', 5, 7, false),

  -- Meat/Poultry/Fish
  ('Chicken Breast (500g)', 'meat_poultry_fish', '{gluten_free,dairy_free,nut_free}', '{}', 'need', 3, 7, false),
  ('Beef Mince (500g)', 'meat_poultry_fish', '{gluten_free,dairy_free,nut_free}', '{}', 'need', 3, 7, false),
  ('Bacon', 'meat_poultry_fish', '{gluten_free,dairy_free,nut_free}', '{}', 'want', 7, 14, false),
  ('Salmon Fillets', 'meat_poultry_fish', '{gluten_free,dairy_free,nut_free}', '{shellfish}', 'want', 3, 14, false),

  -- Bakery
  ('Sourdough Loaf', 'bakery', '{vegetarian}', '{gluten}', 'want', 4, 4, false),
  ('Sliced White Bread', 'bakery', '{vegetarian}', '{gluten}', 'need', 5, 5, false),
  ('Bread Rolls', 'bakery', '{vegetarian}', '{gluten}', 'want', 4, 7, false),

  -- Pantry/Dry Goods
  ('Pasta (500g)', 'pantry_dry_goods', '{vegan,vegetarian}', '{gluten}', 'need', 365, 30, false),
  ('Rice (2kg)', 'pantry_dry_goods', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 730, 60, false),
  ('Tinned Tomatoes', 'pantry_dry_goods', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 730, 60, false),
  ('Peanut Butter', 'pantry_dry_goods', '{vegan,vegetarian,gluten_free,dairy_free}', '{nuts}', 'want', 180, 45, false),
  ('Olive Oil', 'pantry_dry_goods', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 365, 60, false),
  ('Flour (1kg)', 'pantry_dry_goods', '{vegan,vegetarian,dairy_free,nut_free}', '{gluten}', 'want', 180, 60, false),
  ('Cereal', 'pantry_dry_goods', '{vegetarian}', '{gluten}', 'need', 180, 30, false),

  -- Frozen
  ('Frozen Peas (1kg)', 'frozen', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'want', 180, 30, false),
  ('Frozen Chips', 'frozen', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'want', 180, 30, false),
  ('Ice Cream', 'frozen', '{vegetarian}', '{dairy}', 'want', 90, 30, false),
  ('Frozen Berries', 'frozen', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'want', 180, 45, false),

  -- Beverages
  ('Orange Juice', 'beverages', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'want', 10, 10, false),
  ('Coffee', 'beverages', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 180, 30, false),
  ('Tea Bags', 'beverages', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'need', 365, 60, false),
  ('Sparkling Water (6-pack)', 'beverages', '{vegan,vegetarian,gluten_free,dairy_free,nut_free}', '{}', 'want', 180, 21, false),

  -- Snacks/Treats
  ('Crisps', 'snacks_treats', '{vegetarian}', '{}', 'want', 60, 21, false),
  ('Chocolate Bar', 'snacks_treats', '{vegetarian}', '{dairy,nuts}', 'want', 180, 21, false),
  ('Mixed Nuts', 'snacks_treats', '{vegan,vegetarian,gluten_free,dairy_free}', '{nuts}', 'want', 90, 30, false),
  ('Biscuits', 'snacks_treats', '{vegetarian}', '{gluten,dairy}', 'want', 90, 21, false),

  -- Cleaning Products
  ('Dishwasher Tablets', 'cleaning_products', '{}', '{}', 'need', null, 60, false),
  ('Washing Up Liquid', 'cleaning_products', '{}', '{}', 'need', null, 45, false),
  ('All-Purpose Cleaner Spray', 'cleaning_products', '{}', '{}', 'want', null, 60, false),
  ('Bin Bags', 'cleaning_products', '{}', '{}', 'need', null, 45, false),

  -- Paper/Disposables
  ('Toilet Paper (9-pack)', 'paper_disposables', '{}', '{}', 'need', null, 21, false),
  ('Kitchen Roll', 'paper_disposables', '{}', '{}', 'need', null, 21, false),
  ('Cling Film', 'paper_disposables', '{}', '{}', 'want', null, 90, false),
  ('Foil', 'paper_disposables', '{}', '{}', 'want', null, 90, false),

  -- Laundry Care
  ('Laundry Detergent', 'laundry_care', '{}', '{}', 'need', null, 45, false),
  ('Fabric Softener', 'laundry_care', '{}', '{}', 'want', null, 60, false),
  ('Stain Remover', 'laundry_care', '{}', '{}', 'want', null, 90, false),

  -- Bathroom/Personal Care
  ('Toothpaste', 'bathroom_personal_care', '{}', '{}', 'need', null, 60, false),
  ('Shampoo', 'bathroom_personal_care', '{}', '{}', 'need', null, 60, false),
  ('Shower Gel', 'bathroom_personal_care', '{}', '{}', 'need', null, 60, false),
  ('Deodorant', 'bathroom_personal_care', '{}', '{}', 'need', null, 60, false),

  -- Fringe (occasional/seasonal)
  ('Birthday Candles', 'fringe', '{}', '{}', 'want', null, null, true),
  ('Wrapping Paper', 'fringe', '{}', '{}', 'want', null, null, true),
  ('Sunscreen', 'fringe', '{}', '{}', 'want', 730, null, true),
  ('BBQ Charcoal', 'fringe', '{}', '{}', 'want', null, null, true);
