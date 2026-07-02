import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useItem } from '../hooks/useItems'
import { usePurchaseHistory } from '../hooks/usePurchases'
import { TagBadge } from '../components/common/TagBadge'
import { LogPurchaseModal } from '../components/purchases/LogPurchaseModal'
import { LogUsageModal } from '../components/usage/LogUsageModal'
import type { Purchase } from '../types/database'

const USAGE_LABEL: Record<Purchase['usage_status'], string> = {
  active: 'Active',
  partially_used: 'Partially used',
  finished: 'Finished',
}

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isLoading } = useItem(id)
  const { data: purchases } = usePurchaseHistory(id)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [usagePurchase, setUsagePurchase] = useState<Purchase | null>(null)

  if (isLoading || !item) return <p className="p-6 text-center text-slate-500">Loading…</p>

  return (
    <div className="mx-auto max-w-lg space-y-5 p-4">
      <Link to="/tick-list" className="text-sm text-slate-500 hover:underline">
        ← Back to list
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{item.name}</h1>
        <div className="mt-2 flex flex-wrap gap-1">
          {item.allergy_tags.map((tag) => (
            <TagBadge key={tag} label={tag} variant="allergy" />
          ))}
          {item.diet_tags.map((tag) => (
            <TagBadge key={tag} label={tag} variant="diet" />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-slate-500">Default shelf life</span>
          <span className="text-slate-900">{item.default_shelf_life_days != null ? `${item.default_shelf_life_days} days` : '—'}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-500">Learned shelf life</span>
          <span className="text-slate-900">
            {item.learned_shelf_life_days != null ? `${Math.round(item.learned_shelf_life_days)} days` : 'Not enough data yet'}
          </span>
        </div>
      </div>

      <button
        onClick={() => setShowPurchaseModal(true)}
        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white"
      >
        Log purchase
      </button>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Purchase history</h2>
        {purchases && purchases.length === 0 && <p className="text-sm text-slate-400">No purchases logged yet.</p>}
        <div className="space-y-2">
          {purchases?.map((purchase) => (
            <div key={purchase.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <div>
                <p className="font-medium text-slate-900">{new Date(purchase.purchase_date).toLocaleDateString()}</p>
                <p className="text-slate-500">
                  {USAGE_LABEL[purchase.usage_status]}
                  {purchase.estimated_expiry && ` · expires ${new Date(purchase.estimated_expiry).toLocaleDateString()}`}
                  {purchase.previous_stock_extended && ' · extended batch'}
                </p>
              </div>
              {purchase.usage_status !== 'finished' && (
                <button onClick={() => setUsagePurchase(purchase)} className="text-xs font-medium text-slate-500 hover:text-slate-800">
                  Mark used
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {showPurchaseModal && <LogPurchaseModal item={item} onClose={() => setShowPurchaseModal(false)} />}
      {usagePurchase && <LogUsageModal purchase={usagePurchase} onClose={() => setUsagePurchase(null)} />}
    </div>
  )
}
