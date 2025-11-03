# 🎨 全局主题管理方案

> **场景**: 明暗模式切换、主题颜色、所有应用同步  
> **方案**: 共享 Zustand Store + Tailwind CSS + next-themes  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [核心方案](#核心方案)
2. [实施步骤](#实施步骤)
3. [代码示例](#代码示例)
4. [高级功能](#高级功能)
5. [最佳实践](#最佳实践)

---

## 💡 核心方案

### 为什么主题是共享状态？

```
用户在 Bridge 切换到暗色模式
    ↓
跳转到 DEX
    ↓
期望：DEX 也是暗色模式 ✅
    ↓
所以：主题状态必须共享！
```

### 技术栈

```
Zustand Store (状态管理)
    ↓
next-themes (Next.js 主题支持)
    ↓
Tailwind CSS (样式实现)
    ↓
localStorage (持久化)
```

---

## 🚀 实施步骤

### 步骤 1: 创建主题 Store

#### 1.1 `packages/shared/theme/store.ts`

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  // 状态
  theme: Theme
  
  // 操作
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // 初始主题
      theme: 'system',
      
      // 设置主题
      setTheme: (theme: Theme) => {
        set({ theme })
        
        // 同步到 HTML
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          // system: 根据系统偏好
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          document.documentElement.classList.toggle('dark', isDark)
        }
      },
      
      // 切换主题
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'biya-theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

#### 1.2 `packages/shared/theme/useTheme.ts`

```typescript
import { useEffect } from 'react'
import { useThemeStore } from './store'

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore()

  // 初始化：应用保存的主题
  useEffect(() => {
    const savedTheme = useThemeStore.getState().theme
    useThemeStore.getState().setTheme(savedTheme)
  }, [])

  // 监听系统主题变化
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches)
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  }
}
```

#### 1.3 `packages/shared/theme/index.ts`

```typescript
export * from './store'
export * from './useTheme'

export type { Theme, ThemeState } from './store'
```

---

### 步骤 2: 配置 Tailwind CSS

#### 2.1 全局 Tailwind 配置 (`packages/shared/styles/tailwind-base.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 使用 class 策略
  theme: {
    extend: {
      colors: {
        // 自定义主题颜色
        background: {
          light: '#ffffff',
          dark: '#0a0a0a',
        },
        foreground: {
          light: '#000000',
          dark: '#ffffff',
        },
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
        // 或使用 CSS 变量
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
      },
    },
  },
}
```

#### 2.2 各应用引用基础配置

**`apps/bridge/tailwind.config.js`**:
```javascript
const baseConfig = require('@biya/shared/styles/tailwind-base')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/**/*.{js,ts,jsx,tsx}', // 包含共享组件
  ],
}
```

---

### 步骤 3: 全局样式

#### 3.1 `packages/shared/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 方案 1: 使用 Tailwind 颜色 */
@layer base {
  :root {
    /* 亮色主题 */
    --background: 255 255 255;
    --foreground: 0 0 0;
    --primary: 59 130 246;
    --secondary: 107 114 128;
    --accent: 168 85 247;
    --muted: 243 244 246;
    --border: 229 231 235;
  }

  .dark {
    /* 暗色主题 */
    --background: 10 10 10;
    --foreground: 255 255 255;
    --primary: 96 165 250;
    --secondary: 156 163 175;
    --accent: 192 132 252;
    --muted: 31 41 55;
    --border: 55 65 81;
  }
}

/* 方案 2: 直接使用 CSS 变量 */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #000000;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
}

.dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1f2937;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --border-color: #374151;
}

/* 平滑过渡 */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* 避免主题切换时的闪烁 */
html {
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}
```

---

### 步骤 4: 创建主题切换组件

#### 4.1 `packages/shared/components/ThemeToggle.tsx`

```typescript
'use client'

