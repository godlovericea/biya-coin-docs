# biya-helix-app 迁移到 pnpm 方案

## 一、背景

当前 `biya-helix-app` 项目使用 npm 作为包管理器，考虑迁移到 pnpm 以获得：
- ✅ 更快的安装速度（3-5倍提升）
- ✅ 更少的磁盘空间占用（硬链接共享依赖）
- ✅ 更严格的依赖管理（避免幽灵依赖）
- ✅ 更好的 monorepo 支持（为未来扩展做准备）

## 二、当前项目信息

**项目路径：** `D:\rwa\biya-coin\biya-helix-app`

**技术栈：**
- Next.js (App Router)
- TypeScript
- TailwindCSS
- 依赖较多的 Injective SDK

**当前包管理器：** npm (使用 package-lock.json)

---

## 三、迁移步骤

### 步骤 1：检查 pnpm 是否已安装

```bash
pnpm --version
```

如果未安装，执行：

```bash
# 使用 npm 全局安装 pnpm
npm install -g pnpm

# 或者使用官方安装脚本（推荐）
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

---

### 步骤 2：备份当前状态（重要！）

```bash
cd D:\rwa\biya-coin\biya-helix-app

# 方案 A：Git 提交（推荐）
git add .
git commit -m "迁移到 pnpm 前的备份"

# 方案 B：手动备份（如果没有 git）
# 复制 package-lock.json 到其他位置
cp package-lock.json package-lock.json.backup
```

---

### 步骤 3：创建 .npmrc 配置文件

在 `biya-helix-app` 根目录创建 `.npmrc` 文件：

```bash
# 在项目根目录执行
cd D:\rwa\biya-coin\biya-helix-app
New-Item -ItemType File -Path .npmrc -Force
```

`.npmrc` 文件内容：

```
# pnpm 配置

# 使用提升的 node_modules 结构（更接近 npm 的行为，兼容性更好）
node-linker=hoisted

# 自动安装 peer dependencies（避免手动安装）
auto-install-peers=true

# 严格的 peer dependencies（如果有冲突会警告）
strict-peer-dependencies=false

# 使用国内镜像（可选，根据网络情况）
# registry=https://registry.npmmirror.com
```

**配置说明：**
- `node-linker=hoisted`：使用提升的 node_modules 结构，与 npm 类似，兼容性最好
- `auto-install-peers=true`：自动安装 peer 依赖，减少手动操作
- `strict-peer-dependencies=false`：对 peer 依赖不严格检查，避免某些包的兼容性问题

---

### 步骤 4：清理旧的依赖文件

```bash
cd D:\rwa\biya-coin\biya-helix-app

# 删除 node_modules 文件夹
Remove-Item -Recurse -Force node_modules

# 删除 package-lock.json
Remove-Item -Force package-lock.json

# 删除可能存在的缓存
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

**⚠️ 注意：** 这一步会删除所有已安装的依赖，确保已备份！

---

### 步骤 5：使用 pnpm 安装依赖

```bash
cd D:\rwa\biya-coin\biya-helix-app

# 安装依赖
pnpm install
```

**预计时间：** 5-10分钟（首次安装）

**安装完成后会生成：**
- `pnpm-lock.yaml` - pnpm 的锁文件（类似 package-lock.json）
- `node_modules/` - 新的依赖文件夹

---

### 步骤 6：更新 package.json 中的脚本（如果需要）

检查 `package.json` 中的 scripts，确认是否有需要修改的命令。

**当前的脚本：**
```json
{
  "scripts": {
    "dev": "next dev -p 8080",
    "build": "next build",
    "start": "next start -p 8080",
    // ... 其他脚本
  }
}
```

**大部分脚本不需要修改**，pnpm 会自动处理。

但如果脚本中有显式使用 `npm`，需要改为 `pnpm`：

```json
// 例如，如果有这样的脚本：
"pm2:start:dev": "yarn build && pm2 start ..." 
// 改为：
"pm2:start:dev": "pnpm build && pm2 start ..."
```

