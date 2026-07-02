import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Purchase } from '../types/database'

/** All non-finished purchases for an item — used to detect existing stock for reconciliation. */
export function useActivePurchases(itemId: string | undefined) {
  return useQuery({
    queryKey: ['purchases', 'active', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('item_id', itemId!)
        .in('usage_status', ['active', 'partially_used'])
        .order('purchase_date', { ascending: false })
      if (error) throw error
      return data as Purchase[]
    },
    enabled: !!itemId,
  })
}

/** Full purchase history for an item, most recent first — used on the item detail page. */
export function usePurchaseHistory(itemId: string | undefined) {
  return useQuery({
    queryKey: ['purchases', 'history', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('item_id', itemId!)
        .order('purchase_date', { ascending: false })
      if (error) throw error
      return data as Purchase[]
    },
    enabled: !!itemId,
  })
}

function invalidatePurchaseQueries(queryClient: ReturnType<typeof useQueryClient>, itemId: string) {
  queryClient.invalidateQueries({ queryKey: ['purchases', 'active', itemId] })
  queryClient.invalidateQueries({ queryKey: ['purchases', 'history', itemId] })
  queryClient.invalidateQueries({ queryKey: ['items', itemId] })
  queryClient.invalidateQueries({ queryKey: ['items'] })
}

export function useLogPurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (purchase: Pick<Purchase, 'item_id' | 'purchase_date' | 'estimated_expiry'>) => {
      const { data, error } = await supabase.from('purchases').insert(purchase).select().single()
      if (error) throw error
      return data as Purchase
    },
    onSuccess: (data) => invalidatePurchaseQueries(queryClient, data.item_id),
  })
}

/** Reconciliation "extend": update the existing batch's expiry instead of logging a new one. */
export function useExtendPurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, estimated_expiry }: { id: string; estimated_expiry: string | null }) => {
      const { data, error } = await supabase
        .from('purchases')
        .update({ estimated_expiry, previous_stock_extended: true })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Purchase
    },
    onSuccess: (data) => invalidatePurchaseQueries(queryClient, data.item_id),
  })
}

export function useLogUsage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      usage_status,
    }: {
      id: string
      usage_status: 'partially_used' | 'finished'
    }) => {
      const { data, error } = await supabase
        .from('purchases')
        .update({
          usage_status,
          used_date: usage_status === 'finished' ? new Date().toISOString().slice(0, 10) : null,
        })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Purchase
    },
    onSuccess: (data) => invalidatePurchaseQueries(queryClient, data.item_id),
  })
}
