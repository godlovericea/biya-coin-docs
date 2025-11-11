# 🚀 快速部署指南

## 方案对比

| 平台 | 难度 | 速度 | 免费额度 | 推荐指数 |
|-----|------|------|---------|---------|
| **Vercel** | ⭐ 简单 | ⚡ 超快 | 100GB 流量/月 | ⭐⭐⭐⭐⭐ |
| **Netlify** | ⭐ 简单 | ⚡ 快 | 100GB 流量/月 | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | ⭐⭐ 中等 | ⚡ 快 | 无限流量 | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | ⭐ 简单 | ⚡ 超快 | 无限流量 | ⭐⭐⭐⭐⭐ |

---

## 🎯 最快部署：Vercel（5分钟搞定）

### 步骤1：准备代码

```bash
cd docs/md2html
```

### 步骤2：初始化 Git（如果还没有）

```bash
git init
git add .
git commit -m "feat: 初始化 Markdown 预览器"
```

### 步骤3：推送到 GitHub

```bash
# 在 GitHub 创建一个新仓库（比如叫 md2html-viewer）
git remote add origin https://github.com/你的用户名/md2html-viewer.git
git branch -M main
git push -u origin main
```

### 步骤4：部署到 Vercel

#### 方法A：网页端部署（推荐新手）

1. 访问 [vercel.com](https://vercel.com)
2. 用 GitHub 账号登录
3. 点击 "Add New" -> "Project"
4. 选择你刚才的仓库 `md2html-viewer`
5. 配置：
   - Framework Preset: `Other`
   - Root Directory: `./`（或留空）
   - Build Command: 留空
   - Output Directory: 留空
6. 点击 "Deploy"
7. 等待 30 秒 - 完成！🎉

你会得到一个地址：`https://md2html-viewer.vercel.app`

#### 方法B：命令行部署（推荐老手）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署（首次会问几个问题，全部回车即可）
vercel

# 4. 生产环境部署
vercel --prod
```

完成！你会得到一个网址。

---

## 🎨 Netlify 部署（同样简单）

### 方法1：拖拽部署（最简单！）

1. 访问 [netlify.com](https://netlify.com)
2. 用 GitHub 登录
3. 进入 Dashboard
4. **直接把 `md2html` 文件夹拖到页面上**
5. 完成！🎉

### 方法2：通过 Git

1. 代码推送到 GitHub（同上）
2. 在 Netlify 点击 "New site from Git"
3. 选择 GitHub -> 选择仓库
4. 配置：
   - Build command: 留空
   - Publish directory: `/`
5. 点击 "Deploy site"
6. 完成！

---

## 📄 GitHub Pages 部署

### 步骤1：推送代码到 GitHub

```bash
git init
git add .
git commit -m "feat: 初始化 Markdown 预览器"
git remote add origin https://github.com/你的用户名/md2html-viewer.git
git branch -M main
git push -u origin main
```

### 步骤2：启用 Pages

1. 进入仓库页面
2. 点击 `Settings`
3. 左侧菜单找到 `Pages`
4. Source 选择：`main` 分支，`/ (root)` 目录
5. 点击 `Save`
6. 等待几分钟

访问地址：`https://你的用户名.github.io/md2html-viewer/`

---

## ☁️ Cloudflare Pages 部署

### 步骤1：推送到 GitHub（同上）

### 步骤2：Cloudflare Pages

1. 访问 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 登录后点击 "Create a project"
3. 连接 GitHub 账号
4. 选择你的仓库 `md2html-viewer`
5. 配置：
   - Project name: `md2html-viewer`
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: 留空
   - Build output directory: `/`
6. 点击 "Save and Deploy"
7. 完成！

访问地址：`https://md2html-viewer.pages.dev`

---

## 🔧 部署后的调整

### 如果使用 GitHub Pages

由于地址有子路径，需要修改 `index.html`：

```html
<!-- 原来 -->
<link rel="stylesheet" href="./style.css">

<!-- 改为 -->
<link rel="stylesheet" href="/md2html-viewer/style.css">
```

### 如果使用其他平台

不需要修改，直接使用！

---

## 🎯 自定义域名（可选）

### Vercel

1. 在项目设置中点击 "Domains"
2. 添加你的域名（如 `md.yourdomain.com`）
3. 在域名DNS添加 CNAME 记录指向 Vercel

### Netlify

1. 在项目设置中点击 "Domain management"
2. 添加自定义域名
3. 按提示配置 DNS

### Cloudflare Pages

1. 在项目设置中点击 "Custom domains"
2. 添加域名（Cloudflare DNS 会自动配置）

---

## 📊 性能对比

实测数据（国内访问）：

| 平台 | 首次加载 | CDN节点 | 稳定性 |
|-----|---------|---------|--------|
| Vercel | ~500ms | 全球CDN | ⭐⭐⭐⭐ |
| Netlify | ~600ms | 全球CDN | ⭐⭐⭐⭐⭐ |
| Cloudflare | ~400ms | 全球CDN | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ~800ms | GitHub CDN | ⭐⭐⭐ |

---

## 💡 常见问题

### Q: 部署后 CSS 样式不显示？

A: 检查 `index.html` 中的路径是否正确：

```html
<!-- 正确（相对路径） -->
<link rel="stylesheet" href="./style.css">

<!-- 或者使用绝对路径 -->
<link rel="stylesheet" href="/style.css">
```

### Q: 能用 Vercel CLI 一键部署吗？

A: 可以！

```bash
# 首次部署
vercel

# 后续更新
git commit -am "update"
git push
# Vercel 会自动重新部署
```

### Q: 免费版有什么限制？

A: 几乎没有！
- Vercel: 100GB 流量/月，足够个人使用
- Netlify: 100GB 流量/月
- Cloudflare: 无限流量
- GitHub Pages: 无限流量，但有 100GB 软限制

### Q: 需要备案吗？

A: 使用他们提供的域名（如 `.vercel.app`）不需要备案！

如果使用自己的域名且在国内访问，建议：
- 使用 Cloudflare（不需要备案）
- 或使用 Vercel/Netlify 配合 Cloudflare CDN

---

## 🎉 完成后的检查清单

- [ ] 网站能正常访问
- [ ] 上传功能正常
- [ ] 预览显示正常
- [ ] 下载 HTML 功能正常
- [ ] 手机端显示正常
- [ ] 分享链接给朋友测试

---

## 📮 需要帮助？

- 查看 [Vercel 文档](https://vercel.com/docs)
- 查看 [Netlify 文档](https://docs.netlify.com)
- 查看 [GitHub Pages 文档](https://docs.github.com/pages)

**祝你部署成功！** 🎉

