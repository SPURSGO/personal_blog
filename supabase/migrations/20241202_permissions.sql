-- 授予匿名用户读取权限
GRANT SELECT ON posts TO anon;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON comments TO anon;

-- 授予认证用户完整权限
GRANT ALL PRIVILEGES ON posts TO authenticated;
GRANT ALL PRIVILEGES ON categories TO authenticated;
GRANT ALL PRIVILEGES ON comments TO authenticated;

-- 创建行级安全策略
-- 评论插入策略（无需认证）
CREATE POLICY "任何人都可以发表评论" ON comments
  FOR INSERT WITH CHECK (true);

-- 评论读取策略（只显示已批准的评论）
CREATE POLICY "只显示已批准的评论" ON comments
  FOR SELECT USING (approved = true OR auth.uid() IS NOT NULL);

-- 评论更新删除策略（只有认证用户可以管理）
CREATE POLICY "认证用户可以管理评论" ON comments
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 文章读取策略（只显示已发布的文章）
CREATE POLICY "只显示已发布的文章" ON posts
  FOR SELECT USING (published = true OR auth.uid() IS NOT NULL);

-- 文章管理策略（只有认证用户可以管理）
CREATE POLICY "认证用户可以管理文章" ON posts
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 分类读取策略（公开读取）
CREATE POLICY "任何人都可以读取分类" ON categories
  FOR SELECT USING (true);

-- 分类管理策略（只有认证用户可以管理）
CREATE POLICY "认证用户可以管理分类" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 启用行级安全
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;