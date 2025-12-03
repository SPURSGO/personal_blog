import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, FolderOpen, MessageSquare, Eye, TrendingUp, Users } from 'lucide-react'
import { getDashboardStats } from '../../lib/adminApi'

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  totalCategories: number
  totalComments: number
  approvedComments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: '总文章数',
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/posts'
    },
    {
      title: '已发布',
      value: stats?.publishedPosts || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/admin/posts'
    },
    {
      title: '分类数',
      value: stats?.totalCategories || 0,
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/categories'
    },
    {
      title: '总评论',
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/admin/comments'
    },
    {
      title: '已审核',
      value: stats?.approvedComments || 0,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      link: '/admin/comments'
    }
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">管理后台</h1>
        <p className="text-gray-600">博客数据概览和管理</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">快速操作</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/posts/new"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">发布新文章</h3>
              <p className="text-sm text-gray-600">创建新的博客文章</p>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">管理分类</h3>
              <p className="text-sm text-gray-600">添加或编辑分类</p>
            </div>
          </Link>

          <Link
            to="/admin/comments"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">审核评论</h3>
              <p className="text-sm text-gray-600">管理用户评论</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 最新动态 */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">最新动态</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>博客运行正常，所有功能可用</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>当前有 {stats?.publishedPosts || 0} 篇已发布文章</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <MessageSquare className="h-4 w-4 text-orange-600" />
            <span>共有 {stats?.totalComments || 0} 条评论，{stats?.approvedComments || 0} 条已审核</span>
          </div>
        </div>
      </div>
    </div>
  )
}