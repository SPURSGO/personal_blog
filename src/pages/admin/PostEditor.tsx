import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Save, Eye, ArrowLeft, Calendar, Clock } from 'lucide-react'
import { createPost, updatePost } from '../../lib/adminApi'
import { getCategories } from '../../lib/api'
import { Category } from '../../types'
import MarkdownRenderer from '../../components/MarkdownRenderer'

export default function PostEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    published: false
  })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const categoriesData = await getCategories()
      setCategories(categoriesData)

      // 如果是编辑模式，加载文章数据
      if (id) {
        // 这里需要实现获取单篇文章的API
        // 暂时使用模拟数据
        setFormData({
          title: '示例文章标题',
          content: '# 示例文章内容\n\n这是示例文章内容。',
          excerpt: '这是文章的摘要',
          category_id: categoriesData[0]?.id || '',
          published: false
        })
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('请填写标题和内容')
      return
    }

    try {
      setSaving(true)
      
      const postData = {
        ...formData,
        read_time: Math.ceil(formData.content.split(/\s+/).length / 200) // 估算阅读时间
      }
      
      if (id) {
        // 更新文章
        await updatePost(id, postData)
      } else {
        // 创建新文章
        await createPost(postData)
      }
      
      navigate('/admin/posts')
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('保存文章失败')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    setPreviewMode(!previewMode)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/admin/posts"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回文章列表
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? '编辑文章' : '发布新文章'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? '编辑' : '预览'}
          </button>
          
          <button
            type="submit"
            form="post-form"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 编辑区域 */}
        <div className="lg:col-span-2">
          {previewMode ? (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {formData.title || '无标题'}
              </h1>
              {formData.excerpt && (
                <p className="text-gray-600 mb-6 italic">{formData.excerpt}</p>
              )}
              <MarkdownRenderer content={formData.content || '*暂无内容*'} />
            </div>
          ) : (
            <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
              {/* 标题 */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  文章标题 *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入文章标题"
                  required
                />
              </div>

              {/* 摘要 */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  文章摘要
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入文章摘要（可选）"
                />
              </div>

              {/* 内容 */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  文章内容 *
                </label>
                <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <textarea
                    id="content"
                    rows={20}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 border-0 rounded-md focus:outline-none resize-none"
                    placeholder="请输入文章内容，支持 Markdown 格式..."
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  支持 Markdown 格式，可以使用 # 标题、**粗体**、*斜体*、代码块等语法
                </p>
              </div>
            </form>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 发布设置 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">发布设置</h3>
            
            {/* 分类 */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                id="category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">选择分类</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 发布状态 */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">立即发布</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                如果不勾选，文章将保存为草稿
              </p>
            </div>

            {/* 统计信息 */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>字数统计</span>
                <span>{formData.content.length} 字符</span>
              </div>
              <div className="flex items-center justify-between">
                <span>预估阅读时间</span>
                <span>{Math.ceil(formData.content.length / 500)} 分钟</span>
              </div>
            </div>
          </div>

          {/* 帮助信息 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Markdown 帮助</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div><code className="bg-gray-200 px-1 rounded"># 标题</code> - 一级标题</div>
              <div><code className="bg-gray-200 px-1 rounded">## 标题</code> - 二级标题</div>
              <div><code className="bg-gray-200 px-1 rounded">**粗体**</code> - 粗体文本</div>
              <div><code className="bg-gray-200 px-1 rounded">*斜体*</code> - 斜体文本</div>
              <div><code className="bg-gray-200 px-1 rounded">`代码`</code> - 行内代码</div>
              <div><code className="bg-gray-200 px-1 rounded">```代码块```</code> - 代码块</div>
              <div><code className="bg-gray-200 px-1 rounded">[链接](url)</code> - 超链接</div>
              <div><code className="bg-gray-200 px-1 rounded">- 列表项</code> - 无序列表</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}