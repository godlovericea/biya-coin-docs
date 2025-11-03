# 🔗 共享功能快速参考

> **5 分钟速查** | 完整文档：[SHARED_FEATURES_IN_MONOREPO.md](./SHARED_FEATURES_IN_MONOREPO.md)

---

## 🚀 快速开始

### 1. 运行自动化脚本

```powershell
cd D:\rwa\biya-coin
.\docs\bridge\setup-shared.ps1
pnpm install
```

### 2. 在应用中使用

```typescript
import { useWallet, useAuth, formatAddress } from '@biya/shared'

const { isConnected, address, connect } = useWallet()
const { user, login, logout } = useAuth()
const shortAddr = formatAddress(address)
```

---

## 📦 可用的共享功能

### 钱包功能 (`@biya/shared/wallet`)

```typescript
import { useWallet } from '@biya/shared/wallet'

const {
  address,              // EVM 地址
  injectiveAddress,     // Injective 地址
  isConnected,          // 是否连接
  connect,              // 连接钱包
  disconnect            // 断开连接
} = useWallet()
```

### 认证功能 (`@biya/shared/auth`)

```typescript
import { useAuth } from '@biya/shared/auth'

const {
  user,                 // 用户信息
  token,                // JWT Token
  isAuthenticated,      // 是否已登录
  login,                // 登录
  logout                // 退出
} = useAuth()
```

### 工具函数 (`@biya/shared/utils`)

```typescript
import { 
  formatAddress, 
  formatAmount, 
  formatUSD,
  copyToClipboard 
} from '@biya/shared/utils'

// 格式化地址
formatAddress('0x1234567890abcdef')  // '0x1234...cdef'

// 格式化金额
formatAmount(1234.56, 2)  // '1,234.56'

// 格式化 USD
formatUSD(1234.56)  // '$1,234.56'

// 复制到剪贴板
await copyToClipboard('text')  // true/false
```

---

## 💻 使用示例

### 示例 1: 钱包连接按钮

```typescript
'use client'
import { useWallet } from '@biya/shared/wallet'
import { formatAddress } from '@biya/shared/utils'

export function WalletButton() {
  const { isConnected, address, connect, disconnect } = useWallet()

  if (isConnected) {
    return (
      <button onClick={disconnect}>
        {formatAddress(address)} ✕
      </button>
    )
  }

  return (
    <button onClick={() => connect('keplr')}>
      Connect Wallet
    </button>
  )
}
```

### 示例 2: 用户资料

```typescript
'use client'
import { useAuth } from '@biya/shared/auth'
import { useWallet } from '@biya/shared/wallet'
import { formatAddress } from '@biya/shared/utils'

export function UserProfile() {
  const { user, logout } = useAuth()
  const { address } = useWallet()

  return (
    <div>
      <p>{user?.username || formatAddress(address)}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 示例 3: 余额显示

```typescript
import { formatAmount, formatUSD } from '@biya/shared/utils'

export function BalanceDisplay({ balance }: { balance: number }) {
  return (
    <div>
      <p>Balance: {formatAmount(balance)} INJ</p>
      <p>Value: {formatUSD(balance * 20)}</p>
    </div>
  )
}
```

---

## 📁 包结构

```
packages/
├── shared/              # @biya/shared
│   ├── wallet/         # 钱包功能
│   ├── auth/           # 认证功能
│   ├── components/     # 业务组件
│   └── utils/          # 工具函数
│
└── ui/                 # @biya/ui
    └── components/     # UI 基础组件
```

---

## 🔄 工作流程

### 添加新的共享功能

```bash
# 1. 创建功能
cd packages/shared
mkdir my-feature
echo "export function myFeature() {}" > my-feature/index.ts

# 2. 导出
# 在 packages/shared/index.ts 添加:
export * from './my-feature'

# 3. 在应用中使用
import { myFeature } from '@biya/shared'
```

### 修改共享功能

```bash
# 1. 修改代码
cd packages/shared
# 编辑文件...

# 2. 测试
cd ../../apps/bridge
pnpm dev
# 修改会自动热更新
```

---

## 🎯 何时使用共享包？

### ✅ 应该共享

- 钱包连接/断开
- 用户登录/退出
- 地址格式化
- 金额格式化
- 通用 UI 组件（Button、Input）
- 工具函数

### ❌ 不应该共享

- 应用特定的业务逻辑
- 应用特定的页面组件
- 应用特定的状态

---

## 🐛 常见问题

### Q: 如何调试共享包？

```typescript
// 在共享包中添加日志
export function useWallet() {
  console.log('useWallet called')
  // ...
}
```

### Q: TypeScript 提示找不到模块？

```bash
# 确保已安装
pnpm install

# 重启 TS Server
# VS Code: Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Q: 修改后不生效？

```bash
# 清理缓存
pnpm clean
rm -rf node_modules
pnpm install
```

---

## 📊 对比

| 功能 | 独立实现 | 共享包 |
|------|---------|--------|
| 代码重复 | ❌ 3份 | ✅ 1份 |
| 维护成本 | ❌ 高 | ✅ 低 |
| Bundle 大小 | ❌ 大 | ✅ 小 |
| 一致性 | ❌ 可能不同 | ✅ 完全一致 |

---

## 🔗 相关文档

- [完整文档](./SHARED_FEATURES_IN_MONOREPO.md)
- [自动化脚本](./setup-shared.ps1)
- [独立部署方案](./BRIDGE_INDEPENDENT_DEPLOYMENT_PLAN.md)

---

**开始使用共享功能吧！🚀**

