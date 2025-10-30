# 官网静态资源管理方案

## 🎯 资源分类与策略

### 资源分类

| 类型 | 特点 | 大小 | 推荐方案 |
|-----|------|------|---------|
| **Logo/图标** | 小，不常变 | < 50KB | 本地存放 |
| **产品图片** | 中等，偶尔更新 | 100-500KB | CDN |
| **背景图/Banner** | 大，需优化 | 500KB-2MB | CDN + 优化 |
| **视频** | 很大 | > 5MB | 专业视频CDN |
| **动画/Lottie** | 中等 | 50-200KB | 本地或CDN |

---

## 🆚 方案对比

### 方案 1：全部本地存放（❌ 不推荐）

```
biya-official-website/
└── public/
    ├── images/
    │   ├── hero-bg.jpg (2MB)
    │   ├── product1.png (500KB)
    │   └── team-photo.jpg (800KB)
    └── videos/
        └── intro.mp4 (50MB)
```

**问题：**
- ❌ 首次加载慢（所有资源从服务器加载）
- ❌ 服务器带宽压力大
- ❌ 无法利用全球CDN加速
- ❌ 部署包体积巨大

**适用场景：** 
- ✅ 开发测试阶段
- ✅ 小图标、Logo（< 50KB）

---

### 方案 2：七牛云 CDN（✅ 推荐）

```typescript
// 图片存储在七牛云
const imageUrl = 'https://cdn.biya.com/images/hero-bg.jpg'

// 使用 Next.js Image 组件
<Image 
  src={imageUrl}
  width={1920}
  height={1080}
  alt="Hero Background"
/>
```

**优势：**
- ✅ 全球CDN加速
- ✅ 自动图片处理（压缩、格式转换、裁剪）
- ✅ 减轻服务器压力
- ✅ 支持图片防盗链
- ✅ 价格便宜（¥0.18/GB/月）

**适用场景：**
- ✅ 产品图片、Banner
- ✅ 营销素材
- ✅ 用户上传的内容

---

### 方案 3：Next.js + Vercel（✅ 备选）

```typescript
// 图片放在 public/ 下
<Image 
  src="/images/product.jpg"
  width={800}
  height={600}
  alt="Product"
/>
// Vercel 会自动优化并通过 CDN 分发
```

**优势：**
- ✅ 零配置（Vercel 自动处理）
- ✅ 自动图片优化
- ✅ 全球CDN
- ✅ 免费额度充足

**劣势：**
- ⚠️ 免费版有带宽限制（100GB/月）
- ⚠️ 图片处理功能没有七牛云丰富

**适用场景：**
- ✅ 访问量不大的官网
- ✅ 预算有限的项目

---

### 方案 4：混合方案（⭐ 最佳实践）

```
┌─────────────────────────────────────────┐
│          资源分类存储策略                 │
├─────────────────────────────────────────┤
│ 小图标/Logo                              │
│  └─> 本地 public/ (内联或本地加载)       │
├─────────────────────────────────────────┤
│ 产品图片/Banner                          │
│  └─> 七牛云 CDN (图片处理 + 全球加速)    │
├─────────────────────────────────────────┤
│ 视频内容                                 │
│  └─> 七牛云视频CDN 或 YouTube/Vimeo     │
├─────────────────────────────────────────┤
│ 字体文件                                 │
│  └─> Google Fonts 或自托管               │
└─────────────────────────────────────────┘
```

---

## 🚀 七牛云 CDN 实施方案

### Step 1: 七牛云账号设置

```bash
1. 注册七牛云账号：https://www.qiniu.com
2. 创建存储空间（Bucket）
   - 名称：biya-official-website
   - 区域：根据用户分布选择
   - 访问控制：公开
3. 绑定自定义域名
   - cdn.biya.com
4. 配置 HTTPS 证书
```

### Step 2: 安装七牛云 SDK

```bash
npm install qiniu
npm install @types/qiniu -D
```

### Step 3: 创建上传脚本

