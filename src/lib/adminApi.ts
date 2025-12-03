import { supabase } from './supabase'
import { Post, Category, Comment } from '../types'
import { slugify, calculateReadingTime } from './utils'

// 管理员登录
export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

// 管理员登出
export async function adminLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 获取当前用户
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 文章管理
export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'slug'>) {
  const slug = slugify(post.title)
  const readTime = calculateReadingTime(post.content)
  
  const { data, error } = await supabase
    .from('posts')
    .insert([{ ...post, slug, read_time: readTime }])
    .select()
    .single()

  if (error) throw error
  return data as Post
}

export async function updatePost(id: string, post: Partial<Post>) {
  const updateData: any = { ...post, updated_at: new Date().toISOString() }
  
  // 如果更新了标题，重新生成slug
  if (post.title) {
    updateData.slug = slugify(post.title)
  }
  
  // 如果更新了内容，重新计算阅读时间
  if (post.content) {
    updateData.read_time = calculateReadingTime(post.content)
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Post
}

export async function deletePost(id: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getAllPosts(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories (id, name, slug)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data as Post[]
}

// 分类管理
export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'post_count'>) {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export async function updateCategory(id: string, category: Partial<Category>) {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// 评论管理
export async function getAllComments(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      posts (id, title, slug)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data as (Comment & { posts: { id: string; title: string; slug: string } })[]
}

export async function updateComment(id: string, approved: boolean) {
  const { data, error } = await supabase
    .from('comments')
    .update({ approved })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Comment
}

export async function deleteComment(id: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// 统计信息
export async function getDashboardStats() {
  const [
    { count: postsCount },
    { count: publishedPostsCount },
    { count: categoriesCount },
    { count: commentsCount },
    { count: approvedCommentsCount }
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('approved', true)
  ])

  return {
    totalPosts: postsCount || 0,
    publishedPosts: publishedPostsCount || 0,
    totalCategories: categoriesCount || 0,
    totalComments: commentsCount || 0,
    approvedComments: approvedCommentsCount || 0
  }
}