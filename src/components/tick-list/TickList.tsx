import { useMemo, useState } from 'react'
import { useCategories, useItems } from '../../hooks/useItems'
import { usePendingSelections, useToggleSelection } from '../../hooks/useSelections'
import { useMemberContext } from '../../context/MemberContext'
import { CategoryFilterBar } from './CategoryFilterBar'
import { DietAllergyFilter } from './DietAllergyFilter'
import { ItemCard } from './ItemCard'
import { LogPurchaseModal } from '../purchases/LogPurchaseModal'
import type { Item } from '../../types/database'

export function TickList() {
  const { currentMember } = useMemberContext()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: items, isLoading: itemsLoading, error } = useItems()
  const { data: pendingSelections } = usePendingSelections()
  const toggleSelection = useToggleSelection()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [matchDietOnly, setMatchDietOnly] = useState(false)
  const [purchaseItem, setPurchaseItem] = useState<Item | null>(null)

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

  if (categoriesLoading || itemsLoading) return <p className="p-6 text-center text-slate-500">Loading items…</p>
  if (error) return <p className="p-6 text-center text-rose-600">Couldn't load items: {(error as Error).message}</p>

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      <CategoryFilterBar categories={categories ?? []} selected={selectedCategory} onSelect={setSelectedCategory} />
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
                if (!currentMember) return
                toggleSelection.mutate({ itemId: item.id, memberId: currentMember.id, isTicked })
              }}
              onLogPurchase={() => setPurchaseItem(item)}
            />
          )
        })}
        {visibleItems.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No items match these filters.</p>}
      </div>

      {purchaseItem && <LogPurchaseModal item={purchaseItem} onClose={() => setPurchaseItem(null)} />}
    </div>
  )
}
