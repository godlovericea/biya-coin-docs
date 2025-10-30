# Week 1: 基础架构与钱包 (Day 1-7)

**目标**: 项目可运行，钱包可连接，市场数据可展示  
**负责人**: 全员（5人）  
**验收**: `yarn dev`启动成功，可连接Metamask，显示市场列表

---

## 📋 本周概览

### 核心任务
1. **Day 1**: 项目搭建与环境配置
2. **Day 2**: 目录结构与静态资源
3. **Day 3-4**: 钱包连接系统
4. **Day 5-6**: 市场数据服务
5. **Day 7**: 主页与路由

### 技术重点
- Next.js 15 + TypeScript + Tailwind CSS 基础搭建
- Injective SDK 集成
- Zustand 状态管理
- 钱包连接（Metamask, Keplr, Leap, Cosmostation）
- WebSocket 基础实现
- 市场数据获取与展示

---

## Day 1: 项目搭建与环境配置

**负责人**: 架构师 + 2名开发  
**工作时间**: 8小时

### 任务1.1: 初始化Next.js项目 (2小时)

**参考文件**: `injective-helix-demo/package.json`, `nuxt.config.ts`

**详细步骤**:
1. 创建Next.js 15项目
   - 运行 `npx create-next-app@latest biya-helix-app`
   - 选择：TypeScript ✓, ESLint ✓, Tailwind CSS ✓, App Router ✓
   - 进入项目目录 `cd biya-helix-app`

2. 安装核心依赖包
   - Injective SDK: `@injectivelabs/sdk-ts`, `@injectivelabs/wallet-ts`
   - 状态管理: `zustand`, `@tanstack/react-query`
   - 表单: `react-hook-form`, `zod`
   - UI组件: `@radix-ui/react-*` (Dialog, Dropdown, Tabs等)
   - 工具库: `bignumber.js`, `date-fns`, `lodash-es`
   - 图表: `lightweight-charts`, `apexcharts`
   
3. 复制package.json中的依赖列表
   - 从`injective-helix-demo/package.json`提取所有依赖
   - 转换Nuxt专用包到Next.js等价物
   - 运行 `yarn install` 或 `yarn`

4. 验证安装
   - 运行 `yarn dev`确认项目启动
   - 访问 http://localhost:3000
   - 确认无错误

**交付物**:
- [ ] package.json包含所有必需依赖
- [ ] 项目可以正常启动
- [ ] 无依赖冲突错误

**验收标准**:
- `yarn dev` 正常启动
- 浏览器访问无错误
- 控制台无警告

---

### 任务1.2: TypeScript配置 (1小时)

**参考文件**: `injective-helix-demo/tsconfig.json`

**详细步骤**:
1. 配置tsconfig.json
   - 启用严格模式: `"strict": true`
   - 配置路径别名:
     ```json
     "paths": {
       "@/*": ["./src/*"],
       "@components/*": ["./src/components/*"],
       "@lib/*": ["./src/lib/*"],
       "@hooks/*": ["./src/hooks/*"],
       "@types/*": ["./src/types/*"],
       "@utils/*": ["./src/utils/*"],
       "@constants/*": ["./src/constants/*"],
       "@services/*": ["./src/services/*"],
       "@store/*": ["./src/store/*"]
     }
     ```
   - 启用增量编译: `"incremental": true`

2. 创建类型定义文件
   - 创建 `src/types/global.d.ts`
   - 创建 `src/types/injective.d.ts`
   - 定义Window接口扩展（钱包相关）

3. 配置路径映射
   - 更新 `next.config.ts` 的 webpack alias
   - 确保IDE识别路径别名

4. 验证配置
   - 运行 `yarn type-check` (添加到package.json scripts)
   - 确认无类型错误

**交付物**:
- [ ] tsconfig.json配置完成
- [ ] 路径别名可用
- [ ] 类型定义文件创建

**验收标准**:
- TypeScript编译无错误
- IDE自动补全路径别名
- 导入语句使用@开头

---

### 任务1.3: ESLint与Prettier配置 (1小时)

**参考文件**: `injective-helix-demo/.eslintrc.js`, `.prettierrc`

