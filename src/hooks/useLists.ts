import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { List } from '../types/database'

/** Shared lists plus any private lists owned by the current member — private lists owned by someone else are never fetched. */
export function useVisibleLists(currentMemberId: string | undefined) {
  return useQuery({
    queryKey: ['lists', currentMemberId],
    queryFn: async () => {
      const query = supabase.from('lists').select('*').order('created_at')
      const { data, error } = currentMemberId
        ? await query.or(`is_private.eq.false,owner_member_id.eq.${currentMemberId}`)
        : await query.eq('is_private', false)
      if (error) throw error
      return data as List[]
    },
  })
}

export function useCreateList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (list: Pick<List, 'name' | 'is_private' | 'owner_member_id'>) => {
      const { data, error } = await supabase.from('lists').insert(list).select().single()
      if (error) throw error
      return data as List
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lists'] }),
  })
}

export function useDeleteList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lists').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lists'] }),
  })
}

/** Permanently deletes every pending tick on a list — leaves fulfilled history alone. */
export function useClearList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (listId: string) => {
      const { error } = await supabase.from('selections').delete().match({ list_id: listId, status: 'pending' })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['selections'] }),
  })
}
