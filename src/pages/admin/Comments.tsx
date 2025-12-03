import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Comment, Post } from '../../types'
import { Check, X, Eye, MessageSquare, Trash2 } from 'lucide-react'

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  useEffect(() => {
    fetchComments()
    fetchPosts()
  }, [])

  const fetchComments = async () => {
    try {
      let query = supabase
        .from('comments')
        .select(`
          *,
          posts!inner(title, slug)
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('获取评论失败:', error)
      alert('获取评论失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, content, excerpt, created_at, updated_at, published, read_time, category_id')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('获取文章失败:', error)
    }
  }

  const updateCommentStatus = async (commentId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', commentId)

      if (error) throw error
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, status }
          : comment
      ))
    } catch (error) {
      console.error('更新评论状态失败:', error)
      alert('更新评论状态失败')
    }
  }

  const deleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
      
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      alert('评论已删除')
    } catch (error) {
      console.error('删除评论失败:', error)
      alert('删除评论失败')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已批准'
      case 'rejected': return '已拒绝'
      default: return '待审核'
    }
  }

  const filteredComments = filter === 'all' ? comments : comments.filter(c => c.status === filter)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">评论管理</h1>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            共 {comments.length} 条评论
          </span>
        </div>
      </div>

      {/* 筛选标签 */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'pending', label: '待审核' },
              { key: 'approved', label: '已批准' },
              { key: 'rejected', label: '已拒绝' },
              { key: 'all', label: '全部' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === 'pending' ? '暂无待审核的评论' : 
             filter === 'approved' ? '暂无已批准的评论' :
             filter === 'rejected' ? '暂无已拒绝的评论' : '暂无评论'}
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{comment.author_name}</div>
                      <div className="text-sm text-gray-500">{comment.author_email}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                    {getStatusText(comment.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleString('zh-CN')}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  评论文章: <a href={`/post/${(comment.posts as any).slug}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {(comment.posts as any).title}
                  </a>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{comment.content}</p>
                </div>
              </div>

              {comment.reply && (
                <div className="mb-4 pl-4 border-l-2 border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">管理员回复:</div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-gray-800">{comment.reply}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {comment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateCommentStatus(comment.id, 'approved')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                      批准
                    </button>
                    <button
                      onClick={() => updateCommentStatus(comment.id, 'rejected')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                      拒绝
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedComment(comment)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  查看详情
                </button>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 评论详情弹窗 */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">评论详情</h2>
              <button
                onClick={() => setSelectedComment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">评论者</label>
                  <div className="text-gray-900">{selectedComment.author_name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <div className="text-gray-900">{selectedComment.author_email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedComment.status)}`}>
                    {getStatusText(selectedComment.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">评论时间</label>
                  <div className="text-gray-900">{new Date(selectedComment.created_at).toLocaleString('zh-CN')}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">评论文章</label>
                <a href={`/post/${(selectedComment.posts as any).slug}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {(selectedComment.posts as any).title}
                </a>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">评论内容</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{selectedComment.content}</p>
                </div>
              </div>
              
              {selectedComment.reply && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">管理员回复</label>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-800">{selectedComment.reply}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}