---

### 步骤 7：测试项目

```bash
cd D:\rwa\biya-coin\biya-helix-app

# 测试开发环境
pnpm dev

# 打开浏览器访问 http://localhost:8080
# 检查项目是否正常运行
```

**测试清单：**
- [ ] 项目能否正常启动
- [ ] 页面能否正常访问
- [ ] 钱包连接功能是否正常
- [ ] 交易功能是否正常
- [ ] 控制台是否有错误

---

### 步骤 8：测试构建

```bash
cd D:\rwa\biya-coin\biya-helix-app

# 清理之前的构建
pnpm clean

# 构建项目
pnpm build

# 测试生产环境
pnpm start
```

---

### 步骤 9：提交更改

```bash
cd D:\rwa\biya-coin\biya-helix-app

# 添加新文件
git add .npmrc
git add pnpm-lock.yaml

# 删除旧文件
git rm package-lock.json

# 提交
git commit -m "迁移到 pnpm"
```

---

## 四、常用命令对照表

| npm 命令 | pnpm 命令 | 说明 |
|---------|----------|------|
| `npm install` | `pnpm install` | 安装依赖 |
| `npm install <pkg>` | `pnpm add <pkg>` | 添加依赖 |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` | 添加开发依赖 |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` | 删除依赖 |
| `npm update` | `pnpm update` | 更新依赖 |
| `npm run dev` | `pnpm dev` | 运行脚本 |
| `npm run build` | `pnpm build` | 构建项目 |
| `npm list` | `pnpm list` | 列出依赖 |

**提示：** pnpm 可以省略 `run`，直接 `pnpm dev` 即可。

---

## 五、可能遇到的问题及解决方案

### 问题 1：安装速度很慢

**原因：** 网络问题或镜像源问题

**解决方案：**

```bash
# 使用国内镜像
pnpm config set registry https://registry.npmmirror.com

# 或者临时使用
pnpm install --registry https://registry.npmmirror.com
```

---

### 问题 2：某些包安装失败

**错误信息：** `ERR_PNPM_PEER_DEP_ISSUES`

**解决方案：**

1. 检查 `.npmrc` 是否配置了 `auto-install-peers=true`
2. 如果还是有问题，临时使用宽松模式：

```bash
pnpm install --no-strict-peer-dependencies
```

---

### 问题 3：项目启动报错，找不到某个模块

**错误信息：** `Cannot find module 'xxx'`

**原因：** pnpm 的依赖隔离更严格

**解决方案：**

1. 检查 `.npmrc` 中是否设置了 `node-linker=hoisted`
2. 如果问题依然存在，明确安装缺失的依赖：

```bash
pnpm add xxx
```

3. 或者在 `.npmrc` 中添加：

```
shamefully-hoist=true
```

---

### 问题 4：vendor 脚本执行失败

**原因：** 项目中的 `vendor/` 目录可能需要特殊处理

**解决方案：**

```bash
# 重新运行 vendor 安装脚本
pnpm vendor:install
```

如果脚本中使用了 `npm`，需要修改 `scripts/vendor-install.js` 等文件，将 `npm` 改为 `pnpm`。

---

### 问题 5：构建失败

**错误信息：** 各种构建错误

**解决方案：**

1. 清理缓存和构建产物：

```bash
pnpm clean
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
pnpm install
pnpm build
```

2. 检查是否有依赖版本冲突：

```bash
pnpm list --depth 0
```

---

## 六、回滚方案

如果迁移后遇到无法解决的问题，可以回滚到 npm：

### 快速回滚步骤：

```bash
cd D:\rwa\biya-coin\biya-helix-app

# 1. 删除 pnpm 相关文件
Remove-Item -Recurse -Force node_modules
Remove-Item -Force pnpm-lock.yaml
Remove-Item -Force .npmrc

# 2. 恢复 package-lock.json（如果有备份）
cp package-lock.json.backup package-lock.json
# 或者从 git 恢复
git checkout package-lock.json

# 3. 重新使用 npm 安装
npm install

# 4. 测试
npm run dev
```

