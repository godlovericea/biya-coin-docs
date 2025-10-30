# 基于自有基础设施的部署方案

## 🎯 前提条件
- ✅ 有运维工程师团队
- ✅ 有自己的云服务器（阿里云海外）
- ✅ 有技术掌控能力

**这种情况下，决策因素完全不同！**

---

## 📊 重新评估对比

### 关键变化：成本结构不同

| 项目 | Vercel | 自有服务器 |
|-----|--------|-----------|
| **服务器成本** | 含在 Vercel 价格中 | **已支付（沉没成本）** ✅ |
| **运维成本** | $0 | **已支付（固定工资）** ✅ |
| **边际成本** | 按流量收费 | **几乎为 0** ✅ |
| **资源利用** | 无法复用 | **充分利用现有资源** ✅ |

**结论：使用自有服务器的边际成本几乎为 0**

---

## 🎯 推荐方案（修订版）

### 方案 A：自有服务器 + CDN（⭐⭐⭐⭐⭐ 推荐）

```
架构：
├── 源站：阿里云海外服务器（您已有）
├── CDN：七牛云全球 CDN
└── 运维：您的团队维护

优势：
✅ 充分利用现有资源
✅ 完全掌控
✅ 边际成本极低（只需 CDN 流量费）
✅ 数据自主可控
✅ 可深度定制优化
✅ 团队经验积累

成本：
- 服务器：已有（沉没成本）
- 运维：已有（固定工资）
- 新增：CDN 流量费 ¥0.18/GB
- 月增成本：~¥50-200（取决于流量）
```

---

## 🏗️ 推荐架构设计

### 完整技术架构

```
┌─────────────────────────────────────────────────┐
│                   用户请求                        │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│         七牛云全球 CDN（静态资源）                │
│  - 图片、视频、CSS、JS                            │
│  - 全球边缘节点缓存                               │
│  - 自动压缩、WebP 转换                           │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼ （回源）
┌─────────────────────────────────────────────────┐
│       阿里云海外服务器（您的）                     │
│  ├── Nginx（反向代理 + 负载均衡）                 │
│  ├── PM2（Node.js 进程管理）                     │
│  ├── Next.js（SSR + API Routes）                │
│  └── 监控（Prometheus + Grafana）                │
└─────────────────────────────────────────────────┘
```

---

## 🔧 具体实施方案

### Step 1：服务器配置（30分钟）

```bash
# 1. 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 PM2（生产级进程管理）
npm install -g pm2

# 3. 安装 Nginx
sudo apt install nginx

# 4. 克隆项目
git clone https://github.com/your-org/biya-official-website.git
cd biya-official-website

# 5. 安装依赖
npm install

# 6. 构建生产版本
npm run build
```

### Step 2：PM2 配置（15分钟）

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'biya-website',
    script: 'npm',
    args: 'start',
    instances: 'max',  // 根据 CPU 核心数自动扩展
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    
    // 自动重启配置
    max_memory_restart: '1G',
    
    // 优雅重启
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
  }]
}

// 启动
pm2 start ecosystem.config.js
pm2 save
pm2 startup  // 开机自启
```

### Step 3：Nginx 配置（20分钟）

```nginx
# /etc/nginx/sites-available/biya-website
upstream nextjs_upstream {
  server 127.0.0.1:3000;
  # 如果有多个实例
  # server 127.0.0.1:3001;
  # server 127.0.0.1:3002;
  keepalive 64;
}

