# 🔀 Git 仓库与部署策略

> **核心问题**: 子项目能否使用不同 git 地址？能否单独部署？  
> **答案**: 有多种方案可选，根据团队需求决定  
> **更新时间**: 2025-10-30

---

## 📖 目录

1. [核心问题解答](#核心问题解答)
2. [方案对比](#方案对比)
3. [推荐方案](#推荐方案)
4. [实施细节](#实施细节)
5. [最佳实践](#最佳实践)

---

## 💡 核心问题解答

### Q1: 子项目是单独的 git 地址吗？

**A**: 取决于你选择的方案

| 方案 | Git 仓库 | 说明 |
|------|---------|------|
| **Monorepo** | ✅ 单一仓库 | 所有项目在一个 repo |
| **Multi-repo** | ✅ 多个仓库 | 每个项目独立 repo |
| **Hybrid** | ⚡ 混合 | 主 repo + git submodules |

### Q2: 可以使用不同的 git 地址吗？

**A**: ✅ **可以！**

有三种方式：
1. **Git Submodules** - 引用其他仓库
2. **Git Subtree** - 合并其他仓库
3. **Multi-repo** - 完全独立的仓库

### Q3: 可以单独部署吗？

**A**: ✅ **完全可以！**

无论使用哪种 Git 策略，**部署都是独立的**：

```
Bridge: https://bridge.biya.com  (独立部署)
DEX:    https://dex.biya.com     (独立部署)
Helix:  https://biya.com         (独立部署)
```

---

## 📊 方案对比

### 方案 1: Monorepo（单一仓库）✅ 推荐

```
单一 Git 仓库
├── apps/
│   ├── bridge/     → 独立部署到 bridge.biya.com
│   ├── dex/        → 独立部署到 dex.biya.com
│   └── helix/      → 独立部署到 biya.com
└── packages/
    └── shared/
```

**优点**：
- ✅ 代码共享方便
- ✅ 统一的版本管理
- ✅ 原子化提交（修改多个项目一次提交）
- ✅ 更容易重构
- ✅ 统一的 CI/CD

**缺点**：
- ❌ 仓库变大
- ❌ 克隆时间长
- ❌ 权限管理复杂（整个团队都能看到所有代码）

**适合场景**：
- 团队协作密切
- 项目关联性强
- 需要频繁共享代码

---

### 方案 2: Multi-repo（多个仓库）

```
独立的 Git 仓库
├── biya-bridge/    (repo 1) → https://github.com/biya/bridge
├── biya-dex/       (repo 2) → https://github.com/biya/dex
└── biya-helix/     (repo 3) → https://github.com/biya/helix

共享库（独立 npm 包）
└── @biya/shared    (npm)    → npm install @biya/shared
```

**优点**：
- ✅ 完全独立
- ✅ 权限管理简单
- ✅ 克隆快速
- ✅ 团队可以独立工作

**缺点**：
- ❌ 代码共享困难
- ❌ 需要发布 npm 包
- ❌ 版本同步麻烦
- ❌ 重构跨项目困难

**适合场景**：
- 团队独立工作
- 项目关联性弱
- 不同的发布周期

---

### 方案 3: Hybrid（混合方案）⚡ 灵活

```
主仓库 + Submodules
biya-monorepo/              (主 repo)
├── apps/
│   ├── bridge/             (submodule → bridge repo)
│   ├── dex/                (submodule → dex repo)
│   └── helix/              (本地代码)
└── packages/
    └── shared/             (本地代码)
```

**优点**：
- ✅ 既有 Monorepo 的便利
- ✅ 又有 Multi-repo 的灵活性
- ✅ 可以控制访问权限
- ✅ 可以独立开发

**缺点**：
- ❌ 管理复杂
- ❌ 学习成本高
- ❌ 容易出错

**适合场景**：
- 部分项目需要严格权限控制
- 部分项目来自外部团队
- 需要混合管理

---

## 🎯 推荐方案

### 情况 1: 同一团队，协作开发 → **Monorepo**

```
biya-coin/                  (单一 repo)
├── apps/
│   ├── bridge/
│   ├── dex/
│   └── helix/
└── packages/
    └── shared/
```

**Git 地址**:
```
https://github.com/biya/biya-coin
```

**部署**:
```
Bridge:  apps/bridge/  → bridge.biya.com
DEX:     apps/dex/     → dex.biya.com
Helix:   apps/helix/   → biya.com
```

**权限管理**:
- 整个团队访问整个仓库
- 通过 CODEOWNERS 控制代码审查权限

**CI/CD**:
```yaml
# .github/workflows/bridge.yml
name: Deploy Bridge
on:
  push:
    paths:
      - 'apps/bridge/**'
      - 'packages/shared/**'
```

---

### 情况 2: 不同团队，独立开发 → **Multi-repo**

```
独立仓库
https://github.com/biya/bridge
https://github.com/biya/dex
https://github.com/biya/helix

共享库（npm 包）
https://github.com/biya/shared
```

**共享代码**:
```json
// package.json
{
  "dependencies": {
    "@biya/shared": "^1.0.0"  // 从 npm 安装
  }
}
```

**部署**:
- 每个项目独立部署
- 互不影响

---

### 情况 3: 混合需求 → **Hybrid (Submodules)**

```
主仓库
biya-monorepo/
├── apps/
│   ├── bridge/             # git submodule
│   ├── dex/                # git submodule
│   └── helix/              # 主仓库代码
└── packages/
    └── shared/             # 主仓库代码
```

**设置 Submodules**:
```bash
# 添加 submodule
git submodule add https://github.com/biya/bridge apps/bridge
git submodule add https://github.com/biya/dex apps/dex

# 克隆包含 submodules
git clone --recursive https://github.com/biya/biya-monorepo

# 更新 submodules
git submodule update --remote
```

---

## 🚀 实施细节

### 方案 A: Monorepo 实施

#### 1. 创建单一仓库

```bash
cd D:\rwa\biya-coin
git init
git add .
git commit -m "Initial commit with Monorepo structure"
git remote add origin https://github.com/your-org/biya-coin
git push -u origin main
```

#### 2. 配置部署

**Vercel 部署**:
- Project 1: `biya-bridge`
  - Root Directory: `apps/bridge`
  - Domain: `bridge.biya.com`

- Project 2: `biya-dex`
  - Root Directory: `apps/dex`
  - Domain: `dex.biya.com`

- Project 3: `biya-helix`
  - Root Directory: `apps/helix`
  - Domain: `biya.com`

**CI/CD**:
```yaml
# .github/workflows/deploy-bridge.yml
name: Deploy Bridge
on:
  push:
    branches: [main]
    paths:
      - 'apps/bridge/**'
      - 'packages/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          cd apps/bridge
          vercel --prod
```

---

### 方案 B: Submodules 实施

#### 1. 创建主仓库

```bash
mkdir biya-monorepo
cd biya-monorepo
git init

# 创建基础结构
mkdir -p packages/shared
```

#### 2. 添加子项目为 Submodules

```bash
# 添加 Bridge 项目（来自独立仓库）
git submodule add https://github.com/biya/bridge apps/bridge

# 添加 DEX 项目（来自独立仓库）
git submodule add https://github.com/biya/dex apps/dex

# Helix 直接在主仓库
mkdir -p apps/helix
```

#### 3. 初始化和更新

```bash
# 克隆包含 submodules
git clone --recursive https://github.com/biya/biya-monorepo

# 或者先克隆，再初始化 submodules
git clone https://github.com/biya/biya-monorepo
cd biya-monorepo
git submodule init
git submodule update
```

#### 4. 更新 Submodules

```bash
# 更新单个 submodule
cd apps/bridge
git pull origin main

# 更新所有 submodules
git submodule update --remote --merge

# 提交 submodule 变更
cd ../..
git add apps/bridge
git commit -m "Update bridge submodule"
```

#### 5. 团队工作流

**开发 Bridge 项目**:
```bash
# 进入 Bridge 目录
cd apps/bridge

# 这是一个独立的 git 仓库
git checkout -b feature/new-feature
# ... 修改代码
git commit -m "Add new feature"
git push origin feature/new-feature

# 回到主仓库，更新 submodule 引用
cd ../..
git add apps/bridge
git commit -m "Update bridge to latest version"
git push
```

---

## 📊 部署策略对比

| 部署方式 | Monorepo | Multi-repo | Hybrid |
|---------|----------|-----------|--------|
| **独立部署** | ✅ | ✅ | ✅ |
| **独立域名** | ✅ | ✅ | ✅ |
| **独立 CI/CD** | ✅ | ✅ | ✅ |
| **部署触发** | 监听路径 | 监听仓库 | 监听 submodule |
| **回滚** | 按应用回滚 | 按仓库回滚 | 按 submodule 回滚 |

**结论**: 无论使用哪种 Git 策略，**部署都是完全独立的**！

---

## 🔐 权限管理

### Monorepo 权限

```
整个仓库
├── apps/
│   ├── bridge/    ← Team A 负责（通过 CODEOWNERS）
│   ├── dex/       ← Team B 负责（通过 CODEOWNERS）
│   └── helix/     ← Team C 负责（通过 CODEOWNERS）
```

**GitHub CODEOWNERS**:
```
# .github/CODEOWNERS
/apps/bridge/** @team-bridge
/apps/dex/** @team-dex
/apps/helix/** @team-helix
/packages/shared/** @team-platform
```

### Multi-repo 权限

```
独立仓库，完全独立的权限
├── biya-bridge/   ← Team A 有权限
├── biya-dex/      ← Team B 有权限
└── biya-helix/    ← Team C 有权限
```

---

## ✅ 最佳实践

### 1. 选择合适的方案

```
同一团队？     → Monorepo
不同团队？     → Multi-repo 或 Hybrid
有外部依赖？   → Hybrid (Submodules)
严格权限控制？ → Multi-repo
```

### 2. CI/CD 配置

**Monorepo**:
```yaml
# 只在相关代码变更时部署
on:
  push:
    paths:
      - 'apps/bridge/**'
      - 'packages/shared/**'  # 共享代码变更也要部署
```

**Multi-repo**:
```yaml
# 任何变更都部署
on:
  push:
    branches: [main]
```

### 3. 版本管理

**Monorepo**:
- 统一版本号（推荐）
- 或每个应用独立版本

**Multi-repo**:
- 每个仓库独立版本
- 共享库使用语义化版本

### 4. 依赖管理

**Monorepo**:
```json
// apps/bridge/package.json
{
  "dependencies": {
    "@biya/shared": "workspace:*"  // 本地引用
  }
}
```

**Multi-repo**:
```json
// bridge/package.json
{
  "dependencies": {
    "@biya/shared": "^1.0.0"  // npm 包
  }
}
```

---

## 🎯 决策树

```
开始
  ↓
问：团队是否紧密协作？
  ↓
┌─YES──────────────────┐    ┌─NO───────────────────┐
│ 问：需要频繁共享代码？ │    │ 问：有严格权限要求？  │
│                      │    │                      │
│ YES → Monorepo ✅    │    │ YES → Multi-repo ✅  │
│ NO  → Multi-repo     │    │ NO  → Hybrid         │
└──────────────────────┘    └──────────────────────┘
```

---

## 🚀 实际部署示例

### 场景：Monorepo + 独立部署

```bash
# 1. 代码结构（单一 git 仓库）
biya-coin/
├── apps/
│   ├── bridge/
│   ├── dex/
│   └── helix/

# 2. Vercel 配置（三个独立项目）
Vercel Project 1: biya-bridge
  - Git: biya-coin (main branch)
  - Root: apps/bridge
  - Domain: bridge.biya.com
  
Vercel Project 2: biya-dex
  - Git: biya-coin (main branch)
  - Root: apps/dex
  - Domain: dex.biya.com
  
Vercel Project 3: biya-helix
  - Git: biya-coin (main branch)
  - Root: apps/helix
  - Domain: biya.com

# 3. 部署触发
修改 apps/bridge → 只重新部署 Bridge
修改 apps/dex → 只重新部署 DEX
修改 packages/shared → 三个项目都重新部署
```

---

## 📚 总结

### 核心要点

1. **Git 策略** 和 **部署策略** 是独立的
   - Monorepo 可以独立部署
   - Multi-repo 也可以共享代码

2. **推荐 Monorepo** 因为：
   - ✅ 代码共享方便
   - ✅ 统一管理
   - ✅ 仍然可以独立部署

3. **部署完全独立**：
   - 不同域名
   - 不同 Vercel 项目
   - 互不影响

### 快速决策

| 需求 | 推荐方案 |
|------|---------|
| 同一团队 | Monorepo |
| 不同团队 | Multi-repo |
| 混合需求 | Hybrid |
| **部署独立？** | **✅ 全都支持** |

---

## 📖 相关文档

- [独立部署方案](./BRIDGE_INDEPENDENT_DEPLOYMENT_PLAN.md)
- [共享功能方案](./SHARED_FEATURES_IN_MONOREPO.md)
- [状态管理策略](./STATE_MANAGEMENT_STRATEGY.md)

---

*最后更新: 2025-10-30*

