import { Modal } from '../common/Modal'
import type { Purchase } from '../../types/database'

export function ReconciliationPrompt({
  existingPurchase,
  newEstimatedExpiry,
  onExtend,
  onNewBatch,
  onClose,
}: {
  existingPurchase: Purchase
  newEstimatedExpiry: string | null
  onExtend: () => void
  onNewBatch: () => void
  onClose: () => void
}) {
  return (
    <Modal title="Already in stock" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-600">
        You already have a batch from{' '}
        <strong>{new Date(existingPurchase.purchase_date).toLocaleDateString()}</strong>
        {existingPurchase.estimated_expiry && (
          <> (expiring {new Date(existingPurchase.estimated_expiry).toLocaleDateString()})</>
        )}
        . Is this restocking the same batch, or a separate new one?
      </p>
      <div className="space-y-2">
        <button
          onClick={onExtend}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-left text-sm hover:bg-slate-50"
        >
          <span className="font-medium text-slate-900">Extend existing batch</span>
          <br />
          <span className="text-slate-500">
            Update expiry to {newEstimatedExpiry ? new Date(newEstimatedExpiry).toLocaleDateString() : 'no set expiry'}
          </span>
        </button>
        <button
          onClick={onNewBatch}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-left text-sm hover:bg-slate-50"
        >
          <span className="font-medium text-slate-900">Log as a new batch</span>
          <br />
          <span className="text-slate-500">Keep both batches tracked separately</span>
        </button>
      </div>
    </Modal>
  )
}
