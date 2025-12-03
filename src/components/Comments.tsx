import { useState, useEffect } from 'react'
import { MessageCircle, User, Mail, Send } from 'lucide-react'
import { Comment } from '../types'
import { getCommentsByPostId, createComment } from '../lib/api'
import { formatDate } from '../lib/utils'

interface CommentsProps {
  postId: string
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const data = await getCommentsByPostId(postId)
      setComments(data)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.author_name.trim() || !formData.author_email.trim() || !formData.content.trim()) {
      setMessage('请填写所有必填字段')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.author_email)) {
      setMessage('请输入有效的邮箱地址')
      return
    }

    try {
      setSubmitting(true)
      setMessage('')
      
      const newComment = await createComment({
        ...formData,
        post_id: postId,
        approved: false,
        status: 'pending' as const
      })
      
      setComments([newComment, ...comments])
      setFormData({ author_name: '', author_email: '', content: '' })
      setMessage('评论已提交，等待审核')
    } catch (error) {
      console.error('Failed to submit comment:', error)
      setMessage('提交评论失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12">
      <div className="flex items-center space-x-2 mb-8">
        <MessageCircle className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-bold text-gray-900">评论</h3>
        <span className="text-sm text-gray-500">({comments.length})</span>
      </div>

      {/* 评论表单 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">发表评论</h4>
        
        {message && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            message.includes('失败') || message.includes('请') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
                姓名 *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="author_email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱 *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  id="author_email"
                  value={formData.author_email}
                  onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的邮箱"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              评论内容 *
            </label>
            <textarea
              id="content"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入您的评论..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? '提交中...' : '提交评论'}
          </button>
        </form>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">加载评论中...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无评论，快来发表第一条评论吧！</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="text-sm font-medium text-gray-900">
                      {comment.author_name}
                    </h5>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  
                  <div className="text-gray-700">
                    <p>{comment.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}