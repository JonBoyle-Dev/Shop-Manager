import { useState } from 'react'
import { useMembers, useUpdateMember, useDeleteMember } from '../../hooks/useMembers'
import { useMemberContext } from '../../context/MemberContext'
import { TagBadge } from '../common/TagBadge'
import { MemberForm } from './MemberForm'

export function MembersAdmin() {
  const { data: members, isLoading, error } = useMembers()
  const updateMember = useUpdateMember()
  const deleteMember = useDeleteMember()
  const { currentMember, setCurrentMember } = useMemberContext()
  const [editingId, setEditingId] = useState<string | null>(null)

  if (isLoading) return <p className="p-6 text-center text-slate-500">Loading members…</p>
  if (error) return <p className="p-6 text-center text-rose-600">Couldn't load members: {(error as Error).message}</p>

  return (
    <div className="mx-auto max-w-lg space-y-3 p-4">
      <h1 className="text-xl font-semibold text-slate-900">Family members</h1>
      {members?.map((member) => (
        <div key={member.id} className="rounded-xl border border-slate-200 bg-white p-4">
          {editingId === member.id ? (
            <MemberForm
              initial={member}
              submitLabel="Save changes"
              onCancel={() => setEditingId(null)}
              onSubmit={(values) => updateMember.mutate({ id: member.id, ...values }, { onSuccess: () => setEditingId(null) })}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">
                  {member.name}
                  {currentMember?.id === member.id && <span className="ml-2 text-xs font-normal text-slate-400">(you)</span>}
                </span>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => setEditingId(member.id)} className="text-slate-500 hover:text-slate-800">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (currentMember?.id === member.id) setCurrentMember(null)
                      deleteMember.mutate(member.id)
                    }}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {member.diet_preferences.map((tag) => (
                  <TagBadge key={tag} label={tag} variant="diet" />
                ))}
                {member.allergies.map((tag) => (
                  <TagBadge key={tag} label={tag} variant="allergy" />
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
