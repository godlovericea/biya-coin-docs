# 🌍 Monorepo 多语言（i18n）解决方案

> **适用于**: Biya Monorepo (helix + bridge + dex)  
> **技术栈**: next-intl + 共享翻译包  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [挑战分析](#挑战分析)
2. [推荐方案](#推荐方案)
3. [文件结构](#文件结构)
4. [实现步骤](#实现步骤)
5. [使用示例](#使用示例)
6. [最佳实践](#最佳实践)

---

## 🎯 挑战分析

### 当前问题

在 Monorepo 中，每个应用独立运行，面临以下挑战：

```
apps/helix/messages/
  ├── en.json      # 主站翻译
  └── zh.json

apps/bridge/messages/
  ├── en.json      # Bridge 翻译（重复？）
  └── zh.json

apps/dex/messages/
  ├── en.json      # DEX 翻译（重复？）
  └── zh.json
```

**问题**：
- ❌ 通用翻译重复（如 "Login", "Cancel", "Confirm"）
- ❌ 维护困难（修改一处要同步多处）
- ❌ 不一致风险（不同应用翻译可能不同）
- ❌ Bundle 体积增加

---

## 💡 推荐方案：分层翻译架构

### 三层结构

```
┌─────────────────────────────────────────┐
│  应用特定翻译 (App-Specific)              │  ← 每个应用独有
│  apps/bridge/messages/bridge.json        │
└─────────────────────────────────────────┘
                  ↓ 导入
┌─────────────────────────────────────────┐
│  业务领域翻译 (Domain)                    │  ← 跨应用共享
│  packages/i18n/messages/trading.json     │
│  packages/i18n/messages/wallet.json      │
└─────────────────────────────────────────┘
                  ↓ 导入
┌─────────────────────────────────────────┐
│  通用翻译 (Common)                        │  ← 所有应用共享
│  packages/i18n/messages/common.json      │
└─────────────────────────────────────────┘
```

### 翻译优先级

```
应用特定翻译 > 业务领域翻译 > 通用翻译
```

---

## 📁 文件结构

### 完整目录结构

```
biya-coin/
├── packages/
│   └── i18n/                          # 🆕 共享 i18n 包
│       ├── package.json
│       ├── tsconfig.json
│       │
│       ├── messages/                  # 翻译文件
│       │   ├── common/                # 通用翻译
│       │   │   ├── en.json
│       │   │   ├── zh.json
│       │   │   ├── ja.json
│       │   │   └── ko.json
│       │   │
│       │   ├── domains/               # 业务领域翻译
│       │   │   ├── wallet/
│       │   │   │   ├── en.json
│       │   │   │   └── zh.json
│       │   │   ├── trading/
│       │   │   │   ├── en.json
│       │   │   │   └── zh.json
│       │   │   └── bridge/
│       │   │       ├── en.json
│       │   │       └── zh.json
│       │   │
│       │   └── index.ts               # 导出函数
│       │
│       ├── utils/                     # i18n 工具
│       │   ├── merge-messages.ts
│       │   ├── get-locale.ts
│       │   └── format.ts
│       │
│       └── config/                    # 配置
│           └── locales.ts
│
├── apps/
│   ├── helix/
│   │   ├── messages/                  # 主站特定翻译
│   │   │   ├── en.json
│   │   │   └── zh.json
│   │   └── i18n/
│   │       └── request.ts             # 合并翻译
│   │
│   ├── bridge/
│   │   ├── messages/                  # Bridge 特定翻译
│   │   │   ├── en.json
│   │   │   └── zh.json
│   │   └── i18n/
│   │       └── request.ts
│   │
│   └── dex/
│       ├── messages/
│       │   ├── en.json
│       │   └── zh.json
│       └── i18n/
│           └── request.ts
```

---

## 🚀 实施步骤

### 步骤 1: 创建共享 i18n 包

#### 1.1 创建目录

```bash
cd D:\rwa\biya-coin

mkdir -p packages\i18n\messages\common
mkdir -p packages\i18n\messages\domains\wallet
mkdir -p packages\i18n\messages\domains\trading
mkdir -p packages\i18n\messages\domains\bridge
mkdir -p packages\i18n\utils
mkdir -p packages\i18n\config
```

#### 1.2 创建 `packages/i18n/package.json`

```json
{
  "name": "@biya/i18n",
  "version": "0.1.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./messages/*": "./messages/*/index.ts",
    "./utils": "./utils/index.ts",
    "./config": "./config/index.ts"
  },
  "dependencies": {
    "deepmerge": "^4.3.1"
  }
}
```

---

### 步骤 2: 定义通用翻译

#### 2.1 `packages/i18n/messages/common/en.json`

```json
{
  "Common": {
    "actions": {
      "confirm": "Confirm",
      "cancel": "Cancel",
      "submit": "Submit",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "close": "Close",
      "back": "Back",
      "next": "Next",
      "loading": "Loading...",
      "retry": "Retry"
    },
    "status": {
      "success": "Success",
      "error": "Error",
      "warning": "Warning",
      "pending": "Pending",
      "completed": "Completed",
      "failed": "Failed"
    },
    "form": {
      "required": "This field is required",
      "invalid": "Invalid value",
      "email": "Invalid email address",
      "minLength": "Minimum {min} characters",
      "maxLength": "Maximum {max} characters"
    },
    "languages": {
      "en": "English",
      "zh": "中文",
      "ja": "日本語",
      "ko": "한국어"
    }
  },
  "Wallet": {
    "connect": "Connect Wallet",
    "disconnect": "Disconnect",
    "balance": "Balance",
    "address": "Address",
    "copied": "Address copied!"
  },
  "Navigation": {
    "home": "Home",
    "about": "About",
    "docs": "Docs",
    "support": "Support"
  }
}
```

#### 2.2 `packages/i18n/messages/common/zh.json`

```json
{
  "Common": {
    "actions": {
      "confirm": "确认",
      "cancel": "取消",
      "submit": "提交",
      "save": "保存",
      "delete": "删除",
      "edit": "编辑",
      "close": "关闭",
      "back": "返回",
      "next": "下一步",
      "loading": "加载中...",
      "retry": "重试"
    },
    "status": {
      "success": "成功",
      "error": "错误",
      "warning": "警告",
      "pending": "处理中",
      "completed": "已完成",
      "failed": "失败"
    },
    "form": {
      "required": "此字段为必填项",
      "invalid": "无效值",
      "email": "无效的邮箱地址",
      "minLength": "最少 {min} 个字符",
      "maxLength": "最多 {max} 个字符"
    },
    "languages": {
      "en": "English",
      "zh": "中文",
      "ja": "日本語",
      "ko": "한국어"
    }
  },
  "Wallet": {
    "connect": "连接钱包",
    "disconnect": "断开连接",
    "balance": "余额",
    "address": "地址",
    "copied": "地址已复制！"
  },
  "Navigation": {
    "home": "首页",
    "about": "关于",
    "docs": "文档",
    "support": "支持"
  }
}
```

---

### 步骤 3: 定义领域翻译

#### 3.1 `packages/i18n/messages/domains/bridge/en.json`

```json
{
  "Bridge": {
    "title": "Cross-Chain Bridge",
    "description": "Transfer assets between different blockchains",
    "from": "From",
    "to": "To",
    "amount": "Amount",
    "balance": "Balance",
    "max": "Max",
    "networks": {
      "ethereum": "Ethereum",
      "injective": "Injective",
      "bnb": "BNB Chain",
      "polygon": "Polygon"
    },
    "actions": {
      "bridge": "Bridge",
      "approve": "Approve",
      "approving": "Approving...",
      "bridging": "Bridging...",
      "switchNetwork": "Switch Network"
    },
    "status": {
      "idle": "Ready to bridge",
      "approving": "Approving token...",
      "bridging": "Bridging in progress...",
      "success": "Bridge successful!",
      "failed": "Bridge failed"
    },
    "errors": {
      "insufficientBalance": "Insufficient balance",
      "invalidAmount": "Invalid amount",
      "networkMismatch": "Wrong network",
      "walletNotConnected": "Please connect wallet first",
      "approvalFailed": "Approval failed",
      "bridgeFailed": "Bridge transaction failed"
    },
    "info": {
      "estimatedTime": "Estimated time: {time}",
      "gasFee": "Gas fee: ~${fee}",
      "minimumAmount": "Minimum: {amount}",
      "needsApproval": "This token requires approval before bridging"
    }
  }
}
```

#### 3.2 `packages/i18n/messages/domains/bridge/zh.json`

```json
{
  "Bridge": {
    "title": "跨链桥",
    "description": "在不同区块链之间转移资产",
    "from": "从",
    "to": "到",
    "amount": "数量",
    "balance": "余额",
    "max": "最大",
    "networks": {
      "ethereum": "以太坊",
      "injective": "Injective",
      "bnb": "币安智能链",
      "polygon": "Polygon"
    },
    "actions": {
      "bridge": "桥接",
      "approve": "授权",
      "approving": "授权中...",
      "bridging": "桥接中...",
      "switchNetwork": "切换网络"
    },
    "status": {
      "idle": "准备桥接",
      "approving": "正在授权代币...",
      "bridging": "桥接进行中...",
      "success": "桥接成功！",
      "failed": "桥接失败"
    },
    "errors": {
      "insufficientBalance": "余额不足",
      "invalidAmount": "无效金额",
      "networkMismatch": "网络错误",
      "walletNotConnected": "请先连接钱包",
      "approvalFailed": "授权失败",
      "bridgeFailed": "桥接交易失败"
    },
    "info": {
      "estimatedTime": "预计时间：{time}",
      "gasFee": "Gas 费用：约 ${fee}",
      "minimumAmount": "最小值：{amount}",
      "needsApproval": "此代币需要先授权才能桥接"
    }
  }
}
```

---

### 步骤 4: 创建合并工具

#### 4.1 `packages/i18n/utils/merge-messages.ts`

```typescript
import deepmerge from 'deepmerge'

/**
 * 深度合并多个翻译对象
 * 后面的对象会覆盖前面的对象
 */
export function mergeMessages<T extends Record<string, any>>(
  ...messages: (T | undefined)[]
): T {
  // 过滤 undefined
  const validMessages = messages.filter(Boolean) as T[]
  
  if (validMessages.length === 0) {
    return {} as T
  }
  
  if (validMessages.length === 1) {
    return validMessages[0]
  }
  
  // 深度合并
  return deepmerge.all<T>(validMessages, {
    // 数组合并策略：用新数组替换旧数组
    arrayMerge: (_, sourceArray) => sourceArray
  })
}

/**
 * 按优先级合并翻译
 * @param common - 通用翻译
 * @param domain - 领域翻译
 * @param app - 应用特定翻译
 */
export function mergeI18nMessages<T extends Record<string, any>>(
  common?: T,
  domain?: T,
  app?: T
): T {
  return mergeMessages(common, domain, app)
}
```

#### 4.2 `packages/i18n/utils/get-locale.ts`

```typescript
export const supportedLocales = ['en', 'zh', 'ja', 'ko'] as const
export type SupportedLocale = typeof supportedLocales[number]

export const defaultLocale: SupportedLocale = 'en'

/**
 * 验证 locale 是否支持
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}

/**
 * 获取有效的 locale
 */
export function getValidLocale(locale?: string | null): SupportedLocale {
  if (!locale) return defaultLocale
  return isValidLocale(locale) ? locale : defaultLocale
}
```

#### 4.3 `packages/i18n/index.ts`

```typescript
// 导出工具函数
export * from './utils/merge-messages'
export * from './utils/get-locale'

// 导出配置
export * from './config/locales'

// 导出类型
export type Messages = Record<string, any>
```

---

### 步骤 5: 在各应用中使用

#### 5.1 Bridge 应用翻译配置

**`apps/bridge/messages/en.json`** (Bridge 特定翻译):
```json
{
  "BridgePage": {
    "title": "Biya Bridge - Cross-Chain Bridge",
    "subtitle": "Fast and secure asset transfers",
    "features": {
      "fast": "Lightning Fast",
      "secure": "Bank-Level Security",
      "cheap": "Low Fees"
    }
  },
  "Footer": {
    "copyright": "© 2025 Biya Bridge. All rights reserved.",
    "backToMain": "Back to Main Site"
  }
}
```

**`apps/bridge/i18n/request.ts`**:
```typescript
import { getRequestConfig } from 'next-intl/server'
import { mergeI18nMessages, getValidLocale } from '@biya/i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = getValidLocale(await requestLocale)

  // 1. 加载通用翻译
  const commonMessages = (await import(`@biya/i18n/messages/common/${locale}.json`)).default

  // 2. 加载 Bridge 领域翻译
  const bridgeDomainMessages = (await import(`@biya/i18n/messages/domains/bridge/${locale}.json`)).default

  // 3. 加载 Bridge 应用特定翻译
  const bridgeAppMessages = (await import(`../messages/${locale}.json`)).default

  // 4. 合并翻译（优先级：应用 > 领域 > 通用）
  const messages = mergeI18nMessages(
    commonMessages,
    bridgeDomainMessages,
    bridgeAppMessages
  )

  return {
    locale,
    messages
  }
})
```

#### 5.2 在组件中使用

**`apps/bridge/components/BridgeForm.tsx`**:
```typescript
'use client'

import { useTranslations } from 'next-intl'

export function BridgeForm() {
  const t = useTranslations('Bridge')
  const tCommon = useTranslations('Common')

  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>

      <div>
        <label>{t('from')}</label>
        <select>
          <option>{t('networks.ethereum')}</option>
          <option>{t('networks.injective')}</option>
        </select>
      </div>

      <div>
        <label>{t('amount')}</label>
        <input type="text" />
        <span>{t('balance')}: 100 USDT</span>
        <button>{t('max')}</button>
      </div>

      <button>
        {t('actions.bridge')}
      </button>

      {/* 使用通用翻译 */}
      <button>{tCommon('actions.cancel')}</button>
    </div>
  )
}
```

---

### 步骤 6: Helix 主站配置

**`apps/helix/i18n/request.ts`**:
```typescript
import { getRequestConfig } from 'next-intl/server'
import { mergeI18nMessages, getValidLocale } from '@biya/i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = getValidLocale(await requestLocale)

  // 1. 加载通用翻译
  const commonMessages = (await import(`@biya/i18n/messages/common/${locale}.json`)).default

  // 2. 加载相关领域翻译
  const walletMessages = (await import(`@biya/i18n/messages/domains/wallet/${locale}.json`)).default
  const tradingMessages = (await import(`@biya/i18n/messages/domains/trading/${locale}.json`)).default

  // 3. 加载主站特定翻译
  const helixMessages = (await import(`../messages/${locale}.json`)).default

  // 4. 合并
  const messages = mergeI18nMessages(
    commonMessages,
    { ...walletMessages, ...tradingMessages },
    helixMessages
  )

  return {
    locale,
    messages
  }
})
```

---

## 📊 翻译文件组织策略

### 方案 A: 按功能模块拆分（推荐）

```
packages/i18n/messages/
├── common/                    # 通用（所有应用）
│   ├── actions.json          # 操作按钮
│   ├── status.json           # 状态文本
│   └── form.json             # 表单验证
│
└── domains/                   # 业务领域
    ├── wallet/               # 钱包相关
    │   ├── connection.json
    │   └── transaction.json
    │
    ├── bridge/               # 跨链桥相关
    │   ├── transfer.json
    │   └── networks.json
    │
    └── trading/              # 交易相关
        ├── orders.json
        └── markets.json
```

### 方案 B: 按应用拆分

```
packages/i18n/messages/
├── shared/                    # 所有应用共享
│   └── en.json
│
├── helix/                     # Helix 相关
│   └── en.json
│
├── bridge/                    # Bridge 相关
│   └── en.json
│
└── dex/                       # DEX 相关
    └── en.json
```

**推荐使用方案 A**：更细粒度，按需加载

---

## 🎯 使用示例

### 示例 1: Bridge 表单

```typescript
'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

export function BridgeForm() {
  const t = useTranslations('Bridge')
  const tCommon = useTranslations('Common')
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    try {
      await bridge(data)
      toast.success(t('status.success'))
    } catch (error) {
      toast.error(t('errors.bridgeFailed'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{t('title')}</h1>
      
      <div>
        <label>{t('from')}</label>
        <input {...register('from', { required: true })} />
        {errors.from && <span>{tCommon('form.required')}</span>}
      </div>

      <div>
        <label>{t('amount')}</label>
        <input {...register('amount')} />
        <button type="button">{t('max')}</button>
      </div>

      <button type="submit">
        {t('actions.bridge')}
      </button>

      <button type="button">
        {tCommon('actions.cancel')}
      </button>
    </form>
  )
}
```

### 示例 2: 带参数的翻译

```typescript
const t = useTranslations('Bridge')

// 翻译: "Estimated time: 5-15 minutes"
<p>{t('info.estimatedTime', { time: '5-15 minutes' })}</p>

// 翻译: "Gas fee: ~$20"
<p>{t('info.gasFee', { fee: '20' })}</p>

// 翻译: "Minimum: 10 USDT"
<p>{t('info.minimumAmount', { amount: '10 USDT' })}</p>
```

### 示例 3: 动态切换语言

```typescript
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    // 替换 URL 中的 locale
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <select value={locale} onChange={(e) => switchLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="zh">中文</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
    </select>
  )
}
```

---

## 🔧 高级功能

### 1. 翻译验证脚本

**`packages/i18n/scripts/validate.ts`**:
```typescript
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

function getKeys(obj: any, prefix = ''): Set<string> {
  const keys = new Set<string>()
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'object' && value !== null) {
      getKeys(value, fullKey).forEach(k => keys.add(k))
    } else {
      keys.add(fullKey)
    }
  }
  
  return keys
}

function validateTranslations(dir: string) {
  const files = readdirSync(dir).filter(f => f.endsWith('.json'))
  const translations = new Map<string, Set<string>>()
  
  // 读取所有翻译文件的 key
  for (const file of files) {
    const content = JSON.parse(readFileSync(join(dir, file), 'utf-8'))
    const locale = file.replace('.json', '')
    translations.set(locale, getKeys(content))
  }
  
  // 对比 key
  const [base] = translations.entries().next().value
  const baseKeys = translations.get(base)!
  
  let hasErrors = false
  
  for (const [locale, keys] of translations) {
    if (locale === base) continue
    
    // 缺失的 key
    const missing = [...baseKeys].filter(k => !keys.has(k))
    if (missing.length > 0) {
      console.error(`❌ ${locale} missing keys:`, missing)
      hasErrors = true
    }
    
    // 多余的 key
    const extra = [...keys].filter(k => !baseKeys.has(k))
    if (extra.length > 0) {
      console.warn(`⚠️  ${locale} extra keys:`, extra)
    }
  }
  
  if (!hasErrors) {
    console.log('✅ All translations are valid!')
  }
  
  return !hasErrors
}

// 运行验证
validateTranslations('./messages/common')
validateTranslations('./messages/domains/bridge')
```

**运行**:
```bash
pnpm --filter @biya/i18n validate
```

---

### 2. 自动生成类型

**`packages/i18n/scripts/generate-types.ts`**:
```typescript
import { readFileSync, writeFileSync } from 'fs'

function generateTypes(enJsonPath: string, outputPath: string) {
  const content = JSON.parse(readFileSync(enJsonPath, 'utf-8'))
  
  function getType(obj: any, indent = 0): string {
    const spaces = '  '.repeat(indent)
    let result = '{\n'
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        result += `${spaces}  ${key}: ${getType(value, indent + 1)}\n`
      } else {
        result += `${spaces}  ${key}: string\n`
      }
    }
    
    result += `${spaces}}`
    return result
  }
  
  const typeDefinition = `
// Auto-generated by generate-types.ts
// DO NOT EDIT MANUALLY

export interface Messages ${getType(content)}
`
  
  writeFileSync(outputPath, typeDefinition)
  console.log(`✅ Types generated: ${outputPath}`)
}

generateTypes('./messages/common/en.json', './types/messages.d.ts')
```

---

## ✅ 最佳实践

### 1. 命名规范

```json
{
  "Namespace": {
    "category": {
      "item": "Translation"
    }
  }
}
```

**示例**:
```json
{
  "Bridge": {
    "actions": {
      "bridge": "Bridge",
      "approve": "Approve"
    },
    "errors": {
      "insufficientBalance": "Insufficient balance"
    }
  }
}
```

### 2. 保持一致性

✅ **好的做法**:
```json
{
  "Common": {
    "actions": {
      "confirm": "Confirm",
      "cancel": "Cancel",
      "submit": "Submit"
    }
  }
}
```

❌ **不好的做法**:
```json
{
  "actions": {
    "confirm": "Confirm",
    "cancelButton": "Cancel",  // 不一致
    "submitForm": "Submit"     // 不一致
  }
}
```

### 3. 使用变量

```json
{
  "greeting": "Hello, {name}!",
  "balance": "Balance: {amount} {token}",
  "estimatedTime": "Estimated time: {min}-{max} minutes"
}
```

### 4. 复数形式

```json
{
  "itemCount": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
}
```

### 5. 日期和数字格式

```typescript
import { useFormatter } from 'next-intl'

const format = useFormatter()

// 日期
format.dateTime(new Date(), { dateStyle: 'full' })

// 数字
format.number(1234.56, { style: 'currency', currency: 'USD' })
```

---

## 📦 Package.json 配置

### Root `package.json`

```json
{
  "scripts": {
    "i18n:validate": "pnpm --filter @biya/i18n validate",
    "i18n:generate-types": "pnpm --filter @biya/i18n generate-types"
  }
}
```

### `packages/i18n/package.json`

```json
{
  "name": "@biya/i18n",
  "scripts": {
    "validate": "tsx scripts/validate.ts",
    "generate-types": "tsx scripts/generate-types.ts"
  },
  "dependencies": {
    "deepmerge": "^4.3.1"
  },
  "devDependencies": {
    "tsx": "^4.7.0"
  }
}
```

---

## 🎯 总结

### 架构优势

✅ **代码复用**: 通用翻译只维护一份  
✅ **灵活性**: 每个应用可覆盖通用翻译  
✅ **可维护性**: 分层清晰，易于管理  
✅ **类型安全**: 自动生成 TypeScript 类型  
✅ **性能**: 按需加载，减少 Bundle 体积  

### 文件组织

```
通用翻译 (packages/i18n/messages/common/)
    ↓
领域翻译 (packages/i18n/messages/domains/)
    ↓
应用翻译 (apps/*/messages/)
```

### 使用流程

1. **定义通用翻译** → `packages/i18n/messages/common/`
2. **定义领域翻译** → `packages/i18n/messages/domains/bridge/`
3. **定义应用翻译** → `apps/bridge/messages/`
4. **合并翻译** → `apps/bridge/i18n/request.ts`
5. **使用翻译** → 组件中使用 `useTranslations()`

---

## 📚 参考资源

- [next-intl 文档](https://next-intl-docs.vercel.app/)
- [i18n 最佳实践](https://github.com/i18next/i18next)
- [Monorepo 管理](https://pnpm.io/workspaces)

---

*最后更新: 2025-10-30*

