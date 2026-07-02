import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Selection } from '../types/database'

export interface SelectionWithMember extends Selection {
  members: { id: string; name: string } | null
}

/** All pending selections, joined with the requesting member, for requester tagging on the tick list. */
export function usePendingSelections() {
  return useQuery({
    queryKey: ['selections', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('selections')
        .select('*, members(id, name)')
        .eq('status', 'pending')
      if (error) throw error
      return data as SelectionWithMember[]
    },
  })
}

export function useToggleSelection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      itemId,
      memberId,
      isTicked,
    }: {
      itemId: string
      memberId: string
      isTicked: boolean
    }) => {
      if (isTicked) {
        const { error } = await supabase
          .from('selections')
          .delete()
          .match({ item_id: itemId, member_id: memberId, status: 'pending' })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('selections')
          .insert({ item_id: itemId, member_id: memberId, status: 'pending' })
        if (error) throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['selections'] }),
  })
}

/** Marks all pending selections for an item as fulfilled — called when a purchase is logged. */
export function useFulfillSelections() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('selections')
        .update({ status: 'fulfilled' })
        .match({ item_id: itemId, status: 'pending' })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['selections'] }),
  })
}

const UNIQUE_VIOLATION = '23505'

/** Re-flags an item as needed, requested by whoever logged it as finished. A no-op if it's already pending. */
export function useRequestItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ itemId, memberId }: { itemId: string; memberId: string }) => {
      const { error } = await supabase
        .from('selections')
        .insert({ item_id: itemId, member_id: memberId, status: 'pending' })
      if (error && error.code !== UNIQUE_VIOLATION) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['selections'] }),
  })
}
