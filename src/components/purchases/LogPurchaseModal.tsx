import { useState } from 'react'
import { Modal } from '../common/Modal'
import { ReconciliationPrompt } from './ReconciliationPrompt'
import { useActivePurchases, useLogPurchase, useExtendPurchase } from '../../hooks/usePurchases'
import { useFulfillSelections } from '../../hooks/useSelections'
import { estimateExpiry, toDateInputValue } from '../../lib/shelfLife'
import type { Item } from '../../types/database'

export function LogPurchaseModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const [purchaseDate, setPurchaseDate] = useState(() => toDateInputValue(new Date()))
  const { data: activePurchases, isLoading } = useActivePurchases(item.id)
  const logPurchase = useLogPurchase()
  const extendPurchase = useExtendPurchase()
  const fulfillSelections = useFulfillSelections()

  const estimatedExpiryDate = estimateExpiry(new Date(purchaseDate + 'T00:00:00'), item)
  const estimatedExpiry = estimatedExpiryDate ? toDateInputValue(estimatedExpiryDate) : null

  function afterLogged() {
    fulfillSelections.mutate(item.id)
    onClose()
  }

  function logAsNewBatch() {
    logPurchase.mutate(
      { item_id: item.id, purchase_date: purchaseDate, estimated_expiry: estimatedExpiry },
      { onSuccess: afterLogged }
    )
  }

  if (!isLoading && activePurchases && activePurchases.length > 0) {
    const [mostRecent] = activePurchases
    return (
      <ReconciliationPrompt
        existingPurchase={mostRecent}
        newEstimatedExpiry={estimatedExpiry}
        onClose={onClose}
        onExtend={() =>
          extendPurchase.mutate({ id: mostRecent.id, estimated_expiry: estimatedExpiry }, { onSuccess: afterLogged })
        }
        onNewBatch={logAsNewBatch}
      />
    )
  }

  return (
    <Modal title={`Log purchase — ${item.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Purchase date</label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <p className="text-sm text-slate-500">
          {estimatedExpiry
            ? `Estimated to expire ${new Date(estimatedExpiry).toLocaleDateString()}`
            : "No shelf life tracked for this item — won't get an expiry reminder."}
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={logAsNewBatch}
            disabled={logPurchase.isPending || isLoading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Log purchase
          </button>
        </div>
      </div>
    </Modal>
  )
}