**详细步骤**:
1. 安装ESLint插件
   - `eslint-config-next` (已默认安装)
   - `@typescript-eslint/eslint-plugin`
   - `eslint-plugin-react-hooks`
   
2. 配置.eslintrc.json
   - 复制Nuxt项目的规则，转换为React规则
   - 禁用规则: `react/react-in-jsx-scope` (React 19不需要)
   - 启用规则: `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`
   
3. 安装配置Prettier
   - 安装: `prettier`, `eslint-config-prettier`
   - 创建 `.prettierrc` 配置文件
   - 配置: semi, singleQuote, tabWidth, printWidth
   
4. 配置Git Hooks
   - 安装: `husky`, `lint-staged`
   - 配置pre-commit: 运行ESLint和Prettier
   - 配置commit-msg: 使用commitlint (可选)

5. VSCode配置
   - 创建 `.vscode/settings.json`
   - 配置自动格式化: `"editor.formatOnSave": true`
   - 配置自动修复: `"editor.codeActionsOnSave"`

**交付物**:
- [ ] .eslintrc.json配置文件
- [ ] .prettierrc配置文件
- [ ] Git hooks配置
- [ ] VSCode团队设置

**验收标准**:
- `yarn lint` 运行无错误
- 保存文件自动格式化
- Git提交前自动检查

---

### 任务1.4: Tailwind CSS配置 (1小时)

**参考文件**: `injective-helix-demo/tailwind.config.ts`, `assets/css/`

**详细步骤**:
1. 配置tailwind.config.ts
   - 复制Nuxt项目的主题颜色
   - 配置暗色主题: `darkMode: 'class'`
   - 添加自定义颜色、字体、间距
   - 配置断点（响应式）

2. 创建全局样式
   - 创建 `src/styles/globals.css`
   - 从Nuxt的 `assets/css/` 复制基础样式
   - 定义CSS变量（主题颜色）
   - 添加自定义@layer utilities

3. 配置字体
   - 从Nuxt的 `assets/fonts/` 复制字体文件到 `public/fonts/`
   - 在globals.css中使用@font-face声明
   - 配置font-family到Tailwind

4. 测试主题
   - 创建简单组件测试颜色
   - 测试亮色/暗色切换
   - 测试响应式断点

**交付物**:
- [ ] tailwind.config.ts配置完成
- [ ] globals.css基础样式
- [ ] 字体文件就位
- [ ] 主题变量定义

**验收标准**:
- Tailwind类名生效
- 自定义颜色可用
- 字体正确加载
- 响应式断点正常

---

### 任务1.5: 国际化配置 (1.5小时)

**参考文件**: `injective-helix-demo/next-i18next.config.ts`, `public/locales/`

**详细步骤**:
1. 安装i18n库
   - 安装: `next-intl` (推荐) 或 `next-i18next`
   - 选择理由: next-intl更适合App Router

2. 复制翻译文件
   - 从Nuxt的 `public/locales/` 复制到Next.js的 `public/locales/`
   - 保持文件结构: `en/common.json`, `zh/common.json`
   - 验证JSON格式正确

3. 配置i18n
   - 创建 `src/i18n/config.ts`
   - 定义支持的语言: `['en', 'zh']`
   - 设置默认语言: `'en'`
   - 创建语言切换hook: `useLocale`

4. 创建语言切换组件
   - 从Nuxt翻译 `components/ChooseLanguage.tsx`
   - 实现语言下拉选择
   - 保存语言到localStorage
   - 刷新页面保持语言

5. 测试i18n
   - 测试中英文切换
   - 测试翻译文本显示
   - 测试刷新后语言保持

**交付物**:
- [ ] i18n配置文件
- [ ] 翻译JSON文件
- [ ] 语言切换组件
- [ ] useLocale hook

**验收标准**:
- 中英文切换正常
- 翻译文本正确显示
- 刷新页面语言保持
- 无翻译缺失警告

---

### 任务1.6: 主题系统配置 (1.5小时)

**参考文件**: `injective-helix-demo/context/ThemeContext.ts`, `components/SelectTheme.tsx`

**详细步骤**:
1. 创建主题Context
   - 创建 `src/contexts/ThemeContext.tsx`
   - 定义主题类型: `'light' | 'dark'`
   - 实现主题状态管理
   - 实现主题切换函数

