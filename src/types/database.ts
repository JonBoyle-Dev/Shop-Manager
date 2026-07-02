export type NeedOrWant = 'need' | 'want'
export type SelectionStatus = 'pending' | 'fulfilled'
export type UsageStatus = 'active' | 'partially_used' | 'finished'

export interface Category {
  id: string
  label: string
  sort_order: number
}

export interface Item {
  id: string
  name: string
  category_id: string
  diet_tags: string[]
  allergy_tags: string[]
  need_or_want: NeedOrWant
  default_shelf_life_days: number | null
  learned_shelf_life_days: number | null
  default_replenish_days: number | null
  purchase_frequency_days: number | null
  fringe: boolean
  created_at: string
}

export interface Member {
  id: string
  name: string
  diet_preferences: string[]
  allergies: string[]
  created_at: string
}

export interface List {
  id: string
  name: string
  is_private: boolean
  owner_member_id: string | null
  created_at: string
}

export interface Selection {
  id: string
  list_id: string
  member_id: string
  item_id: string
  date_requested: string
  status: SelectionStatus
}

export interface Purchase {
  id: string
  item_id: string
  purchase_date: string
  estimated_expiry: string | null
  previous_stock_extended: boolean
  used_date: string | null
  usage_status: UsageStatus
  quantity: number
  created_at: string
}
