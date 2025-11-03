# ❓ FAQ 与最佳实践

> **核心内容**: 常见问题解答和开发最佳实践  
> **目标**: 解决开发中的常见问题，提高开发效率  
> **更新时间**: 2025-10-31

---

## 📖 目录

1. [常见问题 FAQ](#常见问题-faq)
2. [开发最佳实践](#开发最佳实践)
3. [性能优化技巧](#性能优化技巧)
4. [调试和排错](#调试和排错)
5. [团队协作](#团队协作)

---

## 🤔 常见问题 FAQ

### Q1: 如何添加新的共享组件？

**A**: 在 `packages/shared/components` 中添加，然后导出。

```typescript
// 1. 创建组件
// packages/shared/components/ui/NewComponent.tsx
export function NewComponent() {
  return <div>New Component</div>
}

// 2. 在 index.ts 中导出
// packages/shared/components/ui/index.ts
export * from './NewComponent'

// 3. 在应用中使用
import { NewComponent } from '@biya/shared'
```

---

### Q2: 如何在应用间共享状态？

**A**: 使用共享包中的 Zustand Store。

```typescript
// 1. 在共享包中创建 Store
// packages/wallet/store/wallet-store.ts
export const useWalletStore = create<WalletState>()(/* ... */)

// 2. 在多个应用中使用同一个 Store
// apps/helix/components/Header.tsx
import { useWalletStore } from '@biya/wallet'

// apps/bridge/components/WalletButton.tsx
import { useWalletStore } from '@biya/wallet'

// 状态会自动同步（如果两个应用在同一个浏览器标签组中）
```

---

### Q3: 如何处理不同应用的特定依赖？

**A**: 在各自的 `package.json` 中添加。

```json
// apps/bridge/package.json
{
  "dependencies": {
    "@biya/shared": "*",           // 共享包
    "@injectivelabs/sdk-ts": "1.16.7",  // Bridge 特定依赖
    "wagmi": "^2.19.1"                   // Bridge 特定依赖
  }
}

// apps/dex/package.json
{
  "dependencies": {
    "@biya/shared": "*",           // 共享包
    "@0x/contract-wrappers": "^13.0.0",  // DEX 特定依赖
    "web3": "^4.0.0"                     // DEX 特定依赖
  }
}
```

---

### Q4: 如何更新共享包的代码？

**A**: 直接修改，应用会自动重新加载（开发模式）。

```bash
# 修改共享包代码
# packages/shared/components/ui/Button.tsx

# 应用会自动热重载，无需重启
# 如果没有自动重载，尝试重启开发服务器
npm run dev:helix
```

---

### Q5: TypeScript 找不到共享包的类型？

**A**: 检查 `tsconfig.json` 中的 `paths` 配置。

```json
// apps/helix/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@biya/shared": ["../../packages/shared"],
      "@biya/shared/*": ["../../packages/shared/*"]
    }
  }
}
```

**如果还是不行，尝试**:
```bash
# 删除 .next 和 node_modules
rm -rf .next node_modules

# 重新安装
npm install

# 重启 TypeScript 服务器（VS Code）
Ctrl+Shift+P → TypeScript: Restart TS Server
```

---

### Q6: 如何处理循环依赖？

**A**: 避免共享包之间的相互依赖。

```
❌ 不好：循环依赖
@biya/shared → @biya/theme
@biya/theme → @biya/shared

✅ 好：单向依赖
@biya/shared ← @biya/theme
@biya/shared ← @biya/wallet
@biya/shared ← @biya/auth
```

**如果必须共享**:
- 将共同依赖提取到 `@biya/shared`
- 或者使用事件系统解耦

---

### Q7: 如何在本地测试生产构建？

**A**: 使用 `build` 和 `start` 命令。

```bash
# 构建应用
npm run build:helix

# 启动生产服务器
npm run start:helix

# 访问 http://localhost:3000
```

---

### Q8: 如何调试共享包代码？

**A**: 使用 Source Maps 和断点。

```typescript
// packages/shared/components/ui/Button.tsx
export function Button() {
  debugger  // 断点会在这里停止
  console.log('Button rendered')
  return <button>Click me</button>
}
```

**在 VS Code 中**:
1. 在共享包代码中设置断点
2. 使用 "Run and Debug" → "Next.js: debug full stack"
3. 断点会正常工作

---

### Q9: Workspace 依赖更新问题？

**A**: 使用正确的更新命令。

```bash
# npm workspaces
npm install <package> --workspace=apps/helix
npm install <package> --workspace=packages/shared

# 更新所有 workspaces
npm update --workspaces

# pnpm
pnpm add <package> --filter @biya/helix
pnpm add <package> --filter @biya/shared
```

---

### Q10: 如何处理不同应用的环境变量？

**A**: 在各自目录下创建 `.env.local`。

```
apps/helix/.env.local
apps/bridge/.env.local
apps/dex/.env.local

# 每个应用有独立的环境变量
```

---

## ✅ 开发最佳实践

### 1. 项目结构

```
✅ 好的结构
packages/
├── shared/        # 通用组件、工具
├── theme/         # 主题管理
├── i18n/          # 国际化
├── wallet/        # 钱包管理
└── auth/          # 认证管理

❌ 不好的结构
packages/
├── core/          # 太宽泛
└── utils/         # 所有工具混在一起
```

---

### 2. 命名约定

```typescript
// ✅ 组件：PascalCase
export function Button() {}
export const UserProfile = () => {}

// ✅ 文件名：与组件名一致
Button.tsx
UserProfile.tsx

// ✅ Hooks：useXxx
export function useDebounce() {}
export function useWallet() {}

// ✅ 工具函数：camelCase
export function formatCurrency() {}
export function validateEmail() {}

// ✅ 常量：UPPER_SNAKE_CASE
export const MAX_LENGTH = 100
export const API_URL = 'https://api.example.com'

// ✅ 类型/接口：PascalCase
export interface User {}
export type Theme = 'light' | 'dark'
```

---

### 3. 导入顺序

```typescript
// ✅ 推荐的导入顺序
// 1. React/Next.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. 第三方库
import { create } from 'zustand'
import { clsx } from 'clsx'

// 3. 共享包（按字母顺序）
import { Button, Card } from '@biya/shared'
import { useAuthStore } from '@biya/auth'
import { useThemeStore } from '@biya/theme'
import { useWalletStore } from '@biya/wallet'

// 4. 本地导入（按层级）
import { Header } from '@/components/layout/Header'
import { formatCurrency } from '@/lib/utils'
import type { User } from '@/types/user'

// 5. 样式
import './styles.css'
```

---

### 4. 组件设计

```typescript
// ✅ 好的组件设计
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  isLoading,
  onClick,
  children 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        'button',
        `button-${variant}`,
        `button-${size}`
      )}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}

// ❌ 不好的设计
export function Button(props: any) {
  return <button {...props} />
}
```

---

### 5. 状态管理

```typescript
// ✅ 使用选择器优化性能
const address = useWalletStore((state) => state.address)

// ❌ 避免：订阅整个 Store
const walletStore = useWalletStore()

// ✅ 组合多个状态时使用 shallow
import { shallow } from 'zustand/shallow'

const { address, balance } = useWalletStore(
  (state) => ({
    address: state.address,
    balance: state.balance,
  }),
  shallow
)
```

---

### 6. 类型安全

```typescript
// ✅ 定义明确的类型
interface User {
  id: string
  email: string
  name: string
}

function getUser(): User {
  return { id: '1', email: 'user@example.com', name: 'User' }
}

// ❌ 避免使用 any
function getUser(): any {
  return { id: '1', email: 'user@example.com', name: 'User' }
}

// ✅ 使用泛型
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json())
}

const user = await fetchData<User>('/api/user')
```

---

### 7. 错误处理

```typescript
// ✅ 完整的错误处理
async function fetchUser() {
  try {
    const response = await fetch('/api/user')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch user:', error)
    // 上报错误到监控系统
    reportError(error)
    throw error
  }
}

// ❌ 忽略错误
async function fetchUser() {
  const response = await fetch('/api/user')
  return await response.json()
}
```

---

### 8. 性能优化

```typescript
// ✅ 使用 React.memo 优化组件
export const UserCard = React.memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>
})

// ✅ 使用 useCallback 缓存函数
const handleClick = useCallback(() => {
  console.log('Clicked')
}, [])

// ✅ 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// ✅ 动态导入大组件
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
})
```

---

## ⚡ 性能优化技巧

### 1. Bundle 大小优化

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@biya/shared',
      'lucide-react',
      'date-fns',
    ],
  },
}

// ✅ 按需导入
import { Button } from '@biya/shared'
import { Calendar } from 'lucide-react'

// ❌ 避免：导入整个库
import * as Shared from '@biya/shared'
import * as Icons from 'lucide-react'
```

---

### 2. 图片优化

```typescript
// ✅ 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority  // 首屏图片
/>

// ✅ 使用 WebP/AVIF 格式
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
}
```

---

### 3. 代码分割

```typescript
// ✅ 路由级别的代码分割（自动）
// app/about/page.tsx
// 自动分割成单独的 chunk

// ✅ 组件级别的动态导入
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false,  // 仅客户端渲染
})

