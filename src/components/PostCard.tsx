import { Link } from 'react-router-dom'
import { Calendar, Clock, User } from 'lucide-react'
import { Post } from '../types'
import { formatDate, formatDateDistance } from '../lib/utils'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* 分类标签 */}
        {post.categories && (
          <div className="mb-3">
            <Link
              to={`/category/${post.categories.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
            >
              {post.categories.name}
            </Link>
          </div>
        )}

        {/* 标题 */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
          <Link to={`/post/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* 摘要 */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* 元信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
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

          <Link
            to={`/post/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            阅读更多 →
          </Link>
        </div>
      </div>
    </article>
  )
}