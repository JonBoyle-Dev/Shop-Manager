import { useState, type FormEvent } from 'react'
import { DIET_TAGS, ALLERGY_TAGS } from '../../lib/constants'
import { TagToggleGroup } from '../common/TagToggleGroup'
import type { Member } from '../../types/database'

export function MemberForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: {
  initial?: Pick<Member, 'name' | 'diet_preferences' | 'allergies'>
  onSubmit: (values: { name: string; diet_preferences: string[]; allergies: string[] }) => void
  onCancel?: () => void
  submitLabel?: string
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [dietPreferences, setDietPreferences] = useState<string[]>(initial?.diet_preferences ?? [])
  const [allergies, setAllergies] = useState<string[]>(initial?.allergies ?? [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), diet_preferences: dietPreferences, allergies })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jon"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          autoFocus
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Diet preferences</label>
        <TagToggleGroup options={DIET_TAGS} selected={dietPreferences} onChange={setDietPreferences} activeClassName="bg-emerald-600 text-white" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Allergies (medical — always overrides diet filters)</label>
        <TagToggleGroup options={ALLERGY_TAGS} selected={allergies} onChange={setAllergies} activeClassName="bg-rose-600 text-white" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
        )}
        <button type="submit" disabled={!name.trim()} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
