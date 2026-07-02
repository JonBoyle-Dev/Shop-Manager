export function DietAllergyFilter({
  matchDietOnly,
  onChange,
  hiddenForAllergyCount,
}: {
  matchDietOnly: boolean
  onChange: (value: boolean) => void
  hiddenForAllergyCount: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={matchDietOnly} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
        Show only items matching my diet
      </label>
      {hiddenForAllergyCount > 0 && (
        <span className="text-rose-600">
          {hiddenForAllergyCount} item{hiddenForAllergyCount === 1 ? '' : 's'} hidden for your allergies
        </span>
      )}
    </div>
  )
}
