# Framer Motion 完全指南

## 🎨 什么是 Framer Motion？

**Framer Motion** 是一个为 React 设计的**生产级动画库**，让你能用简单的代码创建流畅、专业的动画效果。

### 核心特点

| 特性 | 说明 |
|-----|------|
| **声明式 API** | 用 React 组件的方式写动画 |
| **性能优异** | 基于 GPU 加速，60fps 流畅 |
| **易学易用** | 几行代码实现复杂动画 |
| **功能丰富** | 手势、拖拽、滚动触发等 |
| **TypeScript** | 完整的类型支持 |

---

## 🆚 对比其他动画方案

### 传统方案 vs Framer Motion

| 方案 | 代码量 | 学习曲线 | 性能 | 推荐度 |
|-----|-------|---------|------|--------|
| **CSS 动画** | 少 | 简单 | 好 | ⭐⭐⭐ |
| **CSS Transitions** | 少 | 简单 | 好 | ⭐⭐⭐ |
| **React Spring** | 多 | 陡峭 | 优秀 | ⭐⭐⭐ |
| **GSAP** | 多 | 中等 | 优秀 | ⭐⭐⭐⭐ |
| **Framer Motion** | **少** | **平缓** | **优秀** | **⭐⭐⭐⭐⭐** |

---

## 🚀 快速入门

### 1. 安装

```bash
npm install framer-motion
```

### 2. 基础用法

#### 淡入动画（最简单）

```tsx
import { motion } from 'framer-motion'

export function FadeInComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}      // 初始状态
      animate={{ opacity: 1 }}      // 动画目标
      transition={{ duration: 0.5 }} // 动画时长
    >
      Hello World
    </motion.div>
  )
}
```

#### 滑入动画

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}      // 从下方 50px 开始
  animate={{ opacity: 1, y: 0 }}       // 移动到原位
  transition={{ duration: 0.6 }}
>
  Content slides up
</motion.div>
```

#### 缩放动画

```tsx
<motion.div
  initial={{ scale: 0 }}               // 从 0 开始
  animate={{ scale: 1 }}               // 放大到正常大小
  transition={{ duration: 0.5 }}
>
  Content scales in
</motion.div>
```

---

## 💡 核心概念

### 1. motion 组件

Framer Motion 为所有 HTML 元素提供了 `motion` 版本：

```tsx
// 普通 React 组件
<div>Content</div>
<button>Click</button>
<img src="..." />

// motion 版本（可以添加动画）
<motion.div>Content</motion.div>
<motion.button>Click</motion.button>
<motion.img src="..." />
```

### 2. 三个关键属性

```tsx
<motion.div
  initial={...}      // 初始状态
  animate={...}      // 目标状态
  transition={...}   // 过渡配置
/>
```

### 3. 动画属性

可以动画化的属性：

```tsx
{
  // 位置
  x: 100,           // 水平移动
  y: 50,            // 垂直移动
  
  // 缩放
  scale: 1.5,       // 整体缩放
  scaleX: 1.2,      // 水平缩放
  scaleY: 0.8,      // 垂直缩放
  
  // 旋转
  rotate: 45,       // 旋转角度
  rotateX: 180,     // 3D 旋转
  
  // 透明度
  opacity: 0.5,     // 透明度
  
  // 其他
  backgroundColor: '#ff0000',  // 背景色
  borderRadius: '50%',         // 圆角
}
```

---

## 🎯 官网常用场景

### 场景 1：页面进入动画

```tsx
// components/PageTransition.tsx
import { motion } from 'framer-motion'

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// 使用
<PageTransition>
  <HomePage />
</PageTransition>
```

### 场景 2：滚动触发动画

```tsx
// components/ScrollReveal.tsx
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })  // 只触发一次

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}

// 使用
<ScrollReveal>
  <h2>This appears when you scroll to it</h2>
</ScrollReveal>
```

### 场景 3：按钮悬停效果

```tsx
// components/AnimatedButton.tsx
import { motion } from 'framer-motion'

export function AnimatedButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,                    // 放大 5%
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
      whileTap={{ scale: 0.95 }}       // 点击时缩小
      transition={{ duration: 0.2 }}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg"
    >
      {children}
    </motion.button>
  )
}
```

### 场景 4：卡片列表动画

```tsx
// components/CardList.tsx
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1  // 每个子元素延迟 0.1s
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function CardList() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-4"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          variants={item}
          className="p-6 bg-white rounded-lg shadow"
        >
          Card {i}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### 场景 5：数字滚动动画

```tsx
// components/AnimatedNumber.tsx
import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { duration: 2000 })
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}

// 使用
<AnimatedNumber value={1234567} />
// 显示：0 → 1,234,567 (2秒内滚动)
```

---

## 🎨 官网实战案例

### 案例 1：Hero Section 动画

```tsx
// components/sections/HeroSection.tsx
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* 标题淡入 + 上移 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold mb-6"
        >
          Welcome to Biya
        </motion.h1>

        {/* 副标题延迟出现 */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-600 mb-8"
        >
          Institutional-Grade Digital Assets
        </motion.p>

        {/* 按钮延迟 + 缩放 */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  )
}
```

