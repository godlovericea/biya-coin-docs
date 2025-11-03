# 🚀 Monorepo 独立部署实战指南

> **核心问题**: 同一个 git 仓库，如何只部署其中一个项目？  
> **答案**: 通过配置部署平台的"监听路径"和"Root Directory"  
> **更新时间**: 2025-10-30

---

## 🎯 核心原理

### 误解 ❌

```
同一个 git 仓库 = 一起部署 = 改一个项目，所有项目都上线
```

### 事实 ✅

```
同一个 git 仓库 + 配置独立部署 = 各自部署

修改 Bridge → 只部署 Bridge ✅
修改 DEX → 只部署 DEX ✅
修改 Helix → 只部署 Helix ✅
```

---

## 🔑 关键机制

### 1. 在 Vercel/Netlify 上创建**多个独立项目**

```
不是 1 个 Vercel 项目！
而是 3 个 Vercel 项目：

Project 1: biya-bridge
  ├─ Git: github.com/biya/biya-coin
  ├─ Root Directory: apps/bridge        ← 关键！
  ├─ Ignored Build Step: 监听路径        ← 关键！
  └─ Domain: bridge.biya.com

Project 2: biya-dex
  ├─ Git: github.com/biya/biya-coin      ← 同一个仓库
  ├─ Root Directory: apps/dex            ← 不同的目录
  ├─ Ignored Build Step: 监听路径        ← 不同的监听
  └─ Domain: dex.biya.com

Project 3: biya-helix
  ├─ Git: github.com/biya/biya-coin      ← 同一个仓库
  ├─ Root Directory: apps/helix          ← 不同的目录
  ├─ Ignored Build Step: 监听路径        ← 不同的监听
  └─ Domain: biya.com
```

### 2. 配置"Ignored Build Step"（跳过构建）

Vercel 会检查你的提交：
- **如果修改了 `apps/bridge/`** → 只重新部署 `biya-bridge` 项目
- **如果修改了 `apps/dex/`** → 只重新部署 `biya-dex` 项目
- **如果修改了 `packages/shared/`** → 重新部署**所有**项目（因为共享代码变了）

---

## 📋 实际配置步骤

### 步骤 1: 创建 Vercel 项目（Bridge）

1. **登录 Vercel**
   - 访问 https://vercel.com/dashboard
   - 点击 "Add New" → "Project"

2. **导入 Git 仓库**
   - 选择 `biya-coin` 仓库
   - 点击 "Import"

3. **配置项目**
   ```
   Project Name: biya-bridge
   Framework Preset: Next.js
   Root Directory: apps/bridge     ← 重要！只构建这个目录
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **配置 Ignored Build Step（关键！）**
   - 进入项目设置 → Settings → Git
   - 找到 "Ignored Build Step"
   - 输入以下命令：

   ```bash
   # 方式 1: 使用 Vercel 内置的 VERCEL_GIT_COMMIT_REF
   bash -c 'git diff HEAD^ HEAD --quiet -- apps/bridge packages/shared || exit 1'
   
   # 方式 2: 使用自定义脚本（推荐）
   node scripts/check-should-deploy.js bridge
   ```

5. **配置域名**
   - Settings → Domains
   - 添加 `bridge.biya.com`

---

### 步骤 2: 创建 Vercel 项目（DEX）

1. **再次导入同一个仓库**
   - Add New → Project
   - 选择 `biya-coin`（同一个仓库！）

2. **配置项目**
   ```
   Project Name: biya-dex
   Root Directory: apps/dex        ← 不同的目录
   ```

3. **配置 Ignored Build Step**
   ```bash
   # 只监听 apps/dex 和 packages/shared
   git diff HEAD^ HEAD --quiet -- apps/dex packages/shared || exit 1
   ```

4. **配置域名**
   - 添加 `dex.biya.com`

---

### 步骤 3: 创建 Vercel 项目（Helix）

重复步骤 2，但使用：
```
Project Name: biya-helix
Root Directory: apps/helix
Domain: biya.com
```

---

## 🔧 自动化脚本（推荐）

### 创建部署检查脚本

```javascript
// scripts/check-should-deploy.js
const { execSync } = require('child_process')

const app = process.argv[2] // 'bridge', 'dex', 'helix'

if (!app) {
  console.log('❌ Usage: node check-should-deploy.js <app-name>')
  process.exit(1)
}

try {
  // 检查是否有相关文件变更
  const diff = execSync(
    `git diff HEAD^ HEAD --name-only -- apps/${app} packages/shared`,
    { encoding: 'utf8' }
  )

  if (diff.trim()) {
    console.log(`✅ ${app} has changes, proceeding with deployment`)
    console.log('Changed files:')
    console.log(diff)
    process.exit(1) // Exit 1 = 继续部署
  } else {
    console.log(`⏭️  ${app} has no changes, skipping deployment`)
    process.exit(0) // Exit 0 = 跳过部署
  }
} catch (error) {
  console.log('✅ Proceeding with deployment (error checking changes)')
  process.exit(1) // 出错时默认部署
}
```

### 在 Vercel 中使用

**Settings → Git → Ignored Build Step**:
```bash
node scripts/check-should-deploy.js bridge
```

---

## 🎬 实际场景演示

### 场景 1: 只修改 Bridge 代码

```bash
# 1. 修改 Bridge 代码
cd D:\rwa\biya-coin
code apps/bridge/app/page.tsx