// ✅ 条件导入
if (isAdmin) {
  const AdminPanel = (await import('./AdminPanel')).default
  return <AdminPanel />
}
```

---

### 4. 缓存策略

```typescript
// ✅ 使用 Next.js 缓存
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ id: post.id }))
}

export const revalidate = 3600  // ISR: 1小时重新验证

// ✅ React Query 缓存
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: () => fetchUser(id),
  staleTime: 5 * 60 * 1000,  // 5分钟
  cacheTime: 30 * 60 * 1000,  // 30分钟
})
```

---

## 🐛 调试和排错

### 1. 常见错误和解决方案

#### 错误 1: Module not found

```
Error: Module not found: Can't resolve '@biya/shared'
```

**解决方案**:
```bash
# 1. 检查 tsconfig.json paths
# 2. 重新安装依赖
npm install
# 3. 重启开发服务器
npm run dev
```

---

#### 错误 2: Hydration 错误

```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**解决方案**:
```typescript
// ✅ 使用 suppressHydrationWarning
<html suppressHydrationWarning>

// ✅ 或者使用客户端组件
'use client'

// ✅ 或者使用 useEffect
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

---

#### 错误 3: 共享包更新不生效

**解决方案**:
```bash
# 1. 清理构建缓存
npm run clean:build

