-- 创建分类表
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500),
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT true,
  read_time INTEGER DEFAULT 5,
  category_id UUID REFERENCES categories(id)
);

-- 创建评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved BOOLEAN DEFAULT false,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_approved ON comments(approved);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_categories_slug ON categories(slug);

-- 初始化分类数据
INSERT INTO categories (name, slug, description) VALUES
('技术分享', 'tech', '技术相关文章'),
('生活随笔', 'life', '日常生活感悟'),
('学习笔记', 'notes', '学习过程中的笔记');

-- 初始化示例文章
INSERT INTO posts (title, slug, excerpt, content, category_id, read_time, created_at, updated_at) VALUES
('欢迎来到我的个人博客', 'welcome-to-my-blog', '这是我的第一篇博客文章，欢迎大家来到我的个人博客网站。', '# 欢迎来到我的个人博客

这是我的第一篇博客文章，欢迎大家来到我的个人博客网站。

在这里，我会分享一些技术心得、生活感悟和学习笔记。希望能够通过文字记录自己的成长历程，也希望能与更多志同道合的朋友交流。

## 关于这个博客

这个博客是基于React + Supabase + Vercel技术栈开发的现代化个人博客系统。具有以下特点：

- 🚀 快速响应的页面加载
- 📱 适配移动端的响应式设计
- 📝 支持Markdown格式的文章编辑
- 💬 支持访客评论功能
- 🔒 安全可靠的数据管理

## 未来计划

接下来我会陆续发布更多优质内容，包括但不限于：

- 前端开发技术分享
- 项目实战经验总结
- 生活感悟和思考
- 学习笔记和读书笔记

欢迎大家常来看看，也欢迎留言交流！

---

*最后更新时间：2024年12月*', 
(SELECT id FROM categories WHERE slug = 'life'), 3, NOW(), NOW()),
('React开发最佳实践', 'react-best-practices', '分享一些React开发中的最佳实践和技巧。', '# React开发最佳实践

## 组件设计原则

### 1. 单一职责原则
每个组件应该只负责一个功能，避免组件过于复杂。

```javascript
// ✅ 好的做法
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
    </div>
  );
}

// ❌ 不好的做法 - 组件职责过多
function UserDashboard() {
  // 处理用户数据获取
  // 处理用户编辑
  // 处理用户删除
  // 渲染用户列表
  // ...
}
```

### 2. 使用自定义Hooks
将可复用的逻辑提取到自定义Hooks中。

```javascript
function useUserData(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}
```

## 状态管理

### 使用Zustand进行状态管理

Zustand是一个轻量级的状态管理库，使用起来非常简单。

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

## 性能优化

### 1. 使用React.memo
对于纯函数组件，可以使用React.memo进行性能优化。

```javascript
const UserCard = React.memo(function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
    </div>
  );
});
```

### 2. 使用useMemo和useCallback

```javascript
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: heavyComputation(item)
    }));
  }, [data]);

  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.computed}
        </div>
      ))}
    </div>
  );
}
```

---

*最后更新时间：2024年12月*', 
(SELECT id FROM categories WHERE slug = 'tech'), 8, NOW(), NOW());