```typescript
// scripts/upload-to-qiniu.ts
import * as qiniu from 'qiniu'
import fs from 'fs'
import path from 'path'

const accessKey = process.env.QINIU_ACCESS_KEY!
const secretKey = process.env.QINIU_SECRET_KEY!
const bucket = 'biya-official-website'
const cdnDomain = 'https://cdn.biya.com'

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const config = new qiniu.conf.Config()
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

/**
 * 上传单个文件到七牛云
 */
async function uploadFile(localFile: string, key: string) {
  const options = {
    scope: bucket,
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)

  return new Promise((resolve, reject) => {
    formUploader.putFile(
      uploadToken,
      key,
      localFile,
      putExtra,
      (err, body, info) => {
        if (err) {
          reject(err)
        } else if (info.statusCode === 200) {
          console.log(`✅ 上传成功: ${cdnDomain}/${key}`)
          resolve(body)
        } else {
          reject(new Error(`Upload failed: ${info.statusCode}`))
        }
      }
    )
  })
}

/**
 * 批量上传文件夹
 */
async function uploadDirectory(dir: string, prefix: string = '') {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      await uploadDirectory(filePath, `${prefix}${file}/`)
    } else {
      const key = `${prefix}${file}`
      await uploadFile(filePath, key)
    }
  }
}

// 执行上传
uploadDirectory('./public/images', 'images/')
  .then(() => console.log('✅ 所有文件上传完成'))
  .catch(err => console.error('❌ 上传失败:', err))
```

### Step 4: 配置环境变量

```bash
# .env.local
QINIU_ACCESS_KEY=your_access_key
QINIU_SECRET_KEY=your_secret_key
QINIU_BUCKET=biya-official-website
QINIU_DOMAIN=https://cdn.biya.com
```

### Step 5: 添加上传命令

```json
// package.json
{
  "scripts": {
    "upload": "ts-node scripts/upload-to-qiniu.ts",
    "upload:images": "ts-node scripts/upload-to-qiniu.ts images",
    "upload:videos": "ts-node scripts/upload-to-qiniu.ts videos"
  }
}
```

---

## 🎨 使用方式

### 方案 A：直接使用 CDN URL

```typescript
// lib/cdn.ts
export const CDN_URL = process.env.NEXT_PUBLIC_QINIU_DOMAIN || ''

export function getCDNUrl(path: string) {
  return `${CDN_URL}/${path}`
}

// 七牛云图片处理参数
export function getImageUrl(
  path: string, 
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  }
) {
  let url = getCDNUrl(path)
  
  if (options) {
    const params = []
    if (options.width) params.push(`w/${options.width}`)
    if (options.height) params.push(`h/${options.height}`)
    if (options.quality) params.push(`q/${options.quality}`)
    if (options.format) params.push(`format/${options.format}`)
    
    if (params.length > 0) {
      url += `?imageView2/2/${params.join('/')}`
    }
  }
  
  return url
}
```

**使用：**

```tsx
// components/sections/HeroSection.tsx
import Image from 'next/image'
import { getImageUrl } from '@/lib/cdn'

export function HeroSection() {
  return (
    <div className="relative">
      <Image
        src={getImageUrl('images/hero-bg.jpg', {
          width: 1920,
          quality: 80,
          format: 'webp'
        })}
        width={1920}
        height={1080}
        alt="Hero Background"
        priority
      />
    </div>
  )
}
```

### 方案 B：创建 CDN Image 组件

```tsx
// components/ui/CDNImage.tsx
import Image, { ImageProps } from 'next/image'
import { getImageUrl } from '@/lib/cdn'

interface CDNImageProps extends Omit<ImageProps, 'src'> {
  src: string // CDN 路径（不含域名）
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
}

export function CDNImage({ 
  src, 
  width, 
  height, 
  quality = 80,
  format = 'webp',
  ...props 
}: CDNImageProps) {
  const cdnUrl = getImageUrl(src, {
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
    quality,
    format,
  })

  return (
    <Image
      src={cdnUrl}
      width={width}
      height={height}
      {...props}
    />
  )
}
```

**使用：**

```tsx
// 使用非常简洁
<CDNImage
  src="images/product.jpg"
  width={800}
  height={600}
  alt="Product"
  quality={90}
/>

// 自动处理：
// - 从七牛云CDN加载
// - 转换为 WebP 格式
// - 压缩到指定质量
// - 响应式图片
```

