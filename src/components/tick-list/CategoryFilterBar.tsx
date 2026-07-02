import type { Category } from '../../types/database'

export function CategoryFilterBar({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[]
  selected: string | null
  onSelect: (categoryId: string | null) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
          selected === null ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
            selected === category.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
