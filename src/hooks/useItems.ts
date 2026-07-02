import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Category, Item } from '../types/database'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order')
      if (error) throw error
      return data as Category[]
    },
  })
}

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('items').select('*').order('name')
      if (error) throw error
      return data as Item[]
    },
  })
}

export function useItem(itemId: string | undefined) {
  return useQuery({
    queryKey: ['items', itemId],
    queryFn: async () => {
      const { data, error } = await supabase.from('items').select('*').eq('id', itemId!).single()
      if (error) throw error
      return data as Item
    },
    enabled: !!itemId,
  })
}

export type NewItem = Pick<
  Item,
  'name' | 'category_id' | 'diet_tags' | 'allergy_tags' | 'need_or_want' | 'default_shelf_life_days' | 'default_replenish_days' | 'fringe'
>

export function useCreateItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (item: NewItem) => {
      const { data, error } = await supabase.from('items').insert(item).select().single()
      if (error) throw error
      return data as Item
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })
}
