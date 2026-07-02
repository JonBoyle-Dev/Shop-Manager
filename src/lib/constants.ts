// Kept in sync by hand with supabase/seed.sql.
// diet_tags on items / members.diet_preferences share this vocabulary.
export const DIET_TAGS = ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'nut_free'] as const

// allergy_tags on items / members.allergies share this vocabulary.
export const ALLERGY_TAGS = ['dairy', 'gluten', 'nuts', 'shellfish', 'egg', 'soy'] as const

export const CATEGORY_ORDER = [
  'fridge_dairy',
  'fresh_produce',
  'meat_poultry_fish',
  'bakery',
  'pantry_dry_goods',
  'frozen',
  'beverages',
  'snacks_treats',
  'cleaning_products',
  'paper_disposables',
  'laundry_care',
  'bathroom_personal_care',
  'fringe',
] as const

export const CURRENT_MEMBER_STORAGE_KEY = 'shop-manager:current-member-id'
export const CURRENT_LIST_STORAGE_KEY = 'shop-manager:current-list-id'

/** A purchase counts as "expiring soon" once its estimated expiry is this many days away or closer. */
export const EXPIRING_SOON_DAYS = 3
