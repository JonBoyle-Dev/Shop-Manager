import { useState, type FormEvent } from 'react'
import { DIET_TAGS, ALLERGY_TAGS } from '../../lib/constants'
import { TagToggleGroup } from '../common/TagToggleGroup'
import type { Category, NeedOrWant } from '../../types/database'
import type { NewItem } from '../../hooks/useItems'

export function ItemForm({
  initialName,
  categories,
  onSubmit,
  onCancel,
}: {
  initialName: string
  categories: Category[]
  onSubmit: (values: NewItem) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initialName)
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [dietTags, setDietTags] = useState<string[]>([])
  const [allergyTags, setAllergyTags] = useState<string[]>([])
  const [needOrWant, setNeedOrWant] = useState<NeedOrWant>('want')
  const [shelfLifeDays, setShelfLifeDays] = useState('')
  const [replenishDays, setReplenishDays] = useState('')
  const [fringe, setFringe] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !categoryId) return
    onSubmit({
      name: name.trim(),
      category_id: categoryId,
      diet_tags: dietTags,
      allergy_tags: allergyTags,
      need_or_want: needOrWant,
      default_shelf_life_days: shelfLifeDays ? Number(shelfLifeDays) : null,
      default_replenish_days: replenishDays ? Number(replenishDays) : null,
      fringe,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          autoFocus
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Need or want</label>
        <div className="flex gap-2">
          {(['need', 'want'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setNeedOrWant(value)}
              className={`rounded-full border px-3 py-1 text-sm ${
                needOrWant === value ? 'border-transparent bg-slate-900 text-white' : 'border-slate-300 text-slate-600'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Suitable for diets</label>
        <TagToggleGroup options={DIET_TAGS} selected={dietTags} onChange={setDietTags} activeClassName="bg-emerald-600 text-white" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contains allergens</label>
        <TagToggleGroup options={ALLERGY_TAGS} selected={allergyTags} onChange={setAllergyTags} activeClassName="bg-rose-600 text-white" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Shelf life (days)</label>
          <input
            type="number"
            min={0}
            value={shelfLifeDays}
            onChange={(e) => setShelfLifeDays(e.target.value)}
            placeholder="leave blank if n/a"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Replenish cycle (days)</label>
          <input
            type="number"
            min={0}
            value={replenishDays}
            onChange={(e) => setReplenishDays(e.target.value)}
            placeholder="leave blank if n/a"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={fringe} onChange={(e) => setFringe(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
        Occasional/seasonal item
      </label>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim() || !categoryId}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Add item
        </button>
      </div>
    </form>
  )
}
