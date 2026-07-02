export function TagToggleGroup({
  options,
  selected,
  onChange,
  activeClassName = 'bg-slate-900 text-white',
}: {
  options: readonly string[]
  selected: string[]
  onChange: (next: string[]) => void
  activeClassName?: string
}) {
  function toggle(tag: string) {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const isActive = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              isActive ? `border-transparent ${activeClassName}` : 'border-slate-300 text-slate-600 hover:border-slate-400'
            }`}
          >
            {tag.replace(/_/g, ' ')}
          </button>
        )
      })}
    </div>
  )
}
