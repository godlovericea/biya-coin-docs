# 🔗 Monorepo 共享功能解决方案

> **适用于**: Biya Monorepo (helix + bridge + dex)  
> **场景**: 钱包连接、登录退出、用户信息等基础功能  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [核心思想](#核心思想)
2. [架构设计](#架构设计)
3. [共享功能清单](#共享功能清单)
4. [实施方案](#实施方案)
5. [使用示例](#使用示例)
6. [最佳实践](#最佳实践)

---

## 💡 核心思想

### 问题分析

在多个应用中，这些功能会重复出现：

```
❌ 当前状态（重复代码）

apps/helix/
  ├── components/WalletConnectButton.tsx    // 重复
  ├── hooks/useWallet.ts                    // 重复
  └── context/WalletContext.tsx             // 重复

apps/bridge/
  ├── components/WalletConnectButton.tsx    // 重复
  ├── hooks/useWallet.ts                    // 重复
  └── context/WalletContext.tsx             // 重复

apps/dex/
  ├── components/WalletConnectButton.tsx    // 重复
  ├── hooks/useWallet.ts                    // 重复
  └── context/WalletContext.tsx             // 重复
```

**问题**：
- 🔴 代码重复
- 🔴 维护困难（修改一处需要同步三处）
- 🔴 行为不一致（可能实现略有差异）
- 🔴 Bundle 体积增大

### 解决方案

**创建共享包** → 所有应用引用同一份代码

```
✅ Monorepo 方案

packages/shared/
  ├── components/
  │   ├── WalletConnectButton.tsx    // 共享组件
  │   └── UserProfile.tsx
  ├── hooks/
  │   ├── useWallet.ts               // 共享 Hook
  │   └── useAuth.ts
  └── context/
      ├── WalletProvider.tsx         // 共享 Context
      └── AuthProvider.tsx

apps/helix/     → 使用 @biya/shared
apps/bridge/    → 使用 @biya/shared
apps/dex/       → 使用 @biya/shared
```

---

## 🏗️ 架构设计

### 分层架构

```
┌──────────────────────────────────────────────────┐
│  应用层 (Apps)                                    │
│  - helix                                         │
│  - bridge                                        │
│  - dex                                           │
└──────────────────────────────────────────────────┘
                    ↓ 使用
┌──────────────────────────────────────────────────┐
│  业务共享层 (Business Shared)                     │
│  packages/shared/                                │
│  - 钱包连接                                       │
│  - 用户认证                                       │
│  - 通用组件                                       │
└──────────────────────────────────────────────────┘
                    ↓ 使用
┌──────────────────────────────────────────────────┐
│  UI 基础层 (UI Foundation)                        │
│  packages/ui/                                    │
│  - Button, Input, Card                          │
│  - 设计系统                                       │
└──────────────────────────────────────────────────┘
                    ↓ 使用
┌──────────────────────────────────────────────────┐
│  工具层 (Utils)                                   │
│  packages/utils/                                 │
│  - 格式化函数                                     │
│  - 常量定义                                       │
└──────────────────────────────────────────────────┘
```

### 包组织策略

```
packages/
├── ui/              # UI 基础组件
│   ├── Button
│   ├── Input
│   ├── Card
│   └── Modal
│
├── shared/          # 业务共享功能
│   ├── wallet/      # 钱包相关
│   ├── auth/        # 认证相关
│   ├── components/  # 业务组件
│   └── hooks/       # 业务 Hooks
│
├── utils/           # 工具函数
│   ├── format/
│   ├── validation/
│   └── constants/
│
├── types/           # 类型定义
│   └── shared.d.ts
│
└── i18n/            # 多语言
    └── messages/
```

---

## 📋 共享功能清单

### 1. 钱包功能

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 钱包连接 | Keplr、MetaMask 等 | 🔴 高 |
| 钱包断开 | 断开连接、清理状态 | 🔴 高 |
| 地址显示 | 格式化地址显示 | 🟡 中 |
| 余额查询 | 多链余额查询 | 🟡 中 |
| 网络切换 | 切换不同区块链 | 🟡 中 |
| 签名交易 | 通用签名接口 | 🔴 高 |

### 2. 认证功能

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 登录 | 用户登录 | 🔴 高 |
| 退出 | 用户退出 | 🔴 高 |
| 用户信息 | 获取用户资料 | 🟡 中 |
| 权限检查 | 路由权限验证 | 🟢 低 |
| Token 管理 | JWT Token 处理 | 🔴 高 |

### 3. UI 组件

| 组件 | 说明 | 优先级 |
|------|------|--------|
| Button | 按钮 | 🔴 高 |
| Input | 输入框 | 🔴 高 |
| Modal | 弹窗 | 🟡 中 |
| Toast | 提示消息 | 🟡 中 |
| Loading | 加载状态 | 🟡 中 |
| Card | 卡片 | 🟢 低 |

### 4. 工具函数

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 地址格式化 | `0x1234...5678` | 🔴 高 |
| 金额格式化 | 数字千分位 | 🔴 高 |
| 日期格式化 | 日期显示 | 🟡 中 |
| 复制到剪贴板 | 一键复制 | 🟡 中 |

---

## 🚀 实施方案

### 步骤 1: 创建共享包结构

#### 1.1 创建目录

```bash
cd D:\rwa\biya-coin

# 创建共享包
mkdir -p packages\shared\wallet
mkdir -p packages\shared\auth
mkdir -p packages\shared\components
mkdir -p packages\shared\hooks
mkdir -p packages\shared\utils

# 创建 UI 包
mkdir -p packages\ui\components
mkdir -p packages\ui\styles
```

#### 1.2 创建 `packages/shared/package.json`

```json
{
  "name": "@biya/shared",
  "version": "0.1.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./wallet": "./wallet/index.ts",
    "./auth": "./auth/index.ts",
    "./components": "./components/index.ts",
    "./hooks": "./hooks/index.ts",
    "./utils": "./utils/index.ts"
  },
  "dependencies": {
    "@injectivelabs/wallet-strategy": "1.16.7",
    "wagmi": "^2.19.1",
    "viem": "^2.38.5",
    "zustand": "^5.0.8"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0"
  }
}
```

---

### 步骤 2: 实现钱包功能

#### 2.1 钱包 Store (`packages/shared/wallet/store.ts`)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WalletState {
  // 状态
  address: string | null
  injectiveAddress: string | null
  isConnected: boolean
  chainId: number | null
  
  // 操作
  setAddress: (address: string | null) => void
  setInjectiveAddress: (address: string | null) => void
  setConnected: (connected: boolean) => void
  setChainId: (chainId: number | null) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      // 初始状态
      address: null,
      injectiveAddress: null,
      isConnected: false,
      chainId: null,
      
      // 操作方法
      setAddress: (address) => set({ address }),
      setInjectiveAddress: (injectiveAddress) => set({ injectiveAddress }),
      setConnected: (isConnected) => set({ isConnected }),
      setChainId: (chainId) => set({ chainId }),
      
      disconnect: () => set({
        address: null,
        injectiveAddress: null,
        isConnected: false,
        chainId: null,
      }),
    }),
    {
      name: 'biya-wallet-storage', // localStorage key
      partialize: (state) => ({
        // 只持久化部分状态
        address: state.address,
        injectiveAddress: state.injectiveAddress,
      }),
    }
  )
)
```

#### 2.2 钱包 Hook (`packages/shared/wallet/useWallet.ts`)

```typescript
import { useWalletStore } from './store'
import { WalletStrategy } from '@injectivelabs/wallet-strategy'
import { useAccount as useWagmiAccount } from 'wagmi'

export function useWallet() {
  const store = useWalletStore()
  const { address: evmAddress } = useWagmiAccount()

  const connectKeplr = async () => {
    try {
      // Keplr 连接逻辑
      const walletStrategy = new WalletStrategy({
        chainId: 'injective-1',
      })
      
      await walletStrategy.connectWallet('keplr')
      const [injectiveAddress] = await walletStrategy.getAddresses()
      
      store.setInjectiveAddress(injectiveAddress)
      store.setConnected(true)
      
      return injectiveAddress
    } catch (error) {
      console.error('Failed to connect Keplr:', error)
      throw error
    }
  }

  const connectMetaMask = async () => {
    try {
      // MetaMask 通过 wagmi 自动处理
      if (evmAddress) {
        store.setAddress(evmAddress)
        store.setConnected(true)
        return evmAddress
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error)
      throw error
    }
  }

  const disconnect = async () => {
    store.disconnect()
    // 触发钱包断开
  }

  return {
    // 状态
    address: store.address,
    injectiveAddress: store.injectiveAddress,
    isConnected: store.isConnected,
    chainId: store.chainId,
    
    // 方法
    connectKeplr,
    connectMetaMask,
    disconnect,
  }
}
```

#### 2.3 钱包连接按钮 (`packages/shared/components/WalletConnectButton.tsx`)

```typescript
'use client'

import { useWallet } from '../wallet/useWallet'
import { Button } from '@biya/ui'
import { useState } from 'react'

interface WalletConnectButtonProps {
  type?: 'keplr' | 'metamask' | 'auto'
  onConnected?: (address: string) => void
  onError?: (error: Error) => void
}

export function WalletConnectButton({
  type = 'auto',
  onConnected,
  onError,
}: WalletConnectButtonProps) {
  const { isConnected, address, injectiveAddress, connectKeplr, connectMetaMask, disconnect } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      let connectedAddress: string
      
      if (type === 'keplr') {
        connectedAddress = await connectKeplr()
      } else if (type === 'metamask') {
        connectedAddress = await connectMetaMask()
      } else {
        // 自动检测
        connectedAddress = await connectKeplr()
      }
      
      onConnected?.(connectedAddress)
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
  }

  if (isConnected) {
    return (
      <Button onClick={handleDisconnect} variant="outline">
        {address || injectiveAddress}
        <span className="ml-2">✕</span>
      </Button>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}
```

---

### 步骤 3: 实现认证功能

#### 3.1 认证 Store (`packages/shared/auth/store.ts`)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  address: string
  email?: string
  username?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'biya-auth-storage',
    }
  )
)
```

#### 3.2 认证 Hook (`packages/shared/auth/useAuth.ts`)

```typescript
import { useAuthStore } from './store'
import { useRouter } from 'next/navigation'

interface LoginCredentials {
  address: string
  signature?: string
}

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    try {
      // 调用 API 登录
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const { user, token } = await response.json()
      store.login(user, token)
      
      return { user, token }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // 调用 API 退出
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${store.token}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      store.logout()
      router.push('/login')
    }
  }

  const checkAuth = () => {
    if (!store.isAuthenticated) {
      router.push('/login')
      return false
    }
    return true
  }

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    login,
    logout,
    checkAuth,
  }
}
```

---

### 步骤 4: 创建通用组件

#### 4.1 用户资料组件 (`packages/shared/components/UserProfile.tsx`)

```typescript
'use client'

import { useAuth } from '../auth/useAuth'
import { useWallet } from '../wallet/useWallet'
import { Button } from '@biya/ui'
import { formatAddress } from '../utils/format'

export function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth()
  const { address, injectiveAddress, disconnect } = useWallet()

  const handleLogout = async () => {
    await logout()
    await disconnect()
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      {/* 用户头像 */}
      {user?.avatar && (
        <img 
          src={user.avatar} 
          alt={user.username || 'User'} 
          className="w-10 h-10 rounded-full"
        />
      )}

      {/* 用户信息 */}
      <div>
        <div className="font-medium">
          {user?.username || formatAddress(address || injectiveAddress)}
        </div>
        <div className="text-sm text-gray-500">
          {formatAddress(address || injectiveAddress)}
        </div>
      </div>

      {/* 退出按钮 */}
      <Button onClick={handleLogout} variant="outline" size="sm">
        Logout
      </Button>
    </div>
  )
}
```

---

### 步骤 5: 工具函数

#### 5.1 格式化工具 (`packages/shared/utils/format.ts`)

```typescript
/**
 * 格式化地址
 * @example formatAddress('0x1234567890abcdef') // '0x1234...cdef'
 */
export function formatAddress(
  address: string | null | undefined,
  startLength = 6,
  endLength = 4
): string {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * 格式化金额
 * @example formatAmount(1234.56) // '1,234.56'
 */
export function formatAmount(
  amount: number | string,
  decimals = 2
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * 格式化 USD
 * @example formatUSD(1234.56) // '$1,234.56'
 */
export function formatUSD(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}
```

---

### 步骤 6: 在应用中使用

#### 6.1 Bridge 应用使用

**`apps/bridge/app/layout.tsx`**:
```typescript
import { WalletConnectButton, UserProfile } from '@biya/shared/components'
import '@biya/ui/styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1>Biya Bridge</h1>
            
            <div className="flex items-center gap-4">
              <UserProfile />
              <WalletConnectButton />
            </div>
          </div>
        </nav>
        
        <main>{children}</main>
      </body>
    </html>
  )
}
```

**`apps/bridge/components/MyComponent.tsx`**:
```typescript
'use client'

import { useWallet } from '@biya/shared/wallet'
import { useAuth } from '@biya/shared/auth'
import { formatAddress, formatUSD } from '@biya/shared/utils'
import { Button } from '@biya/ui'

export function MyComponent() {
  const { isConnected, address } = useWallet()
  const { isAuthenticated, user } = useAuth()

  return (
    <div>
      {isConnected && (
        <p>Connected: {formatAddress(address)}</p>
      )}
      
      {isAuthenticated && (
        <p>Welcome, {user?.username}!</p>
      )}
      
      <p>Balance: {formatUSD(1234.56)}</p>
    </div>
  )
}
```

---

## 📊 依赖关系图

```
apps/helix/
apps/bridge/     → @biya/shared    → @biya/ui
apps/dex/           (业务逻辑)        (UI组件)
                         ↓
                    @biya/utils
                    (工具函数)
```

---

## ✅ 最佳实践

### 1. 保持单一职责

```typescript
// ✅ 好的做法：每个包职责清晰
packages/shared/wallet/    // 只处理钱包
packages/shared/auth/      // 只处理认证
packages/ui/               // 只提供 UI 组件

// ❌ 不好的做法：混在一起
packages/shared/
  ├── wallet-and-auth.ts   // 职责不清
  └── everything.ts        // 什么都有
```

### 2. 使用 TypeScript

```typescript
// ✅ 导出类型
export interface User {
  id: string
  address: string
  username?: string
}

export function useAuth(): {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}
```

### 3. 提供默认配置

```typescript
// ✅ 提供合理的默认值
export function formatAddress(
  address: string,
  startLength = 6,    // 默认值
  endLength = 4       // 默认值
): string {
  // ...
}
```

### 4. 文档和示例

每个共享包应该有：
- README.md（说明和示例）
- 类型定义
- 单元测试

---

## 🎯 使用场景对比

### 场景 1: 钱包连接

**之前**（每个应用独立实现）:
```typescript
// apps/helix/components/Wallet.tsx
const Wallet = () => {
  const [address, setAddress] = useState(null)
  const connect = async () => { /* 实现 */ }
  // ... 50 行代码
}

// apps/bridge/components/Wallet.tsx
const Wallet = () => {
  const [address, setAddress] = useState(null)
  const connect = async () => { /* 实现 */ }
  // ... 50 行代码（重复！）
}
```

**现在**（使用共享包）:
```typescript
// 所有应用
import { WalletConnectButton } from '@biya/shared/components'

<WalletConnectButton 
  onConnected={(address) => console.log(address)}
/>
```

### 场景 2: 地址显示

**之前**:
```typescript
// 每个应用都要写
const formatAddr = (addr: string) => {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}
```

**现在**:
```typescript
import { formatAddress } from '@biya/shared/utils'

formatAddress('0x1234567890abcdef')
```

---

## 📦 Package.json 配置

### Root `package.json`

```json
{
  "name": "biya-monorepo",
  "scripts": {
    "dev:all": "pnpm -r --parallel dev",
    "build:shared": "pnpm --filter @biya/shared build",
    "build:ui": "pnpm --filter @biya/ui build"
  }
}
```

### 应用 `package.json`

```json
{
  "name": "bridge",
  "dependencies": {
    "@biya/shared": "workspace:*",
    "@biya/ui": "workspace:*",
    "@biya/utils": "workspace:*",
    "@biya/i18n": "workspace:*"
  }
}
```

---

## 🔄 更新流程

### 1. 修改共享包

```bash
# 修改共享代码
cd packages/shared
# 编辑文件...

# 测试（在使用的应用中测试）
cd ../../apps/bridge
pnpm dev
```

### 2. 发布更新

```bash
# 如果是内部包，不需要发布
# Monorepo 会自动链接最新代码
```

### 3. 版本管理

```bash
# 更新版本（可选）
cd packages/shared
npm version patch  # 0.1.0 → 0.1.1
```

---

## 🎯 总结

### 核心优势

✅ **代码复用**: 写一次，处处使用  
✅ **统一维护**: 修改一处，全部生效  
✅ **类型安全**: TypeScript 全面支持  
✅ **减小体积**: 避免重复代码  
✅ **提高效率**: 新应用快速集成  

### 包组织建议

```
packages/
├── ui/              # UI 基础组件（Button, Input）
├── shared/          # 业务共享（Wallet, Auth）
├── utils/           # 工具函数（format, validate）
├── types/           # 类型定义
└── i18n/            # 多语言
```

### 使用原则

1. **UI 组件** → `@biya/ui`
2. **业务逻辑** → `@biya/shared`
3. **工具函数** → `@biya/utils`
4. **类型定义** → `@biya/types`
5. **多语言** → `@biya/i18n`

---

## 📚 相关文档

- [独立部署方案](./BRIDGE_INDEPENDENT_DEPLOYMENT_PLAN.md)
- [多语言方案](./I18N_IN_MONOREPO.md)
- [快速开始](./QUICK_START.md)

---

*最后更新: 2025-10-30*

