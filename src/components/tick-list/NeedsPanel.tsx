import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { daysUntil } from '../../lib/shelfLife'
import { EXPIRING_SOON_DAYS } from '../../lib/constants'
import type { Item } from '../../types/database'
import type { PurchaseSummary } from '../../hooks/usePurchases'

interface ExpiringEntry {
  item: Item
  daysUntil: number
}

interface OverdueEntry {
  item: Item
  daysOverdue: number
}

function expiryLabel(days: number): string {
  if (days < 0) return `Expired ${Math.abs(days)}d ago`
  if (days === 0) return 'Expires today'
  return `Expires in ${days}d`
}

export function NeedsPanel({ items, purchases }: { items: Item[]; purchases: PurchaseSummary[] }) {
  const { expiring, overdue } = useMemo(() => {
    const itemsById = new Map(items.map((item) => [item.id, item]))

    const expiringList: ExpiringEntry[] = []
    for (const purchase of purchases) {
      if (purchase.usage_status === 'finished' || !purchase.estimated_expiry) continue
      const days = daysUntil(purchase.estimated_expiry)
      if (days > EXPIRING_SOON_DAYS) continue
      const item = itemsById.get(purchase.item_id)
      if (item) expiringList.push({ item, daysUntil: days })
    }
    expiringList.sort((a, b) => a.daysUntil - b.daysUntil)

    const lastPurchaseByItem = new Map<string, string>()
    for (const purchase of purchases) {
      const existing = lastPurchaseByItem.get(purchase.item_id)
      if (!existing || purchase.purchase_date > existing) lastPurchaseByItem.set(purchase.item_id, purchase.purchase_date)
    }

    const overdueList: OverdueEntry[] = []
    for (const [itemId, lastPurchaseDate] of lastPurchaseByItem) {
      const item = itemsById.get(itemId)
      if (!item || item.need_or_want !== 'need' || item.fringe || item.default_replenish_days == null) continue
      const daysOverdue = -daysUntil(lastPurchaseDate) - item.default_replenish_days
      if (daysOverdue > 0) overdueList.push({ item, daysOverdue })
    }
    overdueList.sort((a, b) => b.daysOverdue - a.daysOverdue)

    return { expiring: expiringList, overdue: overdueList }
  }, [items, purchases])

  if (expiring.length === 0 && overdue.length === 0) return null

  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
      {expiring.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">Expiring soon</p>
          <ul className="space-y-1">
            {expiring.map(({ item, daysUntil: days }) => (
              <li key={item.id} className="flex justify-between text-sm">
                <Link to={`/item/${item.id}`} className="text-slate-800 hover:underline">
                  {item.name}
                </Link>
                <span className="text-amber-700">{expiryLabel(days)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {overdue.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">Might need restocking</p>
          <ul className="space-y-1">
            {overdue.map(({ item, daysOverdue }) => (
              <li key={item.id} className="flex justify-between text-sm">
                <Link to={`/item/${item.id}`} className="text-slate-800 hover:underline">
                  {item.name}
                </Link>
                <span className="text-amber-700">{daysOverdue}d overdue</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
