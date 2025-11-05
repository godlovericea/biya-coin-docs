# Figma MCP 完整配置与使用指南

## 📋 目录

1. [什么是 Figma MCP](#什么是-figma-mcp)
2. [配置 Figma MCP](#配置-figma-mcp)
3. [验证配置是否成功](#验证配置是否成功)
4. [通过 Figma MCP 生成代码](#通过-figma-mcp-生成代码)
5. [完整案例：登录页面](#完整案例登录页面)
6. [常见问题解决](#常见问题解决)
7. [最佳实践](#最佳实践)

---

## 什么是 Figma MCP

**MCP (Model Context Protocol)** 是一个开放协议，允许 AI 助手（如 Cursor）连接到外部工具和数据源。

**Figma MCP** 是 MCP 的一个实现，让 Cursor 能够：
- 直接访问 Figma 设计文件
- 读取设计规范（颜色、字体、间距等）
- 提取组件信息
- 自动生成基于设计稿的代码

---

## 配置 Figma MCP

### 步骤 1：获取 Figma Access Token

1. 访问 [Figma Settings - Personal Access Tokens](https://www.figma.com/developers/api#access-tokens)
2. 点击 **"Generate new token"**
3. 给 token 起个名字（例如：`cursor-mcp-token`）
4. 复制生成的 token（格式：`figd_xxxxxxxxxxxxx`）
5. ⚠️ **重要**：保存好这个 token，页面关闭后无法再次查看

### 步骤 2：确定配置文件路径

Cursor 的 MCP 配置文件位置：

**Windows:**
```
C:\Users\你的用户名\.cursor\mcp.json
```

**macOS/Linux:**
```
~/.cursor/mcp.json
```

### 步骤 3：创建/编辑配置文件

如果文件不存在，创建它。内容如下：

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp"],
      "env": {
        "FIGMA_API_KEY": "figd_你的实际token"
      }
    }
  }
}
```

**关键配置说明：**

| 配置项 | 说明 |
|--------|------|
| `mcpServers` | MCP 服务器配置对象 |
| `"figma"` | 服务器名称（可自定义） |
| `command` | 执行命令（使用 npx） |
| `args` | 参数数组，`-y` 自动确认安装 |
| `figma-developer-mcp` | 使用的 Figma MCP 包 |
| `FIGMA_API_KEY` | 你的 Figma token |

### 步骤 4：重启 Cursor

⚠️ **必须重启 Cursor** 才能加载 MCP 配置！

1. 完全关闭 Cursor（不是最小化）
2. 重新打开 Cursor
3. 等待几秒让 MCP 服务初始化

---

## 验证配置是否成功

### 方法 1：查看 MCP 状态指示器

在 Cursor 右下角查找 MCP 状态指示器：
- **绿点** 🟢 = 已连接（成功）
- **红点/灰点** = 未连接（失败）

### 方法 2：使用测试命令

在 Cursor 聊天中输入：

```
请帮我读取这个 Figma 文件：FusPoyOyC8pxTf8boEF0nP
```

如果成功，Cursor 会返回文件信息。

### 方法 3：检查 MCP 工具列表

使用命令：
```
@mcp list
```

应该看到类似输出：
```
Available MCP Tools:
- figma/get_file
- figma/get_file_nodes
- figma/get_image
...
```

---

## 通过 Figma MCP 生成代码

### 完整工作流程

```
Figma 设计稿 → Figma MCP → Cursor AI → Next.js/React 代码
```

### 步骤 1：获取 Figma 设计链接

从 Figma 设计文件 URL 中提取信息：

**示例 URL：**
```
https://www.figma.com/design/FusPoyOyC8pxTf8boEF0nP/web?node-id=319-68&p=f&t=JTbTNnvRpDnMraru-0
```

**提取信息：**
- **File ID**: `FusPoyOyC8pxTf8boEF0nP` (设计文件ID)
- **Node ID**: `319-68` (具体节点/画板ID)

### 步骤 2：在 Cursor 中请求读取设计

**基础读取命令：**
```
请读取 Figma 设计文件 ID: FusPoyOyC8pxTf8boEF0nP
```

**读取特定节点：**
```
请读取 Figma 文件 FusPoyOyC8pxTf8boEF0nP 中的节点 319-68
```

**完整请求示例：**
```
我有一个 Figma 登录页面设计，URL 是：
https://www.figma.com/design/FusPoyOyC8pxTf8boEF0nP/web?node-id=319-68

请帮我：
1. 读取这个设计的详细信息
2. 提取颜色、字体、间距等规范
3. 生成对应的 Next.js 登录页面代码
```

### 步骤 3：指定技术栈和要求

**明确你的需求：**

```
基于上面的 Figma 设计，请创建 Next.js 页面，要求：

技术栈：
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion（动画）
- next-intl（国际化）

功能需求：
- 响应式设计（移动端、平板、桌面）
- 表单验证
- 加载状态
- 错误处理
- 深色模式支持

文件结构：
- 创建在 app/[locale]/login/ 目录
- 组件化设计，拆分为可复用组件
```

### 步骤 4：Cursor 自动生成代码

Cursor 会：
1. ✅ 通过 Figma MCP 读取设计数据
2. ✅ 分析设计的布局、颜色、字体
3. ✅ 提取组件层级结构
4. ✅ 生成对应的 React 组件
5. ✅ 应用 TailwindCSS 样式
6. ✅ 添加动画和交互效果
7. ✅ 创建国际化翻译文件

---

## 完整案例：登录页面

### 需求描述

**Figma 设计：**
- URL: `https://www.figma.com/design/FusPoyOyC8pxTf8boEF0nP/web?node-id=319-68`
- 设计特点：左右分栏布局，左侧品牌展示，右侧登录表单

### 实际操作步骤

#### 1️⃣ 提供设计链接

```
我有一个登录页面的 Figma 设计：
https://www.figma.com/design/FusPoyOyC8pxTf8boEF0nP/web?node-id=319-68

请帮我分析这个设计并生成 Next.js 代码。
```

#### 2️⃣ Cursor 读取设计

Cursor 会自动：
- 调用 `mcp_figma_get_file` 读取文件
- 调用 `mcp_figma_get_file_nodes` 读取节点
- 分析设计规范

#### 3️⃣ 确认技术栈

```
请使用以下技术栈：
- Next.js 14 App Router
- TypeScript
- TailwindCSS
- Framer Motion
- next-intl

创建位置：biya-helix-app/app/[locale]/login/
```

#### 4️⃣ Cursor 生成文件

自动生成：

**页面文件：**
```typescript
// app/[locale]/login/page.tsx
import { setRequestLocale } from 'next-intl/server'
import BiyaPayLoginForm from './components/BiyaPayLoginForm'
import Link from 'next/link'

export default async function LoginPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="relative min-h-screen">
      <Link href="/" className="absolute top-8 left-8 ...">
        Back to Home
      </Link>
      <BiyaPayLoginForm />
    </div>
  )
}
```

**组件文件：**
```typescript
// app/[locale]/login/components/BiyaPayLoginForm.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function BiyaPayLoginForm() {
  const t = useTranslations('LoginPage')
  // ... 组件实现
}
```

**国际化文件：**
```json
// messages/en.json
{
  "LoginPage": {
    "title": "Welcome Back",
    "subtitle": "Sign in to your account",
    "email": "Email Address",
    ...
  }
}
```

#### 5️⃣ 测试和调整

```bash
# 启动开发服务器
cd biya-helix-app
npm run dev

# 访问页面
http://localhost:8080/en/login
```

如需调整：
```
登录表单的按钮应该更大一些，字体改为 semibold，
并且悬停时有放大动画效果。
```

---

## 常见问题解决

### 问题 1：MCP 连接失败 ❌

**症状：**
- 右下角红点或灰点
- 提示 "No server info found"

**解决方案：**

1. **检查配置文件路径**
   ```bash
   # Windows PowerShell
   Test-Path "C:\Users\你的用户名\.cursor\mcp.json"
   
   # 应该返回 True
   ```

2. **验证 JSON 格式**
   ```json
   {
     "mcpServers": {
       "figma": {
         "command": "npx",
         "args": ["-y", "figma-developer-mcp"],
         "env": {
           "FIGMA_API_KEY": "figd_xxxxx"
         }
       }
     }
   }
   ```
   
   ⚠️ 注意：
   - 逗号位置正确
   - 引号匹配
   - 没有多余的逗号

3. **重启 Cursor**
   - 完全关闭（任务管理器确认进程已结束）
   - 重新启动
   - 等待 10-15 秒

### 问题 2：Token 无效 ❌

**症状：**
- MCP 绿点但无法读取文件
- 提示 "Authentication failed"

**解决方案：**

1. **重新生成 Token**
   - 访问 Figma Settings
   - 删除旧 token
   - 生成新 token
   - 更新 mcp.json

2. **检查 Token 格式**
   ```
   正确：figd_xxxxxxxxxxxxxxxxxxxxxxxxxxx
   错误：没有 figd_ 前缀
   ```

### 问题 3：无法读取特定文件 ❌

**症状：**
- 其他文件可以读取
- 特定文件提示权限错误

**解决方案：**

1. **检查文件权限**
   - 确保你有文件的查看权限
   - 文件不是私有状态

2. **使用正确的 File ID**
   ```
   URL: https://www.figma.com/design/FusPoyOyC8pxTf8boEF0nP/web
   File ID: FusPoyOyC8pxTf8boEF0nP (不含前后缀)
   ```

### 问题 4：生成的代码不准确 ❌

**解决方案：**

1. **提供更详细的上下文**
   ```
   这个登录表单有以下特点：
   1. 左侧是品牌展示区，背景为渐变色
   2. 右侧是表单区，白色背景
   3. 输入框有圆角和阴影
   4. 按钮是深色的，有悬停效果
   5. 支持 Google 和 GitHub 登录
   
   请严格按照这些特点生成代码。
   ```

2. **分步骤请求**
   ```
   第一步：请先创建页面布局和结构
   第二步：添加表单组件和验证逻辑
   第三步：添加样式和动画效果
   第四步：添加国际化支持
   ```

3. **提供参考截图**
   - 在聊天中直接粘贴设计截图
   - Cursor 可以同时参考 Figma 数据和截图

---

## 最佳实践

### 1. 设计稿准备

**✅ 好的设计稿：**
- 图层命名清晰（button-primary, input-email）
- 组件化设计（使用 Figma Components）
- 有完整的设计规范（Colors, Typography）
- 响应式设计标注

**❌ 避免：**
- 图层命名混乱（Rectangle 1, Group 23）
- 所有元素都是独立的（未组件化）
- 缺少设计规范

### 2. 提示词技巧

**✅ 清晰明确：**
```
基于 Figma 设计 [File ID: xxx, Node ID: xxx]，创建一个：
- 响应式的登录页面
- 使用 Next.js 14 + TypeScript
- TailwindCSS 样式
- 支持中英文切换
- 表单验证和错误提示
```

**❌ 模糊不清：**
```
帮我做个登录页面
```

### 3. 文件组织

**推荐结构：**
```
app/
└── [locale]/
    └── login/
        ├── page.tsx              # 主页面
        ├── components/
        │   ├── LoginForm.tsx     # 表单组件
        │   ├── SocialLogin.tsx   # 社交登录
        │   └── BrandSection.tsx  # 品牌展示
        └── styles.css           # 自定义样式（如需）

messages/
├── en.json                      # 英文翻译
├── zh.json                      # 中文翻译
└── ...
```

### 4. 迭代优化

**第一次生成后：**
```
✅ 先测试基本功能是否正常
✅ 再调整样式细节
✅ 最后优化动画和交互
```

**逐步完善：**
```
第 1 步：生成基础页面 ✓
第 2 步：添加表单验证 ✓
第 3 步：添加动画效果 ✓
第 4 步：优化响应式 ✓
第 5 步：添加深色模式 ✓
```

### 5. 代码复用

**提取可复用组件：**
```typescript
// components/ui/Button.tsx
export function Button({ variant, children, ...props }) {
  return (
    <motion.button
      className={cn(buttonVariants({ variant }))}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// 在多个页面中使用
import { Button } from '@/components/ui/Button'
```

---

## 高级用法

### 多节点批量生成

```
我有 3 个相关的 Figma 节点：
1. 节点 404-2655: 邮箱输入界面
2. 节点 404-2445: 密码输入界面  
3. 节点 386-848: 登录成功界面

请读取这 3 个节点，并生成一个多步骤登录表单组件。
```

### 设计系统提取

```
请分析 Figma 文件 [File ID]，提取完整的设计系统：
1. 颜色变量（primary, secondary, etc.）
2. 字体系统（heading, body, etc.）
3. 间距系统（spacing scale）
4. 圆角系统（border radius）
5. 阴影系统（box shadow）

然后生成对应的 TailwindCSS 配置文件。
```

### 响应式适配

```
这个 Figma 设计有 3 个断点：
- Mobile: 375px
- Tablet: 768px
- Desktop: 1440px

请生成响应式代码，在不同断点下调整布局。
```

---

## 备选方案：Node.js 脚本

如果 MCP 无法使用，可以使用直接 API 调用：

### 创建备用脚本

```javascript
// scripts/read-figma-design.js
const https = require('https');

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_ID = process.env.FIGMA_FILE_ID || 'FusPoyOyC8pxTf8boEF0nP';
const NODE_ID = process.env.FIGMA_NODE_ID || '319-68';

const options = {
  hostname: 'api.figma.com',
  path: `/v1/files/${FILE_ID}/nodes?ids=${NODE_ID}`,
  method: 'GET',
  headers: {
    'X-Figma-Token': FIGMA_TOKEN
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    console.log(JSON.stringify(result, null, 2));
  });
});
```

### 使用脚本

```bash
# 设置环境变量
export FIGMA_ACCESS_TOKEN="figd_xxxxx"
export FIGMA_FILE_ID="FusPoyOyC8pxTf8boEF0nP"
export FIGMA_NODE_ID="319-68"

# 运行脚本
node scripts/read-figma-design.js > figma-data.json
```

然后将 JSON 数据提供给 Cursor：
```
我已经通过 API 获取了 Figma 设计数据（见 figma-data.json），
请基于这些数据生成 Next.js 页面代码。
```

---

## 总结

### Figma MCP 工作流

```
1. 设计师在 Figma 创建设计 📐
   ↓
2. 开发者获取 Figma URL 🔗
   ↓
3. 在 Cursor 中请求读取设计 💬
   ↓
4. Figma MCP 自动获取数据 🔄
   ↓
5. Cursor AI 分析设计规范 🤖
   ↓
6. 自动生成 React/Next.js 代码 ⚡
   ↓
7. 开发者测试和微调 ✨
```

### 关键优势

- ✅ **自动化**：减少手动编码时间 50%+
- ✅ **准确性**：直接基于设计稿，减少偏差
- ✅ **一致性**：确保代码与设计保持同步
- ✅ **效率**：快速迭代和原型开发
- ✅ **协作**：设计和开发无缝衔接

### 下一步

1. ✅ 配置好 Figma MCP
2. ✅ 准备好设计文件
3. ✅ 尝试生成第一个页面
4. ✅ 根据需求迭代优化
5. ✅ 建立自己的组件库

---

## 相关资源

- [Figma API 文档](https://www.figma.com/developers/api)
- [MCP 官方文档](https://modelcontextprotocol.io)
- [Next.js 文档](https://nextjs.org/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)

---

**最后更新：** 2025-01-31  
**版本：** 1.0  
**作者：** Cursor AI Assistant

如有问题或建议，欢迎反馈！🚀

