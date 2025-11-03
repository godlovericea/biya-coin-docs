# 06 - API 参考

> **适合人群**: 开发者  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [React Hooks](#react-hooks)
2. [Provider Props](#provider-props)
3. [Type Definitions](#type-definitions)
4. [Constants](#constants)

---

## 🪝 React Hooks

### useWallet()

**描述**: 钱包连接和管理

**导入**:
```typescript
import { useWallet } from '@/context/bridge/walletContext'
```

**返回值**:
```typescript
{
  address: string | null               // 以太坊/BSC 地址
  injectiveAddress: string | null      // Injective 地址
  wallet: Wallet | null                // 当前钱包类型
  isConnected: boolean                 // 是否已连接
  connect: (wallet: Wallet) => Promise<void>
  disconnect: () => Promise<void>
}
```

**示例**:
```typescript
const { address, injectiveAddress, connect, disconnect } = useWallet()

// 连接 Keplr
await connect(Wallet.Keplr)

// 连接 MetaMask
await connect(Wallet.MetaMask)

// 断开连接
await disconnect()
```

---

### useAccount()

**描述**: 账户余额和授权管理

**导入**:
```typescript
import { useAccount } from '@/context/bridge/accountContext'
```

**返回值**:
```typescript
{
  denomBalanceMap: Record<string, BalanceWithToken>
  bnbDenomBalanceMap: Record<string, BalanceWithToken>
  fetchBalanceAndAllowance: () => Promise<void>
  isLoading: boolean
}
```

**类型定义**:
```typescript
interface BalanceWithToken {
  balance: string        // 原始余额（最小单位）
  inUsd: string         // USD 价值
  denom: string         // 代币标识
}
```

**示例**:
```typescript
const { denomBalanceMap, fetchBalanceAndAllowance } = useAccount()

// 获取 USDT 余额
const usdtBalance = denomBalanceMap[
  "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7"
]

console.log('Balance:', usdtBalance.balance)
console.log('USD Value:', usdtBalance.inUsd)

// 刷新余额
await fetchBalanceAndAllowance()
```

---

### useToken()

**描述**: 代币价格查询

**导入**:
```typescript
import { useToken } from '@/context/bridge/tokenContext'
```

**返回值**:
```typescript
{
  tokens: TokenStatic[]
  tokenPrice: Record<string, TokenPrice>
}
```

**类型定义**:
```typescript
interface TokenPrice {
  price: number
  change24h: number
}
```

**示例**:
```typescript
const { tokens, tokenPrice } = useToken()

// 获取 INJ 价格
const injPrice = tokenPrice['inj']
console.log('Price:', injPrice.price)
console.log('24h Change:', injPrice.change24h)
```

---

### usePeggy()

**描述**: Peggy 桥接操作

**导入**:
```typescript
import { usePeggy } from '@/context/bridge/peggyContext'
```

**返回值**:
```typescript
{
  peggyEthDeposit: (params: PeggyDepositParams) => Promise<string | undefined>
  peggyInjectiveToEth: (params: PeggyWithdrawParams) => Promise<string | undefined>
}
```

**类型定义**:
```typescript
interface PeggyDepositParams {
  amount: string         // 转账金额（用户单位）
  token: TokenStatic     // 代币对象
}

interface PeggyWithdrawParams {
  amount: string
  token: TokenStatic
}
```

**示例**:
```typescript
const { peggyEthDeposit, peggyInjectiveToEth } = usePeggy()

// 存款：以太坊 → Injective
try {
  const txHash = await peggyEthDeposit({
    amount: "100",              // 100 USDT
    token: ethUsdtToken
  })
  
  console.log('Deposit tx:', txHash)
  // 显示成功提示
} catch (error) {
  console.error('Deposit failed:', error)
}

// 提现：Injective → 以太坊
const txHash = await peggyInjectiveToEth({
  amount: "50",               // 50 USDT
  token: injUsdtToken
})
```

---

### useAxelar()

**描述**: Axelar 桥接操作

**导入**:
```typescript
import { useAxelar } from '@/context/bridge/axelarContext'
```

**返回值**:
```typescript
{
  axelarEvmDeposit: (params: AxelarDepositParams) => Promise<string | undefined>
  axelarInjectiveDeposit: (params: AxelarDepositParams) => Promise<string | undefined>
}
```

**类型定义**:
```typescript
interface AxelarDepositParams {
  amount: string
  fromToken: TokenStatic
  toToken: TokenStatic
}
```

**示例**:
```typescript
const { axelarEvmDeposit } = useAxelar()

// BSC → Injective
const txHash = await axelarEvmDeposit({
  amount: "100",
  fromToken: bnbUsdtToken,      // BSC USDT
  toToken: injAxlUsdcToken      // INJ axlUSDC
})
```

---

### useEvent()

**描述**: 事件回调

**导入**:
```typescript
import { useEvent } from '@/context/bridge/eventContext'
```

**返回值**:
```typescript
{
  onSuccess: (...args: unknown[]) => unknown
  onError: (...args: unknown[]) => unknown
  onInit: (...args: unknown[]) => unknown
  mock: boolean
}
```

**示例**:
```typescript
const { onSuccess, onError } = useEvent()

// 在成功后调用
onSuccess?.()

// 在失败后调用
onError?.(error)
```

---

## ⚙️ Provider Props

### BridgeProviders

**导入**:
```typescript
import { BridgeProviders } from '@/context/bridge/BridgeProviders'
```

**Props**:
```typescript
interface BridgeProvidersProps {
  children: ReactNode
}
```

**使用**:
```typescript
<BridgeProviders>
  <YourBridgeComponent />
</BridgeProviders>
```

---

### EventProvider

**导入**:
```typescript
import { EventProvider } from '@/context/bridge/EventProvider'
```

**Props**:
```typescript
interface EventProviderProps {
  children: ReactNode
  onInit?: (...args: unknown[]) => unknown
  onSuccess?: (...args: unknown[]) => unknown
  onError?: (...args: unknown[]) => unknown
  mock?: boolean
}
```

**使用**:
```typescript
<EventProvider
  onInit={() => console.log('Bridge initialized')}
  onSuccess={() => toast.success('Success!')}
  onError={(error) => toast.error(error.message)}
  mock={false}
>
  {children}
</EventProvider>
```

---

## 📝 Type Definitions

### TokenStatic

**定义**: 代币的完整信息

```typescript
interface TokenStatic {
  address: string                    // 合约地址
  denom: string                      // 代币标识
  symbol: string                     // 代币符号（如 USDT）
  name: string                       // 代币名称（如 Tether）
  decimals: number                   // 精度（如 6, 18）
  logo: string                       // 图标 URL
  coinGeckoId: string                // CoinGecko ID
  tokenType: TokenType               // 代币类型
  tokenVerification: TokenVerification
  isNative: boolean                  // 是否原生代币
  externalLogo?: string              // 外部图标
}
```

**示例**:
```typescript
const ethUsdtToken: TokenStatic = {
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  denom: "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7",
  symbol: "USDT",
  name: "Tether",
  decimals: 6,
  logo: "https://...",
  coinGeckoId: "tether",
  tokenType: TokenType.Erc20,
  tokenVerification: TokenVerification.Verified,
  isNative: false
}
```

---

### Network

**定义**: 支持的网络

```typescript
enum Network {
  Ethereum = "ethereum",
  Injective = "injective",
  BnbChain = "bnb",
  // ... 更多
}
```

---

### Wallet

**定义**: 支持的钱包

```typescript
enum Wallet {
  Keplr = "keplr",
  Leap = "leap",
  MetaMask = "metamask",
  OkxWallet = "okx",
  // ... 更多
}
```

---

### WalletConnectStatus

**定义**: 钱包连接状态

```typescript
enum WalletConnectStatus {
  Idle = "Idle",
  Connecting = "Connecting",
  Connected = "Connected",
  Disconnected = "Disconnected",
}
```

---

## 🔢 Constants

### 代币常量

**文件**: `lib/bridge/data/tokens.ts`

```typescript
// 导出的代币对象
export const injToken: TokenStatic           // INJ（原生）
export const ethUsdtToken: TokenStatic       // ETH USDT
export const bnbUsdtToken: TokenStatic       // BSC USDT
export const injAxlUsdcToken: TokenStatic    // INJ axlUSDC
export const injErc20Token: TokenStatic      // INJ (ERC20)
export const wethToken: TokenStatic          // WETH
```

---

### 网络常量

**文件**: `lib/bridge/constants/setup.ts`

```typescript
export const NETWORK: Network               // 当前网络（mainnet/testnet）
export const CHAIN_ID: string               // Injective Chain ID
export const ETHEREUM_CHAIN_ID: number      // 以太坊 Chain ID
export const IS_MAINNET: boolean            // 是否主网
export const IS_TESTNET: boolean            // 是否测试网
```

---

### Peggy 合约地址

**文件**: `lib/bridge/data/tokens.ts`

```typescript
export const injectivePeggyAddress = {
  [Network.Mainnet]: "0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3",
  [Network.Testnet]: "0x513DFF2bdccabcc9B65241F1211DC243c11f1684",
  // ...
}
```

---

### Gas 相关常量

**文件**: `lib/bridge/constants/index.ts`

```typescript
export const DEFAULT_GAS_PRICE: BigNumber         // 默认 Gas 价格
export const GWEI_IN_WEI: BigNumber               // Gwei 转 Wei
export const TX_DEFAULTS_GAS: number              // 默认 Gas Limit
export const PEGGY_TRANSFER_DEFAULT_GAS_LIMIT: number  // Peggy Gas Limit
export const ALLOWANCE_DEFAULT_GAS_LIMIT: number  // 授权 Gas Limit
```

---

### 其他常量

```typescript
export const UNLIMITED_ALLOWANCE: BigNumber  // 无限授权额度
export const ZERO_IN_WEI: BigNumberInWei     // 0（Wei 单位）
export const ZERO_IN_BASE: BigNumberInBase   // 0（基础单位）
```

---

## 💡 使用最佳实践

### 1. 错误处理

```typescript
try {
  const txHash = await peggyEthDeposit({ amount, token })
  // 成功处理
  toast.success('Bridge successful!')
} catch (error) {
  // 错误处理
  if (error.code === 'ACTION_REJECTED') {
    toast.error('User rejected transaction')
  } else if (error.message.includes('insufficient funds')) {
    toast.error('Insufficient balance')
  } else {
    toast.error('Bridge failed')
  }
}
```

### 2. 金额格式化

```typescript
import { BigNumberInBase } from '@injectivelabs/utils'

// 用户输入 → 最小单位
const amountInBase = new BigNumberInBase(userInput)
const amountInWei = amountInBase.toWei(token.decimals)

// 最小单位 → 用户可读
const displayAmount = new BigNumberInBase(balance)
  .toWei(-token.decimals)
  .toFixed(2)
```

### 3. 状态管理

```typescript
const [isLoading, setIsLoading] = useState(false)

const handleBridge = async () => {
  setIsLoading(true)
  try {
    await peggyEthDeposit({ amount, token })
  } finally {
    setIsLoading(false)
  }
}
```

---

## 📖 下一步

- 👉 [常见问题](./07-常见问题.md) - FAQ 和故障排查
- 👉 [业务概述](./01-业务概述.md) - 回顾业务逻辑

---

*最后更新: 2025-10-30*

