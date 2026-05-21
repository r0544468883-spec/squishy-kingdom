import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'

function getSupabase() {
  return createClient()
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getProducts] Supabase error:', error.message, error.code)
    return []
  }
  return (data || []) as unknown as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('[getProductBySlug] Supabase error:', error.message)
    return null
  }
  return data as unknown as Product
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getProductsByCategory] Supabase error:', error.message)
    return []
  }
  return (data || []) as unknown as Product[]
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(8)

  if (error) {
    console.error('[getFeaturedProducts] Supabase error:', error.message)
    return []
  }
  return (data || []) as unknown as Product[]
}

export async function getNewProducts(): Promise<Product[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) {
    console.error('[getNewProducts] Supabase error:', error.message)
    return []
  }
  return (data || []) as unknown as Product[]
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('sort_order', { ascending: true })
    .limit(20)

  if (error) {
    console.error('[searchProducts] Supabase error:', error.message)
    return []
  }
  return (data || []) as unknown as Product[]
}
