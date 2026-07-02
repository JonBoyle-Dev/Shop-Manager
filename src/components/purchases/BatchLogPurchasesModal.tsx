import { useEffect, useRef, useState } from 'react'
import { Modal } from '../common/Modal'
import { ReconciliationPrompt } from './ReconciliationPrompt'
import { useActivePurchases, useLogPurchase, useExtendPurchase } from '../../hooks/usePurchases'
import { useFulfillSelections } from '../../hooks/useSelections'
import { estimateExpiry, toDateInputValue } from '../../lib/shelfLife'
import type { Item } from '../../types/database'

interface BatchItem {
  item: Item
  quantity: number
}

export function BatchLogPurchasesModal({
  items,
  onClose,
  onDone,
}: {
  items: BatchItem[]
  onClose: () => void
  onDone: () => void
}) {
  const [phase, setPhase] = useState<'date' | 'processing' | 'done'>('date')
  const [sharedDate, setSharedDate] = useState(() => toDateInputValue(new Date()))
  const [index, setIndex] = useState(0)
  const [loggedCount, setLoggedCount] = useState(0)
  const autoLoggedIndexRef = useRef(-1)

  const current = phase === 'processing' ? items[index] : undefined
  const { data: activePurchases, isLoading: activeLoading } = useActivePurchases(current?.item.id)
  const logPurchase = useLogPurchase()
  const extendPurchase = useExtendPurchase()
  const fulfillSelections = useFulfillSelections()

  const estimatedExpiryDate = current ? estimateExpiry(new Date(sharedDate + 'T00:00:00'), current.item) : null
  const estimatedExpiry = estimatedExpiryDate ? toDateInputValue(estimatedExpiryDate) : null

  function advance() {
    setLoggedCount((c) => c + 1)
    setIndex((i) => {
      if (i + 1 >= items.length) {
        setPhase('done')
        return i
      }
      return i + 1
    })
  }

  function logCurrentAsNewBatch() {
    if (!current) return
    logPurchase.mutate(
      { item_id: current.item.id, purchase_date: sharedDate, estimated_expiry: estimatedExpiry, quantity: current.quantity },
      {
        onSuccess: () => {
          fulfillSelections.mutate(current.item.id)
          advance()
        },
      }
    )
  }

  // Items with no existing stock skip straight to logging — only guard against
  // StrictMode's double effect invocation re-triggering the same index.
  useEffect(() => {
    if (phase !== 'processing' || activeLoading || !current) return
    if (activePurchases && activePurchases.length === 0 && autoLoggedIndexRef.current !== index) {
      autoLoggedIndexRef.current = index
      logCurrentAsNewBatch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, activeLoading, activePurchases])

  if (phase === 'date') {
    return (
      <Modal title={`Log purchases (${items.length})`} onClose={onClose}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Purchase date</label>
            <input
              type="date"
              value={sharedDate}
              onChange={(e) => setSharedDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-slate-600">
            {items.map(({ item, quantity }) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span className="text-slate-400">×{quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button
              onClick={() => setPhase('processing')}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Log {items.length} purchase{items.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  if (phase === 'done') {
    const finish = () => {
      onDone()
      onClose()
    }
    return (
      <Modal title="Done" onClose={finish}>
        <p className="mb-4 text-sm text-slate-600">
          Logged {loggedCount} purchase{loggedCount === 1 ? '' : 's'}.
        </p>
        <div className="flex justify-end">
          <button onClick={finish} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Close
          </button>
        </div>
      </Modal>
    )
  }

  if (!current) return null

  if (!activeLoading && activePurchases && activePurchases.length > 0) {
    const [mostRecent] = activePurchases
    return (
      <ReconciliationPrompt
        itemName={current.item.name}
        existingPurchase={mostRecent}
        newEstimatedExpiry={estimatedExpiry}
        addedQuantity={current.quantity}
        onClose={onClose}
        onExtend={() =>
          extendPurchase.mutate(
            { id: mostRecent.id, estimated_expiry: estimatedExpiry, quantity: mostRecent.quantity + current.quantity },
            {
              onSuccess: () => {
                fulfillSelections.mutate(current.item.id)
                advance()
              },
            }
          )
        }
        onNewBatch={logCurrentAsNewBatch}
      />
    )
  }

  return (
    <Modal title={`Logging — ${current.item.name}`} onClose={onClose}>
      <p className="text-sm text-slate-500">
        Checking existing stock… ({index + 1}/{items.length})
      </p>
    </Modal>
  )
}
