# 🖥️ 自建服务器部署方案

> **对比**: Vercel vs 自建服务器  
> **目标**: Monorepo 独立部署  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [Vercel vs 自建服务器对比](#vercel-vs-自建服务器对比)
2. [自建服务器部署方案](#自建服务器部署方案)
3. [Docker 方案（推荐）](#docker-方案推荐)
4. [PM2 方案](#pm2-方案)
5. [CI/CD 配置](#cicd-配置)
6. [成本对比](#成本对比)

---

## 📊 Vercel vs 自建服务器对比

### 核心对比表

| 特性 | Vercel | 自建服务器 |
|------|--------|-----------|
| **部署难度** | ⭐ 简单（点几下） | ⭐⭐⭐ 复杂（需配置） |
| **独立部署** | ✅ 自动检测 | ✅ 手动控制 |
| **成本** | 免费/付费 | 服务器费用 |
| **性能** | ⭐⭐⭐ CDN 加速 | ⭐⭐ 取决于服务器 |
| **扩展性** | ⭐⭐⭐ 自动扩容 | ⭐⭐ 手动扩容 |
| **控制权** | ⭐ 受限 | ⭐⭐⭐ 完全控制 |
| **维护成本** | ⭐ 低 | ⭐⭐⭐ 高 |
| **SSL 证书** | ✅ 自动 | ⚙️ 需配置 |
| **监控日志** | ✅ 内置 | ⚙️ 需配置 |
| **回滚** | ✅ 一键 | ⚙️ 需脚本 |

---

### 详细对比

#### 1. 部署流程

**Vercel**:
```
1. 推送代码到 GitHub
2. Vercel 自动检测
3. 自动构建
4. 自动部署
5. 自动配置 SSL
6. 自动 CDN 分发

总耗时: 2-3 分钟 ✅
```

**自建服务器**:
```
1. 推送代码到 GitHub
2. 触发 CI/CD (GitHub Actions)
3. 构建 Docker 镜像
4. SSH 连接服务器
5. 拉取新镜像
6. 重启容器
7. 更新 Nginx 配置
8. 重新加载 Nginx

总耗时: 5-10 分钟 ⚙️
```

---

#### 2. 独立部署实现

**Vercel**:
```yaml
# 自动检测文件变更
apps/bridge/ 变更 → 只部署 Bridge
apps/dex/ 变更 → 只部署 DEX

无需额外配置 ✅
```

**自建服务器**:
```yaml
# 需要配置 CI/CD
.github/workflows/deploy-bridge.yml:
  on:
    push:
      paths:
        - 'apps/bridge/**'
        - 'packages/shared/**'

手动配置每个应用的部署流程 ⚙️
```

---

#### 3. 成本对比

**Vercel**:
```
免费套餐:
  - 100 GB 带宽/月
  - 无限部署
  - 自动 SSL
  - CDN 全球加速

Pro 套餐 ($20/月):
  - 1 TB 带宽/月
  - 更多并发构建
  - 团队协作

费用: $0 - $240/年
```

**自建服务器**:
```
最小配置 (单台服务器):
  - 2 核 4GB: ¥80-150/月
  - 域名: ¥50/年
  - SSL 证书: 免费 (Let's Encrypt)
  - CDN: ¥0-500/月 (可选)

费用: ¥960-2300/年

集群配置 (高可用):
  - 3 台服务器: ¥240-450/月
  - 负载均衡: ¥100/月
  - CDN: ¥500/月
  
费用: ¥4080-12600/年
```

---

## 🚀 自建服务器部署方案

### 架构设计

```
                     ┌─────────────────┐
                     │   域名 DNS      │
                     └────────┬────────┘
                              ↓
                     ┌─────────────────┐
                     │  Nginx (443)    │
                     │  反向代理 + SSL  │
                     └────────┬────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Bridge:3001  │    │  DEX:3002    │    │ Helix:3003   │
│ (Docker 容器)│    │ (Docker 容器)│    │ (Docker 容器)│
└──────────────┘    └──────────────┘    └──────────────┘
        ↓                     ↓                     ↓
┌────────────────────────────────────────────────────────┐
│              单一 Git 仓库: biya-coin                   │
└────────────────────────────────────────────────────────┘
```

---

## 🐳 Docker 方案（推荐）

### 方案 1: Docker Compose

#### 1. 创建 Docker 镜像

**apps/bridge/Dockerfile**:
```dockerfile
# Bridge 应用 Dockerfile
FROM node:20-alpine AS base

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./
COPY apps/bridge/package.json ./apps/bridge/
COPY packages/shared/package.json ./packages/shared/

# 安装依赖
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/bridge/node_modules ./apps/bridge/node_modules

# 复制源码
COPY apps/bridge ./apps/bridge
COPY packages/shared ./packages/shared

# 构建应用
WORKDIR /app/apps/bridge
RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# 创建用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/apps/bridge/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/bridge/.next/static ./apps/bridge/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/bridge/public ./apps/bridge/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/bridge/server.js"]
```

#### 2. Docker Compose 配置

**docker-compose.yml** (根目录):
```yaml
version: '3.8'

services:
  # Bridge 服务
  bridge:
    build:
      context: .
      dockerfile: apps/bridge/Dockerfile
    container_name: biya-bridge
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_NAME=Bridge
    restart: unless-stopped
    networks:
      - biya-network

  # DEX 服务
  dex:
    build:
      context: .
      dockerfile: apps/dex/Dockerfile
    container_name: biya-dex
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_NAME=DEX
    restart: unless-stopped
    networks:
      - biya-network

  # Helix 服务
  helix:
    build:
      context: .
      dockerfile: biya-helix-app/Dockerfile
    container_name: biya-helix
    ports:
      - "3003:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_NAME=Helix
    restart: unless-stopped
    networks:
      - biya-network

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: biya-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - bridge
      - dex
      - helix
    restart: unless-stopped
    networks:
      - biya-network

networks:
  biya-network:
    driver: bridge
```

#### 3. Nginx 配置

**nginx/conf.d/default.conf**:
```nginx
# Bridge 配置
server {
    listen 80;
    server_name bridge.biya.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bridge.biya.com;

    # SSL 证书
    ssl_certificate /etc/nginx/ssl/bridge.biya.com.crt;
    ssl_certificate_key /etc/nginx/ssl/bridge.biya.com.key;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 反向代理到 Bridge 容器
    location / {
        proxy_pass http://bridge:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# DEX 配置
server {
    listen 80;
    server_name dex.biya.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dex.biya.com;

    ssl_certificate /etc/nginx/ssl/dex.biya.com.crt;
    ssl_certificate_key /etc/nginx/ssl/dex.biya.com.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location / {
        proxy_pass http://dex:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Helix 配置
server {
    listen 80;
    server_name biya.com www.biya.com;
    return 301 https://biya.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name biya.com www.biya.com;

    ssl_certificate /etc/nginx/ssl/biya.com.crt;
    ssl_certificate_key /etc/nginx/ssl/biya.com.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 重定向 www 到非 www
    if ($host = 'www.biya.com') {
        return 301 https://biya.com$request_uri;
    }
    
    location / {
        proxy_pass http://helix:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. 部署命令

```bash
# 全部部署
docker-compose up -d --build

# 只部署 Bridge
docker-compose up -d --build bridge

# 只部署 DEX
docker-compose up -d --build dex

# 只部署 Helix
docker-compose up -d --build helix

# 查看日志
docker-compose logs -f bridge

# 重启服务
docker-compose restart bridge

# 停止所有服务
docker-compose down
```

---

## 📦 PM2 方案

### 方案 2: PM2 进程管理

#### 1. PM2 配置文件

**ecosystem.config.js** (根目录):
```javascript
module.exports = {
  apps: [
    {
      name: 'biya-bridge',
      cwd: './apps/bridge',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_APP_NAME: 'Bridge'
      },
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/bridge-error.log',
      out_file: './logs/bridge-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'biya-dex',
      cwd: './apps/dex',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        NEXT_PUBLIC_APP_NAME: 'DEX'
      },
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/dex-error.log',
      out_file: './logs/dex-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'biya-helix',
      cwd: './biya-helix-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
        NEXT_PUBLIC_APP_NAME: 'Helix'
      },
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/helix-error.log',
      out_file: './logs/helix-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}
```

#### 2. PM2 部署命令

```bash
# 安装 PM2
npm install -g pm2

# 启动所有应用
pm2 start ecosystem.config.js

# 只启动 Bridge
pm2 start ecosystem.config.js --only biya-bridge

# 只重启 Bridge
pm2 restart biya-bridge

# 查看状态
pm2 status

# 查看日志
pm2 logs biya-bridge

# 监控
pm2 monit

# 停止所有
pm2 stop all

# 保存配置
pm2 save

# 开机自启
pm2 startup
```

---

## 🔄 CI/CD 配置

### GitHub Actions 自动部署

#### 1. Bridge 部署流程

**.github/workflows/deploy-bridge.yml**:
```yaml
name: Deploy Bridge to Self-Hosted

on:
  push:
    branches: [main]
    paths:
      - 'apps/bridge/**'
      - 'packages/shared/**'
      - '.github/workflows/deploy-bridge.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./apps/bridge/Dockerfile
          push: true
          tags: |
            ${{ secrets.DOCKER_REGISTRY }}/biya-bridge:latest
            ${{ secrets.DOCKER_REGISTRY }}/biya-bridge:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/biya-coin
            docker-compose pull bridge
            docker-compose up -d bridge
            docker image prune -f

      - name: Health check
        run: |
          sleep 10
          curl -f https://bridge.biya.com/api/health || exit 1

      - name: Notify
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Bridge deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### 2. DEX 和 Helix 类似配置

复制上面的配置，修改：
- `deploy-dex.yml`
- `deploy-helix.yml`
- 修改 paths, image 名称, 服务名称

---

## 📊 独立部署对比

### Vercel 方式

```
优点:
✅ 自动检测变更
✅ 自动构建
✅ 自动部署
✅ 零配置

缺点:
❌ 依赖 Vercel 平台
❌ 成本可能较高
❌ 控制权有限
```

### 自建服务器方式

```
优点:
✅ 完全控制
✅ 成本可控
✅ 数据安全
✅ 灵活配置

缺点:
❌ 需要维护
❌ 需要配置 CI/CD
❌ 需要处理 SSL
❌ 需要监控日志
```

---

## 🎯 独立部署实现

### Docker Compose 方式

```bash
# 场景 1: 只更新 Bridge
git pull origin main
docker-compose build bridge
docker-compose up -d bridge

# 场景 2: 只更新 DEX
docker-compose build dex
docker-compose up -d dex

# 场景 3: 更新共享代码（全部重建）
docker-compose build
docker-compose up -d
```

### PM2 方式

```bash
# 场景 1: 只更新 Bridge
cd apps/bridge
git pull origin main
npm install
npm run build
pm2 restart biya-bridge

# 场景 2: 只更新 DEX
cd apps/dex
git pull origin main
npm install
npm run build
pm2 restart biya-dex
```

---

## 🔐 SSL 证书配置

### 使用 Let's Encrypt（免费）

```bash
# 安装 Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# 申请证书（Bridge）
sudo certbot --nginx -d bridge.biya.com

# 申请证书（DEX）
sudo certbot --nginx -d dex.biya.com

# 申请证书（Helix）
sudo certbot --nginx -d biya.com -d www.biya.com

# 自动续期
sudo certbot renew --dry-run

# 添加到 crontab（每天检查）
echo "0 0 * * * root certbot renew --quiet" | sudo tee -a /etc/crontab
```

---

## 📈 监控和日志

### 1. 应用监控

**使用 PM2 监控**:
```bash
# 实时监控
pm2 monit

# Web 监控界面
pm2 install pm2-server-monit

# 集成 Prometheus
pm2 install pm2-prometheus
```

**使用 Docker 监控**:
```bash
# 查看容器状态
docker-compose ps

# 查看资源使用
docker stats

# 查看日志
docker-compose logs -f bridge
```

### 2. 日志管理

**集中式日志**:
```yaml
# docker-compose.yml 添加日志配置
services:
  bridge:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 💰 成本对比详解

### Vercel 成本

```
月度成本:
  免费版: $0
  Pro 版: $20
  Enterprise: 定制

年度成本: $0 - $240

额外成本:
  域名: ¥50/年
  总计: $0 - $240 + ¥50
```

### 自建服务器成本

```
服务器配置选项:

1. 入门配置（单应用）
   - 1 核 2GB: ¥50/月
   - 带宽 1M: 已包含
   - 存储 50GB: 已包含
   年度: ¥600

2. 标准配置（3 个应用）
   - 2 核 4GB: ¥120/月
   - 带宽 3M: 已包含
   - 存储 100GB: 已包含
   年度: ¥1440

3. 高配置（生产环境）
   - 4 核 8GB: ¥300/月
   - 带宽 5M: 已包含
   - 存储 200GB: 已包含
   年度: ¥3600

额外成本:
  域名: ¥50/年
  CDN (可选): ¥200-500/月
  备份 (可选): ¥50/月

总计:
  最低: ¥650/年
  标准: ¥1490/年
  高配: ¥3650/年
  + CDN: +¥2400-6000/年
```

---

## 🎯 决策建议

### 选择 Vercel，如果：

- ✅ 团队规模小（1-5 人）
- ✅ 不想管理服务器
- ✅ 需要快速上线
- ✅ 预算充足（$20/月可接受）
- ✅ 需要全球 CDN 加速
- ✅ 重视开发效率

### 选择自建服务器，如果：

- ✅ 有运维能力
- ✅ 需要完全控制
- ✅ 数据敏感
- ✅ 流量可预测
- ✅ 长期运营（成本优势明显）
- ✅ 已有服务器资源

---

## 📋 实施检查表

### Vercel 部署

- [ ] GitHub 仓库准备好
- [ ] 创建 3 个 Vercel 项目
- [ ] 配置 Root Directory
- [ ] 配置 Ignored Build Step
- [ ] 配置域名
- [ ] 测试独立部署

### 自建服务器部署

- [ ] 购买服务器
- [ ] 配置域名 DNS
- [ ] 安装 Docker / PM2
- [ ] 创建 Dockerfile
- [ ] 配置 Nginx
- [ ] 申请 SSL 证书
- [ ] 配置 CI/CD
- [ ] 设置监控日志
- [ ] 测试独立部署

---

## 🚀 快速开始脚本

### 自动化部署脚本

**deploy.sh**:
```bash
#!/bin/bash

# 部署脚本
APP=$1  # bridge, dex, helix

if [ -z "$APP" ]; then
    echo "Usage: ./deploy.sh <app-name>"
    echo "Example: ./deploy.sh bridge"
    exit 1
fi

echo "🚀 Deploying $APP..."

# 拉取最新代码
echo "📥 Pulling latest code..."
git pull origin main

# 使用 Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "🐳 Building Docker image..."
    docker-compose build $APP
    
    echo "🚢 Deploying container..."
    docker-compose up -d $APP
    
    echo "🧹 Cleaning up..."
    docker image prune -f
    
# 使用 PM2
elif command -v pm2 &> /dev/null; then
    APP_DIR="apps/$APP"
    if [ "$APP" = "helix" ]; then
        APP_DIR="biya-helix-app"
    fi
    
    echo "📦 Installing dependencies..."
    cd $APP_DIR
    npm install
    
    echo "🔨 Building application..."
    npm run build
    
    echo "🔄 Restarting PM2..."
    pm2 restart biya-$APP
    
    cd ../..
else
    echo "❌ Neither docker-compose nor pm2 found"
    exit 1
fi

echo "✅ $APP deployed successfully!"
echo "🔍 Check status:"
echo "   Docker: docker-compose ps"
echo "   PM2: pm2 status"
```

使用:
```bash
chmod +x deploy.sh
./deploy.sh bridge
./deploy.sh dex
./deploy.sh helix
```

---

## 📖 相关文档

- [Monorepo 独立部署](./MONOREPO_INDEPENDENT_DEPLOYMENT.md) - Vercel 方案
- [Git 策略对比](./GIT_AND_DEPLOYMENT_STRATEGY.md)
- [快速决策指南](./GIT_QUICK_DECISION.md)

---

*最后更新: 2025-10-30*

