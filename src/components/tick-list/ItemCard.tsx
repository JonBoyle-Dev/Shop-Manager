import { Link } from 'react-router-dom'
import { TagBadge } from '../common/TagBadge'
import { QuantityStepper } from '../common/QuantityStepper'
import type { Item } from '../../types/database'

export function ItemCard({
  item,
  isTicked,
  requesterNames,
  onToggle,
  onLogPurchase,
  isBought,
  boughtQuantity,
  onToggleBought,
  onBoughtQuantityChange,
}: {
  item: Item
  isTicked: boolean
  requesterNames: string[]
  onToggle: () => void
  onLogPurchase: () => void
  isBought: boolean
  boughtQuantity: number
  onToggleBought: () => void
  onBoughtQuantityChange: (quantity: number) => void
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link to={`/item/${item.id}`} className="font-medium text-slate-900 hover:underline">
            {item.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {item.need_or_want === 'need' && <TagBadge label="need" variant="neutral" />}
            {item.fringe && <TagBadge label="occasional" variant="fringe" />}
            {item.allergy_tags.map((tag) => (
              <TagBadge key={tag} label={tag} variant="allergy" />
            ))}
            {item.diet_tags.map((tag) => (
              <TagBadge key={tag} label={tag} variant="diet" />
            ))}
          </div>
          {requesterNames.length > 0 && (
            <p className="mt-1 truncate text-xs text-slate-400">Requested by {requesterNames.join(', ')}</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            onClick={onToggle}
            aria-pressed={isTicked}
            className={`h-9 w-9 rounded-full border-2 text-lg font-bold transition ${
              isTicked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-transparent hover:border-slate-400'
            }`}
          >
            ✓
          </button>
          <button onClick={onLogPurchase} className="text-xs font-medium text-slate-500 hover:text-slate-800">
            Log purchase
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={isBought} onChange={onToggleBought} className="h-4 w-4 rounded border-slate-300" />
          Got it
        </label>
        {isBought && <QuantityStepper value={boughtQuantity} onChange={onBoughtQuantityChange} />}
      </div>
    </div>
  )
}
