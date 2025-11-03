# 🏗️ Biya Coin 完整架构

> **基于**: biya-helix-app  
> **包含**: 主题切换、多语言、状态管理、共享功能  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [完整目录结构](#完整目录结构)
2. [核心模块说明](#核心模块说明)
3. [技术栈](#技术栈)
4. [实施步骤](#实施步骤)

---

## 📁 完整目录结构

```
D:\rwa\biya-coin\
│
├── 📄 package.json                      # 根配置（Workspaces）
├── 📄 pnpm-workspace.yaml              # pnpm 配置（可选）
├── 📄 tsconfig.json                    # TypeScript 根配置
├── 📄 .eslintrc.js                     # ESLint 配置
├── 📄 .prettierrc                      # Prettier 配置
├── 📄 .gitignore
├── 📄 README.md
├── 📄 docker-compose.yml               # Docker 配置
│
├── 📁 node_modules/                    # 共享依赖（Workspace）
│   ├── react/
│   ├── next/
│   └── @biya/                          # 本地包软链接
│       ├── shared -> ../../packages/shared
│       ├── i18n -> ../../packages/i18n
│       └── theme -> ../../packages/theme
│
├── 📁 apps/                            # 应用目录
│   │
│   ├── 📁 bridge/                      # 跨链桥应用
│   │   ├── 📄 package.json
│   │   ├── 📄 next.config.ts
│   │   ├── 📄 tailwind.config.ts
│   │   ├── 📄 tsconfig.json
│   │   ├── 📄 Dockerfile
│   │   ├── 📄 vercel.json
│   │   │
│   │   ├── 📁 app/                     # Next.js App Router
│   │   │   ├── 📁 [locale]/           # 国际化路由
│   │   │   │   ├── 📄 layout.tsx      # 根布局
│   │   │   │   ├── 📄 page.tsx        # 首页
│   │   │   │   ├── 📁 bridge/         # 桥接页面
│   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   └── 📄 BridgePage.tsx
│   │   │   │   └── 📁 api/            # API 路由
│   │   │   │       └── 📁 health/
│   │   │   ├── 📄 layout.tsx          # 全局布局
│   │   │   └── 📄 not-found.tsx
│   │   │
│   │   ├── 📁 components/              # Bridge 特有组件
│   │   │   ├── 📁 bridge/
│   │   │   │   ├── 📄 Bridge.tsx
│   │   │   │   ├── 📄 BridgeForm.tsx
│   │   │   │   ├── 📄 BridgeFromV2.tsx
│   │   │   │   └── 📁 common/
│   │   │   │       ├── 📄 CurrencyInput.tsx
│   │   │   │       └── 📄 Spinner.tsx
│   │   │   └── 📁 layout/
│   │   │       ├── 📄 Header.tsx
│   │   │       └── 📄 Footer.tsx
│   │   │
│   │   ├── 📁 context/                 # Bridge Context
│   │   │   └── 📁 bridge/
│   │   │       ├── 📄 BridgeProviders.tsx
│   │   │       ├── 📄 WalletProvider.tsx
│   │   │       ├── 📄 AccountProvider.tsx
│   │   │       ├── 📄 PeggyProvider.tsx
│   │   │       ├── 📄 AxelarProvider.tsx
│   │   │       ├── 📄 TokenProvider.tsx
│   │   │       └── 📄 EventProvider.tsx
│   │   │
│   │   ├── 📁 lib/                     # Bridge 业务逻辑
│   │   │   └── 📁 bridge/
│   │   │       ├── 📁 constants/
│   │   │       ├── 📁 contracts/
│   │   │       ├── 📁 services/
│   │   │       ├── 📁 utils/
│   │   │       ├── 📁 hooks/
│   │   │       ├── 📁 types/
│   │   │       ├── 📁 data/
│   │   │       └── 📁 wallet/
│   │   │
│   │   ├── 📁 messages/                # Bridge 特定翻译
│   │   │   ├── 📄 en.json
│   │   │   ├── 📄 zh.json
│   │   │   ├── 📄 ja.json
│   │   │   └── 📄 ko.json
│   │   │
│   │   ├── 📁 store/                   # Bridge 特定状态
│   │   │   ├── 📄 bridge-store.ts     # 桥接交易状态
│   │   │   └── 📄 transaction-history.ts
│   │   │
│   │   ├── 📁 styles/
│   │   │   └── 📄 globals.css
│   │   │
│   │   ├── 📁 public/
│   │   │   ├── 📁 images/
│   │   │   │   └── 📁 chains/
│   │   │   │       ├── 📄 ethereum.svg
│   │   │   │       ├── 📄 bnb.svg
│   │   │   │       └── 📄 injective.svg
│   │   │   └── 📁 icons/
│   │   │
│   │   └── 📁 i18n/
│   │       └── 📄 request.ts           # i18n 配置
│   │
│   ├── 📁 dex/                         # DEX 应用
│   │   ├── 📄 package.json
│   │   ├── 📄 next.config.ts
│   │   ├── 📄 Dockerfile
│   │   │
│   │   ├── 📁 app/
│   │   │   ├── 📁 [locale]/
│   │   │   │   ├── 📄 layout.tsx
│   │   │   │   ├── 📄 page.tsx
│   │   │   │   ├── 📁 trade/          # 交易页面
│   │   │   │   ├── 📁 markets/        # 市场页面
│   │   │   │   ├── 📁 portfolio/      # 资产页面
│   │   │   │   └── 📁 orders/         # 订单页面
│   │   │   └── 📄 layout.tsx
│   │   │
│   │   ├── 📁 components/              # DEX 特有组件
│   │   │   ├── 📁 trading/
│   │   │   │   ├── 📄 OrderBook.tsx
│   │   │   │   ├── 📄 TradeForm.tsx
│   │   │   │   └── 📄 PriceChart.tsx
│   │   │   └── 📁 markets/
│   │   │       └── 📄 MarketList.tsx
│   │   │
│   │   ├── 📁 store/                   # DEX 特定状态
│   │   │   ├── 📄 orderbook-store.ts  # 订单簿状态
│   │   │   ├── 📄 trading-store.ts    # 交易状态
│   │   │   └── 📄 market-store.ts     # 市场数据
│   │   │
│   │   ├── 📁 messages/                # DEX 特定翻译
│   │   │   ├── 📄 en.json
│   │   │   └── 📄 zh.json
│   │   │
│   │   └── 📁 lib/
│   │       └── 📁 dex/
│   │           ├── 📁 api/
│   │           ├── 📁 utils/
│   │           └── 📁 hooks/
│   │
│   └── 📁 helix/                       # Helix 主站
│       ├── 📄 package.json
│       ├── 📄 next.config.ts
│       ├── 📄 Dockerfile
│       │
│       ├── 📁 app/
│       │   ├── 📁 [locale]/
│       │   │   ├── 📄 layout.tsx
│       │   │   ├── 📄 page.tsx        # 首页
│       │   │   ├── 📁 about/          # 关于页面
│       │   │   ├── 📁 docs/           # 文档页面
│       │   │   └── 📁 blog/           # 博客页面
│       │   └── 📄 layout.tsx
│       │
│       ├── 📁 components/              # Helix 特有组件
│       │   ├── 📁 home/
│       │   │   ├── 📄 Hero.tsx
│       │   │   ├── 📄 Features.tsx
│       │   │   └── 📄 Stats.tsx
│       │   └── 📁 docs/
│       │
│       ├── 📁 messages/                # Helix 特定翻译
│       │   ├── 📄 en.json
│       │   └── 📄 zh.json
│       │
│       └── 📁 lib/
│
├── 📁 packages/                        # 共享包
│   │
│   ├── 📁 shared/                      # 共享功能包 ⭐
│   │   ├── 📄 package.json
│   │   ├── 📄 tsconfig.json
│   │   │
│   │   ├── 📁 components/              # 共享 UI 组件
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📁 ui/                  # 基础 UI 组件
│   │   │   │   ├── 📄 Button.tsx
│   │   │   │   ├── 📄 Input.tsx
│   │   │   │   ├── 📄 Card.tsx
│   │   │   │   ├── 📄 Modal.tsx
│   │   │   │   ├── 📄 Dropdown.tsx
│   │   │   │   ├── 📄 Toast.tsx
│   │   │   │   └── 📄 Loading.tsx
│   │   │   ├── 📁 layout/              # 布局组件
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   ├── 📄 Footer.tsx
│   │   │   │   ├── 📄 Sidebar.tsx
│   │   │   │   └── 📄 Container.tsx
│   │   │   ├── 📁 theme/               # 主题组件
│   │   │   │   ├── 📄 ThemeProvider.tsx
│   │   │   │   ├── 📄 ThemeToggle.tsx
│   │   │   │   └── 📄 ThemeScript.tsx
│   │   │   └── 📁 wallet/              # 钱包组件
│   │   │       ├── 📄 WalletButton.tsx
│   │   │       ├── 📄 WalletModal.tsx
│   │   │       └── 📄 NetworkSelector.tsx
│   │   │
│   │   ├── 📁 hooks/                   # 共享 Hooks
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 useMediaQuery.ts
│   │   │   ├── 📄 useDebounce.ts
│   │   │   ├── 📄 useLocalStorage.ts
│   │   │   ├── 📄 useClickOutside.ts
│   │   │   └── 📄 useKeyPress.ts
│   │   │
│   │   ├── 📁 utils/                   # 工具函数
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 format.ts           # 格式化
│   │   │   ├── 📄 validation.ts       # 验证
│   │   │   ├── 📄 cn.ts               # className 合并
│   │   │   ├── 📄 date.ts             # 日期处理
│   │   │   └── 📄 number.ts           # 数字处理
│   │   │
│   │   ├── 📁 constants/               # 常量
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 chains.ts           # 链配置
│   │   │   ├── 📄 tokens.ts           # 代币配置
│   │   │   └── 📄 networks.ts         # 网络配置
│   │   │
│   │   ├── 📁 types/                   # 共享类型
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 wallet.ts
│   │   │   ├── 📄 user.ts
│   │   │   └── 📄 common.ts
│   │   │
│   │   └── 📄 index.ts                 # 统一导出
│   │
│   ├── 📁 theme/                       # 主题管理包 ⭐
│   │   ├── 📄 package.json
│   │   │
│   │   ├── 📁 store/                   # 主题状态管理
│   │   │   ├── 📄 theme-store.ts      # Zustand Store
│   │   │   └── 📄 theme-persist.ts    # 持久化
│   │   │
│   │   ├── 📁 hooks/                   # 主题 Hooks
│   │   │   ├── 📄 useTheme.ts         # 主题切换 Hook
│   │   │   └── 📄 useSystemTheme.ts   # 系统主题检测
│   │   │
│   │   ├── 📁 config/                  # 主题配置
│   │   │   ├── 📄 themes.ts           # 主题定义
│   │   │   ├── 📄 colors.ts           # 颜色配置
│   │   │   └── 📄 tailwind.ts         # Tailwind 扩展
│   │   │
│   │   ├── 📁 components/              # 主题组件
│   │   │   ├── 📄 ThemeProvider.tsx
│   │   │   ├── 📄 ThemeToggle.tsx
│   │   │   └── 📄 ThemeScript.tsx     # 防闪烁脚本
│   │   │
│   │   ├── 📁 types/
│   │   │   └── 📄 theme.ts
│   │   │
│   │   └── 📄 index.ts
│   │
│   ├── 📁 i18n/                        # 国际化包 ⭐
│   │   ├── 📄 package.json
│   │   │
│   │   ├── 📁 locales/                 # 翻译文件
│   │   │   ├── 📁 common/              # 通用翻译
│   │   │   │   ├── 📄 en.json
│   │   │   │   ├── 📄 zh.json
│   │   │   │   ├── 📄 ja.json
│   │   │   │   └── 📄 ko.json
│   │   │   ├── 📁 domain/              # 领域翻译
│   │   │   │   ├── 📁 wallet/
│   │   │   │   │   ├── 📄 en.json
│   │   │   │   │   └── 📄 zh.json
│   │   │   │   ├── 📁 trading/
│   │   │   │   │   ├── 📄 en.json
│   │   │   │   │   └── 📄 zh.json
│   │   │   │   └── 📁 bridge/
│   │   │   │       ├── 📄 en.json
│   │   │   │       └── 📄 zh.json
│   │   │   └── 📄 index.ts
│   │   │
│   │   ├── 📁 hooks/                   # i18n Hooks
│   │   │   ├── 📄 useTranslation.ts
│   │   │   └── 📄 useLocale.ts
│   │   │
│   │   ├── 📁 utils/                   # i18n 工具
│   │   │   ├── 📄 merge.ts            # 翻译合并
│   │   │   ├── 📄 format.ts           # 格式化
│   │   │   └── 📄 detect.ts           # 语言检测
│   │   │
│   │   ├── 📁 config/
│   │   │   ├── 📄 locales.ts          # 语言配置
│   │   │   └── 📄 next-intl.ts        # next-intl 配置
│   │   │
│   │   └── 📄 index.ts
│   │
│   ├── 📁 wallet/                      # 钱包管理包 ⭐
│   │   ├── 📄 package.json
│   │   │
│   │   ├── 📁 store/                   # 钱包状态
│   │   │   ├── 📄 wallet-store.ts     # Zustand Store
│   │   │   └── 📄 wallet-persist.ts
│   │   │
│   │   ├── 📁 hooks/                   # 钱包 Hooks
│   │   │   ├── 📄 useWallet.ts        # 钱包连接
│   │   │   ├── 📄 useBalance.ts       # 余额查询
│   │   │   └── 📄 useNetwork.ts       # 网络切换
│   │   │
│   │   ├── 📁 services/                # 钱包服务
│   │   │   ├── 📄 metamask.ts
│   │   │   ├── 📄 walletconnect.ts
│   │   │   └── 📄 keplr.ts
│   │   │
│   │   ├── 📁 types/
│   │   │   └── 📄 wallet.ts
│   │   │
│   │   └── 📄 index.ts
│   │
│   ├── 📁 auth/                        # 认证管理包 ⭐
│   │   ├── 📄 package.json
│   │   │
│   │   ├── 📁 store/                   # 认证状态
│   │   │   ├── 📄 auth-store.ts       # Zustand Store
│   │   │   └── 📄 session-store.ts
│   │   │
│   │   ├── 📁 hooks/                   # 认证 Hooks
│   │   │   ├── 📄 useAuth.ts          # 认证状态
│   │   │   ├── 📄 useSession.ts       # 会话管理
│   │   │   └── 📄 useUser.ts          # 用户信息
│   │   │
│   │   ├── 📁 services/                # 认证服务
│   │   │   ├── 📄 auth.ts
│   │   │   └── 📄 session.ts
│   │   │
│   │   └── 📄 index.ts
│   │
│   └── 📁 config/                      # 配置包
│       ├── 📄 package.json
│       ├── 📄 eslint-config.js         # 共享 ESLint 配置
│       ├── 📄 prettier-config.js       # 共享 Prettier 配置
│       ├── 📄 tsconfig.base.json       # 共享 TS 配置
│       └── 📄 tailwind-config.js       # 共享 Tailwind 配置
│
├── 📁 scripts/                         # 构建和部署脚本
│   ├── 📄 check-should-deploy.js       # 部署检查
│   ├── 📄 build-all.sh                 # 构建所有应用
│   ├── 📄 deploy.sh                    # 部署脚本
│   └── 📄 setup-env.sh                 # 环境配置
│
├── 📁 docs/                            # 文档
│   ├── 📄 README.md
│   └── 📁 bridge/                      # 桥接文档
│       ├── 📄 README.md
│       ├── 📄 ARCHITECTURE.md
│       └── ...
│
├── 📁 .github/                         # GitHub 配置
│   ├── 📁 workflows/                   # CI/CD
│   │   ├── 📄 deploy-bridge.yml
│   │   ├── 📄 deploy-dex.yml
│   │   ├── 📄 deploy-helix.yml
│   │   └── 📄 test.yml
│   └── 📄 CODEOWNERS                   # 代码所有者
│
├── 📁 nginx/                           # Nginx 配置（自建服务器）
│   ├── 📄 nginx.conf
│   └── 📁 conf.d/
│       ├── 📄 bridge.conf
│       ├── 📄 dex.conf
│       └── 📄 helix.conf
│
└── 📁 vendor/                          # 本地化的依赖
    └── 📁 injective/
        ├── 📁 sdk-ts/
        └── 📁 core-proto-ts/
```

---

## 🎯 核心模块说明

### 1. 应用层（apps/）

#### Bridge 应用
```
功能：跨链桥接
端口：3001
域名：bridge.biya.com
状态：
  - bridge-store.ts         # 桥接交易状态（独立）
  - transaction-history.ts  # 交易历史（独立）
  - 使用 @biya/wallet       # 钱包（共享）
  - 使用 @biya/theme        # 主题（共享）
```

#### DEX 应用
```
功能：去中心化交易所
端口：3002
域名：dex.biya.com
状态：
  - orderbook-store.ts      # 订单簿（独立）
  - trading-store.ts        # 交易状态（独立）
  - market-store.ts         # 市场数据（独立）
  - 使用 @biya/wallet       # 钱包（共享）
  - 使用 @biya/theme        # 主题（共享）
```

#### Helix 应用
```
功能：主站门户
端口：3003
域名：biya.com
状态：
  - 主要使用共享状态
  - 使用 @biya/auth         # 认证（共享）
  - 使用 @biya/theme        # 主题（共享）
```

---

### 2. 共享包层（packages/）

#### @biya/shared - 基础共享包 ⭐
```typescript
// 导出结构
export { Button, Input, Card } from './components/ui'
export { Header, Footer } from './components/layout'
export { useDebounce, useMediaQuery } from './hooks'
export { cn, formatNumber, formatDate } from './utils'
export * from './types'

// 使用示例
import { Button, useDebounce, cn } from '@biya/shared'
```

#### @biya/theme - 主题管理包 ⭐
```typescript
// store/theme-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'light' | 'dark' | 'system'
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,
      toggleTheme: () => {
        const current = get().theme
        set({ theme: current === 'light' ? 'dark' : 'light' })
      },
      setTheme: (theme) => set({ theme })
    }),
    { name: 'biya-theme' }
  )
)

// 使用示例
import { useTheme, ThemeToggle } from '@biya/theme'

const { theme, isDark, toggleTheme } = useTheme()
```

#### @biya/i18n - 国际化包 ⭐
```typescript
// 翻译合并策略
import { mergeTranslations } from '@biya/i18n'

// 应用中使用
const messages = mergeTranslations('en', [
  'common',        // 通用翻译
  'wallet',        // 钱包领域
  'bridge'         // Bridge 应用特定
])

// 使用示例
import { useTranslation } from '@biya/i18n'

const { t } = useTranslation()
t('common.button.submit')
t('wallet.connect')
t('bridge.transfer')
```

#### @biya/wallet - 钱包管理包 ⭐
```typescript
// store/wallet-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WalletStore {
  address: string | null
  chainId: number | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

export const useWallet = create<WalletStore>()(
  persist(
    (set) => ({
      address: null,
      chainId: null,
      isConnected: false,
      connect: async () => {
        // 连接逻辑
      },
      disconnect: () => {
        set({ address: null, chainId: null, isConnected: false })
      }
    }),
    { name: 'biya-wallet' }
  )
)

// 使用示例
import { useWallet, WalletButton } from '@biya/wallet'

const { address, isConnected, connect } = useWallet()
```

#### @biya/auth - 认证管理包 ⭐
```typescript
// store/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        // 登录逻辑
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    { name: 'biya-auth' }
  )
)

// 使用示例
import { useAuth } from '@biya/auth'

const { user, isAuthenticated, logout } = useAuth()
```

---

## 🛠️ 技术栈

### 前端框架
- **Next.js 15** - App Router
- **React 19** - UI 库
- **TypeScript 5** - 类型系统
- **Tailwind CSS 4** - 样式

### 状态管理
- **Zustand** - 轻量级状态管理
  - 共享状态：wallet, auth, theme
  - 应用状态：bridge, dex, market

### 国际化
- **next-intl** - Next.js i18n
- **分层架构**：common → domain → app

### 包管理
- **npm workspaces** 或 **pnpm** - Monorepo
- **workspace:** 协议 - 本地包引用

### 部署
- **Vercel** - 推荐（自动部署）
- **Docker** - 自建服务器
- **PM2** - 进程管理

---

## 📝 核心配置文件

### 1. 根目录 package.json

```json
{
  "name": "biya-coin",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "dev:bridge": "npm run dev --workspace=apps/bridge",
    "dev:dex": "npm run dev --workspace=apps/dex",
    "dev:helix": "npm run dev --workspace=apps/helix",
    "build": "npm run build --workspaces --if-present",
    "build:bridge": "npm run build --workspace=apps/bridge",
    "build:dex": "npm run build --workspace=apps/dex",
    "build:helix": "npm run build --workspace=apps/helix",
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "clean": "rm -rf node_modules apps/*/node_modules packages/*/node_modules"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

### 2. apps/bridge/package.json

```json
{
  "name": "@biya/bridge",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.5.4",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "next-intl": "^4.4.0",
    
    "@biya/shared": "workspace:*",
    "@biya/theme": "workspace:*",
    "@biya/i18n": "workspace:*",
    "@biya/wallet": "workspace:*",
    "@biya/auth": "workspace:*",
    
    "@injectivelabs/sdk-ts": "1.16.7",
    "@injectivelabs/wallet-strategy": "1.16.7",
    "@0xsquid/sdk": "^2.10.2",
    "@axelar-network/axelarjs-sdk": "^0.17.9",
    "wagmi": "^2.19.1",
    "viem": "^2.38.5",
    "ethers": "^6.15.0",
    "zustand": "^5.0.8",
    "react-hook-form": "^7.65.0",
    "lucide-react": "^0.548.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "typescript": "^5",
    "tailwindcss": "^4"
  }
}
```

---

### 3. packages/theme/package.json

```json
{
  "name": "@biya/theme",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./store": "./store/theme-store.ts",
    "./hooks": "./hooks/index.ts",
    "./components": "./components/index.ts"
  },
  "dependencies": {
    "zustand": "^5.0.8",
    "react": "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^19"
  }
}
```

---

### 4. packages/i18n/package.json

```json
{
  "name": "@biya/i18n",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./locales": "./locales/index.ts",
    "./hooks": "./hooks/index.ts",
    "./utils": "./utils/index.ts"
  },
  "dependencies": {
    "next-intl": "^4.4.0"
  }
}
```

---

### 5. packages/shared/package.json

```json
{
  "name": "@biya/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./components": "./components/index.ts",
    "./hooks": "./hooks/index.ts",
    "./utils": "./utils/index.ts",
    "./types": "./types/index.ts"
  },
  "dependencies": {
    "react": "^19.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1",
    "lucide-react": "^0.548.0"
  }
}
```

---

## 🚀 实施步骤

### 阶段 1: 目录结构调整（1-2 天）

```bash
# 1. 创建新的目录结构
cd D:\rwa\biya-coin