2. 创建主题Provider
   - 实现ThemeProvider组件
   - 读取系统主题偏好: `window.matchMedia('(prefers-color-scheme: dark)')`
   - 读取localStorage保存的主题
   - 应用主题到document.documentElement

3. 创建主题切换组件
   - 从Nuxt翻译 `components/SelectTheme.tsx`
   - 实现主题切换按钮（太阳/月亮图标）
   - 添加切换动画

4. 定义主题变量
   - 在globals.css定义CSS变量
   - 亮色主题变量
   - 暗色主题变量 (在.dark类下)
   - 确保变量覆盖全面

5. 测试主题
   - 测试亮色/暗色切换
   - 测试刷新后主题保持
   - 测试所有组件的主题适配

**交付物**:
- [ ] ThemeContext和Provider
- [ ] 主题切换组件
- [ ] CSS变量定义
- [ ] useTheme hook

**验收标准**:
- 主题切换即时生效
- 刷新后主题保持
- 所有颜色正确切换
- 无闪烁问题

---

## Day 2: 目录结构与静态资源

**负责人**: 2名开发  
**工作时间**: 8小时

### 任务2.1: 创建项目目录结构 (1小时)

**详细步骤**:
1. 创建标准目录
   ```
   src/
   ├── app/              # Next.js App Router
   ├── components/       # React组件
   │   ├── common/       # 通用组件
   │   ├── layout/       # 布局组件
   │   ├── wallet/       # 钱包相关
   │   ├── market/       # 市场相关
   │   ├── trading/      # 交易相关
   │   └── ...
   ├── lib/
   │   ├── hooks/        # 自定义Hooks
   │   ├── services/     # API服务
   │   ├── store/        # 状态管理
   │   └── utils/        # 工具函数
   ├── types/            # TypeScript类型
   ├── constants/        # 常量定义
   └── styles/           # 全局样式
   
   public/
   ├── icons/            # 图标文件
   ├── images/           # 图片文件
   ├── locales/          # 翻译文件
   └── data/             # 静态数据JSON
   ```

2. 创建README文件
   - 在每个主要目录创建README.md
   - 说明目录用途
   - 说明文件命名规范
   - 提供示例

3. 创建index.ts文件
   - 在主要目录创建index.ts导出文件
   - 便于统一导入

**交付物**:
- [ ] 完整的目录结构
- [ ] 各目录README文档
- [ ] index.ts导出文件

**验收标准**:
- 目录结构清晰合理
- 新成员可快速找到文件位置

---

### 任务2.2: 复制静态资源 (2小时)

**参考位置**: `injective-helix-demo/public/`, `assets/`

**详细步骤**:
1. 复制图标文件
   - 从Nuxt的 `public/` 复制所有SVG图标到Next.js的 `public/icons/`
   - 整理图标分类（钱包图标、代币图标、UI图标）
   - 创建图标索引文件

2. 复制图片文件
   - 复制所有PNG/JPG图片到 `public/images/`
   - 按用途分类（logo、background、banner）
   
3. 复制字体文件
   - 复制 `assets/fonts/` 到 `public/fonts/`
   - 确认字体许可证

4. 复制数据文件
   - 复制市场配置JSON: `app/data/` → `public/data/`
   - 代币列表JSON
   - 市场映射JSON

5. 优化资源
   - 压缩图片（使用工具如tinypng）
   - 优化SVG（移除无用代码）
   - 检查文件大小

6. 创建资源引用
   - 创建 `src/constants/assets.ts`
   - 定义所有资源路径常量
   - 便于统一管理

**交付物**:
- [ ] 所有静态资源就位
- [ ] 资源文件优化
- [ ] 资源路径常量文件

**验收标准**:
- 所有资源可访问
- 图标正确显示
- 字体正确加载
- JSON数据可读取

---

### 任务2.3: 创建基础Layout组件 (3小时)

**参考文件**: `injective-helix-demo/layouts/`, `components/Layout/`

**详细步骤**:
1. 创建RootLayout
   - 创建 `src/app/layout.tsx`
   - 集成ThemeProvider
   - 集成I18nProvider
   - 添加全局样式导入
   - 添加全局字体