import { useTheme } from '../theme/useTheme'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded transition-colors ${
          theme === 'light' 
            ? 'bg-primary text-white' 
            : 'hover:bg-background'
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded transition-colors ${
          theme === 'dark' 
            ? 'bg-primary text-white' 
            : 'hover:bg-background'
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded transition-colors ${
          theme === 'system' 
            ? 'bg-primary text-white' 
            : 'hover:bg-background'
        }`}
        aria-label="System theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  )
}
```

#### 4.2 简化版：`ThemeToggleSimple.tsx`

```typescript
'use client'

import { useTheme } from '../theme/useTheme'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggleSimple() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}
```

---

### 步骤 5: 在应用中使用

#### 5.1 Bridge 应用

**`apps/bridge/app/layout.tsx`**:
```typescript
import { ThemeToggle } from '@biya/shared/components'
import '@biya/shared/styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationMismatch>
      <body className="bg-background text-foreground">
        <nav className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Biya Bridge</h1>
            
            {/* 主题切换按钮 */}
            <ThemeToggle />
          </div>
        </nav>
        
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
```

#### 5.2 使用主题感知的组件

```typescript
'use client'

import { useTheme } from '@biya/shared/theme'

export function ThemedCard() {
  const { isDark } = useTheme()

  return (
    <div className="p-6 rounded-lg bg-background border border-border">
      <h2 className="text-xl font-bold text-foreground">
        Welcome to {isDark ? 'Dark' : 'Light'} Mode
      </h2>
      <p className="text-secondary mt-2">
        This card adapts to your theme preference.
      </p>
    </div>
  )
}
```

---

## 🎨 高级功能

### 1. 自定义主题颜色

#### 1.1 扩展主题 Store

```typescript
// packages/shared/theme/store.ts
export type ThemeColor = 'blue' | 'purple' | 'green' | 'red'

export interface ThemeState {
  theme: Theme
  color: ThemeColor  // 新增
  
  setTheme: (theme: Theme) => void
  setColor: (color: ThemeColor) => void  // 新增
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      color: 'blue',  // 默认颜色
      
      setTheme: (theme) => set({ theme }),
      
      setColor: (color) => {
        set({ color })
        // 应用颜色到 CSS 变量
        document.documentElement.setAttribute('data-theme-color', color)
      },
      
      toggleTheme: () => { /* ... */ },
    }),
    {
      name: 'biya-theme-storage',
    }
  )
)
```

#### 1.2 CSS 颜色变量

```css
/* packages/shared/styles/globals.css */
:root[data-theme-color="blue"] {
  --primary: 59 130 246;
  --primary-hover: 37 99 235;
}

:root[data-theme-color="purple"] {
  --primary: 168 85 247;
  --primary-hover: 147 51 234;
}

:root[data-theme-color="green"] {
  --primary: 34 197 94;
  --primary-hover: 22 163 74;
}

:root[data-theme-color="red"] {
  --primary: 239 68 68;
  --primary-hover: 220 38 38;
}
```

#### 1.3 颜色选择器组件

```typescript
'use client'

import { useTheme } from '@biya/shared/theme'

const colors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
]

export function ColorPicker() {
  const { color, setColor } = useTheme()

  return (
    <div className="flex gap-2">
      {colors.map((c) => (
        <button
          key={c.value}
          onClick={() => setColor(c.value as ThemeColor)}
          className={`w-8 h-8 rounded-full ${c.class} ${
            color === c.value ? 'ring-2 ring-offset-2 ring-primary' : ''
          }`}
          aria-label={c.name}
        />
      ))}
    </div>
  )
}
```

---

### 2. 主题预设（Theme Presets）

```typescript
// packages/shared/theme/presets.ts
export const themePresets = {
  default: {
    light: {
      background: '#ffffff',
      foreground: '#000000',
      primary: '#3b82f6',
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#ffffff',
      primary: '#60a5fa',
    },
  },
  ocean: {
    light: {
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      primary: '#0284c7',
    },
    dark: {
      background: '#082f49',
      foreground: '#e0f2fe',
      primary: '#38bdf8',
    },
  },
  forest: {
    light: {
      background: '#f0fdf4',
      foreground: '#14532d',
      primary: '#16a34a',
    },
    dark: {
      background: '#14532d',
      foreground: '#dcfce7',
      primary: '#4ade80',
    },
  },
}
```

---

### 3. 防止闪烁（Flash Prevention）

#### 3.1 服务端渲染初始化脚本

```typescript
// packages/shared/theme/ThemeScript.tsx
export function ThemeScript() {
  const script = `
    (function() {
      const theme = localStorage.getItem('biya-theme-storage')
      const themeData = theme ? JSON.parse(theme) : { state: { theme: 'system' } }
      const themeMode = themeData.state.theme
      
      if (themeMode === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (themeMode === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.classList.toggle('dark', isDark)
      }
    })()
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
```

**在 `layout.tsx` 中使用**:
```typescript
import { ThemeScript } from '@biya/shared/theme'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationMismatch>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## ✅ 最佳实践

### 1. 使用 Tailwind 颜色类

```typescript
// ✅ 好的做法：使用 Tailwind 类
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">Title</h1>
  <p className="text-secondary">Description</p>
</div>

// ❌ 不好的做法：硬编码颜色
<div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
  <h1 style={{ color: '#3b82f6' }}>Title</h1>
</div>
```

### 2. 主题感知的图片

```typescript
'use client'

import { useTheme } from '@biya/shared/theme'

export function Logo() {
  const { isDark } = useTheme()

  return (
    <img 
      src={isDark ? '/logo-dark.svg' : '/logo-light.svg'} 
      alt="Logo" 
    />
  )
}
```

### 3. 条件样式

```typescript
import { cn } from '@biya/shared/utils'

export function Card({ children }) {
  return (
    <div className={cn(
      'p-4 rounded-lg',
      'bg-white dark:bg-gray-900',
      'text-black dark:text-white',
      'border border-gray-200 dark:border-gray-800'
    )}>
      {children}
    </div>
  )
}
```

---

## 📊 完整示例

### Bridge 应用完整实现

```typescript
// apps/bridge/app/layout.tsx
import { ThemeToggle, ThemeScript } from '@biya/shared'
import '@biya/shared/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationMismatch>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-background text-foreground">
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">Biya Bridge</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </nav>
        
        <main className="min-h-screen p-4">{children}</main>
        
        <footer className="border-t border-border bg-muted">
          <div className="container mx-auto px-4 py-6 text-center text-secondary">
            © 2025 Biya Bridge
          </div>
        </footer>
      </body>
    </html>
  )
}

// apps/bridge/app/page.tsx
'use client'

import { useTheme } from '@biya/shared/theme'

export default function BridgePage() {
  const { isDark, theme } = useTheme()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 rounded-lg bg-card border border-border">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Cross-Chain Bridge
        </h1>
        <p className="text-secondary">
          Current theme: {theme} ({isDark ? 'Dark' : 'Light'} mode)
        </p>
        
        <div className="mt-6 p-4 rounded bg-primary/10 border border-primary/20">
          <p className="text-primary font-medium">
            This component adapts to your theme preference!
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## 🎯 总结

### 核心要点

1. **主题是共享状态** → `packages/shared/theme/`
2. **使用 Tailwind CSS** → 语义化颜色类
3. **持久化用户偏好** → localStorage
4. **所有应用同步** → 统一的 Store
5. **防止闪烁** → ThemeScript

### 文件结构

```
packages/shared/
  ├── theme/
  │   ├── store.ts              # Zustand Store
  │   ├── useTheme.ts           # React Hook
  │   ├── ThemeScript.tsx       # 防闪烁脚本
  │   └── index.ts
  ├── components/
  │   ├── ThemeToggle.tsx       # 主题切换组件
  │   └── ColorPicker.tsx       # 颜色选择器
  └── styles/
      ├── globals.css           # 全局样式
      └── tailwind-base.js      # Tailwind 基础配置

apps/bridge/
  └── app/
      └── layout.tsx            # 引入 ThemeToggle
```

---

## 📚 相关文档

- [状态管理策略](./STATE_MANAGEMENT_STRATEGY.md)
- [共享功能方案](./SHARED_FEATURES_IN_MONOREPO.md)

---

*最后更新: 2025-10-30*

