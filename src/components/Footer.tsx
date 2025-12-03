import { Github, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 博客信息 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">我的博客</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              欢迎来到我的个人博客！这里记录着我的技术心得、生活感悟和学习笔记。
              希望我的文字能够给你带来一些启发和帮助。
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Heart className="h-4 w-4 text-red-500" />
              <span>用心写作，用爱分享</span>
            </div>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              联系方式
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@example.com"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>contact@example.com</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} 我的博客. 保留所有权利.
            </p>
            <p className="text-sm text-gray-500 mt-2 sm:mt-0">
              由 <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel</a> 强力驱动
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}