---

## 🎬 视频处理方案

### 方案 1：七牛云视频 CDN

```typescript
// lib/video.ts
export function getVideoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_QINIU_DOMAIN}/${path}`
}

// 使用
<video 
  src={getVideoUrl('videos/intro.mp4')}
  poster={getImageUrl('videos/intro-poster.jpg')}
  controls
  preload="metadata"
>
  Your browser does not support the video tag.
</video>
```

**七牛云视频处理功能：**
- ✅ 视频转码（多种格式）
- ✅ 视频截图（自动生成封面）
- ✅ 视频水印
- ✅ HLS 切片（流媒体播放）

### 方案 2：YouTube/Vimeo 嵌入（推荐）

```tsx
// components/VideoPlayer.tsx
interface VideoPlayerProps {
  videoId: string
  platform: 'youtube' | 'vimeo'
}

export function VideoPlayer({ videoId, platform }: VideoPlayerProps) {
  const embedUrl = platform === 'youtube'
    ? `https://www.youtube.com/embed/${videoId}`
    : `https://player.vimeo.com/video/${videoId}`

  return (
    <div className="relative aspect-video">
      <iframe
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}

// 使用
<VideoPlayer videoId="dQw4w9WgXcQ" platform="youtube" />
```

**优势：**
- ✅ 完全免费
- ✅ 全球CDN
- ✅ 自动转码多种清晰度
- ✅ 自适应播放
- ✅ 节省服务器带宽

---

## 📊 成本分析

### 七牛云价格（2024年）

| 服务 | 价格 | 免费额度 |
|-----|------|---------|
| **存储空间** | ¥0.148/GB/月 | 10GB |
| **CDN流量** | ¥0.18/GB | 10GB/月 |
| **图片处理** | ¥0.025/千次 | 10万次/月 |
| **视频转码** | ¥0.0195/分钟 | - |

**预估成本（官网）：**

```
假设每月：
- 存储：50GB 图片 + 视频
- CDN流量：500GB
- 图片处理：100万次

成本计算：
- 存储：(50 - 10) × 0.148 = ¥5.92
- 流量：(500 - 10) × 0.18 = ¥88.2
- 处理：(100 - 10) × 0.025 = ¥2.25

总计：¥96.37/月
```

### Vercel 价格（对比）

| 方案 | 存储 | 带宽 | 价格 |
|-----|------|------|------|
| **Hobby（免费）** | 无限 | 100GB/月 | $0 |
| **Pro** | 无限 | 1TB/月 | $20/月 |

---

## 🎯 推荐方案（混合策略）

### 开发阶段

```typescript
// config/cdn.ts
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export function getAssetUrl(path: string) {
  // 开发环境使用本地
  if (!IS_PRODUCTION) {
    return `/images/${path}`
  }
  
  // 生产环境使用 CDN
  return `${process.env.NEXT_PUBLIC_QINIU_DOMAIN}/${path}`
}
```

### 生产环境

```
小文件（< 50KB）
  └─> 本地 public/ + Vercel CDN
  
图片（50KB - 5MB）
  └─> 七牛云 CDN + 图片处理
  
视频（> 5MB）
  └─> YouTube/Vimeo 或七牛云视频 CDN
```

---

## 🔧 完整配置示例

### 1. 环境变量

```bash
# .env.local (开发环境)
NEXT_PUBLIC_CDN_DOMAIN=http://localhost:3000

# .env.production (生产环境)
NEXT_PUBLIC_CDN_DOMAIN=https://cdn.biya.com
QINIU_ACCESS_KEY=your_access_key
QINIU_SECRET_KEY=your_secret_key
QINIU_BUCKET=biya-official-website
```

### 2. CDN 配置文件

```typescript
// lib/cdn.config.ts
export const CDN_CONFIG = {
  domain: process.env.NEXT_PUBLIC_CDN_DOMAIN || '',
  
  // 图片路径前缀
  paths: {
    images: 'images',
    videos: 'videos',
    documents: 'documents',
  },
  
  // 默认图片处理参数
  imageDefaults: {
    quality: 80,
    format: 'webp' as const,
  },
  
  // 响应式图片断点
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
  },
}
```

### 3. 统一的资源管理器

```typescript
// lib/assets.ts
import { CDN_CONFIG } from './cdn.config'

