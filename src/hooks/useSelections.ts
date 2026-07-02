import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Selection } from '../types/database'

export interface SelectionWithMember extends Selection {
  members: { id: string; name: string } | null
}

/** Pending selections for one list (or several, for the combined shop view), joined with the requesting member. */
export function usePendingSelections(listIds: string[]) {
  return useQuery({
    queryKey: ['selections', 'pending', ...listIds].sort(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('selections')
        .select('*, members(id, name)')
        .eq('status', 'pending')
        .in('list_id', listIds)
      if (error) throw error
      return data as SelectionWithMember[]
    },
    enabled: listIds.length > 0,
  })
}

export function useToggleSelection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      listId,
      itemId,
      memberId,
      isTicked,
    }: {
      listId: string
      itemId: string
      memberId: string
      isTicked: boolean
    }) => {
      if (isTicked) {
        const { error } = await supabase
          .from('selections')
          .delete()
          .match({ list_id: listId, item_id: itemId, member_id: memberId, status: 'pending' })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('selections')
          .insert({ list_id: listId, item_id: itemId, member_id: memberId, status: 'pending' })
        if (error) throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['selections'] }),
  })
}

/** Marks all pending selections for an item as fulfilled, across every list that requested it — called when a purchase is logged. */
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

/** Re-flags an item as needed on a list, requested by whoever logged it as finished. A no-op if it's already pending there. */
export function useRequestItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ listId, itemId, memberId }: { listId: string; itemId: string; memberId: string }) => {
      const { error } = await supabase
        .from('selections')
        .insert({ list_id: listId, item_id: itemId, member_id: memberId, status: 'pending' })
      if (error && error.code !== UNIQUE_VIOLATION) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['selections'] }),
  })
}
