export interface Post {
  id: string
  title: string
  content: string
  slug: string
  excerpt: string
  created_at: string
  updated_at: string
  published: boolean
  read_time: number
  category_id: string | null
  categories?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  post_count: number
  created_at: string
}

export interface Comment {
  id: string
  author_name: string
  author_email: string
  content: string
  created_at: string
  approved: boolean
  post_id: string
  status: 'pending' | 'approved' | 'rejected'
  reply?: string
  posts?: {
    title: string
    slug: string
  }
}