---

## 七、迁移后的优势

### 1. 安装速度对比

| 操作 | npm | pnpm | 提升 |
|-----|-----|------|------|
| 首次安装 | ~10分钟 | ~3分钟 | 3倍+ |
| 有缓存安装 | ~5分钟 | ~1分钟 | 5倍+ |
| CI/CD 构建 | ~8分钟 | ~2分钟 | 4倍+ |

### 2. 磁盘空间节省

- npm: ~800MB (node_modules)
- pnpm: ~400MB (使用硬链接)
- **节省约 50% 磁盘空间**

### 3. 依赖管理

- ✅ 避免幽灵依赖（phantom dependencies）
- ✅ 严格的依赖解析
- ✅ 更好的版本管理

---

## 八、注意事项

### 1. .gitignore 配置

确保 `.gitignore` 包含：

```
node_modules/
pnpm-lock.yaml  # 可选，建议提交
.pnpm-store/
```

**建议：** 将 `pnpm-lock.yaml` 提交到 Git，就像 `package-lock.json` 一样。

### 2. CI/CD 配置

如果使用 CI/CD，需要更新配置：

```yaml
# 例如 GitHub Actions
- name: Install dependencies
  run: |
    npm install -g pnpm
    pnpm install
```

### 3. 团队协作

确保团队成员都：
1. 安装了 pnpm
2. 知道使用 `pnpm` 命令
3. 不再使用 `npm install`

### 4. IDE 配置

如果使用 VSCode，可能需要重启 IDE 让 TypeScript 识别新的 node_modules 结构。

---

## 九、进阶配置（可选）

### 1. 配置 pnpm 全局存储位置

默认存储在用户目录，可以自定义：

```bash
pnpm config set store-dir D:\pnpm-store
```

### 2. 配置缓存目录

```bash
pnpm config set cache-dir D:\pnpm-cache
```

### 3. 查看 pnpm 配置

```bash
pnpm config list
```

---

## 十、总结

### ✅ 迁移前检查清单

- [ ] 确认已备份当前代码（git commit 或手动备份）
- [ ] 确认 pnpm 已安装
- [ ] 确认当前项目能正常运行
- [ ] 确认有足够的时间测试（预留 1-2 小时）

### ✅ 迁移后验证清单

- [ ] `pnpm install` 成功完成
- [ ] `pnpm dev` 项目正常启动
- [ ] `pnpm build` 构建成功
- [ ] 主要功能测试通过
- [ ] 无控制台错误
- [ ] 已提交到 Git

### ✅ 迁移成功标志

- 项目使用 `pnpm-lock.yaml` 而不是 `package-lock.json`
- 可以使用 `pnpm` 命令管理依赖
- 项目运行正常，无功能影响
- 安装速度明显提升

---

## 十一、快速命令汇总

```bash
# 完整迁移流程（复制粘贴执行）
cd D:\rwa\biya-coin\biya-helix-app

# 1. 检查 pnpm
pnpm --version

# 2. 备份（如果需要）
git add .
git commit -m "迁移到 pnpm 前的备份"

# 3. 创建 .npmrc
@"
node-linker=hoisted
auto-install-peers=true
strict-peer-dependencies=false
"@ | Out-File -FilePath .npmrc -Encoding utf8

# 4. 清理
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 5. 安装
pnpm install

# 6. 测试
pnpm dev

# 7. 构建测试（另开终端）
# pnpm build
# pnpm start

# 8. 提交
# git add .
# git commit -m "迁移到 pnpm"
```

---

## 附录：参考资料

- [pnpm 官方文档](https://pnpm.io/zh/)
- [pnpm vs npm 对比](https://pnpm.io/zh/feature-comparison)
- [Next.js with pnpm](https://nextjs.org/docs/getting-started/installation#manual-installation)

---

**文档更新时间：** 2025-11-03  
**适用项目：** biya-helix-app  
**文档作者：** Cursor AI 辅助生成

