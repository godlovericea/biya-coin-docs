# 🌍 i18n 快速参考

> **适用于**: Biya Monorepo  
> **完整文档**: [I18N_IN_MONOREPO.md](./I18N_IN_MONOREPO.md)

---

## 📁 文件结构

```
packages/i18n/               # 共享翻译包
  ├── messages/
  │   ├── common/           # 通用翻译（所有应用）
  │   │   ├── en.json
  │   │   └── zh.json
  │   └── domains/
  │       └── bridge/       # Bridge 领域翻译
  │           ├── en.json
  │           └── zh.json
  └── utils/
      └── merge-messages.ts

apps/bridge/
  ├── messages/             # Bridge 特定翻译
  │   ├── en.json
  │   └── zh.json
  └── i18n/
      └── request.ts        # 合并配置
```

---

## 🚀 快速开始

### 1. 运行自动化脚本

```powershell
cd D:\rwa\biya-coin
.\docs\bridge\setup-i18n.ps1
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 在组件中使用

```typescript
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('Bridge')
  const tCommon = useTranslations('Common')

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('actions.bridge')}</button>
      <button>{tCommon('actions.cancel')}</button>
    </div>
  )
}
```

---

## 📝 翻译文件格式

### 通用翻译 (`packages/i18n/messages/common/en.json`)

```json
{
  "Common": {
    "actions": {
      "confirm": "Confirm",
      "cancel": "Cancel"
    }
  },
  "Wallet": {
    "connect": "Connect Wallet"
  }
}
```

### 领域翻译 (`packages/i18n/messages/domains/bridge/en.json`)

```json
{
  "Bridge": {
    "title": "Cross-Chain Bridge",
    "actions": {
      "bridge": "Bridge",
      "approve": "Approve"
    }
  }
}
```

### 应用翻译 (`apps/bridge/messages/en.json`)

```json
{
  "BridgePage": {
    "title": "Biya Bridge",
    "subtitle": "Fast and secure"
  }
}
```

---

## 🎯 使用场景

### 场景 1: 基本使用

```typescript
const t = useTranslations('Bridge')

<h1>{t('title')}</h1>
// 输出: Cross-Chain Bridge
```

### 场景 2: 带参数

```typescript
// 翻译: "Balance: {amount} {token}"
<p>{t('balance', { amount: '100', token: 'USDT' })}</p>
// 输出: Balance: 100 USDT
```

### 场景 3: 多个命名空间

```typescript
const t = useTranslations('Bridge')
const tCommon = useTranslations('Common')
const tWallet = useTranslations('Wallet')

<div>
  <h1>{t('title')}</h1>
  <button>{tCommon('actions.confirm')}</button>
  <span>{tWallet('balance')}: 100</span>
</div>
```

### 场景 4: 切换语言

```typescript
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <select value={locale} onChange={(e) => switchLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  )
}
```

---

## 🔄 翻译合并优先级

```
应用翻译 (apps/bridge/messages/)
    ↓ 覆盖
领域翻译 (packages/i18n/messages/domains/bridge/)
    ↓ 覆盖
通用翻译 (packages/i18n/messages/common/)
```

**示例**:
- 通用: `{ "Common": { "actions": { "cancel": "Cancel" } } }`
- Bridge: `{ "Common": { "actions": { "cancel": "取消桥接" } } }`
- 最终: Bridge 中显示 "取消桥接"

---

## 📦 配置文件

### `apps/bridge/i18n/request.ts`

```typescript
import { getRequestConfig } from 'next-intl/server'
import { mergeI18nMessages, getValidLocale } from '@biya/i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = getValidLocale(await requestLocale)

  // 加载翻译
  const commonMessages = (await import(`@biya/i18n/messages/common/${locale}.json`)).default
  const bridgeDomainMessages = (await import(`@biya/i18n/messages/domains/bridge/${locale}.json`)).default
  const bridgeAppMessages = (await import(`../messages/${locale}.json`)).default

  // 合并
  const messages = mergeI18nMessages(
    commonMessages,
    bridgeDomainMessages,
    bridgeAppMessages
  )

  return { locale, messages }
})
```

---

## 🎨 最佳实践

### ✅ 好的做法

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

- 使用命名空间 (`Bridge`)
- 按类别分组 (`actions`, `errors`)
- 使用驼峰命名 (`insufficientBalance`)

### ❌ 避免

```json
{
  "bridge_button": "Bridge",           // ❌ 扁平结构
  "BridgeError1": "Error",             // ❌ 无意义的名称
  "insufficient-balance": "Error"      // ❌ 使用短横线
}
```

---

## 🐛 常见问题

### Q: 翻译不生效？

**A**: 检查以下几点：
1. 文件路径是否正确
2. JSON 格式是否有效
3. 是否重启了开发服务器
4. namespace 是否正确

### Q: 如何添加新语言？

**A**: 
1. 在 `packages/i18n/utils/get-locale.ts` 添加语言代码
2. 创建对应的 JSON 文件（如 `ja.json`）
3. 复制并翻译内容

### Q: 如何验证翻译完整性？

**A**:
```bash
pnpm i18n:validate
```

### Q: 类型提示不工作？

**A**:
```bash
pnpm i18n:generate-types
```

---

## 📊 对比表

| 特性 | 独立翻译 | 共享翻译包 |
|------|---------|-----------|
| 代码重复 | ❌ 高 | ✅ 低 |
| 维护成本 | ❌ 高 | ✅ 低 |
| 灵活性 | ✅ 高 | ✅ 高 |
| 一致性 | ❌ 低 | ✅ 高 |
| Bundle 体积 | ❌ 大 | ✅ 小 |

---

## 🔗 相关资源

- [完整文档](./I18N_IN_MONOREPO.md)
- [自动化脚本](./setup-i18n.ps1)
- [next-intl 文档](https://next-intl-docs.vercel.app/)

---

## 📞 获取帮助

遇到问题？
1. 查看[完整文档](./I18N_IN_MONOREPO.md)
2. 检查控制台错误
3. 验证 JSON 格式

---

**开始使用吧！🚀**

