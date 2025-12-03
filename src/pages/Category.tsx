import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { getCategoryBySlug } from '../lib/api'
import { getPosts } from '../lib/api'
import { Category as CategoryType, Post } from '../types'

export default function Category() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<CategoryType | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      loadCategory()
    }
  }, [slug])

  const loadCategory = async () => {
    try {
      setLoading(true)
      setError('')
      
      // 获取分类信息
      const categoryData = await getCategoryBySlug(slug!)
      setCategory(categoryData)
      
      // 获取该分类下的文章
      const postsData = await getPosts(100, 0, slug!)
      setPosts(postsData)
    } catch (err) {
      console.error('Failed to load category:', err)
      setError('分类不存在或加载失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载分类中...</p>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">
            <h1 className="text-2xl font-bold mb-4">{error || '分类不存在'}</h1>
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            首页
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category.name}
        </h1>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{category.description}</span>
          <span>•</span>
          <span>{posts.length} 篇文章</span>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* 文章列表 */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg">该分类下暂无文章</p>
            <p className="text-sm mt-2">敬请期待更多内容</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}