import { useState } from 'react'
import { Modal } from '../common/Modal'
import { ItemForm } from './ItemForm'
import { useCreateItem } from '../../hooks/useItems'
import type { Category, Item } from '../../types/database'

export function AddItemModal({
  items,
  categories,
  onClose,
  onSelectExisting,
  onCreated,
}: {
  items: Item[]
  categories: Category[]
  onClose: () => void
  onSelectExisting: (item: Item) => void
  onCreated: (item: Item) => void
}) {
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const createItem = useCreateItem()

  const matches = query.trim()
    ? items.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 20)
    : []

  if (showForm) {
    return (
      <Modal title="Add new item" onClose={onClose}>
        <ItemForm
          initialName={query.trim()}
          categories={categories}
          onCancel={() => setShowForm(false)}
          onSubmit={(values) => createItem.mutate(values, { onSuccess: (item) => onCreated(item) })}
        />
      </Modal>
    )
  }

  return (
    <Modal title="Add item" onClose={onClose}>
      <div className="space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an item…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          autoFocus
        />

        {matches.length > 0 && (
          <ul className="max-h-56 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
            {matches.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelectExisting(item)}
                  className="w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim() && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700"
          >
            + Add "{query.trim()}" as a new item
          </button>
        )}
      </div>
    </Modal>
  )
}
