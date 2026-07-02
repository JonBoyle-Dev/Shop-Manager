import { useState } from 'react'
import { useMembers, useCreateMember } from '../../hooks/useMembers'
import { useMemberContext } from '../../context/MemberContext'
import { useNavigate } from 'react-router-dom'
import { MemberForm } from './MemberForm'

export function MemberPicker() {
  const { data: members, isLoading, error } = useMembers()
  const { setCurrentMember } = useMemberContext()
  const createMember = useCreateMember()
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  function selectMember(member: NonNullable<typeof members>[number]) {
    setCurrentMember(member)
    navigate('/tick-list')
  }

  if (isLoading) return <p className="p-6 text-center text-slate-500">Loading members…</p>
  if (error) return <p className="p-6 text-center text-rose-600">Couldn't load members: {(error as Error).message}</p>

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-1 text-center text-2xl font-semibold text-slate-900">Who's shopping?</h1>
      <p className="mb-6 text-center text-sm text-slate-500">Pick your name to get started</p>

      {members && members.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => selectMember(member)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:shadow"
            >
              {member.name}
            </button>
          ))}
        </div>
      )}

      {members && members.length === 0 && !showForm && (
        <p className="mb-4 text-center text-sm text-slate-500">No family members yet — add the first one below.</p>
      )}

      {showForm ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <MemberForm
            submitLabel="Add member"
            onCancel={() => setShowForm(false)}
            onSubmit={(values) => {
              createMember.mutate(values, { onSuccess: () => setShowForm(false) })
            }}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700"
        >
          + Add family member
        </button>
      )}
    </div>
  )
}