export class AssetManager {
  /**
   * 获取图片 URL
   */
  static getImage(
    filename: string,
    options?: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'jpg' | 'png'
    }
  ) {
    const basePath = `${CDN_CONFIG.paths.images}/${filename}`
    let url = `${CDN_CONFIG.domain}/${basePath}`
    
    if (options && CDN_CONFIG.domain.includes('qiniu')) {
      // 七牛云图片处理
      const params = []
      if (options.width) params.push(`w/${options.width}`)
      if (options.height) params.push(`h/${options.height}`)
      if (options.quality) params.push(`q/${options.quality}`)
      if (options.format) params.push(`format/${options.format}`)
      
      if (params.length) {
        url += `?imageView2/2/${params.join('/')}`
      }
    }
    
    return url
  }
  
  /**
   * 获取视频 URL
   */
  static getVideo(filename: string) {
    return `${CDN_CONFIG.domain}/${CDN_CONFIG.paths.videos}/${filename}`
  }
  
  /**
   * 获取响应式图片 srcset
   */
  static getResponsiveImages(filename: string) {
    const { breakpoints } = CDN_CONFIG
    
    return Object.entries(breakpoints).map(([key, width]) => ({
      src: this.getImage(filename, { width }),
      width,
      media: `(max-width: ${width}px)`,
    }))
  }
}

// 使用
const heroImage = AssetManager.getImage('hero.jpg', {
  width: 1920,
  quality: 85,
  format: 'webp'
})
```

---

## 📱 响应式图片最佳实践

```tsx
// components/ResponsiveImage.tsx
import Image from 'next/image'
import { AssetManager } from '@/lib/assets'

interface ResponsiveImageProps {
  filename: string
  alt: string
  sizes?: string
  priority?: boolean
}

export function ResponsiveImage({
  filename,
  alt,
  sizes = '100vw',
  priority = false,
}: ResponsiveImageProps) {
  const responsive = AssetManager.getResponsiveImages(filename)
  
  return (
    <picture>
      {responsive.map(({ src, media }) => (
        <source key={media} srcSet={src} media={media} />
      ))}
      <Image
        src={AssetManager.getImage(filename)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </picture>
  )
}
```

---

## ✅ 最佳实践检查清单

### 开发阶段
- [ ] 图片放在 `public/images/` 本地测试
- [ ] 使用 Next.js Image 组件
- [ ] 添加 alt 属性
- [ ] 设置合适的 width/height

### 部署前
- [ ] 压缩所有图片（TinyPNG）
- [ ] 转换为 WebP 格式
- [ ] 上传到七牛云 CDN
- [ ] 更新环境变量
- [ ] 测试 CDN 链接可访问

### 生产环境
- [ ] 配置 CDN 缓存策略
- [ ] 启用 HTTPS
- [ ] 设置防盗链
- [ ] 监控 CDN 流量和成本

---

## 🚀 快速开始

### 1. 立即可用（本地开发）

```tsx
// 直接使用 Next.js Image
<Image
  src="/images/hero.jpg"
  width={1920}
  height={1080}
  alt="Hero"
/>
```

### 2. 准备上线（配置 CDN）

```bash
# 1. 注册七牛云
# 2. 创建存储空间
# 3. 配置环境变量
# 4. 上传资源
npm run upload

# 5. 更新代码使用 CDN URL
<CDNImage src="images/hero.jpg" ... />
```

---

## 💡 总结建议

### ⭐ 推荐方案：**混合策略**

```
1. 小图标/Logo (< 50KB)
   → 本地 public/ 文件夹

2. 产品图片/Banner (50KB - 5MB)
   → 七牛云 CDN

3. 视频 (> 5MB)
   → YouTube/Vimeo (免费) 或七牛云

4. 字体文件
   → Google Fonts 或本地自托管
```

### 成本预估
- **小型官网**：¥50-100/月（七牛云）
- **中型官网**：¥100-300/月
- **或使用 Vercel 免费版**（100GB流量/月）

需要我帮您配置具体的实现代码吗？ 🚀

