import type { Item } from '../types/database'

/** Estimated expiry for a purchase logged today, preferring the learned average over the item default. */
export function estimateExpiry(purchaseDate: Date, item: Pick<Item, 'learned_shelf_life_days' | 'default_shelf_life_days'>): Date | null {
  const days = item.learned_shelf_life_days ?? item.default_shelf_life_days
  if (days == null) return null
  return addDays(purchaseDate, days)
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + Math.round(days))
  return result
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
