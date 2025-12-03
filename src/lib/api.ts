import { supabase } from './supabase'
import { Post, Category, Comment } from '../types'

export async function getPosts(limit = 10, offset = 0, categorySlug?: string) {
  let query = supabase
    .from('posts')
    .select(`
      *,
      categories (id, name, slug)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  const { data, error } = await query.range(offset, offset + limit - 1)
  
  if (error) throw error
  return data as Post[]
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories (id, name, slug)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) throw error
  return data as Post
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Category[]
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Category
}

export async function getCommentsByPostId(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .eq('approved', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Comment[]
}

export async function createComment(comment: Omit<Comment, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single()

  if (error) throw error
  return data as Comment
}

export async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories (id, name, slug)
    `)
    .eq('published', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Post[]
}