2. 创建Header组件
   - 从Nuxt翻译 `components/Layout/Header.vue`
   - Logo显示
   - 导航菜单（Spot, Futures, Portfolio, etc.）
   - 钱包连接按钮位置预留
   - 语言切换
   - 主题切换
   - 移动端菜单按钮

3. 创建Sidebar组件
   - 从Nuxt翻译 `components/Layout/Sidebar.vue`
   - 市场列表侧边栏
   - 可折叠功能
   - 搜索框
   - 收藏列表

4. 创建Footer组件
   - 从Nuxt翻译 `components/Layout/Footer.vue`
   - 链接（About, Terms, Privacy）
   - 社交媒体图标
   - 版权信息

5. 创建MainLayout
   - 组合Header + Sidebar + Content + Footer
   - 响应式布局
   - 移动端适配

6. 测试布局
   - 测试桌面端布局
   - 测试移动端布局
   - 测试侧边栏折叠
   - 测试导航点击

**交付物**:
- [ ] RootLayout组件
- [ ] Header组件
- [ ] Sidebar组件
- [ ] Footer组件
- [ ] MainLayout组件

**验收标准**:
- 布局结构完整
- 响应式正常
- 导航可点击（虽然页面未创建）
- 移动端菜单可展开

---

### 任务2.4: 创建通用UI组件 (2小时)

**参考文件**: `injective-helix-demo/components/Common/`

**详细步骤**:
1. Button组件
   - 从Nuxt翻译按钮组件
   - 支持多种变体: primary, secondary, outline, ghost
   - 支持多种尺寸: sm, md, lg
   - 支持loading状态
   - 支持disabled状态

2. Input组件
   - 文本输入框
   - 数字输入框（交易金额）
   - 支持前缀/后缀（货币符号）
   - 验证状态（错误、成功）
   - 辅助文本

3. Modal组件
   - 基于Radix UI Dialog
   - 支持不同大小
   - 支持关闭按钮
   - 支持遮罩点击关闭
   - 支持ESC键关闭

4. Dropdown组件
   - 基于Radix UI DropdownMenu
   - 支持多级菜单
   - 支持分隔线
   - 支持图标

5. Toast组件
   - 成功、错误、警告、信息提示
   - 自动消失
   - 支持手动关闭
   - 支持多个Toast堆叠

6. Loading组件
   - Spinner加载动画
   - Skeleton骨架屏
   - 页面级loading

7. 创建组件Storybook（可选）
   - 便于查看所有组件
   - 便于测试组件

**交付物**:
- [ ] Button组件
- [ ] Input组件
- [ ] Modal组件
- [ ] Dropdown组件
- [ ] Toast组件
- [ ] Loading组件

**验收标准**:
- 所有组件可正常使用
- 样式与Nuxt版本一致
- 交互正常
- 支持主题切换

---

## Day 3-4: 钱包连接系统

**负责人**: 1名高级开发 + 1名开发  
**工作时间**: 16小时

### 任务3.1: 创建Wallet Store (3小时)

**参考文件**: `injective-helix-demo/store/wallet.ts`

**详细步骤**:
1. 安装Zustand
   - 已在Day 1安装

2. 创建wallet store
   - 创建 `src/lib/store/walletStore.ts`
   - 定义状态类型:
     ```typescript
     interface WalletState {
       // 连接状态
       isConnected: boolean
       isConnecting: boolean
       
       // 钱包信息
       walletType: WalletType | null
       address: string
       injectiveAddress: string
       
       // 账户信息
       balances: Coin[]
       subaccounts: Subaccount[]
       currentSubaccount: string
       
       // 方法
       connect: (walletType: WalletType) => Promise<void>
       disconnect: () => void
       switchAccount: (address: string) => Promise<void>
       refreshBalances: () => Promise<void>
     }
     ```

3. 实现连接逻辑
   - 调用Injective Wallet Strategy
   - 处理连接成功
   - 处理连接失败
   - 错误处理

4. 实现断开连接
   - 清除状态
   - 清除localStorage

5. 实现状态持久化
   - 使用zustand的persist中间件
   - 保存到localStorage
   - 自动重连逻辑

6. 测试store
   - 测试connect方法
   - 测试disconnect方法
   - 测试状态持久化

**交付物**:
- [ ] walletStore.ts
- [ ] WalletState类型定义
- [ ] connect/disconnect方法
- [ ] 状态持久化

