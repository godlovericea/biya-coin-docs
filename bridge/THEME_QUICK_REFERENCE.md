# 🎨 主题管理快速参考

> **1 分钟速查** | 完整文档：[THEME_MANAGEMENT.md](./THEME_MANAGEMENT.md)

---

## 🎯 核心方案

### 主题 = 共享状态

```
packages/shared/theme/  ← 所有应用共享
    ├── store.ts       # Zustand Store
    ├── useTheme.ts    # React Hook
    └── ThemeScript.tsx # 防闪烁
```

---

## 🚀 快速实现

### 1. 创建主题 Store

```typescript
// packages/shared/theme/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'system',
      
      setTheme: (theme: Theme) => {
        set({ theme })
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },
      
      toggleTheme: () => {
        const current = useThemeStore.getState().theme
        const next = current === 'light' ? 'dark' : 'light'
        useThemeStore.getState().setTheme(next)
      },
    }),
    { name: 'biya-theme-storage' }
  )
)
```

### 2. 创建主题切换组件

```typescript
// packages/shared/components/ThemeToggle.tsx
'use client'
import { useThemeStore } from '../theme/store'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}
```

### 3. 配置 Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // ← 重要！
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
      },
    },
  },
}
```

### 4. 全局样式

```css
/* packages/shared/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 255 255 255;
  --foreground: 0 0 0;
}

.dark {
  --background: 10 10 10;
  --foreground: 255 255 255;
}
```

### 5. 在应用中使用

```typescript
// apps/bridge/app/layout.tsx
import { ThemeToggle } from '@biya/shared/components'
import '@biya/shared/styles/globals.css'

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <nav>
          <ThemeToggle />  {/* ← 添加这里 */}
        </nav>
        {children}
      </body>
    </html>
  )
}
```

---

## 💡 使用示例

### 主题感知组件

```typescript
'use client'
import { useThemeStore } from '@biya/shared/theme'

export function Card() {
  const { theme } = useThemeStore()

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded">
      Current theme: {theme}
    </div>
  )
}
```

### 条件样式

```typescript
<div className={cn(
  'p-4 rounded',
  'bg-white dark:bg-gray-900',
  'text-black dark:text-white',
  'border border-gray-200 dark:border-gray-800'
)}>
  Themed Card
</div>
```

---

## ✅ 要点

| 特性 | 实现 |
|------|------|
| 状态存储 | Zustand + persist |
| 样式实现 | Tailwind CSS dark: |
| 持久化 | localStorage |
| 作用域 | 所有应用共享 |
| 同步 | 自动同步 |

---

## 🎯 完整流程

```
用户点击切换按钮
    ↓
useThemeStore.toggleTheme()
    ↓
document.classList.toggle('dark')
    ↓
Tailwind CSS 应用 dark: 样式
    ↓
localStorage 保存偏好
    ↓
所有应用自动同步
```

---

## 🐛 防闪烁

```typescript
// packages/shared/theme/ThemeScript.tsx
export function ThemeScript() {
  const script = `
    (function() {
      const saved = localStorage.getItem('biya-theme-storage')
      const theme = saved ? JSON.parse(saved).state.theme : 'system'
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    })()
  `
  
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

// 在 layout.tsx 使用
<html>
  <head>
    <ThemeScript />  {/* ← 防止闪烁 */}
  </head>
  <body>...</body>
</html>
```

---

## 🎨 主题颜色

### 语义化颜色

```css
:root {
  --background: 255 255 255;
  --foreground: 0 0 0;
  --primary: 59 130 246;
  --secondary: 107 114 128;
  --muted: 243 244 246;
  --border: 229 231 235;
}

.dark {
  --background: 10 10 10;
  --foreground: 255 255 255;
  --primary: 96 165 250;
  --secondary: 156 163 175;
  --muted: 31 41 55;
  --border: 55 65 81;
}
```

### 在组件中使用

```typescript
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-secondary">Description</p>
  <div className="bg-muted p-4 border border-border">
    Content
  </div>
</div>
```

---

## 📁 文件结构

```
packages/shared/
  ├── theme/
  │   ├── store.ts              # Zustand Store
  │   ├── useTheme.ts           # Hook (可选)
  │   └── ThemeScript.tsx       # 防闪烁
  ├── components/
  │   └── ThemeToggle.tsx       # 切换按钮
  └── styles/
      └── globals.css           # 全局样式

apps/bridge/
  └── app/
      └── layout.tsx            # 引入 ThemeToggle
```

---

## 🔗 相关文档

- [完整文档](./THEME_MANAGEMENT.md)
- [状态管理策略](./STATE_MANAGEMENT_STRATEGY.md)

---

**记住：主题是共享状态，所有应用自动同步！** 🎨

