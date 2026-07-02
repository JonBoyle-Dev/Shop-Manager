import { Modal } from '../common/Modal'
import { useLogUsage } from '../../hooks/usePurchases'
import { useRequestItem } from '../../hooks/useSelections'
import { useMemberContext } from '../../context/MemberContext'
import type { Purchase } from '../../types/database'

export function LogUsageModal({ purchase, onClose }: { purchase: Purchase; onClose: () => void }) {
  const logUsage = useLogUsage()
  const requestItem = useRequestItem()
  const { currentMember } = useMemberContext()

  function markFinished() {
    logUsage.mutate(
      { id: purchase.id, usage_status: 'finished' },
      {
        onSuccess: () => {
          if (currentMember) requestItem.mutate({ itemId: purchase.item_id, memberId: currentMember.id })
          onClose()
        },
      }
    )
  }

  function markPartiallyUsed() {
    logUsage.mutate({ id: purchase.id, usage_status: 'partially_used' }, { onSuccess: onClose })
  }

  return (
    <Modal title="Mark as used" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-600">
        Batch from {new Date(purchase.purchase_date).toLocaleDateString()} — how much is left?
      </p>
      <div className="space-y-2">
        <button
          onClick={markPartiallyUsed}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-left text-sm hover:bg-slate-50"
        >
          <span className="font-medium text-slate-900">Partially used</span>
          <br />
          <span className="text-slate-500">Still have some left</span>
        </button>
        <button
          onClick={markFinished}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-left text-sm hover:bg-slate-50"
        >
          <span className="font-medium text-slate-900">All used up</span>
          <br />
          <span className="text-slate-500">Flags this as needed again{currentMember ? ` for ${currentMember.name}` : ''}</span>
        </button>
      </div>
    </Modal>
  )
}
