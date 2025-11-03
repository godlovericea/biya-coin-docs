# 🌉 跨链桥独立部署方案

> **目标**: 将跨链桥功能从 `biya-helix-app` 中独立出来，支持独立访问和主站跳转  
> **更新时间**: 2025-10-30  
> **难度**: ⭐⭐⭐

---

## 📋 目录

1. [方案对比](#方案对比)
2. [推荐方案](#推荐方案)
3. [项目结构](#项目结构)
4. [实施步骤](#实施步骤)
5. [部署配置](#部署配置)
6. [访问方式](#访问方式)

---

## 🔀 方案对比

### 方案 1：独立 Next.js 应用 + Monorepo（✅ 推荐）

```
biya-coin/
├── packages/
│   ├── biya-helix-app/      # 主站
│   ├── biya-bridge-app/     # 跨链桥（新建）
│   ├── biya-dex-app/        # DEX
│   └── shared/              # 共享代码
└── package.json
```

**优点**：
- ✅ 完全独立，互不影响
- ✅ 可独立部署到不同域名
- ✅ 共享代码，避免重复
- ✅ 独立的版本控制
- ✅ 性能最优（无 iframe 损耗）

**缺点**：
- ⚠️ 需要重构代码结构
- ⚠️ 需要配置 Monorepo

---

### 方案 2：Next.js 子路径部署

```
主站：https://biya.com
桥接：https://biya.com/bridge
```

**优点**：
- ✅ 共享域名和 Cookie
- ✅ SEO 友好
- ✅ 配置简单

**缺点**：
- ❌ 无法真正独立部署
- ❌ 构建时间长（包含整个主站）
- ❌ 耦合度高

---

### 方案 3：独立应用 + iframe 嵌入

```
主站：https://biya.com
桥接：https://bridge.biya.com（独立）
主站嵌入：<iframe src="https://bridge.biya.com" />
```

**优点**：
- ✅ 完全独立
- ✅ 可以嵌入主站

**缺点**：
- ❌ iframe 性能损耗
- ❌ Cookie 跨域问题
- ❌ 用户体验不佳（滚动、高度等）
- ❌ 钱包连接可能有问题

---

### 方案 4：微前端（qiankun/Module Federation）

**优点**：
- ✅ 独立开发和部署
- ✅ 运行时集成

**缺点**：
- ❌ 配置复杂
- ❌ Next.js 支持不完善
- ❌ 调试困难
- ❌ 过度设计（对于两个应用）

---

## 🎯 推荐方案：独立应用 + Monorepo

### 架构设计

```
访问方式 1：独立访问
https://bridge.biya.com
    ↓
独立的 biya-bridge-app
    ↓
完整的跨链桥功能

访问方式 2：主站跳转
https://biya.com
    ↓
点击 "Bridge" 按钮
    ↓
跳转到 https://bridge.biya.com
```

### 技术栈

```json
{
  "monorepo": "pnpm workspace",
  "bridge-app": "Next.js 15 + React 19",
  "shared": "@biya/shared (共享库)",
  "deployment": "Vercel / 独立服务器"
}
```

---

## 📂 项目结构

### 当前结构

```
biya-coin/
├── biya-helix-app/          # 主站
├── biya-dex-app/            # DEX
├── docs/                    # 文档
└── other-projects/
```

### 目标结构（Monorepo）

```
biya-coin/
├── apps/
│   ├── helix/               # 主站（原 biya-helix-app）
│   │   ├── app/
│   │   ├── components/      # 主站专属组件
│   │   ├── lib/
│   │   └── package.json
│   │
│   ├── bridge/              # 跨链桥（新建）🆕
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx    # 桥接主页
│   │   │   └── api/
│   │   ├── components/
│   │   │   └── bridge/     # 从 helix 迁移
│   │   ├── lib/
│   │   │   └── bridge/     # 从 helix 迁移
│   │   ├── context/
│   │   │   └── bridge/     # 从 helix 迁移
│   │   ├── public/
│   │   │   └── images/chains/
│   │   ├── vendor/         # 从 helix 复制
│   │   │   └── injective/
│   │   ├── .env.local
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── dex/                 # DEX（原 biya-dex-app）
│       └── ...
│
├── packages/                # 共享包 🆕
│   ├── shared/              # 共享代码
│   │   ├── components/      # 通用组件（Button, Card 等）
│   │   ├── hooks/           # 共享 Hooks
│   │   ├── utils/           # 工具函数
│   │   ├── types/           # 类型定义
│   │   ├── constants/       # 常量
│   │   └── package.json
│   │
│   └── config/              # 共享配置
│       ├── eslint-config/
│       ├── typescript-config/
│       └── tailwind-config/
│
├── docs/                    # 文档
├── pnpm-workspace.yaml      # Monorepo 配置 🆕
├── package.json             # 根 package.json 🆕
└── turbo.json              # Turborepo 配置（可选）🆕
```

---

## 🚀 实施步骤

### 阶段 1：准备工作（1-2 小时）

#### 1.1 安装 pnpm（如果没有）

```bash
# 安装 pnpm
npm install -g pnpm

# 验证
pnpm --version
```

#### 1.2 创建 Monorepo 结构

```bash
cd D:\rwa\biya-coin

# 创建目录
mkdir apps packages

# 移动现有项目
move biya-helix-app apps\helix
move biya-dex-app apps\dex

# 创建共享包目录
mkdir packages\shared
mkdir packages\config
```

#### 1.3 创建根配置文件

**`pnpm-workspace.yaml`**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**根 `package.json`**:
```json
{
  "name": "biya-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:helix": "pnpm --filter helix dev",
    "dev:bridge": "pnpm --filter bridge dev",
    "dev:dex": "pnpm --filter dex dev",
    "build:helix": "pnpm --filter helix build",
    "build:bridge": "pnpm --filter bridge build",
    "build:all": "pnpm -r build",
    "clean": "pnpm -r clean"
  },
  "devDependencies": {
    "turbo": "^2.3.0"
  }
}
```

---

### 阶段 2：创建独立的 Bridge 应用（2-3 小时）

#### 2.1 初始化 Bridge 项目

```bash
cd D:\rwa\biya-coin\apps

# 创建 Next.js 应用
npx create-next-app@latest bridge --typescript --tailwind --app --no-src-dir
```

#### 2.2 修改 `apps/bridge/package.json`

```json
{
  "name": "bridge",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "@biya/shared": "workspace:*",
    "@0xsquid/sdk": "^2.10.2",
    "@injectivelabs/sdk-ts": "1.16.7",
    "@tanstack/react-query": "^5.90.5",
    "ethers": "^6.15.0",
    "next": "15.5.4",
    "react": "19.1.0",
    "react-hook-form": "^7.65.0",
    "wagmi": "^2.19.1",
    "viem": "^2.38.5"
  }
}
```

#### 2.3 迁移核心代码

```bash
# 从 helix 复制桥接相关代码
cd D:\rwa\biya-coin

# 复制 Bridge 组件
xcopy apps\helix\components\bridge apps\bridge\components\bridge /E /I /Y

# 复制 Bridge 逻辑
xcopy apps\helix\lib\bridge apps\bridge\lib\bridge /E /I /Y

# 复制 Bridge Context
xcopy apps\helix\context\bridge apps\bridge\context\bridge /E /I /Y

# 复制 Vendor
xcopy apps\helix\vendor apps\bridge\vendor /E /I /Y

# 复制图标
xcopy apps\helix\public\images\chains apps\bridge\public\images\chains /E /I /Y
```

#### 2.4 创建 Bridge 主页

**`apps/bridge/app/page.tsx`**:
```typescript
import { BridgeProviders } from '@/context/bridge/BridgeProviders'
import BridgeFromV2 from '@/components/bridge/BridgeFromV2'

export default function BridgePage() {
  return (
    <BridgeProviders>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* 顶部导航 */}
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              <h1 className="text-2xl font-bold text-white">Biya Bridge</h1>
            </div>
            
            {/* 返回主站链接 */}
            <a 
              href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'http://localhost:8080'}
              className="text-gray-400 hover:text-white transition"
            >
              ← Back to Main Site
            </a>
          </div>
        </nav>

        {/* 桥接表单 */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                跨链桥接
              </h2>
              <p className="text-gray-400 text-lg">
                在 Ethereum、BSC 和 Injective 之间安全转移资产
              </p>
            </div>
            
            <BridgeFromV2 />
          </div>
        </main>

        {/* 底部 */}
        <footer className="border-t border-gray-800 mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 Biya Bridge. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </BridgeProviders>
  )
}
```

#### 2.5 配置环境变量

**`apps/bridge/.env.local`**:
```bash
# 网络配置
NEXT_PUBLIC_NETWORK=mainnet

# 主站地址
NEXT_PUBLIC_MAIN_SITE_URL=https://biya.com

# WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Alchemy (可选)
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
```

#### 2.6 配置 Next.js

**`apps/bridge/next.config.ts`**:
```typescript
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 如果要部署到子路径
  // basePath: '/bridge',
  // assetPrefix: '/bridge',
  
  webpack: (config, { isServer }) => {
    // Vendor alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@injectivelabs/sdk-ts': path.resolve(__dirname, 'vendor/injective/sdk-ts'),
      '@injectivelabs/wallet-strategy': path.resolve(__dirname, 'vendor/injective/wallet-strategy'),
      // ... 其他 vendor 包
    }
    
    // Node.js polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      }
    }
    
    return config
  },
  
  // 转译特定包
  transpilePackages: [
    '@injectivelabs/sdk-ts',
    '@injectivelabs/wallet-strategy',
    // ... 其他需要转译的包
  ],
}

export default nextConfig
```

---

### 阶段 3：创建共享包（1-2 小时）

#### 3.1 初始化共享包

**`packages/shared/package.json`**:
```json
{
  "name": "@biya/shared",
  "version": "0.1.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./components": "./components/index.ts",
    "./hooks": "./hooks/index.ts",
    "./utils": "./utils/index.ts"
  },
  "dependencies": {
    "react": "19.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  }
}
```

#### 3.2 提取共享组件

**`packages/shared/components/Button.tsx`**:
```typescript
// 从各个应用中提取通用的 Button 组件
import { forwardRef } from 'react'
import { cn } from '../utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
            'bg-gray-700 text-white hover:bg-gray-600': variant === 'secondary',
            'border border-gray-600 hover:bg-gray-800': variant === 'outline',
            'hover:bg-gray-800': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

**`packages/shared/utils/cn.ts`**:
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**`packages/shared/index.ts`**:
```typescript
// Components
export * from './components/Button'

// Utils
export * from './utils/cn'

// Hooks (如果有共享的)
export * from './hooks/useMediaQuery'
```

---

### 阶段 4：配置构建和部署（1 小时）

#### 4.1 安装依赖

```bash
# 根目录安装依赖
cd D:\rwa\biya-coin
pnpm install

# 各个应用安装依赖
pnpm --filter helix install
pnpm --filter bridge install
pnpm --filter dex install
```

#### 4.2 启动开发服务器

```bash
# 启动主站
pnpm dev:helix
# → http://localhost:8080

# 启动 Bridge（新终端）
pnpm dev:bridge
# → http://localhost:3001

# 启动 DEX（新终端）
pnpm dev:dex
# → http://localhost:3002
```

#### 4.3 构建生产版本

```bash
# 单独构建
pnpm build:bridge

# 构建所有
pnpm build:all
```

---

## 🌐 部署配置

### 方案 A：独立域名部署（推荐）

```
主站：   https://biya.com          (Vercel/独立服务器)
Bridge： https://bridge.biya.com   (Vercel/独立服务器)
DEX：    https://dex.biya.com      (Vercel/独立服务器)
```

#### Vercel 部署

1. **主站**:
   - Project: `biya-helix`
   - Root Directory: `apps/helix`
   - Domain: `biya.com`

2. **Bridge**:
   - Project: `biya-bridge`
   - Root Directory: `apps/bridge`
   - Domain: `bridge.biya.com`

**`apps/bridge/vercel.json`**:
```json
{
  "buildCommand": "cd ../.. && pnpm build:bridge",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

### 方案 B：同域名子路径部署

```
主站：   https://biya.com/
Bridge： https://biya.com/bridge
DEX：    https://biya.com/dex
```

**配置** (`apps/bridge/next.config.ts`):
```typescript
const nextConfig: NextConfig = {
  basePath: '/bridge',
  assetPrefix: '/bridge',
  // ...
}
```

**Nginx 配置**:
```nginx
server {
  listen 80;
  server_name biya.com;

  # 主站
  location / {
    proxy_pass http://localhost:8080;
  }

  # Bridge
  location /bridge {
    proxy_pass http://localhost:3001;
  }

  # DEX
  location /dex {
    proxy_pass http://localhost:3002;
  }
}
```

---

## 🔗 访问方式

### 1. 独立访问

用户直接访问 Bridge 应用：

```
https://bridge.biya.com
```

### 2. 主站跳转

在主站添加跳转链接：

**`apps/helix/components/Navigation.tsx`**:
```typescript
export function Navigation() {
  const bridgeUrl = process.env.NEXT_PUBLIC_BRIDGE_URL || 'http://localhost:3001'
  
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a 
        href={bridgeUrl}
        target="_blank"  // 新标签打开
        rel="noopener noreferrer"
      >
        Bridge
      </a>
      <a href="/dex">DEX</a>
    </nav>
  )
}
```

**环境变量** (`apps/helix/.env.local`):
```bash
NEXT_PUBLIC_BRIDGE_URL=https://bridge.biya.com
```

### 3. 内嵌模式（可选）

如果需要在主站内嵌 Bridge：

**`apps/helix/app/bridge-embedded/page.tsx`**:
```typescript
'use client'

export default function BridgeEmbeddedPage() {
  const bridgeUrl = process.env.NEXT_PUBLIC_BRIDGE_URL
  
  return (
    <div className="h-screen">
      <iframe 
        src={bridgeUrl}
        className="w-full h-full border-0"
        title="Biya Bridge"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  )
}
```

---

## 📊 性能对比

| 指标 | 独立应用 | 子路径部署 | iframe 嵌入 |
|------|---------|-----------|------------|
| 首屏加载 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 构建时间 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 独立性 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| SEO | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| 维护成本 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ✅ 实施检查清单

### Phase 1: 准备
- [ ] 安装 pnpm
- [ ] 创建 Monorepo 结构
- [ ] 移动现有项目到 `apps/`
- [ ] 创建根配置文件

### Phase 2: Bridge 应用
- [ ] 创建 `apps/bridge` 项目
- [ ] 迁移 Bridge 代码
- [ ] 配置 `next.config.ts`
- [ ] 配置环境变量
- [ ] 测试本地运行

### Phase 3: 共享包
- [ ] 创建 `packages/shared`
- [ ] 提取共享组件
- [ ] 配置导出

### Phase 4: 部署
- [ ] 配置 Vercel/服务器
- [ ] 设置域名
- [ ] 测试生产环境

### Phase 5: 主站集成
- [ ] 添加跳转链接
- [ ] 测试跳转流程
- [ ] 更新文档

---

## 🎯 总结

### 推荐流程

1. **第 1-2 天**: 设置 Monorepo，创建 Bridge 应用
2. **第 3 天**: 迁移代码，本地测试
3. **第 4 天**: 部署到测试环境
4. **第 5 天**: 生产部署，主站集成

### 关键优势

✅ **独立开发**: Bridge 团队可以独立迭代  
✅ **独立部署**: 互不影响，降低风险  
✅ **代码复用**: 共享包减少重复代码  
✅ **灵活访问**: 支持独立访问和主站跳转  
✅ **性能最优**: 无 iframe 损耗，首屏加载快  

---

## 📞 需要帮助？

如果在实施过程中遇到问题，请参考：
- Monorepo 文档
- Next.js 多应用文档
- Vercel 部署文档

或直接咨询开发团队！

---

*最后更新: 2025-10-30*