**验收标准**:
- Store可正常工作
- 状态管理正确
- 持久化正常
- 无内存泄漏

---

### 任务3.2: 集成Injective Wallet Strategy (4小时)

**参考文件**: `injective-helix-demo/app/services/wallet.ts`

**详细步骤**:
1. 创建wallet service
   - 创建 `src/lib/services/wallet.service.ts`
   - 初始化WalletStrategy
   - 配置网络（mainnet/testnet）

2. 实现Metamask连接
   - 检测Metamask安装
   - 请求连接
   - 获取地址
   - 处理账户切换
   - 处理网络切换

3. 实现Keplr连接
   - 检测Keplr安装
   - 请求连接
   - 获取Injective地址
   - 处理账户切换

4. 实现Leap连接
   - 检测Leap安装
   - 请求连接
   - 获取地址
   - 处理账户切换

5. 实现Cosmostation连接
   - 检测Cosmostation安装
   - 请求连接
   - 获取地址

6. 统一错误处理
   - 钱包未安装错误
   - 用户拒绝连接
   - 网络错误
   - 账户切换错误

7. 实现自动重连
   - 页面刷新后检测钱包
   - 自动连接上次使用的钱包
   - 处理钱包锁定状态

**交付物**:
- [ ] wallet.service.ts
- [ ] 支持4种主流钱包
- [ ] 错误处理完善
- [ ] 自动重连逻辑

**验收标准**:
- Metamask可连接
- Keplr可连接
- Leap可连接
- Cosmostation可连接
- 错误提示友好
- 自动重连正常

---

### 任务3.3: 创建钱包UI组件 (5小时)

**参考文件**: `injective-helix-demo/components/App/Wallet/`

**详细步骤**:
1. WalletConnectButton组件
   - 未连接状态: 显示"Connect Wallet"按钮
   - 连接中状态: 显示loading
   - 已连接状态: 显示地址缩略
   - 点击打开钱包选择弹窗

2. WalletSelector Modal
   - 显示所有支持的钱包
   - 显示钱包logo
   - 显示钱包名称
   - 显示"已安装"或"未安装"状态
   - 未安装钱包显示下载链接
   - 点击钱包触发连接

3. WalletInfo Dropdown
   - 显示完整地址
   - 显示地址复制按钮
   - 显示余额摘要
   - 显示"Disconnect"按钮
   - 显示"Switch Account"选项（如果支持）

4. AccountSelector组件
   - 显示所有可用账户
   - 切换账户功能
   - 显示各账户余额

5. 样式适配
   - 与Nuxt版本UI一致
   - 支持主题切换
   - 响应式适配

6. 交互优化
   - 添加loading状态
   - 添加错误提示
   - 添加成功提示

**交付物**:
- [ ] WalletConnectButton组件
- [ ] WalletSelector Modal
- [ ] WalletInfo Dropdown
- [ ] AccountSelector组件

**验收标准**:
- 所有组件UI正确
- 交互流畅
- 错误提示友好
- 移动端适配

---

### 任务3.4: 钱包功能测试 (2小时)

**详细步骤**:
1. 功能测试
   - 测试Metamask连接流程
   - 测试Keplr连接流程
   - 测试Leap连接流程
   - 测试Cosmostation连接流程
   - 测试断开连接
   - 测试账户切换
   - 测试页面刷新保持连接

2. 边界测试
   - 测试钱包未安装情况
   - 测试用户拒绝连接
   - 测试网络错误
   - 测试钱包锁定状态

3. UI测试
   - 测试按钮状态变化
   - 测试Modal打开关闭
   - 测试Dropdown展开收起
   - 测试地址复制功能

4. 修复发现的Bug
   - 记录所有Bug
   - 按优先级修复
   - 回归测试

**交付物**:
- [ ] 测试报告
- [ ] Bug列表
- [ ] 修复后的代码

**验收标准**:
- 所有主流钱包可连接
- 无严重Bug
- 交互体验良好

---

### 任务3.5: 创建余额查询功能 (2小时)

**参考文件**: `injective-helix-demo/app/services/bank.ts`

