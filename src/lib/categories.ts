import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types'

function getSupabase() {
  return createClient()
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getCategories] Supabase error:', error.message, error.code)
    return []
  }
  return (data || []) as Category[]
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('[getCategoryBySlug] Supabase error:', error.message)
    return null
  }
  return data as Category
}