### 案例 2：Features Section 滚动动画

```tsx
// components/sections/FeaturesSection.tsx
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  { title: 'Security', description: 'Bank-grade security' },
  { title: 'Yield', description: 'Stable returns' },
  { title: 'Transparency', description: 'Full visibility' },
]

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto grid grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  )
}
```

### 案例 3：导航栏动画

```tsx
// components/layout/Header.tsx
import { motion, useScroll, useTransform } from 'framer-motion'

export function Header() {
  const { scrollY } = useScroll()
  
  // 滚动时改变背景透明度
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  )
  
  // 滚动时改变阴影
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ['0 0 0 rgba(0,0,0,0)', '0 2px 10px rgba(0,0,0,0.1)']
  )

  return (
    <motion.header
      style={{ backgroundColor, boxShadow }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="container mx-auto flex items-center justify-between py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Logo
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-6"
        >
          <a href="/products">Products</a>
          <a href="/about">About</a>
        </motion.div>
      </nav>
    </motion.header>
  )
}
```

---

## ⚡ 性能优化技巧

### 1. 使用 transform 属性（GPU 加速）

```tsx
// ✅ 好：使用 transform（GPU 加速）
<motion.div
  animate={{ x: 100, y: 50, scale: 1.2 }}
/>

// ❌ 差：使用 left/top（CPU 计算）
<motion.div
  animate={{ left: '100px', top: '50px' }}
/>
```

### 2. 避免动画化昂贵属性

```tsx
// ✅ 好：动画化 transform、opacity
<motion.div
  animate={{ scale: 1.2, opacity: 0.8 }}
/>

// ❌ 差：动画化 width、height（触发重排）
<motion.div
  animate={{ width: '200px', height: '300px' }}
/>
```

### 3. 使用 layout prop（智能动画）

```tsx
// 自动处理布局变化的动画
<motion.div layout>
  {isExpanded && <p>Extra content</p>}
</motion.div>
```

---

## 📦 在项目中使用

### 1. 安装

```bash
npm install framer-motion
```

### 2. 创建可复用组件

```tsx
// components/animations/FadeIn.tsx
import { motion } from 'framer-motion'

export function FadeIn({ children, delay = 0 }: { 
  children: React.ReactNode
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

// 使用
<FadeIn delay={0.2}>
  <h1>Title</h1>
</FadeIn>
```

### 3. 全局动画配置

```tsx
// lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
}

// 使用
import { fadeInUp } from '@/lib/animations'

<motion.div {...fadeInUp}>
  Content
</motion.div>
```

---

## 🎯 官网推荐使用场景

| 场景 | 动画效果 | 难度 |
|-----|---------|------|
| **页面进入** | 淡入 + 上移 | ⭐ |
| **滚动触发** | 元素逐个出现 | ⭐⭐ |
| **按钮悬停** | 放大 + 阴影 | ⭐ |
| **卡片列表** | 错位动画 | ⭐⭐ |
| **数字统计** | 数字滚动 | ⭐⭐⭐ |
| **导航栏** | 滚动时变化 | ⭐⭐ |
| **模态框** | 淡入 + 缩放 | ⭐⭐ |

---

## 📊 对比：CSS vs Framer Motion

### 同样的淡入效果

#### CSS 方式

```css
.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
```

```tsx
<div className="fade-in">Content</div>
```

#### Framer Motion 方式

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**优势：**
- ✅ 更灵活（可以程序化控制）
- ✅ 更强大（手势、滚动触发等）
- ✅ 更易维护（逻辑在 JS 中）

---

## ✅ 总结

### Framer Motion 是什么？

```
一个让 React 动画变得简单的库

特点：
✅ 声明式 API（像写 React 组件一样写动画）
✅ 性能优异（GPU 加速，60fps）
✅ 功能强大（手势、滚动、拖拽等）
✅ 易学易用（几行代码实现复杂动画）
✅ TypeScript 支持完整

适用场景：
✅ 官网页面动画
✅ 交互反馈（按钮、卡片）
✅ 滚动触发动画
✅ 页面过渡
✅ 数据可视化
```

### 为什么推荐给官网项目？

```
1. ✅ 提升用户体验
   - 流畅的动画让网站更专业
   - 视觉反馈增强交互感

2. ✅ 开发效率高
   - 简单的 API
   - 可复用的动画组件
   - 不需要写复杂的 CSS

3. ✅ 性能优异
   - 基于 GPU 加速
   - 60fps 流畅动画
   - 不影响页面性能

4. ✅ 行业标准
   - 很多顶级网站在用
   - 社区活跃，文档完善
```

### 快速开始

```bash
# 1. 安装
npm install framer-motion

# 2. 使用
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Hello World
</motion.div>
```

需要我：
1. 创建完整的动画组件库？
2. 实现具体的官网动画效果？
3. 提供更多实战案例？ 🚀

