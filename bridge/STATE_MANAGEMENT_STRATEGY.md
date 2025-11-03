# 🗂️ Monorepo 状态管理策略

> **核心问题**: 各应用使用共同的 Zustand Store，还是各自管理？  
> **答案**: **分层管理** - 共享状态统一管理，应用状态各自独立  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [核心原则](#核心原则)
2. [状态分类](#状态分类)
3. [架构设计](#架构设计)
4. [实施方案](#实施方案)
5. [使用示例](#使用示例)
6. [最佳实践](#最佳实践)

---

## 💡 核心原则

### ✅ 推荐方案：分层状态管理

```
┌─────────────────────────────────────────────┐
│  应用特定状态 (App-Specific State)           │  ← 各应用独立管理
│  - Bridge 交易状态                           │
│  - DEX 订单状态                              │
│  - Helix 个性化设置                          │
└─────────────────────────────────────────────┘
                    独立
┌─────────────────────────────────────────────┐
│  共享状态 (Shared State)                     │  ← 所有应用共享
│  - 钱包连接状态                              │
│  - 用户认证状态                              │
│  - 主题设置                                  │
└─────────────────────────────────────────────┘
```

**原则**：
- 🔵 **跨应用使用** → 共享 Store
- 🟢 **应用特定** → 独立 Store
- 🔴 **避免混合** → 清晰的边界

---

## 📊 状态分类

### 1. 共享状态（Shared State）

**定义**：多个应用都需要访问和修改的状态

| 状态类型 | 示例 | 存放位置 |
|---------|------|---------|
| 🔗 钱包连接 | 地址、余额、网络 | `@biya/shared/wallet` |
| 🔐 用户认证 | 用户信息、Token | `@biya/shared/auth` |
| 🎨 主题设置 | 明暗模式、语言 | `@biya/shared/theme` |
| 🔔 通知系统 | Toast 消息 | `@biya/shared/notifications` |

**特点**：
- ✅ 所有应用都能访问
- ✅ 持久化到 localStorage
- ✅ 统一管理，行为一致

### 2. 应用特定状态（App-Specific State）

**定义**：只在单个应用内使用的状态

| 应用 | 状态类型 | 存放位置 |
|------|---------|---------|
| Bridge | 桥接交易状态、选择的网络 | `apps/bridge/store/` |
| DEX | 订单列表、交易对 | `apps/dex/store/` |
| Helix | 个性化仪表板 | `apps/helix/store/` |

**特点**：
- ✅ 只在当前应用可见
- ✅ 应用卸载后状态清除
- ✅ 独立演进，互不影响

---

## 🏗️ 架构设计

### 完整架构图

```
apps/bridge/
  ├── store/
  │   ├── bridgeStore.ts         # Bridge 特定状态
  │   └── transactionStore.ts    # 交易历史
  └── components/
      └── BridgeForm.tsx
          ↓ 使用
      import { useBridgeStore } from '../store'
      import { useWallet } from '@biya/shared/wallet'  ← 共享状态

apps/dex/
  ├── store/
  │   ├── orderStore.ts          # DEX 特定状态
  │   └── marketStore.ts         # 市场数据
  └── components/
      └── OrderBook.tsx
          ↓ 使用
      import { useOrderStore } from '../store'
      import { useWallet } from '@biya/shared/wallet'  ← 共享状态

packages/shared/
  ├── wallet/
  │   └── store.ts               # 钱包共享状态
  └── auth/
      └── store.ts               # 认证共享状态
```

---

## 🚀 实施方案

### 方案 1: 共享状态（推荐）

#### 1.1 钱包状态 (`packages/shared/wallet/store.ts`)

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WalletState {
  // 状态
  address: string | null
  injectiveAddress: string | null
  isConnected: boolean
  chainId: number | null
  balance: string | null
  
  // 操作
  setAddress: (address: string | null) => void
  setInjectiveAddress: (address: string | null) => void
  setConnected: (connected: boolean) => void
  setChainId: (chainId: number | null) => void
  setBalance: (balance: string | null) => void
  disconnect: () => void
}

// ✅ 共享状态：持久化，所有应用可访问
export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      // 初始状态
      address: null,
      injectiveAddress: null,
      isConnected: false,
      chainId: null,
      balance: null,
      
      // 操作方法
      setAddress: (address) => set({ address }),
      setInjectiveAddress: (injectiveAddress) => set({ injectiveAddress }),
      setConnected: (isConnected) => set({ isConnected }),
      setChainId: (chainId) => set({ chainId }),
      setBalance: (balance) => set({ balance }),
      
      disconnect: () => set({
        address: null,
        injectiveAddress: null,
        isConnected: false,
        chainId: null,
        balance: null,
      }),
    }),
    {
      name: 'biya-wallet-storage',  // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // 只持久化关键状态
        address: state.address,
        injectiveAddress: state.injectiveAddress,
      }),
    }
  )
)
```

**使用**（在任何应用中）:
```typescript
// apps/bridge/components/WalletInfo.tsx
import { useWalletStore } from '@biya/shared/wallet'