**详细步骤**:
1. 创建bank service
   - 创建 `src/lib/services/bank.service.ts`
   - 初始化ChainGrpcBankApi
   - 实现getBalance方法

2. 实现余额查询
   - 查询所有币种余额
   - 查询单个币种余额
   - 实时余额更新（WebSocket）

3. 集成到Wallet Store
   - 在wallet store添加balances状态
   - 添加refreshBalances方法
   - 钱包连接后自动查询余额
   - 定期刷新余额

4. 显示余额
   - 在WalletInfo中显示主要余额
   - 格式化余额显示
   - 转换为USD价值（如果有价格数据）

5. 测试余额功能
   - 测试余额查询
   - 测试余额更新
   - 测试余额显示

**交付物**:
- [ ] bank.service.ts
- [ ] 余额查询功能
- [ ] 余额显示

**验收标准**:
- 余额查询正确
- 余额显示准确
- 余额实时更新

---

## Day 5-6: 市场数据服务

**负责人**: 1名后端开发 + 1名前端开发  
**工作时间**: 16小时

### 任务5.1: 创建Injective Core Service (3小时)

**参考文件**: `injective-helix-demo/app/Services.ts`

**详细步骤**:
1. 创建核心服务配置
   - 创建 `src/lib/services/injective.service.ts`
   - 定义网络配置(mainnet/testnet)
   - 定义API endpoints

2. 初始化IndexerGrpcSpotApi
   - 配置endpoint
   - 测试连接
   - 错误处理

3. 初始化IndexerGrpcDerivativesApi
   - 配置endpoint
   - 测试连接

4. 初始化ChainGrpc APIs
   - ChainGrpcBankApi
   - ChainGrpcAuthZApi (如果需要)

5. 创建单例模式
   - 确保服务只初始化一次
   - 提供统一的访问接口

6. 添加错误处理
   - 网络错误
   - API限流
   - 超时处理

**交付物**:
- [ ] injective.service.ts
- [ ] 网络配置
- [ ] API初始化
- [ ] 错误处理

**验收标准**:
- API可正常调用
- 错误处理完善
- 单例模式正确

---

### 任务5.2: 创建Market Service (4小时)

**参考文件**: `injective-helix-demo/app/services/market.ts`

**详细步骤**:
1. 创建market service
   - 创建 `src/lib/services/market.service.ts`
   - 定义Market类型接口

2. 实现获取现货市场
   - 调用IndexerGrpcSpotApi.fetchMarkets()
   - 数据转换和格式化
   - 错误处理

3. 实现获取期货市场
   - 调用IndexerGrpcDerivativesApi.fetchMarkets()
   - 数据转换和格式化
   - 错误处理

4. 实现获取单个市场
   - 根据marketId获取
   - 根据slug获取
   - 缓存机制

5. 实现市场搜索
   - 按名称搜索
   - 按交易对搜索
   - 模糊搜索

6. 实现市场过滤
   - 按类型过滤(spot/derivatives)
   - 按交易量过滤
   - 按涨跌幅过滤

7. 测试market service
   - 测试获取市场列表
   - 测试搜索功能
   - 测试过滤功能

**交付物**:
- [ ] market.service.ts
- [ ] Market类型定义
- [ ] 获取/搜索/过滤方法

**验收标准**:
- 可获取市场列表
- 搜索功能正确
- 过滤功能正确
- 数据格式规范

---

### 任务5.3: 创建Market Store (3小时)

**参考文件**: `injective-helix-demo/store/market.ts`

**详细步骤**:
1. 创建market store
   - 创建 `src/lib/store/marketStore.ts`
   - 定义状态类型:
     ```typescript
     interface MarketState {
       // 市场列表
       spotMarkets: SpotMarket[]
       derivativeMarkets: DerivativeMarket[]
       
       // 当前选中市场
       currentMarket: Market | null
       
       // 收藏市场
       favoriteMarkets: string[]
       
       // 加载状态
       isLoading: boolean
       
       // 方法
       fetchMarkets: () => Promise<void>
       setCurrentMarket: (marketId: string) => void
       toggleFavorite: (marketId: string) => void
       searchMarkets: (query: string) => Market[]
     }
     ```

2. 实现fetchMarkets
   - 调用market service
   - 更新store状态
   - 错误处理

