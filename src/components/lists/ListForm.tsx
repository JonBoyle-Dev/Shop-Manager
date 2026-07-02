import { useState, type FormEvent } from 'react'

export function ListForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: { name: string; is_private: boolean }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), is_private: isPrivate })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">List name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Holiday, Xmas Week"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          autoFocus
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
        Private — only visible when you've selected your own name
      </label>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
          Cancel
        </button>
        <button type="submit" disabled={!name.trim()} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
          Add list
        </button>
      </div>
    </form>
  )
}
