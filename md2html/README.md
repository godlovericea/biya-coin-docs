# 📝 Markdown 在线预览器

一个纯前端的 Markdown 转 HTML 预览工具，支持拖拽上传、实时预览、一键导出。

## ✨ 功能特点

- 🚀 **纯前端实现** - 无需后端服务器，完全在浏览器中运行
- 📤 **拖拽上传** - 支持拖拽或点击上传 Markdown 文件
- 👀 **实时预览** - 即时渲染，所见即所得
- 📑 **自动目录** - 根据标题自动生成可点击目录
- 💾 **一键导出** - 下载或复制 HTML 代码
- 🎨 **精美样式** - 渐变色主题，现代化UI设计
- 📱 **响应式** - 完美支持手机、平板、电脑

## 🌐 在线演示

部署后的在线地址：
- Vercel: `https://你的项目名.vercel.app`
- Netlify: `https://你的项目名.netlify.app`

## 🚀 本地运行

### 方法1：直接打开

```bash
# 在浏览器中直接打开 index.html
open index.html
```

### 方法2：使用本地服务器

```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve

# 然后访问 http://localhost:8000
```

## 📦 部署到 Vercel（推荐）

### 方式1：通过 Git（推荐）

1. **Push 代码到 GitHub**

```bash
git init
git add .
git commit -m "feat: 添加 Markdown 预览器"
git remote add origin https://github.com/你的用户名/md2html.git
git push -u origin main
```

2. **在 Vercel 部署**

- 访问 [vercel.com](https://vercel.com)
- 点击 "New Project"
- 导入你的 GitHub 仓库
- 点击 "Deploy" - 完成！

### 方式2：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

## 📦 部署到 Netlify

### 方式1：拖拽部署

1. 访问 [netlify.com](https://netlify.com)
2. 登录后进入 Dashboard
3. 将整个 `md2html` 文件夹拖拽到页面上
4. 完成！

### 方式2：通过 Git

1. Push 代码到 GitHub
2. 在 Netlify 点击 "New site from Git"
3. 选择你的仓库
4. 点击 "Deploy site"

## 📦 部署到 GitHub Pages

```bash
# 1. 确保代码在 GitHub 仓库中

# 2. 在仓库设置中启用 Pages
# Settings -> Pages -> Source: main branch / (root)

# 3. 访问
# https://你的用户名.github.io/仓库名/
```

## 📦 部署到 Cloudflare Pages

1. 访问 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 连接 GitHub 仓库
3. 设置：
   - Framework preset: None
   - Build command: 留空
   - Build output directory: `/`
4. 点击 "Save and Deploy"

## 🛠️ 技术栈

- **Marked.js** - Markdown 解析器
- **纯 HTML/CSS/JavaScript** - 无需框架
- **CDN** - 通过 jsdelivr 加载依赖

## 📁 项目结构

```
md2html/
├── index.html          # 在线预览器主页
├── style.css           # 样式文件
├── md-to-html.js       # Node.js 命令行工具
├── package.json        # Node.js 依赖配置
├── vercel.json         # Vercel 部署配置
└── README.md           # 说明文档
```

## 🎯 使用方法

### 在线使用

1. 访问部署后的网址
2. 拖拽或点击上传 `.md` 文件
3. 查看实时预览
4. 点击"下载 HTML"导出

### 命令行使用

```bash
# 安装依赖
npm install

# 转换单个文件
node md-to-html.js input.md

# 指定输出文件
node md-to-html.js input.md output.html
```

## 📝 支持的 Markdown 语法

- ✅ 标题（H1-H6）
- ✅ 粗体、斜体
- ✅ 列表（有序、无序）
- ✅ 代码块（带语法高亮）
- ✅ 行内代码
- ✅ 引用块
- ✅ 表格
- ✅ 链接和图片
- ✅ 分隔线
- ✅ 任务列表

## 🎨 自定义样式

编辑 `style.css` 文件即可自定义样式：

```css
/* 修改主题颜色 */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
}
```

## 🔧 配置说明

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ]
}
```

这个配置告诉 Vercel 这是一个静态网站。

## 📊 性能优化

- ✅ 使用 CDN 加载 marked.js
- ✅ CSS 渐进增强
- ✅ 无需构建步骤
- ✅ 零运行时依赖

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

## 📮 联系方式

- GitHub: [你的GitHub](https://github.com/你的用户名)
- Email: your@email.com

---

**注意**：部署后记得替换 `index.html` 中的 CSS 链接：

```html
<!-- 将这一行 -->
<link rel="stylesheet" href="./style.css">

<!-- 改为你的 GitHub CDN 链接 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/你的用户名/md2html/style.css">
```

或者在下载 HTML 时使用相对路径即可。