export function WalletInfo() {
  const { address, isConnected, disconnect } = useWalletStore()
  
  return (
    <div>
      {isConnected && <p>{address}</p>}
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}
```

---

### 方案 2: 应用特定状态（推荐）

#### 2.1 Bridge 状态 (`apps/bridge/store/bridgeStore.ts`)

```typescript
import { create } from 'zustand'

interface BridgeState {
  // Bridge 特定状态
  fromNetwork: string
  toNetwork: string
  selectedToken: string | null
  amount: string
  isProcessing: boolean
  transactionHash: string | null
  
  // 操作
  setFromNetwork: (network: string) => void
  setToNetwork: (network: string) => void
  setSelectedToken: (token: string | null) => void
  setAmount: (amount: string) => void
  setProcessing: (processing: boolean) => void
  setTransactionHash: (hash: string | null) => void
  reset: () => void
}

// ✅ 应用特定状态：不持久化，只在 Bridge 中使用
export const useBridgeStore = create<BridgeState>((set) => ({
  // 初始状态
  fromNetwork: 'ethereum',
  toNetwork: 'injective',
  selectedToken: null,
  amount: '',
  isProcessing: false,
  transactionHash: null,
  
  // 操作方法
  setFromNetwork: (fromNetwork) => set({ fromNetwork }),
  setToNetwork: (toNetwork) => set({ toNetwork }),
  setSelectedToken: (selectedToken) => set({ selectedToken }),
  setAmount: (amount) => set({ amount }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setTransactionHash: (transactionHash) => set({ transactionHash }),
  
  reset: () => set({
    fromNetwork: 'ethereum',
    toNetwork: 'injective',
    selectedToken: null,
    amount: '',
    isProcessing: false,
    transactionHash: null,
  }),
}))
```

**使用**（只在 Bridge 应用中）:
```typescript
// apps/bridge/components/BridgeForm.tsx
import { useBridgeStore } from '../store/bridgeStore'
import { useWalletStore } from '@biya/shared/wallet'  // 共享状态

export function BridgeForm() {
  // 应用特定状态
  const { 
    fromNetwork, 
    toNetwork, 
    amount, 
    setAmount 
  } = useBridgeStore()
  
  // 共享状态
  const { address, isConnected } = useWalletStore()
  
  return (
    <form>
      <select value={fromNetwork}>
        <option>Ethereum</option>
        <option>BSC</option>
      </select>
      
      <input 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
      />
      
      {!isConnected && <p>Please connect wallet</p>}
    </form>
  )
}
```

---

### 方案 3: 混合使用（实际场景）

#### 3.1 场景：Bridge 需要钱包状态

```typescript
// apps/bridge/components/BridgeContainer.tsx
import { useBridgeStore } from '../store/bridgeStore'      // 应用状态
import { useWalletStore } from '@biya/shared/wallet'       // 共享状态
import { useAuthStore } from '@biya/shared/auth'          // 共享状态

export function BridgeContainer() {
  // 1. 共享状态（钱包、认证）
  const { address, isConnected, disconnect } = useWalletStore()
  const { user, isAuthenticated } = useAuthStore()
  
  // 2. 应用状态（Bridge 特定）
  const { 
    fromNetwork, 
    toNetwork, 
    amount, 
    isProcessing,
    setProcessing 
  } = useBridgeStore()
  
  // 3. 业务逻辑
  const handleBridge = async () => {
    if (!isConnected) {
      alert('Please connect wallet')
      return
    }
    
    setProcessing(true)
    try {
      // 桥接逻辑
      await bridge({ fromNetwork, toNetwork, amount, address })
    } finally {
      setProcessing(false)
    }
  }
  
  return (
    <div>
      <WalletInfo address={address} onDisconnect={disconnect} />
      <BridgeForm />
      <button onClick={handleBridge} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Bridge'}
      </button>
    </div>
  )
}
```

---

## 📋 状态管理决策树

```
需要创建一个新状态？
    ↓
问：这个状态需要在多个应用中共享吗？
    ↓
┌───YES───────────────────────────┐    ┌───NO────────────────────────────┐
│  放在 packages/shared/          │    │  放在 apps/[app]/store/         │
│                                 │    │                                 │
│  示例：                         │    │  示例：                         │
│  - 钱包连接状态                 │    │  - Bridge 交易状态              │
│  - 用户认证信息                 │    │  - DEX 订单列表                 │
│  - 主题设置                     │    │  - Helix 仪表板配置             │
│                                 │    │                                 │
│  特点：                         │    │  特点：                         │
│  ✅ 持久化                      │    │  ✅ 不持久化（或应用级持久化）   │
│  ✅ 所有应用可访问              │    │  ✅ 只在当前应用可见             │
│  ✅ 统一管理                    │    │  ✅ 独立演进                    │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

---

## 🎯 使用示例

### 示例 1: Bridge 应用

```typescript
// apps/bridge/store/bridgeStore.ts
import { create } from 'zustand'

export const useBridgeStore = create((set) => ({
  fromNetwork: 'ethereum',
  toNetwork: 'injective',
  amount: '',
  
  setFromNetwork: (network) => set({ fromNetwork: network }),
  setToNetwork: (network) => set({ toNetwork: network }),
  setAmount: (amount) => set({ amount }),
}))

// apps/bridge/components/BridgeForm.tsx
import { useBridgeStore } from '../store/bridgeStore'
import { useWalletStore } from '@biya/shared/wallet'

export function BridgeForm() {
  const bridge = useBridgeStore()        // 应用状态
  const wallet = useWalletStore()        // 共享状态
  
  return (
    <div>
      {/* 使用应用状态 */}
      <input 
        value={bridge.amount} 
        onChange={(e) => bridge.setAmount(e.target.value)} 
      />
      
      {/* 使用共享状态 */}
      <p>Wallet: {wallet.address}</p>
    </div>
  )
}
```

### 示例 2: DEX 应用

```typescript
// apps/dex/store/orderStore.ts
import { create } from 'zustand'

interface Order {
  id: string
  price: number
  amount: number
}

export const useOrderStore = create<{
  orders: Order[]
  addOrder: (order: Order) => void
}>((set) => ({
  orders: [],
  addOrder: (order) => set((state) => ({ 
    orders: [...state.orders, order] 
  })),
}))

// apps/dex/components/OrderBook.tsx
import { useOrderStore } from '../store/orderStore'
import { useWalletStore } from '@biya/shared/wallet'

export function OrderBook() {
  const { orders } = useOrderStore()          // DEX 特定
  const { isConnected } = useWalletStore()    // 共享
  
  if (!isConnected) {
    return <p>Connect wallet to see orders</p>
  }
  
  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>{order.price}</div>
      ))}
    </div>
  )
}
```

---

## ✅ 最佳实践

### 1. 清晰的命名约定

```typescript
// ✅ 好的命名
packages/shared/wallet/store.ts     // 共享钱包状态
apps/bridge/store/bridgeStore.ts    // Bridge 应用状态
apps/dex/store/orderStore.ts        // DEX 应用状态

// ❌ 不好的命名
packages/shared/store.ts            // 太泛化
apps/bridge/state.ts                // 不清晰
```

### 2. 状态持久化策略

```typescript
// ✅ 共享状态：持久化关键信息
export const useWalletStore = create(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'biya-wallet-storage',
      partialize: (state) => ({
        address: state.address,  // 只持久化必要的
      }),
    }
  )
)

// ✅ 应用状态：通常不持久化
export const useBridgeStore = create((set) => ({ /* ... */ }))

// ⚠️ 应用状态需要持久化：使用应用特定的 key
export const useBridgeStore = create(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'bridge-app-storage',  // 应用特定的 key
    }
  )
)
```

### 3. 状态隔离

```typescript
// ✅ 好的做法：清晰的边界
apps/bridge/
  └── store/
      ├── bridgeStore.ts      // Bridge 逻辑
      └── transactionStore.ts // 交易历史

apps/dex/
  └── store/
      ├── orderStore.ts       // 订单管理
      └── marketStore.ts      // 市场数据

// ❌ 不好的做法：混在一起
apps/bridge/
  └── store/
      └── everything.ts       // 所有状态混在一起
```

### 4. 类型安全

```typescript
// ✅ 导出类型定义
export interface WalletState {
  address: string | null
  isConnected: boolean
}

export const useWalletStore = create<WalletState>(/* ... */)

// 在其他地方使用
import type { WalletState } from '@biya/shared/wallet'
```

---

## 🔄 状态同步策略

### 场景：跨应用状态同步

如果需要在不同应用间实时同步状态（例如：用户在 Bridge 连接钱包后，立即在 DEX 中看到）：

```typescript
// packages/shared/wallet/store.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const useWalletStore = create(
  subscribeWithSelector<WalletState>((set) => ({
    address: null,
    setAddress: (address) => set({ address }),
  }))
)

// 在任何应用中订阅变化
useEffect(() => {
  const unsubscribe = useWalletStore.subscribe(
    (state) => state.address,
    (address) => {
      console.log('Wallet address changed:', address)
      // 执行副作用
    }
  )
  
  return unsubscribe
}, [])
```

---

## 📊 对比表

| 特性 | 共享状态 | 应用特定状态 |
|------|---------|-------------|
| **存放位置** | `packages/shared/` | `apps/[app]/store/` |
| **作用域** | 所有应用 | 单个应用 |
| **持久化** | ✅ 推荐 | ⚠️ 可选 |
| **生命周期** | 全局 | 应用级 |
| **示例** | 钱包、认证 | Bridge 状态、订单 |
| **命名空间** | `biya-*-storage` | `[app]-*-storage` |

---

## 🎯 实际项目结构

```
packages/shared/
  ├── wallet/
  │   └── store.ts              # useWalletStore (共享)
  ├── auth/
  │   └── store.ts              # useAuthStore (共享)
  └── theme/
      └── store.ts              # useThemeStore (共享)

apps/bridge/
  ├── store/
  │   ├── bridgeStore.ts        # useBridgeStore (独立)
  │   └── transactionStore.ts   # useTransactionStore (独立)
  └── components/
      └── BridgeForm.tsx
          ↓ 同时使用
      useWalletStore() + useBridgeStore()

apps/dex/
  ├── store/
  │   ├── orderStore.ts         # useOrderStore (独立)
  │   └── marketStore.ts        # useMarketStore (独立)
  └── components/
      └── OrderBook.tsx
          ↓ 同时使用
      useWalletStore() + useOrderStore()

apps/helix/
  ├── store/
  │   └── dashboardStore.ts     # useDashboardStore (独立)
  └── components/
      └── Dashboard.tsx
          ↓ 同时使用
      useWalletStore() + useDashboardStore()
```

---

## 💡 总结

### 核心原则

1. **共享状态** → `packages/shared/` 
   - 钱包、认证、主题
   - 所有应用都能访问
   - 持久化

2. **应用状态** → `apps/[app]/store/`
   - Bridge 交易、DEX 订单
   - 只在当前应用可见
   - 通常不持久化

3. **清晰边界** 
   - 不混合共享和应用状态
   - 统一的命名约定
   - 类型安全

### 决策流程

```
创建新状态时，问自己：
1. 这个状态需要在多个应用中使用吗？
   → YES: packages/shared/
   → NO:  apps/[app]/store/

2. 这个状态需要持久化吗？
   → YES: 使用 persist middleware
   → NO:  直接使用 create()

3. 这个状态的生命周期是什么？
   → 全局: 共享状态
   → 应用: 应用状态
```

---

## 📚 相关文档

- [共享功能方案](./SHARED_FEATURES_IN_MONOREPO.md)
- [独立部署方案](./BRIDGE_INDEPENDENT_DEPLOYMENT_PLAN.md)
- [多语言方案](./I18N_IN_MONOREPO.md)

---

*最后更新: 2025-10-30*

