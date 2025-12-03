import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { getPosts, searchPosts } from '../lib/api'
import { Post } from '../types'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')

  const postsPerPage = 10

  useEffect(() => {
    loadPosts(1, true)
  }, [searchQuery])

  const loadPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true)
      setError('')
      
      const offset = (pageNum - 1) * postsPerPage
      let data: Post[]
      
      if (searchQuery) {
        data = await searchPosts(searchQuery)
        setHasMore(false) // 搜索结果不分页
      } else {
        data = await getPosts(postsPerPage, offset)
        setHasMore(data.length === postsPerPage)
      }
      
      if (reset) {
        setPosts(data)
        setPage(1)
      } else {
        setPosts(prev => [...prev, ...data])
      }
    } catch (err) {
      console.error('Failed to load posts:', err)
      setError('加载文章失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadPosts(nextPage)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        {searchQuery ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              搜索结果: "{searchQuery}"
            </h1>
            <p className="text-gray-600">
              找到 {posts.length} 篇相关文章
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              最新文章
            </h1>
            <p className="text-gray-600">
              分享技术心得、生活感悟和学习笔记
            </p>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* 文章列表 */}
      {loading && posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载文章中...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchQuery ? (
              <div>
                <p className="text-lg mb-2">没有找到与 "{searchQuery}" 相关的文章</p>
                <p className="text-sm">试试其他关键词吧</p>
              </div>
            ) : (
              <p className="text-lg">暂无文章</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 加载更多 */}
      {hasMore && !searchQuery && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                加载中...
              </>
            ) : (
              '加载更多'
            )}
          </button>
        </div>
      )}
    </div>
  )
}