3. 实现市场选择
   - setCurrentMarket方法
   - 保存到localStorage

4. 实现收藏功能
   - toggleFavorite方法
   - 持久化到localStorage

5. 实现搜索功能
   - 本地搜索（基于已获取的市场）
   - 返回过滤后的市场列表

6. 集成React Query
   - 使用useQuery缓存市场数据
   - 设置staleTime和cacheTime
   - 自动刷新策略

**交付物**:
- [ ] marketStore.ts
- [ ] MarketState类型
- [ ] 市场获取/选择/收藏方法
- [ ] React Query集成

**验收标准**:
- Store状态管理正确
- 方法功能正常
- 缓存策略合理
- 持久化正常

---

### 任务5.4: 创建Market组件 (4小时)

**参考文件**: `injective-helix-demo/components/Partials/Markets/`

**详细步骤**:
1. MarketList组件
   - 从Nuxt翻译市场列表组件
   - 表格布局：交易对、价格、24h变化、成交量
   - 支持排序（按价格、成交量、涨跌幅）
   - 支持分页或虚拟滚动
   - 点击跳转到交易页面

2. MarketSelector组件
   - 搜索框
   - 市场下拉列表
   - 显示收藏市场
   - 快速切换市场

3. MarketTicker组件
   - 显示当前市场信息
   - 价格
   - 24h涨跌
   - 24h高/低
   - 24h成交量

4. FavoriteButton组件
   - 收藏/取消收藏按钮
   - 星标图标
   - 点击切换状态

5. 样式适配
   - 与Nuxt版本一致
   - 响应式布局
   - 主题支持

6. 测试组件
   - 测试市场列表显示
   - 测试排序功能
   - 测试搜索功能
   - 测试收藏功能

**交付物**:
- [ ] MarketList组件
- [ ] MarketSelector组件
- [ ] MarketTicker组件
- [ ] FavoriteButton组件

**验收标准**:
- 市场列表正确显示
- 排序功能正常
- 搜索功能正常
- 收藏功能正常
- UI美观一致

---

### 任务5.5: WebSocket实时数据（基础） (2小时)

**参考文件**: `injective-helix-demo/app/client/streams/`

**详细步骤**:
1. 创建WebSocket manager
   - 创建 `src/lib/services/websocket.service.ts`
   - 初始化WebSocket连接
   - 连接管理（连接、断开、重连）

2. 实现心跳机制
   - 定期发送ping
   - 检测连接状态
   - 断线自动重连

3. 实现市场价格订阅（简化版）
   - 订阅单个市场价格
   - 接收价格更新
   - 更新store状态

4. 测试WebSocket
   - 测试连接
   - 测试订阅
   - 测试数据接收
   - 测试断线重连

**注意**: 完整的WebSocket架构在Week 2完成，这里只实现基础功能

**交付物**:
- [ ] websocket.service.ts
- [ ] 基础连接管理
- [ ] 价格订阅功能

**验收标准**:
- WebSocket可连接
- 价格可实时更新
- 断线可自动重连

---

## Day 7: 主页与路由

**负责人**: 2名开发  
**工作时间**: 8小时

### 任务7.1: 创建首页 (3小时)

**参考文件**: `injective-helix-demo/pages/index.vue`

**详细步骤**:
1. 创建首页
   - 创建 `src/app/page.tsx`
   - 使用MainLayout布局

2. 设计首页内容
   - Hero区域（大标题、介绍）
   - 热门市场列表
   - 24h交易量排行
   - 涨幅榜/跌幅榜
   - 快速入口（Spot、Futures、Swap）

3. 集成组件
   - 集成MarketList组件
   - 集成统计卡片
   - 集成快速入口按钮

4. 样式设计
   - 与Nuxt版本一致（如果有）
   - 或设计简洁现代的首页
   - 响应式布局

5. SEO优化
   - 设置页面title
   - 设置meta description
   - 设置Open Graph标签

**交付物**:
- [ ] 首页page.tsx
- [ ] 首页组件
- [ ] SEO配置

**验收标准**:
- 首页可正常访问
- 市场数据正确显示
- 样式美观
- 响应式正常

---

### 任务7.2: 创建路由结构 (2小时)