# 2. 重启开发服务器
npm run dev:helix

# 3. 如果还不行，清理 node_modules
npm run clean
npm install
```

---

### 2. 调试技巧

#### VS Code 断点调试

**launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

---

#### React DevTools

```bash
# 安装 React DevTools 浏览器扩展
# Chrome/Edge: React Developer Tools
# Firefox: React DevTools

# 在 Components 标签中：
# - 查看组件树
# - 检查 props 和 state
# - 查看 Hooks
```

---

#### Zustand DevTools

```typescript
import { devtools } from 'zustand/middleware'

export const useWalletStore = create<WalletState>()(
  devtools(
    (set) => ({ /* ... */ }),
    { name: 'WalletStore' }
  )
)

// 使用 Redux DevTools Extension 查看状态变化
```

---

## 👥 团队协作

### 1. Git 工作流

```bash
# 功能开发
git checkout -b feature/wallet-integration
# 开发...
git add .
git commit -m "feat(wallet): add wallet connection"
git push origin feature/wallet-integration
# 创建 Pull Request

# Bug 修复
git checkout -b fix/button-styling
# 修复...
git commit -m "fix(shared): button hover state"

# Commit 规范
feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建/工具
```

---

### 2. Code Review 清单

**提交代码前检查**:
- [ ] 代码符合项目规范
- [ ] 类型定义完整
- [ ] 添加必要的注释
- [ ] 删除 console.log 和 debugger
- [ ] 运行 lint 和 type-check
- [ ] 测试通过
- [ ] 更新相关文档

**Review 代码时关注**:
- [ ] 逻辑正确性
- [ ] 性能问题
- [ ] 安全问题
- [ ] 代码可读性
- [ ] 是否有更好的实现方式

---

### 3. 文档规范

```typescript
/**
 * 格式化货币金额
 * 
 * @param value - 数字或字符串形式的金额
 * @param currency - 货币代码（默认 'USD'）
 * @returns 格式化后的货币字符串
 * 
 * @example
 * ```ts
 * formatCurrency(1234.56)  // "$1,234.56"
 * formatCurrency(1234.56, 'EUR')  // "€1,234.56"
 * ```
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'USD'
): string {
  // ...
}
```

---

### 4. 版本管理

```json
// 使用语义化版本
{
  "version": "1.2.3"
  //         │ │ └─ Patch: 向后兼容的 bug 修复
  //         │ └─── Minor: 向后兼容的新功能
  //         └───── Major: 不兼容的 API 变更
}

// package.json 依赖版本
{
  "dependencies": {
    "react": "19.1.0",        // 固定版本
    "next": "^15.5.4",        // 兼容 Minor/Patch 更新
    "@biya/shared": "*"       // Workspace 内部依赖
  }
}
```

---

## 📚 资源链接

### 官方文档
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Zustand](https://zustand-bear.github.io/zustand/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app/)

### 工具
- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [pnpm](https://pnpm.io/)
- [Vercel](https://vercel.com/docs)
- [VS Code](https://code.visualstudio.com/docs)

### 社区
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

---

## 🎉 结语

恭喜你完成了整个 Monorepo 实施指南！

### 你已经学到了

✅ Monorepo 架构设计和原理  
✅ 技术栈选型（Next.js + Zustand + next-intl）  
✅ 共享包设计和实现  
✅ 状态管理策略  
✅ 完整的迁移步骤  
✅ 部署和 CI/CD 配置  
✅ 最佳实践和常见问题

### 下一步建议

1. **立即行动**: 按照 06-实施步骤.md 开始迁移
2. **小步前进**: 一个阶段一个阶段地完成
3. **充分测试**: 每个阶段都要验证功能
4. **持续优化**: 迁移完成后继续改进

### 需要帮助？

如果遇到问题：
1. 查看本文档的 FAQ 部分
2. 检查 TypeScript 和 lint 错误
3. 查阅官方文档
4. 在团队内部讨论

---

**祝你迁移顺利！🚀**

---

*最后更新: 2025-10-31*