server {
  listen 80;
  listen [::]:80;
  server_name www.biya.com biya.com;

  # 强制 HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name www.biya.com biya.com;

  # SSL 证书（Let's Encrypt）
  ssl_certificate /etc/letsencrypt/live/biya.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/biya.com/privkey.pem;
  
  # SSL 优化
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;

  # Gzip 压缩
  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_types text/plain text/css text/xml text/javascript 
             application/x-javascript application/xml+rss 
             application/javascript application/json;

  # 静态资源缓存（Next.js /_next/static）
  location /_next/static {
    proxy_pass http://nextjs_upstream;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  # 图片等静态资源（如果不用 CDN）
  location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    proxy_pass http://nextjs_upstream;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
  }

  # API 路由
  location /api {
    proxy_pass http://nextjs_upstream;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # 所有其他请求
  location / {
    proxy_pass http://nextjs_upstream;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 超时设置
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }

  # 安全头
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
}

# 启用配置
sudo ln -s /etc/nginx/sites-available/biya-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4：七牛云 CDN 配置（30分钟）

```typescript
// lib/cdn.ts
const CDN_DOMAIN = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'https://cdn.biya.com'
const ORIGIN_DOMAIN = process.env.ORIGIN_DOMAIN || 'https://www.biya.com'

/**
 * 静态资源 CDN 化
 */
export function getCDNUrl(path: string) {
  // 开发环境使用本地
  if (process.env.NODE_ENV === 'development') {
    return path
  }
  
  // 生产环境使用 CDN
  if (path.startsWith('/')) {
    return `${CDN_DOMAIN}${path}`
  }
  
  return path
}

// 使用
import Image from 'next/image'
import { getCDNUrl } from '@/lib/cdn'

<Image src={getCDNUrl('/images/hero.jpg')} ... />
```

#### 七牛云配置步骤

```yaml
# 1. 创建存储空间
名称: biya-cdn
区域: 根据服务器位置（如新加坡）
访问控制: 公开

# 2. 配置 CDN 加速
回源设置:
  - 源站类型: 源站域名
  - 源站地址: www.biya.com
  - 协议: HTTPS
  
缓存配置:
  - /_next/static/*: 365天
  - /images/*: 30天
  - /videos/*: 30天
  - /*.html: 10分钟
  
图片处理:
  - 自动 WebP
  - 智能压缩
  - 按需裁剪

# 3. 绑定域名
CDN 域名: cdn.biya.com
CNAME 记录: 指向七牛云提供的域名

# 4. HTTPS 配置
上传 SSL 证书或使用七牛云免费证书
```

---

## 🚀 CI/CD 自动化部署

### GitHub Actions 配置

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Deploy to Server
      uses: easingthemes/ssh-deploy@main
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        ARGS: "-avz --delete"
        SOURCE: ".next/ public/ package.json package-lock.json"
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: "/var/www/biya-website"
    
    - name: Restart PM2
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.REMOTE_HOST }}
        username: ${{ secrets.REMOTE_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/biya-website
          pm2 reload ecosystem.config.js
    
    - name: Upload to Qiniu CDN (Optional)
      run: |
        # 上传静态资源到七牛云
        npm run upload:cdn
```

---

## 📊 性能优化方案

### 1. 服务器级别优化

```bash
# 1. 开启 TCP BBR（拥塞控制算法）
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p

# 2. 调整系统参数
cat >> /etc/sysctl.conf << EOF
# 增加最大文件描述符
fs.file-max = 65535

# 网络优化
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_tw_reuse = 1
EOF

sysctl -p
```

### 2. Node.js 优化

```javascript
// next.config.js
module.exports = {
  // 生产优化
  compress: true,  // Gzip 压缩
  poweredByHeader: false,  // 隐藏 X-Powered-By
  
  // 图片优化
  images: {
    domains: ['cdn.biya.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60,
  },
  
  // 编译优化
  swcMinify: true,
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
  },
}
```

### 3. Redis 缓存（可选）

```typescript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis({
  host: 'localhost',
  port: 6379,
})

/**
 * API 响应缓存
 */
export async function getCachedData(key: string, fetcher: () => Promise<any>, ttl = 300) {
  // 尝试从缓存获取
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // 缓存未命中，获取数据
  const data = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(data))
  
  return data
}

// 使用
export async function getProductData() {
  return getCachedData('products', async () => {
    return await fetchFromAPI('/api/products')
  }, 600)  // 缓存 10 分钟
}
```

---

## 📈 监控和告警

### 1. PM2 监控

```bash
# 安装 PM2 Plus（免费版）
pm2 install pm2-server-monit

# 查看实时监控
pm2 monit

# 查看日志
pm2 logs biya-website

# 查看进程状态
pm2 status
```

### 2. Nginx 日志分析

```bash
# 安装 GoAccess（实时日志分析）
sudo apt install goaccess

# 实时分析
goaccess /var/log/nginx/access.log -o /var/www/html/report.html --real-time-html

# 可以通过浏览器访问实时监控面板
```

### 3. 性能监控

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% 请求追踪
})

// 自定义性能监控
export function trackPerformance(name: string, duration: number) {
  // 发送到监控系统
  console.log(`[Performance] ${name}: ${duration}ms`)
}
```

---

## 💰 成本对比（更新版）

### 使用自有服务器 + CDN

```
固定成本（已有）：
├── 服务器：¥0（已支付）
├── 运维：¥0（固定工资）
└── 带宽：¥0（包含在服务器费用中）

新增成本：
└── 七牛云 CDN：¥0.18/GB

月新增成本估算：
- 流量 100GB：¥18
- 流量 500GB：¥90
- 流量 1TB：¥180

年新增成本：¥216 - ¥2160
```

### 使用 Vercel

```
成本：
├── Hobby（免费）：$0（100GB 限制）
└── Pro：$20/月 = ¥140/月 = ¥1680/年

但无法利用：
❌ 已有服务器资源
❌ 运维团队能力
❌ 数据自主控制
```

**结论：使用自有服务器更划算，且更可控**

---

## 🎯 最终推荐方案

### ⭐⭐⭐⭐⭐ 推荐：自有服务器 + 七牛云 CDN

```yaml
架构：
  源站: 阿里云海外服务器（您已有）
  应用: Next.js + Node.js + PM2
  反向代理: Nginx
  CDN: 七牛云全球加速
  监控: PM2 + 日志分析

优势：
  ✅ 充分利用现有资源（服务器 + 运维）
  ✅ 边际成本极低（只需 CDN 流量费）
  ✅ 完全掌控（数据、配置、优化）
  ✅ 团队能力提升（积累经验）
  ✅ 可深度定制优化
  ✅ 数据安全可控

性能：
  ✅ 全球 CDN 加速（七牛云）
  ✅ 本地优化空间大
  ✅ 可根据需求调整

成本：
  ✅ 年新增成本：¥200-2000（取决于流量）
  ✅ 对比 Vercel 节省：可能节省（如果利用好现有资源）
```

---

## 🚀 实施计划

### 第一周：基础部署

```bash
Day 1-2: 服务器环境配置
  - Node.js 安装
  - PM2 配置
  - Nginx 配置
  - SSL 证书

Day 3-4: 应用部署
  - 代码部署
  - 环境变量配置
  - PM2 启动
  - 域名绑定

Day 5: 测试和优化
  - 性能测试
  - 负载测试
  - 日志配置
```

### 第二周：CDN 和监控

```bash
Day 1-2: 七牛云 CDN
  - 配置回源
  - 缓存策略
  - 图片处理
  - 域名绑定

Day 3-4: 监控和告警
  - PM2 监控
  - 日志分析
  - 性能追踪
  - 告警配置

Day 5: CI/CD
  - GitHub Actions
  - 自动部署
  - 测试流程
```

---

## 📋 检查清单

### 部署前检查

- [ ] 服务器环境准备完毕（Node.js、PM2、Nginx）
- [ ] SSL 证书已配置
- [ ] 域名已解析
- [ ] 环境变量已配置
- [ ] 数据库连接已测试（如果有）

### 部署后检查

- [ ] 网站可正常访问（HTTP/HTTPS）
- [ ] PM2 进程运行正常
- [ ] Nginx 日志无错误
- [ ] 性能测试通过（< 2s 加载）
- [ ] 监控配置生效

### CDN 检查

- [ ] 静态资源走 CDN
- [ ] 图片自动 WebP 转换
- [ ] 缓存策略生效
- [ ] 回源正常

---

## ✅ 总结

**既然您有自己的运维团队和服务器，强烈建议使用自有基础设施！**

### 核心优势

```
1. ✅ 资源利用最大化
   - 服务器已有
   - 运维团队已有
   - 边际成本接近 0

2. ✅ 完全掌控
   - 数据安全
   - 深度定制
   - 优化空间大

3. ✅ 团队成长
   - 积累经验
   - 技术沉淀
   - 问题快速解决

4. ✅ 成本可控
   - 只需 CDN 流量费
   - 年增成本 < ¥2000
   - 相比 Vercel 可能更省
```

需要我帮您：
1. 生成完整的部署脚本？
2. 配置 Nginx 文件？
3. 设置 CI/CD 流程？
4. 配置监控和告警？ 🚀

