import { Github, Mail, MapPin, Calendar, Heart, Code, Book, Coffee } from 'lucide-react'

export default function About() {
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js',
    'Python', 'Java', 'HTML/CSS', 'Tailwind CSS', 'MongoDB',
    'PostgreSQL', 'Git', 'Docker', 'AWS', 'Vercel'
  ]

  const interests = [
    { icon: Code, label: '编程开发', color: 'text-blue-600' },
    { icon: Book, label: '技术阅读', color: 'text-green-600' },
    { icon: Coffee, label: '咖啡文化', color: 'text-amber-600' },
    { icon: Heart, label: '开源贡献', color: 'text-red-600' }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">关于我</h1>
        <p className="text-xl text-gray-600">
          欢迎来到我的个人博客，让我来介绍一下自己
        </p>
      </div>

      {/* 个人信息卡片 */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* 头像 */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">博</span>
            </div>
          </div>

          {/* 个人信息 */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">博主</h2>
            <p className="text-gray-600 mb-6">
              一名热爱技术的前端开发工程师，专注于React生态和现代Web开发技术。
              喜欢分享技术心得，记录学习历程，希望通过这个博客与大家交流学习。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>中国 · 北京</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>2024年开始写作</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>contact@example.com</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Github className="h-4 w-4" />
                <span>GitHub: @myblog</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 技能展示 */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">技术栈</h3>
        <p className="text-gray-600 mb-6">
          我熟悉和使用的技术栈，涵盖了前端开发、后端开发、数据库和部署运维等方面。
        </p>
        
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 兴趣爱好 */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">兴趣爱好</h3>
        <p className="text-gray-600 mb-6">
          除了编程之外，我还有一些其他的兴趣爱好，让生活更加丰富多彩。
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {interests.map((interest) => {
            const Icon = interest.icon
            return (
              <div key={interest.label} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${interest.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-gray-700 font-medium">{interest.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 联系方式 */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">联系我</h3>
        <p className="text-gray-600 mb-6">
          如果你对我的文章有任何想法，或者想要与我交流技术话题，欢迎通过以下方式联系我。
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href="mailto:contact@example.com"
            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">邮箱</h4>
              <p className="text-sm text-gray-600">contact@example.com</p>
            </div>
          </a>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">GitHub</h4>
              <p className="text-sm text-gray-600">@myblog</p>
            </div>
          </a>
        </div>
      </div>

      {/* 页脚说明 */}
      <div className="text-center mt-12 text-gray-500">
        <p className="text-sm">
          感谢你的访问，希望我的文章能够对你有所帮助。
          如果你喜欢这个博客，欢迎分享给更多的朋友。
        </p>
      </div>
    </div>
  )
}