import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react'
import MarkdownRenderer from '../components/MarkdownRenderer'
import Comments from '../components/Comments'
import { getPostBySlug } from '../lib/api'
import { Post } from '../types'
import { formatDate } from '../lib/utils'

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getPostBySlug(slug!)
      setPost(data)
    } catch (err) {
      console.error('Failed to load post:', err)
      setError('文章不存在或加载失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载文章中...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">
            <h1 className="text-2xl font-bold mb-4">{error || '文章不存在'}</h1>
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 返回链接 */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-sm border">
        {/* 文章头部 */}
        <header className="p-8 border-b">
          {/* 分类标签 */}
          {post.categories && (
            <div className="mb-4">
              <Link
                to={`/category/${post.categories.slug}`}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                <Tag className="h-3 w-3" />
                <span>{post.categories.name}</span>
              </Link>
            </div>
          )}

          {/* 标题 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.created_at}>
                {formatDate(post.created_at)}
              </time>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.read_time} 分钟阅读</span>
            </div>
          </div>
        </header>

        {/* 文章内容 */}
        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>

        {/* 文章底部 */}
        <footer className="p-8 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p>最后更新于 {formatDate(post.updated_at)}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">分享:</span>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('链接已复制到剪贴板')
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                复制链接
              </button>
            </div>
          </div>
        </footer>
      </article>

      {/* 评论区 */}
      <Comments postId={post.id} />
    </div>
  )
}