# 创建 apps 目录
mkdir -p apps/{bridge,dex,helix}

# 创建 packages 目录
mkdir -p packages/{shared,theme,i18n,wallet,auth,config}

# 2. 迁移 biya-helix-app 到 apps/helix
mv biya-helix-app/* apps/helix/

# 3. 配置 workspaces
# 编辑根 package.json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}

# 4. 清理并重新安装
Remove-Item -Recurse -Force node_modules
npm install
```

---

### 阶段 2: 创建共享包（2-3 天）

#### 2.1 创建 @biya/theme

```bash
cd packages/theme

# 创建目录
mkdir -p store hooks components config types

# 创建核心文件
```

**store/theme-store.ts**:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ThemeStore {
  theme: 'light' | 'dark' | 'system'
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,
      toggleTheme: () => {
        const current = get().theme
        const newTheme = current === 'light' ? 'dark' : 'light'
        set({ theme: newTheme, isDark: newTheme === 'dark' })
      },
      setTheme: (theme) => {
        const isDark = theme === 'dark' || 
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        set({ theme, isDark })
      }
    }),
    { name: 'biya-theme' }
  )
)
```

**components/ThemeProvider.tsx**:
```typescript
'use client'

import { useEffect } from 'react'
import { useTheme } from '../store/theme-store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, isDark, setTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => setTheme('system')
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, setTheme])

  return <>{children}</>
}
```

**components/ThemeToggle.tsx**:
```typescript
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../store/theme-store'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
```

**index.ts**:
```typescript
export { useTheme } from './store/theme-store'
export { ThemeProvider } from './components/ThemeProvider'
export { ThemeToggle } from './components/ThemeToggle'
export { ThemeScript } from './components/ThemeScript'
```

---

#### 2.2 创建 @biya/i18n

```bash
cd packages/i18n

# 创建目录
mkdir -p locales/{common,domain} hooks utils config
```

**locales/common/en.json**:
```json
{
  "common": {
    "button": {
      "submit": "Submit",
      "cancel": "Cancel",
      "confirm": "Confirm"
    },
    "language": {
      "en": "English",
      "zh": "中文",
      "ja": "日本語",
      "ko": "한국어"
    }
  }
}
```

**locales/domain/wallet/en.json**:
```json
{
  "wallet": {
    "connect": "Connect Wallet",
    "disconnect": "Disconnect",
    "connected": "Connected",
    "balance": "Balance"
  }
}
```

**utils/merge.ts**:
```typescript
export function mergeTranslations(
  locale: string,
  layers: string[]
): Record<string, any> {
  const merged = {}
  
  for (const layer of layers) {
    const translations = require(`../locales/${layer}/${locale}.json`)
    Object.assign(merged, translations)
  }
  
  return merged
}
```

**index.ts**:
```typescript
export { mergeTranslations } from './utils/merge'
export * from './hooks'
export * from './config'
```

---

#### 2.3 创建 @biya/wallet

```bash
cd packages/wallet

# 创建目录
mkdir -p store hooks services types
```

**store/wallet-store.ts**:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WalletStore {
  address: string | null
  chainId: number | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

export const useWallet = create<WalletStore>()(
  persist(
    (set) => ({
      address: null,
      chainId: null,
      isConnected: false,
      connect: async () => {
        // 钱包连接逻辑
        try {
          // ... 实现
          set({ isConnected: true })
        } catch (error) {
          console.error('Failed to connect wallet:', error)
        }
      },
      disconnect: () => {
        set({ address: null, chainId: null, isConnected: false })
      }
    }),
    { name: 'biya-wallet' }
  )
)
```

---

### 阶段 3: 应用集成（3-4 天）

#### 3.1 更新 Bridge 应用

**apps/bridge/app/[locale]/layout.tsx**:
```typescript
import { ThemeProvider } from '@biya/theme'
import { BridgeProviders } from '@/context/bridge/BridgeProviders'

export default function LocaleLayout({ children, params }) {
  return (
    <html lang={params.locale}>
      <body>
        <ThemeProvider>
          <BridgeProviders>
            {children}
          </BridgeProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**使用共享组件**:
```typescript
import { Button } from '@biya/shared/components'
import { ThemeToggle } from '@biya/theme'
import { useWallet } from '@biya/wallet'
import { useTranslation } from '@biya/i18n'

export function BridgeHeader() {
  const { isConnected, connect } = useWallet()
  const { t } = useTranslation()

  return (
    <header>
      <ThemeToggle />
      <Button onClick={connect}>
        {t('wallet.connect')}
      </Button>
    </header>
  )
}
```

---

### 阶段 4: 测试和部署（2-3 天）

```bash
# 1. 本地测试
npm run dev:bridge
npm run dev:dex
npm run dev:helix

# 2. 构建测试
npm run build:bridge
npm run build:dex
npm run build:helix

# 3. 部署（Vercel）
# 创建 3 个 Vercel 项目
# - biya-bridge (Root: apps/bridge)
# - biya-dex (Root: apps/dex)
# - biya-helix (Root: apps/helix)
```

---

## 📖 相关文档

- [Monorepo 依赖管理](./MONOREPO_DEPENDENCIES.md)
- [主题管理](./THEME_MANAGEMENT.md)
- [国际化方案](./I18N_IN_MONOREPO.md)
- [状态管理策略](./STATE_MANAGEMENT_STRATEGY.md)
- [共享功能](./SHARED_FEATURES_IN_MONOREPO.md)
- [独立部署](./MONOREPO_INDEPENDENT_DEPLOYMENT.md)

---

*最后更新: 2025-10-30*

