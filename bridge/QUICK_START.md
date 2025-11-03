# 🚀 Bridge 独立部署 - 快速开始

> **5 分钟快速上手** | 适合急着开始的开发者  
> 详细文档：[BRIDGE_INDEPENDENT_DEPLOYMENT_PLAN.md](./BRIDGE_INDEPENDENT_DEPLOYMENT_PLAN.md)

---

## ⚡ 3 步快速部署

### 方式 1️⃣：自动化脚本（推荐）

```powershell
# 在 biya-coin 根目录运行
cd D:\rwa\biya-coin
.\docs\bridge\setup-bridge-app.ps1

# 安装依赖
pnpm install

# 启动 Bridge
pnpm dev:bridge
# → http://localhost:3001
```

**完成！🎉**

---

### 方式 2️⃣：手动设置（5-10分钟）

#### Step 1: 创建目录结构

```bash
cd D:\rwa\biya-coin

# 创建 apps 和 packages 目录
mkdir apps packages

# 移动现有项目
move biya-helix-app apps\helix
move biya-dex-app apps\dex
```

#### Step 2: 创建 Bridge 应用

```bash
cd apps

# 复制 helix 作为模板
xcopy helix bridge /E /I

# 清理不需要的页面
cd bridge\app
del about hello -r
```

#### Step 3: 修改端口和配置

编辑 `apps/bridge/package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3001",  // 改端口
    "start": "next start -p 3001"
  }
}
```

编辑 `apps/bridge/app/page.tsx`:
```typescript
// 只保留 Bridge 相关内容
import BridgeFromV2 from '@/components/bridge/BridgeFromV2'
import { BridgeProviders } from '@/context/bridge/BridgeProviders'

export default function BridgePage() {
  return (
    <BridgeProviders>
      <BridgeFromV2 />
    </BridgeProviders>
  )
}
```

#### Step 4: 启动

```bash
cd apps\bridge
npm install
npm run dev
# → http://localhost:3001
```

---

## 🔗 在主站添加跳转链接

编辑 `apps/helix/components/Navigation.tsx`:

```typescript
export function Navigation() {
  return (
    <nav>
      <a href="/">Home</a>
      {/* 添加 Bridge 链接 */}
      <a 
        href="http://localhost:3001"  // 开发环境
        // href="https://bridge.biya.com"  // 生产环境
        target="_blank"
      >
        Bridge 🌉
      </a>
      <a href="/about">About</a>
    </nav>
  )
}
```

---

## 🌐 部署到生产环境

### Vercel 部署（最简单）

1. **Push 到 GitHub**:
```bash
git add .
git commit -m "feat: add independent bridge app"
git push
```

2. **在 Vercel 创建项目**:
- 导入 GitHub 仓库
- Root Directory: `apps/bridge`
- Framework Preset: `Next.js`
- 点击 Deploy

3. **配置域名**:
- Settings → Domains
- 添加: `bridge.biya.com`

**完成！🚀**

---

## 📊 端口分配

| 应用 | 开发端口 | 生产域名 |
|------|---------|---------|
| 主站 (helix) | 8080 | biya.com |
| Bridge | 3001 | bridge.biya.com |
| DEX | 3002 | dex.biya.com |

---

## ⚙️ 环境变量配置

`apps/bridge/.env.local`:
```bash
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_MAIN_SITE_URL=https://biya.com
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id
```

获取 WalletConnect ID：https://cloud.walletconnect.com/

---

## 🐛 常见问题

### Q: pnpm 找不到？
```bash
npm install -g pnpm
```

### Q: 端口被占用？
修改 `package.json` 中的端口号：
```json
"dev": "next dev -p 3003"  // 换个端口
```

### Q: 依赖安装失败？
```bash
# 清理缓存
pnpm store prune

# 重新安装
rm -rf node_modules
pnpm install
```

### Q: Vendor 包找不到？
确保复制了 vendor 目录：
```bash
xcopy apps\helix\vendor apps\bridge\vendor /E /I /Y
```

---

## 📚 详细文档

- 📖 [完整部署方案](./BRIDGE_INDEPENDENT_DEPLOYMENT_PLAN.md)
- 🏗️ [架构设计](./02-架构设计.md)
- 🔧 [API 参考](./06-API参考.md)

---

## 💬 需要帮助？

- 查看错误日志
- 检查 .env.local 配置
- 确认端口没有被占用
- 查看详细文档

---

**开始构建吧！🚀**

