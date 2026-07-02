import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVisibleLists, useCreateList, useDeleteList, useClearList } from '../../hooks/useLists'
import { useMemberContext } from '../../context/MemberContext'
import { useListContext } from '../../context/ListContext'
import { ListForm } from './ListForm'
import type { List } from '../../types/database'

export function ListManager() {
  const { currentMember } = useMemberContext()
  const { currentList, setCurrentList } = useListContext()
  const { data: lists, isLoading, error } = useVisibleLists(currentMember?.id)
  const createList = useCreateList()
  const deleteList = useDeleteList()
  const clearList = useClearList()
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  function selectList(list: List) {
    setCurrentList(list)
    navigate('/tick-list')
  }

  function handleClear(list: List) {
    if (window.confirm(`Clear all pending ticks on "${list.name}"? This can't be undone.`)) {
      clearList.mutate(list.id)
    }
  }

  function handleRemove(list: List) {
    if (!window.confirm(`Delete the list "${list.name}" entirely, including its ticks?`)) return
    if (currentList?.id === list.id) setCurrentList(null)
    deleteList.mutate(list.id)
  }

  if (isLoading) return <p className="p-6 text-center text-slate-500">Loading lists…</p>
  if (error) return <p className="p-6 text-center text-rose-600">Couldn't load lists: {(error as Error).message}</p>

  return (
    <div className="mx-auto max-w-lg space-y-3 p-4">
      <h1 className="text-xl font-semibold text-slate-900">Shopping lists</h1>

      {lists?.map((list) => (
        <div
          key={list.id}
          className={`flex items-center justify-between rounded-xl border bg-white p-4 ${
            currentList?.id === list.id ? 'border-slate-900' : 'border-slate-200'
          }`}
        >
          <button onClick={() => selectList(list)} className="min-w-0 flex-1 text-left">
            <span className="font-medium text-slate-900">{list.name}</span>
            {list.is_private && <span className="ml-2 text-xs text-amber-700">Private</span>}
            {currentList?.id === list.id && <span className="ml-2 text-xs text-slate-400">(active)</span>}
          </button>
          <div className="flex shrink-0 gap-3 text-sm">
            <button onClick={() => handleClear(list)} className="text-slate-500 hover:text-slate-800">
              Clear
            </button>
            <button onClick={() => handleRemove(list)} className="text-rose-500 hover:text-rose-700">
              Remove
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <ListForm
          onCancel={() => setShowForm(false)}
          onSubmit={(values) =>
            createList.mutate(
              { ...values, owner_member_id: values.is_private ? (currentMember?.id ?? null) : null },
              { onSuccess: () => setShowForm(false) }
            )
          }
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700"
        >
          + Add list
        </button>
      )}
    </div>
  )
}