# 2. 提交并推送
git add apps/bridge/app/page.tsx
git commit -m "Update bridge homepage"
git push origin main

# 3. Vercel 检测变更
Vercel 检查 biya-bridge 项目:
  - apps/bridge/ 有变更 ✅
  - 触发部署 → bridge.biya.com 更新

Vercel 检查 biya-dex 项目:
  - apps/dex/ 无变更 ❌
  - 跳过部署 → dex.biya.com 不变

Vercel 检查 biya-helix 项目:
  - apps/helix/ 无变更 ❌
  - 跳过部署 → biya.com 不变
```

**结果**: 只有 Bridge 重新部署！✅

---

### 场景 2: 修改共享代码

```bash
# 1. 修改共享组件
cd D:\rwa\biya-coin
code packages/shared/components/Button.tsx

# 2. 提交并推送
git add packages/shared/
git commit -m "Update shared Button component"
git push origin main

# 3. Vercel 检测变更
Vercel 检查 biya-bridge 项目:
  - packages/shared/ 有变更 ✅
  - 触发部署 → bridge.biya.com 更新

Vercel 检查 biya-dex 项目:
  - packages/shared/ 有变更 ✅
  - 触发部署 → dex.biya.com 更新

Vercel 检查 biya-helix 项目:
  - packages/shared/ 有变更 ✅
  - 触发部署 → biya.com 更新
```

**结果**: 所有项目都重新部署（因为共享代码变了）✅

---

### 场景 3: 只修改文档

```bash
# 1. 修改文档
cd D:\rwa\biya-coin
code docs/bridge/README.md

# 2. 提交并推送
git add docs/
git commit -m "Update docs"
git push origin main

