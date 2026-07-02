export function QuantityStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-600 disabled:opacity-30 hover:border-slate-400"
      >
        −
      </button>
      <span className="w-5 text-center text-sm font-medium text-slate-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-slate-400"
      >
        +
      </button>
    </div>
  )
}
