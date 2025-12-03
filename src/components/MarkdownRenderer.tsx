import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义代码块渲染
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <div className="my-4">
                <SyntaxHighlighter
                  style={tomorrow as any}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // 自定义标题样式
          h1({ children }) {
            return <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4">{children}</h3>
          },
          // 自定义段落样式
          p({ children }) {
            return <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
          },
          // 自定义列表样式
          ul({ children }) {
            return <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
          },
          li({ children }) {
            return <li className="text-gray-700">{children}</li>
          },
          // 自定义链接样式
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
          // 自定义引用样式
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600">
                {children}
              </blockquote>
            )
          },
          // 自定义表格样式
          table({ children }) {
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-gray-200">{children}</table>
              </div>
            )
          },
          th({ children }) {
            return (
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {children}
              </td>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}