# 3. Vercel 检测变更
Vercel 检查所有项目:
  - apps/* 无变更 ❌
  - packages/shared 无变更 ❌
  - 全部跳过部署
```

**结果**: 没有项目重新部署！✅

---

## 📊 配置对比

### ❌ 错误配置（所有项目一起部署）

```
Vercel Project: biya-all
  ├─ Root Directory: .              ← 根目录
  └─ 没有配置 Ignored Build Step    ← 任何改动都部署
  
结果：改一个文件，所有项目都部署 ❌
```

### ✅ 正确配置（独立部署）

```
Vercel Project 1: biya-bridge
  ├─ Root Directory: apps/bridge
  └─ Ignored Build Step: 监听 apps/bridge, packages/shared

Vercel Project 2: biya-dex
  ├─ Root Directory: apps/dex
  └─ Ignored Build Step: 监听 apps/dex, packages/shared

Vercel Project 3: biya-helix
  ├─ Root Directory: apps/helix
  └─ Ignored Build Step: 监听 apps/helix, packages/shared

结果：只部署有变更的项目 ✅
```

---

## 🎯 其他部署平台

### Netlify

**创建 `netlify.toml`**:

```toml
# apps/bridge/netlify.toml
[build]
  base = "apps/bridge"
  command = "npm run build"
  publish = ".next"
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- apps/bridge packages/shared"

[build.environment]
  NODE_VERSION = "20"
```

### GitHub Actions

```yaml
# .github/workflows/deploy-bridge.yml
name: Deploy Bridge
on:
  push:
    branches: [main]
    paths:
      - 'apps/bridge/**'
      - 'packages/shared/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Bridge
        run: |
          cd apps/bridge
          npm install
          npm run build
          # 部署到服务器
```

### Docker

```dockerfile
# apps/bridge/Dockerfile
FROM node:20-alpine

# 只复制 Bridge 和共享代码
COPY apps/bridge /app
COPY packages/shared /shared

WORKDIR /app
RUN npm install
RUN npm run build

CMD ["npm", "start"]
```

---

## 🔍 验证独立部署

### 测试步骤

```bash
# 1. 创建测试分支
git checkout -b test-independent-deploy

# 2. 只修改 Bridge
echo "// test" >> apps/bridge/app/page.tsx
git add apps/bridge/
git commit -m "Test: modify bridge only"
git push origin test-independent-deploy

# 3. 在 Vercel Dashboard 观察
# 应该只有 biya-bridge 项目触发部署
# biya-dex 和 biya-helix 应该显示 "Skipped"

# 4. 验证结果
# bridge.biya.com → 应该更新
# dex.biya.com → 应该没变
# biya.com → 应该没变
```

---

## 📈 监控和日志

### Vercel Dashboard

每个项目的部署历史：
```
biya-bridge:
  ✅ Deployed - Update bridge homepage (2 min ago)
  ⏭️  Skipped - Update docs (1 hour ago)
  ✅ Deployed - Update shared components (2 hours ago)

biya-dex:
  ⏭️  Skipped - Update bridge homepage (2 min ago)
  ⏭️  Skipped - Update docs (1 hour ago)
  ✅ Deployed - Update shared components (2 hours ago)
```

### 部署日志

```
Building Project: biya-bridge
Checking for changes...
✅ Changes detected in:
  - apps/bridge/app/page.tsx
  - packages/shared/components/Button.tsx

Installing dependencies...
Building application...
Deploying to bridge.biya.com...
✅ Deployment successful
```

---

## ⚡ 性能优化

### 1. Turborepo（推荐）

```bash
# 安装 Turborepo
npm install turbo --save-dev

# turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    }
  }
}

# 只构建变更的项目
turbo run build --filter=bridge
```

### 2. 缓存优化

```bash
# Vercel 自动缓存
# - node_modules
# - .next/cache
# - Build artifacts

# 手动控制缓存
vercel build --force  # 强制重新构建
```

---

## 🚨 常见问题

### Q1: 共享代码变更，所有项目都要部署吗？

**A**: 是的，这是正确的！

如果修改了 `packages/shared/`，所有使用它的项目都应该重新部署，确保一致性。

### Q2: 如何回滚单个项目？

**A**: 在 Vercel Dashboard：

```
1. 进入项目（如 biya-bridge）
2. 点击 "Deployments"
3. 找到之前的部署
4. 点击 "Promote to Production"
```

其他项目不受影响！

### Q3: 本地如何测试单个项目？

**A**: 
```bash
# 只启动 Bridge
cd apps/bridge
npm run dev

# 只构建 Bridge
npm run build
```

### Q4: CI/CD 如何加速？

**A**: 使用 Monorepo 工具：

```bash
# 使用 Turborepo
npx turbo run build --filter=bridge

# 使用 Nx
npx nx build bridge

# 使用 Lerna
npx lerna run build --scope=@biya/bridge
```

---

## 🎓 最佳实践

### 1. 目录结构清晰

```
biya-coin/
├── apps/
│   ├── bridge/        ← 完整的独立应用
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── app/
│   ├── dex/           ← 完整的独立应用
│   └── helix/         ← 完整的独立应用
└── packages/
    └── shared/        ← 共享代码
```

### 2. 依赖管理

```json
// apps/bridge/package.json
{
  "name": "@biya/bridge",
  "dependencies": {
    "@biya/shared": "workspace:*",  // 引用本地共享包
    "next": "^15.0.0"
  }
}
```

### 3. 环境变量隔离

```bash
# apps/bridge/.env.local
NEXT_PUBLIC_APP_NAME=Bridge
NEXT_PUBLIC_API_URL=https://api.bridge.biya.com

# apps/dex/.env.local
NEXT_PUBLIC_APP_NAME=DEX
NEXT_PUBLIC_API_URL=https://api.dex.biya.com
```

### 4. 构建脚本

```json
// package.json (根目录)
{
  "scripts": {
    "build:bridge": "cd apps/bridge && npm run build",
    "build:dex": "cd apps/dex && npm run build",
    "build:helix": "cd apps/helix && npm run build",
    "build:all": "npm run build:bridge && npm run build:dex && npm run build:helix"
  }
}
```

---

## 📊 成本对比

### Monorepo + 独立部署 vs Multi-repo

| 项目 | Monorepo | Multi-repo |
|------|----------|-----------|
| Git 仓库数 | 1 | 3 |
| Vercel 项目数 | 3 | 3 |
| CI/CD 运行 | 智能（只构建变更） | 每个仓库独立 |
| 构建时间 | 快（缓存复用） | 慢（各自构建） |
| 管理复杂度 | 低 | 高 |
| 代码共享 | 容易 | 困难（需要 npm） |

**结论**: Monorepo + 独立部署 = 最优方案 ✅

---

## 🚀 立即行动

### 方案 A: Vercel（推荐）

```bash
# 1. 推送代码到 GitHub
cd D:\rwa\biya-coin
git add .
git commit -m "Setup monorepo for independent deployment"
git push origin main

# 2. 在 Vercel 创建 3 个项目
# - biya-bridge (Root: apps/bridge)
# - biya-dex (Root: apps/dex)
# - biya-helix (Root: apps/helix)

# 3. 配置 Ignored Build Step
# 使用上面提供的脚本

# 4. 测试
echo "// test" >> apps/bridge/README.md
git add . && git commit -m "Test" && git push
# 观察 Vercel Dashboard，应该只有 bridge 部署
```

### 方案 B: 自己的服务器

```bash
# 使用 Docker Compose
docker-compose up -d bridge  # 只部署 Bridge
docker-compose up -d dex     # 只部署 DEX
docker-compose up -d helix   # 只部署 Helix
```

---

## 📖 相关文档

- [Git 策略详解](./GIT_AND_DEPLOYMENT_STRATEGY.md)
- [快速决策指南](./GIT_QUICK_DECISION.md)
- [独立部署计划](./BRIDGE_INDEPENDENT_DEPLOYMENT_PLAN.md)

---

*最后更新: 2025-10-30*