**详细步骤**:
1. 创建主要路由
   ```
   /                    - 首页
   /spot/[slug]         - 现货交易页
   /futures/[slug]      - 期货交易页
   /portfolio           - 投资组合
   /orders              - 订单管理
   /positions           - 持仓管理
   /swap                - 代币交换
   /liquidity           - 流动性
   /grid                - 网格交易
   /referral            - 推荐
   /points              - 积分
   /settings            - 设置
   ```

2. 创建路由文件
   - 创建对应的目录和page.tsx
   - 暂时显示"Coming Soon"或简单布局

3. 配置导航
   - 在Header组件中配置导航链接
   - 高亮当前页面
   - 测试页面跳转

4. 创建404页面
   - 创建 `src/app/not-found.tsx`
   - 友好的404提示
   - 返回首页按钮

**交付物**:
- [ ] 所有路由文件
- [ ] 导航配置
- [ ] 404页面

**验收标准**:
- 所有路由可访问
- 导航跳转正常
- 404页面正常显示

---

### 任务7.3: 集成测试与修复 (3小时)

**详细步骤**:
1. 功能集成测试
   - 测试项目启动
   - 测试钱包连接完整流程
   - 测试市场列表显示
   - 测试页面导航
   - 测试主题切换
   - 测试语言切换

2. UI一致性检查
   - 对比Nuxt版本UI
   - 检查颜色、字体、间距
   - 检查响应式布局
   - 检查主题切换效果

3. 性能检查
   - 检查首屏加载时间
   - 检查图片加载
   - 检查字体加载
   - 优化加载性能

4. Bug修复
   - 记录所有发现的问题
   - 按优先级修复
   - 回归测试

5. 代码Review
   - Team lead review代码
   - 检查代码规范
   - 检查命名规范
   - 检查类型定义

**交付物**:
- [ ] 测试报告
- [ ] Bug列表和修复记录
- [ ] Code review记录

**验收标准**:
- Week 1所有功能正常
- 无严重Bug
- 代码质量达标
- UI与Nuxt版本基本一致

---

## Week 1 验收标准

### 功能验收
- [ ] `yarn dev`可正常启动
- [ ] TypeScript编译无错误
- [ ] ESLint检查通过
- [ ] 主题切换正常（亮色/暗色）
- [ ] 语言切换正常（中文/英文）
- [ ] 可连接Metamask钱包
- [ ] 可连接Keplr钱包
- [ ] 可连接Leap钱包
- [ ] 可连接Cosmostation钱包
- [ ] 显示钱包地址
- [ ] 显示钱包余额
- [ ] 可获取现货市场列表
- [ ] 可获取期货市场列表
- [ ] 市场列表可排序
- [ ] 市场列表可搜索
- [ ] 可收藏市场
- [ ] 首页可正常访问
- [ ] 导航跳转正常

### 性能验收
- [ ] 首屏加载 < 3s (WiFi)
- [ ] 钱包连接响应 < 2s
- [ ] 市场列表加载 < 1s
- [ ] 无明显卡顿

### 质量验收
- [ ] 无TypeScript错误
- [ ] 无ESLint错误
- [ ] 无Console错误
- [ ] 无Console警告（或已知且可接受）
- [ ] 代码有必要的注释
- [ ] 组件命名规范

### UI验收
- [ ] 布局与Nuxt版本一致
- [ ] 样式与Nuxt版本一致
- [ ] 响应式布局正常
- [ ] 移动端基本可用
- [ ] 主题颜色正确
- [ ] 字体正确加载
- [ ] 图标正确显示

---

## 📚 参考文档

- [MIGRATION_PLAN_8WEEKS.md](../MIGRATION_PLAN_8WEEKS.md) - 完整8周计划
- [01-MIGRATION_OVERVIEW.md](../01-MIGRATION_OVERVIEW.md) - 项目概览
- [02-WEBSOCKET_ARCHITECTURE.md](../02-WEBSOCKET_ARCHITECTURE.md) - WebSocket架构
- [03-PARALLEL_DEVELOPMENT.md](../03-PARALLEL_DEVELOPMENT.md) - 并行开发指南
- [04-TECHNICAL_DEBT.md](../04-TECHNICAL_DEBT.md) - 技术债管理

---

**下一周**: [Week 2: 现货交易核心](./week-02.md)

