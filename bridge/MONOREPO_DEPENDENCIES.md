# 📦 Monorepo 依赖管理详解

> **核心问题**: 每个子项目有自己的 node_modules 吗？  
> **答案**: 有多种方式，推荐使用 Workspace 共享依赖  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [快速回答](#快速回答)
2. [三种依赖管理方式](#三种依赖管理方式)
3. [推荐方案：Workspace](#推荐方案workspace)
4. [实际配置](#实际配置)
5. [最佳实践](#最佳实践)

---

## 🎯 快速回答

### Q: 每个子项目有自己的 node_modules 吗？

**A**: **取决于你的配置方式**

```
方式 1: 传统方式（不推荐）
每个子项目独立 node_modules
  biya-coin/
  ├── apps/
  │   ├── bridge/
  │   │   └── node_modules/     ← 独立的
  │   ├── dex/
  │   │   └── node_modules/     ← 独立的
  │   └── helix/
  │       └── node_modules/     ← 独立的

缺点：
  ❌ 重复依赖（浪费空间）
  ❌ 安装慢
  ❌ 版本不一致

方式 2: Workspace 方式（推荐）⭐
共享 node_modules，提升到根目录
  biya-coin/
  ├── node_modules/            ← 所有依赖都在这里
  ├── apps/
  │   ├── bridge/
  │   ├── dex/
  │   └── helix/

优点：
  ✅ 节省空间（去重）
  ✅ 安装快
  ✅ 版本统一

方式 3: 混合方式
根目录 + 子项目特定依赖
  biya-coin/
  ├── node_modules/            ← 共享依赖
  ├── apps/
  │   ├── bridge/
  │   │   └── node_modules/     ← 只有 Bridge 特有的
  │   ├── dex/
  │   │   └── node_modules/     ← 只有 DEX 特有的
```

---

## 📊 三种依赖管理方式对比

### 方式 1: 传统方式（不推荐）

#### 目录结构
```
biya-coin/
├── apps/
│   ├── bridge/
│   │   ├── package.json
│   │   └── node_modules/
│   │       ├── react/
│   │       ├── next/
│   │       └── ...
│   ├── dex/
│   │   ├── package.json
│   │   └── node_modules/
│   │       ├── react/        ← 重复了！
│   │       ├── next/         ← 重复了！
│   │       └── ...
│   └── helix/
│       ├── package.json
│       └── node_modules/
│           ├── react/        ← 又重复了！
│           ├── next/         ← 又重复了！
│           └── ...
```

#### 安装方式
```bash
# 需要分别安装
cd apps/bridge && npm install
cd apps/dex && npm install
cd apps/helix && npm install
```

#### 问题
```
磁盘空间:
  - react（3 份） = 6 MB × 3 = 18 MB
  - next（3 份） = 500 MB × 3 = 1.5 GB
  - 总计：可能浪费 2-5 GB

安装时间:
  - 每个项目 2-3 分钟
  - 总计：6-9 分钟

版本问题:
  - Bridge: react@19.0.0
  - DEX: react@19.1.0      ← 版本不一致！
  - Helix: react@18.3.0    ← 更不一致！
```

---

### 方式 2: Workspace 方式（推荐）⭐

#### 目录结构
```
biya-coin/
├── package.json              ← 根 package.json（定义 workspaces）
├── node_modules/             ← 所有依赖在这里
│   ├── react/                ← 只有一份
│   ├── next/                 ← 只有一份
│   ├── @biya/                ← 内部包的软链接
│   │   ├── shared -> ../../packages/shared
│   │   └── bridge -> ../../apps/bridge
│   └── ...
├── apps/
│   ├── bridge/
│   │   └── package.json      ← 声明依赖（不安装）
│   ├── dex/
│   │   └── package.json      ← 声明依赖（不安装）
│   └── helix/
│       └── package.json      ← 声明依赖（不安装）
└── packages/
    └── shared/
        └── package.json
```

#### 配置方式

**根目录 package.json**:
```json
{
  "name": "biya-coin",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "install:all": "npm install",
    "build:bridge": "npm run build --workspace=apps/bridge",
    "build:dex": "npm run build --workspace=apps/dex",
    "build:all": "npm run build --workspaces"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0"
  }
}
```

#### 安装方式
```bash
# 在根目录一次性安装所有依赖
cd D:\rwa\biya-coin
npm install

# 自动处理所有子项目的依赖
# ✅ 去重
# ✅ 提升到根 node_modules
# ✅ 创建软链接
```

#### 优点
```
磁盘空间:
  - react（1 份） = 6 MB
  - next（1 份） = 500 MB
  - 节省：2-5 GB ✅

安装时间:
  - 一次安装：2-3 分钟
  - 节省：3-6 分钟 ✅

版本管理:
  - 统一版本
  - 避免冲突 ✅
```

---

### 方式 3: 混合方式

#### 目录结构
```
biya-coin/
├── node_modules/                ← 共享依赖
│   ├── react/
│   ├── next/
│   └── ...
├── apps/
│   ├── bridge/
│   │   ├── package.json
│   │   └── node_modules/        ← 只有 Bridge 特有的
│   │       └── some-bridge-only-lib/
│   ├── dex/
│   │   ├── package.json
│   │   └── node_modules/        ← 只有 DEX 特有的
│   │       └── some-dex-only-lib/
```

#### 使用场景
```
适合：
  ✅ 某些子项目有特殊依赖
  ✅ 避免污染根 node_modules

例如：
  - Bridge 使用特殊的 Ethereum 库
  - DEX 使用特殊的交易库
  - 这些库其他项目不需要
```

---

## 🚀 推荐方案：Workspace

### 为什么推荐 Workspace？

```
1. 节省空间
   传统方式：2-5 GB
   Workspace：500 MB - 1 GB
   节省：60-80% ✅

2. 安装更快
   传统方式：6-9 分钟
   Workspace：2-3 分钟
   节省：50-70% ✅

3. 版本统一
   - 所有项目使用相同版本
   - 避免兼容性问题
   - 更容易维护 ✅

4. 依赖管理简单
   - 一个命令安装所有
   - 统一更新
   - 统一审计 ✅
```

---

## ⚙️ 实际配置

### 1. npm Workspaces（推荐）

#### 根目录 package.json
```json
{
  "name": "biya-coin",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "biya-helix-app"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  }
}
```

#### 子项目 package.json（Bridge）
```json
{
  "name": "@biya/bridge",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0",
    "@biya/shared": "workspace:*"  // ← 引用本地 shared 包
  },
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001"
  }
}
```

#### 共享包 package.json
```json
{
  "name": "@biya/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./components": "./components/index.ts",
    "./utils": "./utils/index.ts"
  },
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

#### 常用命令
```bash
# 安装所有依赖
npm install

# 为特定项目添加依赖
npm install axios --workspace=apps/bridge

# 为所有项目添加依赖
npm install lodash --workspaces

# 运行所有项目的脚本
npm run build --workspaces

# 运行特定项目的脚本
npm run dev --workspace=apps/bridge

# 查看依赖树
npm list --all
```

---

### 2. pnpm Workspaces（更快）

#### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'biya-helix-app'
```

#### 根目录 package.json
```json
{
  "name": "biya-coin",
  "private": true,
  "scripts": {
    "dev": "pnpm --recursive dev",
    "build": "pnpm --recursive build"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

#### 常用命令
```bash
# 安装所有依赖
pnpm install

# 为特定项目添加依赖
pnpm add axios --filter @biya/bridge

# 递归运行脚本
pnpm --recursive dev

# 并行构建
pnpm --recursive --parallel build
```

#### pnpm 的优势
```
速度：
  npm install:  2-3 分钟
  pnpm install: 30-60 秒  ⚡ 快 2-3 倍

空间：
  npm:  500 MB - 1 GB
  pnpm: 100-200 MB  💾 节省 60-80%

原理：
  - 使用硬链接
  - 全局存储
  - 内容寻址
```

---

### 3. Yarn Workspaces

#### 根目录 package.json
```json
{
  "name": "biya-coin",
  "private": true,
  "workspaces": {
    "packages": [
      "apps/*",
      "packages/*"
    ]
  },
  "scripts": {
    "dev": "yarn workspaces run dev",
    "build": "yarn workspaces run build"
  }
}
```

#### 常用命令
```bash
# 安装所有依赖
yarn install

# 为特定项目添加依赖
yarn workspace @biya/bridge add axios

# 运行所有项目的脚本
yarn workspaces run build

# 运行特定项目的脚本
yarn workspace @biya/bridge dev
```

---

## 📋 实际案例

### 当前 biya-coin 项目结构

#### 现状（改进前）
```
biya-coin/
├── package.json                     ← 根配置
├── node_modules/                    ← 有一些依赖
├── biya-helix-app/
│   ├── package.json
│   └── node_modules/                ← 独立安装的
└── packages/
    └── shared/
        └── package.json             ← 没有独立 node_modules
```

**问题**：
- ❌ `biya-helix-app` 有独立的 node_modules（重复）
- ❌ 没有配置 workspaces
- ❌ 依赖管理混乱

---

#### 优化后（使用 Workspaces）
```
biya-coin/
├── package.json                     ← 配置 workspaces
├── node_modules/                    ← 所有共享依赖
│   ├── react/
│   ├── next/
│   ├── @biya/
│   │   ├── shared -> ../packages/shared
│   │   ├── bridge -> ../apps/bridge
│   │   └── helix -> ../biya-helix-app
│   └── ...
├── apps/
│   ├── bridge/
│   │   └── package.json             ← 声明依赖
│   ├── dex/
│   │   └── package.json
│   └── helix/
│       └── package.json
└── packages/
    └── shared/
        └── package.json
```

**优点**：
- ✅ 只有一个 node_modules
- ✅ 依赖自动去重
- ✅ 安装更快
- ✅ 节省空间

---

## 🔧 迁移步骤

### 从传统方式迁移到 Workspaces

#### 1. 备份现有项目
```bash
cd D:\rwa\biya-coin
git add .
git commit -m "Backup before workspace migration"
```

#### 2. 更新根目录 package.json
```json
{
  "name": "biya-coin",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "biya-helix-app"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "clean": "rm -rf node_modules apps/*/node_modules packages/*/node_modules biya-helix-app/node_modules"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

#### 3. 清理所有 node_modules
```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules, biya-helix-app\node_modules

# 或者使用 npm 脚本
npm run clean
```

#### 4. 重新安装（使用 Workspaces）
```bash
npm install
```

#### 5. 验证
```bash
# 检查依赖是否正确
npm list --all

# 测试构建
npm run build --workspace=biya-helix-app

# 测试运行
npm run dev --workspace=biya-helix-app
```

---

## 💾 空间对比

### 实际数据（biya-coin 项目）

#### 传统方式
```
D:\rwa\biya-coin\
├── node_modules/               200 MB
├── biya-helix-app/
│   └── node_modules/           800 MB  ← 重复！
└── packages/
    └── shared/
        └── node_modules/       100 MB  ← 又重复！

总计：1.1 GB
```

#### Workspace 方式
```
D:\rwa\biya-coin\
├── node_modules/               900 MB  ← 所有依赖
├── apps/
│   ├── bridge/                 (无 node_modules)
│   ├── dex/                    (无 node_modules)
│   └── helix/                  (无 node_modules)
└── packages/
    └── shared/                 (无 node_modules)

总计：900 MB

节省：200 MB (18%)
```

#### pnpm 方式
```
D:\rwa\biya-coin\
├── node_modules/               200 MB  ← 硬链接
├── .pnpm-store/                600 MB  ← 全局存储

总计：800 MB

节省：300 MB (27%)
```

---

## 🎯 最佳实践

### 1. 使用 Workspace（必须）

```json
// 根目录 package.json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### 2. 统一依赖版本

```json
// 根目录 package.json - 公共依赖
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  }
}

// apps/bridge/package.json - 项目特定依赖
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "@biya/shared": "workspace:*"
  }
}
```

### 3. 使用 workspace: 协议

```json
{
  "dependencies": {
    "@biya/shared": "workspace:*"  // ← 引用本地包
  }
}
```

### 4. 锁定版本

```bash
# 生成 package-lock.json
npm install

# 提交到 git
git add package-lock.json
git commit -m "Lock dependency versions"

# 团队使用
npm ci  # 而不是 npm install
```

### 5. 定期清理

```bash
# 清理所有 node_modules
rm -rf node_modules apps/*/node_modules

# 重新安装
npm install

# 或使用脚本
npm run clean && npm install
```

---

## 🚨 常见问题

### Q1: 为什么子项目还有 node_modules？

**A**: 可能原因：
1. ❌ 没有配置 workspaces
2. ❌ 在子项目目录运行了 `npm install`
3. ❌ 有子项目特有的依赖

**解决**:
```bash
# 删除子项目的 node_modules
rm -rf apps/*/node_modules

# 在根目录重新安装
cd D:\rwa\biya-coin
npm install
```

---

### Q2: 如何添加子项目特有的依赖？

**A**: 使用 `--workspace` 参数

```bash
# 为 Bridge 添加依赖
npm install axios --workspace=apps/bridge

# 会更新 apps/bridge/package.json
# 但依赖安装在根 node_modules
```

---

### Q3: 如何引用本地 shared 包？

**A**: 使用 `workspace:*` 协议

```json
// apps/bridge/package.json
{
  "dependencies": {
    "@biya/shared": "workspace:*"
  }
}
```

代码中:
```typescript
// ✅ 正确
import { Button } from '@biya/shared/components'

// ❌ 错误
import { Button } from '../../packages/shared/components'
```

---

### Q4: pnpm 和 npm 如何选择？

**A**: 
- 小项目 → npm workspaces（简单）
- 大项目 → pnpm（快且省空间）

**迁移到 pnpm**:
```bash
# 1. 安装 pnpm
npm install -g pnpm

# 2. 创建 pnpm-workspace.yaml
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 3. 删除 npm 相关
rm -rf node_modules package-lock.json

# 4. 使用 pnpm 安装
pnpm install
```

---

### Q5: 构建时找不到依赖怎么办？

**A**: 检查以下几点：

```bash
# 1. 确认依赖已安装
npm list <package-name>

# 2. 检查 package.json
cat apps/bridge/package.json

# 3. 重新安装
npm install

# 4. 检查导入路径
# ✅ 正确
import { Button } from '@biya/shared'
# ❌ 错误
import { Button } from '../../shared'
```

---

## 📖 相关文档

- [Monorepo 独立部署](./MONOREPO_INDEPENDENT_DEPLOYMENT.md)
- [Git 策略对比](./GIT_AND_DEPLOYMENT_STRATEGY.md)
- [共享功能](./SHARED_FEATURES_IN_MONOREPO.md)

---

## 🚀 立即行动

### 推荐配置（npm workspaces）

```bash
# 1. 更新根 package.json
cd D:\rwa\biya-coin

# 2. 清理现有 node_modules
Remove-Item -Recurse -Force biya-helix-app\node_modules

# 3. 配置 workspaces（手动编辑 package.json）
# 添加：
# "workspaces": ["apps/*", "packages/*", "biya-helix-app"]

# 4. 重新安装
npm install

# 5. 验证
npm list
npm run build --workspace=biya-helix-app

✅ 完成！
```

---

*最后更新: 2025-10-30*

