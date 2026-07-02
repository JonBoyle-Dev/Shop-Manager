import { useMemo, useState } from 'react'
import { useCategories, useItems } from '../../hooks/useItems'
import { usePendingSelections, useToggleSelection } from '../../hooks/useSelections'
import { useAllPurchases } from '../../hooks/usePurchases'
import { useMemberContext } from '../../context/MemberContext'
import { useListContext } from '../../context/ListContext'
import { CategoryFilterBar } from './CategoryFilterBar'
import { DietAllergyFilter } from './DietAllergyFilter'
import { ItemCard } from './ItemCard'
import { NeedsPanel } from './NeedsPanel'
import { AddItemModal } from './AddItemModal'
import { LogPurchaseModal } from '../purchases/LogPurchaseModal'
import { BatchLogPurchasesModal } from '../purchases/BatchLogPurchasesModal'
import type { Item } from '../../types/database'

export function TickList() {
  const { currentMember } = useMemberContext()
  const { currentList } = useListContext()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: items, isLoading: itemsLoading, error } = useItems()
  const { data: pendingSelections } = usePendingSelections(currentList ? [currentList.id] : [])
  const { data: allPurchases } = useAllPurchases()
  const toggleSelection = useToggleSelection()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [matchDietOnly, setMatchDietOnly] = useState(false)
  const [purchaseItem, setPurchaseItem] = useState<Item | null>(null)
  const [boughtQuantities, setBoughtQuantities] = useState<Record<string, number>>({})
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)

  function addOrTickItem(item: Item) {
    setShowAddItemModal(false)
    if (!currentMember || !currentList) return
    const alreadyTicked = pendingSelections?.some((s) => s.item_id === item.id && s.member_id === currentMember.id) ?? false
    if (!alreadyTicked) {
      toggleSelection.mutate({ listId: currentList.id, itemId: item.id, memberId: currentMember.id, isTicked: false })
    }
  }

  const { visibleItems, hiddenForAllergyCount } = useMemo(() => {
    if (!items) return { visibleItems: [] as Item[], hiddenForAllergyCount: 0 }

    const memberAllergies = currentMember?.allergies ?? []
    const memberDietPreferences = currentMember?.diet_preferences ?? []

    let hiddenForAllergy = 0
    const filtered = items.filter((item) => {
      const conflictsWithAllergy = item.allergy_tags.some((tag) => memberAllergies.includes(tag))
      if (conflictsWithAllergy) {
        hiddenForAllergy++
        return false
      }
      if (selectedCategory && item.category_id !== selectedCategory) return false
      if (matchDietOnly && memberDietPreferences.length > 0) {
        const matchesAllPreferences = memberDietPreferences.every((pref) => item.diet_tags.includes(pref))
        if (!matchesAllPreferences) return false
      }
      return true
    })

    return { visibleItems: filtered, hiddenForAllergyCount: hiddenForAllergy }
  }, [items, currentMember, selectedCategory, matchDietOnly])

  function toggleBought(itemId: string) {
    setBoughtQuantities((prev) => {
      const next = { ...prev }
      if (itemId in next) {
        delete next[itemId]
      } else {
        next[itemId] = 1
      }
      return next
    })
  }

  function setBoughtQuantity(itemId: string, quantity: number) {
    setBoughtQuantities((prev) => ({ ...prev, [itemId]: quantity }))
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

  if (!currentList) return null
  if (categoriesLoading || itemsLoading) return <p className="p-6 text-center text-slate-500">Loading items…</p>
  if (error) return <p className="p-6 text-center text-rose-600">Couldn't load items: {(error as Error).message}</p>

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      <NeedsPanel items={items ?? []} purchases={allPurchases ?? []} />
      <div className="flex items-center justify-between gap-3">
        <CategoryFilterBar categories={categories ?? []} selected={selectedCategory} onSelect={setSelectedCategory} />
        <button
          onClick={() => setShowAddItemModal(true)}
          className="shrink-0 rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          + Add item
        </button>
      </div>
      <DietAllergyFilter matchDietOnly={matchDietOnly} onChange={setMatchDietOnly} hiddenForAllergyCount={hiddenForAllergyCount} />

      <div className="space-y-2">
        {visibleItems.map((item) => {
          const itemSelections = pendingSelections?.filter((s) => s.item_id === item.id) ?? []
          const isTicked = !!currentMember && itemSelections.some((s) => s.member_id === currentMember.id)
          const requesterNames = itemSelections.map((s) => s.members?.name).filter((n): n is string => !!n)

          return (
            <ItemCard
              key={item.id}
              item={item}
              isTicked={isTicked}
              requesterNames={requesterNames}
              onToggle={() => {
                if (!currentMember || !currentList) return
                toggleSelection.mutate({ listId: currentList.id, itemId: item.id, memberId: currentMember.id, isTicked })
              }}
              onLogPurchase={() => setPurchaseItem(item)}
              isBought={item.id in boughtQuantities}
              boughtQuantity={boughtQuantities[item.id] ?? 1}
              onToggleBought={() => toggleBought(item.id)}
              onBoughtQuantityChange={(quantity) => setBoughtQuantity(item.id, quantity)}
            />
          )
        })}
        {visibleItems.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No items match these filters.</p>}
      </div>

      {purchaseItem && <LogPurchaseModal item={purchaseItem} onClose={() => setPurchaseItem(null)} />}

      {showAddItemModal && (
        <AddItemModal
          items={items ?? []}
          categories={categories ?? []}
          onClose={() => setShowAddItemModal(false)}
          onSelectExisting={addOrTickItem}
          onCreated={addOrTickItem}
        />
      )}

      {boughtItems.length > 0 && !showBatchModal && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white p-3 shadow-lg">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <span className="text-sm text-slate-600">
              {boughtItems.length} item{boughtItems.length === 1 ? '' : 's'} marked as got
            </span>
            <button
              onClick={() => setShowBatchModal(true)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Log Purchases
            </button>
          </div>
        </div>
      )}

      {showBatchModal && (
        <BatchLogPurchasesModal
          items={boughtItems}
          onClose={() => setShowBatchModal(false)}
          onDone={() => setBoughtQuantities({})}
        />
      )}
    </div>
  )
}
