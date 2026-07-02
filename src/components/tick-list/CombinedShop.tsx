import { useMemo, useState } from 'react'
import { useVisibleLists } from '../../hooks/useLists'
import { usePendingSelections } from '../../hooks/useSelections'
import { useItems } from '../../hooks/useItems'
import { useMemberContext } from '../../context/MemberContext'
import { CombinedItemRow } from './CombinedItemRow'
import { LogPurchaseModal } from '../purchases/LogPurchaseModal'
import { BatchLogPurchasesModal } from '../purchases/BatchLogPurchasesModal'
import type { Item, List } from '../../types/database'

export function CombinedShop() {
  const { currentMember } = useMemberContext()
  const { data: lists, isLoading: listsLoading } = useVisibleLists(currentMember?.id)
  const { data: items } = useItems()
  const [selectedListIds, setSelectedListIds] = useState<string[]>([])
  const { data: pendingSelections, isLoading: selectionsLoading } = usePendingSelections(selectedListIds)
  const [purchaseItem, setPurchaseItem] = useState<Item | null>(null)
  const [boughtQuantities, setBoughtQuantities] = useState<Record<string, number>>({})
  const [showBatchModal, setShowBatchModal] = useState(false)

  function toggleList(listId: string) {
    setSelectedListIds((prev) => (prev.includes(listId) ? prev.filter((id) => id !== listId) : [...prev, listId]))
  }

  const mergedItems = useMemo(() => {
    if (!pendingSelections || !items) return []
    const itemsById = new Map(items.map((item) => [item.id, item]))
    const listsById = new Map((lists ?? []).map((list) => [list.id, list]))
    const byItem = new Map<string, { item: Item; requesterSummaries: string[] }>()

    for (const selection of pendingSelections) {
      const item = itemsById.get(selection.item_id)
      if (!item) continue
      const list = listsById.get(selection.list_id)
      const summary = `${selection.members?.name ?? 'Someone'} (${list?.name ?? 'list'})`
      const existing = byItem.get(item.id)
      if (existing) {
        existing.requesterSummaries.push(summary)
      } else {
        byItem.set(item.id, { item, requesterSummaries: [summary] })
      }
    }

    return [...byItem.values()].sort((a, b) => a.item.name.localeCompare(b.item.name))
  }, [pendingSelections, items, lists])

  function toggleBought(itemId: string) {
    setBoughtQuantities((prev) => {
      const next = { ...prev }
      if (itemId in next) delete next[itemId]
      else next[itemId] = 1
      return next
    })
  }

  const boughtItems = useMemo(
    () =>
      Object.entries(boughtQuantities)
        .map(([itemId, quantity]) => {
          const item = items?.find((i) => i.id === itemId)
          return item ? { item, quantity } : null
        })
        .filter((entry): entry is { item: Item; quantity: number } => entry !== null),
    [boughtQuantities, items]
  )

  if (listsLoading) return <p className="p-6 text-center text-slate-500">Loading lists…</p>

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      <div>
        <h1 className="mb-1 text-lg font-semibold text-slate-900">Shop combined lists</h1>
        <p className="mb-3 text-sm text-slate-500">
          Pick the lists you're shopping for. Ticking isn't available here — logging a purchase fulfils it on whichever list(s) asked for it.
        </p>
        <div className="flex flex-wrap gap-2">
          {lists?.map((list: List) => (
            <button
              key={list.id}
              onClick={() => toggleList(list.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                selectedListIds.includes(list.id) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {list.name}
              {list.is_private && ' 🔒'}
            </button>
          ))}
        </div>
      </div>

      {selectedListIds.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Select at least one list above.</p>}
      {selectedListIds.length > 0 && selectionsLoading && <p className="py-8 text-center text-sm text-slate-400">Loading…</p>}

      <div className="space-y-2">
        {mergedItems.map(({ item, requesterSummaries }) => (
          <CombinedItemRow
            key={item.id}
            item={item}
            requesterSummaries={requesterSummaries}
            onLogPurchase={() => setPurchaseItem(item)}
            isBought={item.id in boughtQuantities}
            boughtQuantity={boughtQuantities[item.id] ?? 1}
            onToggleBought={() => toggleBought(item.id)}
            onBoughtQuantityChange={(quantity) => setBoughtQuantities((prev) => ({ ...prev, [item.id]: quantity }))}
          />
        ))}
        {selectedListIds.length > 0 && !selectionsLoading && mergedItems.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">Nothing pending on the selected list(s).</p>
        )}
      </div>

      {purchaseItem && <LogPurchaseModal item={purchaseItem} onClose={() => setPurchaseItem(null)} />}

      {boughtItems.length > 0 && !showBatchModal && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white p-3 shadow-lg">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <span className="text-sm text-slate-600">
              {boughtItems.length} item{boughtItems.length === 1 ? '' : 's'} marked as got
            </span>
            <button onClick={() => setShowBatchModal(true)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Log Purchases
            </button>
          </div>
        </div>
      )}

      {showBatchModal && (
        <BatchLogPurchasesModal items={boughtItems} onClose={() => setShowBatchModal(false)} onDone={() => setBoughtQuantities({})} />
      )}
    </div>
  )
}
