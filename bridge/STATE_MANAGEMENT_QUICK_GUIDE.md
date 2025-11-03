# 🗂️ 状态管理快速指南

> **1 分钟快速决策** | 完整文档：[STATE_MANAGEMENT_STRATEGY.md](./STATE_MANAGEMENT_STRATEGY.md)

---

## 🎯 核心答案

### ✅ **分层管理**：共享状态统一，应用状态独立

```
packages/shared/           # 共享状态（钱包、认证）
    ↓ 所有应用使用
apps/bridge/store/        # Bridge 独立状态
apps/dex/store/           # DEX 独立状态
apps/helix/store/         # Helix 独立状态
```

---

## 📊 快速决策表

| 状态类型 | 放哪里？ | 示例 |
|---------|---------|------|
| 🔗 钱包连接 | `packages/shared/wallet/` | address, balance |
| 🔐 用户认证 | `packages/shared/auth/` | user, token |
| 🎨 主题设置 | `packages/shared/theme/` | dark/light |
| 🌉 Bridge 状态 | `apps/bridge/store/` | fromNetwork, amount |
| 📊 DEX 订单 | `apps/dex/store/` | orders, trades |
| 📈 Helix 配置 | `apps/helix/store/` | dashboard settings |

---

## 🔀 决策流程

```
创建新状态？
    ↓
问：多个应用都需要这个状态吗？
    ↓
┌───YES──────────────┐    ┌───NO───────────────┐
│ packages/shared/   │    │ apps/[app]/store/ │
│                    │    │                    │
│ ✅ 钱包连接         │    │ ✅ Bridge 交易状态 │
│ ✅ 用户登录         │    │ ✅ DEX 订单列表   │
│ ✅ 主题设置         │    │ ✅ 应用特定UI状态 │
└────────────────────┘    └────────────────────┘
```

---

## 💻 代码示例

### 共享状态（钱包）

```typescript
// packages/shared/wallet/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWalletStore = create(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      
      setAddress: (address) => set({ address }),
      disconnect: () => set({ address: null, isConnected: false }),
    }),
    { name: 'biya-wallet-storage' }  // 持久化
  )
)
```

**在任何应用中使用**:
```typescript
import { useWalletStore } from '@biya/shared/wallet'

const { address, isConnected } = useWalletStore()
```

---

### 应用特定状态（Bridge）

```typescript
// apps/bridge/store/bridgeStore.ts
import { create } from 'zustand'

export const useBridgeStore = create((set) => ({
  fromNetwork: 'ethereum',
  toNetwork: 'injective',
  amount: '',
  
  setAmount: (amount) => set({ amount }),
  reset: () => set({ amount: '', fromNetwork: 'ethereum' }),
}))
```

**只在 Bridge 应用中使用**:
```typescript
import { useBridgeStore } from '../store/bridgeStore'

const { amount, setAmount } = useBridgeStore()
```

---

## ⚖️ 对比

| 特性 | 共享状态 | 应用状态 |
|------|---------|---------|
| 位置 | `packages/shared/` | `apps/[app]/store/` |
| 作用域 | 所有应用 | 单个应用 |
| 持久化 | ✅ 推荐 | ❌ 通常不需要 |
| 示例 | 钱包、认证 | 交易状态、UI |

---

## ✅ 最佳实践

### DO ✅

```typescript
// 1. 共享钱包状态
packages/shared/wallet/store.ts

// 2. 应用独立状态
apps/bridge/store/bridgeStore.ts

// 3. 同时使用
import { useWalletStore } from '@biya/shared/wallet'
import { useBridgeStore } from '../store/bridgeStore'
```

### DON'T ❌

```typescript
// ❌ 把应用特定状态放在共享包
packages/shared/bridge-specific/store.ts

// ❌ 重复创建钱包状态
apps/bridge/store/walletStore.ts
apps/dex/store/walletStore.ts
```

---

## 🎯 实际案例

### Bridge 应用

```typescript
'use client'
import { useWalletStore } from '@biya/shared/wallet'  // 共享
import { useBridgeStore } from '../store/bridgeStore' // 应用

export function BridgeForm() {
  // 共享状态
  const { address, isConnected } = useWalletStore()
  
  // 应用状态
  const { amount, fromNetwork, setAmount } = useBridgeStore()
  
  return (
    <div>
      <p>Wallet: {address}</p>
      <input 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
      />
    </div>
  )
}
```

---

## 📁 项目结构

```
packages/shared/
  ├── wallet/store.ts        ← 所有应用使用
  └── auth/store.ts          ← 所有应用使用

apps/bridge/
  └── store/
      └── bridgeStore.ts     ← 只在 Bridge 使用

apps/dex/
  └── store/
      └── orderStore.ts      ← 只在 DEX 使用
```

---

## 🔗 相关文档

- [完整策略文档](./STATE_MANAGEMENT_STRATEGY.md)
- [共享功能方案](./SHARED_FEATURES_IN_MONOREPO.md)

---

**记住：共享就共享，独立就独立，边界清晰！**

