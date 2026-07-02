const VARIANT_CLASSES = {
  diet: 'bg-emerald-100 text-emerald-800',
  allergy: 'bg-rose-100 text-rose-800',
  neutral: 'bg-slate-100 text-slate-700',
  fringe: 'bg-amber-100 text-amber-800',
} as const

export function TagBadge({
  label,
  variant = 'neutral',
}: {
  label: string
  variant?: keyof typeof VARIANT_CLASSES
}) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant]}`}>
      {label.replace(/_/g, ' ')}
    </span>
  )
}
