# 📚 biya-coin 项目文档

> **项目**: Injective Helix 迁移计划  
> **最后更新**: 2025-10-22

---

## 📖 文档目录

### 核心文档
1. **[迁移概览](./01-MIGRATION_OVERVIEW.md)** - 8周迁移计划总览
2. **[WebSocket 架构](./02-WEBSOCKET_ARCHITECTURE.md)** - WebSocket 设计与实现
3. **[并行开发协调](./03-PARALLEL_DEVELOPMENT.md)** - 团队协作指南
4. **[技术债务管理](./04-TECHNICAL_DEBT.md)** - 质量管理策略
5. **[变更日志](./05-CHANGELOG.md)** - 所有文档变更记录

### 升级报告
- **[App Router 升级完成](./APP_ROUTER_UPGRADE_COMPLETE.md)** - biya-helix-app 升级报告
- **[多语言系统升级](./UPGRADE_TO_V2_COMPLETE.md)** - 多语言 V2 升级报告
- **[多语言方案文档](./MULTI_LANGUAGE_SOLUTIONS.md)** - 完整的多语言架构方案

### 详细计划
- **[8周迁移计划](./MIGRATION_PLAN_8WEEKS.md)** - 完整详细计划（6300+ 行）
- **[周计划](./weeks/)** - 每周详细任务分解
  - [Week 1-8 详细计划](./weeks/week-01.md) 至 [week-08.md](./weeks/week-08.md)
  - [可视化图表](./weeks/visualizations/) - HTML 交互式图表

---

## 🎯 快速导航

### 我想...

#### **了解项目概况**
👉 从 [01-MIGRATION_OVERVIEW.md](./01-MIGRATION_OVERVIEW.md) 开始

#### **查看技术架构**
👉 阅读 [02-WEBSOCKET_ARCHITECTURE.md](./02-WEBSOCKET_ARCHITECTURE.md)

#### **了解团队协作**
👉 参考 [03-PARALLEL_DEVELOPMENT.md](./03-PARALLEL_DEVELOPMENT.md)

#### **查看升级成果**
👉 查看 [APP_ROUTER_UPGRADE_COMPLETE.md](./APP_ROUTER_UPGRADE_COMPLETE.md)

#### **了解多语言系统**
👉 阅读 [MULTI_LANGUAGE_SOLUTIONS.md](./MULTI_LANGUAGE_SOLUTIONS.md)

#### **查看可视化图表**
👉 打开 [weeks/visualizations/index.html](./weeks/visualizations/index.html)

---

## 🏆 项目成果

### ✅ 已完成
- **App Router 迁移** - biya-helix-app 成功升级
- **多语言系统** - 支持 5 种语言（可扩展）
- **next-intl 集成** - 包大小减少 68%
- **SEO 优化** - Metadata API + hreflang
- **Cookie 工具** - 类型安全的工具函数
- **配置驱动架构** - 易维护、可扩展

### 🚀 技术亮点
- **Next.js 15 App Router**
- **React Server Components**
- **TypeScript 100% 覆盖**
- **零 Linter 错误**
- **生产级代码质量**

---

## 📁 项目结构

```
biya-coin/
├── docs/                           # 📚 本文档目录
│   ├── 00-README.md               # 文档导航（本文件）
│   ├── 01-MIGRATION_OVERVIEW.md    # 迁移概览
│   ├── 02-WEBSOCKET_ARCHITECTURE.md
│   ├── 03-PARALLEL_DEVELOPMENT.md
│   ├── 04-TECHNICAL_DEBT.md
│   ├── 05-CHANGELOG.md
│   ├── APP_ROUTER_UPGRADE_COMPLETE.md
│   ├── MULTI_LANGUAGE_SOLUTIONS.md
│   ├── UPGRADE_TO_V2_COMPLETE.md
│   ├── MIGRATION_PLAN_8WEEKS.md
│   └── weeks/                      # 周计划详情
│       ├── week-01.md ~ week-08.md
│       └── visualizations/         # 可视化图表
│
├── biya-helix-app/                 # ✅ Next.js App Router 项目
│   ├── app/[locale]/               # App Router 路由
│   ├── components/                 # React 组件
│   ├── config/                     # 配置文件
│   ├── i18n/                       # 国际化配置
│   ├── lib/                        # 工具函数
│   ├── messages/                   # 翻译文件
│   └── middleware.ts               # 语言路由中间件
│
└── injective-helix-demo/           # 🔵 原 Nuxt.js 项目（参考）
```

---

## 🛠️ 技术栈

### biya-helix-app
- **框架**: Next.js 15 (App Router)
- **React**: 19
- **TypeScript**: 5.x
- **多语言**: next-intl 4.4.0
- **样式**: Tailwind CSS
- **状态管理**: Zustand (计划)
- **SDK**: Injective SDK

### injective-helix-demo（原项目）
- **框架**: Nuxt.js 3
- **Vue**: 3
- **多语言**: @nuxtjs/i18n
- **样式**: Tailwind CSS + UnoCSS

---

## 📊 迁移进度

### biya-helix-app（测试项目）
- ✅ **100% 完成** - App Router + next-intl 已上线
- ✅ 支持 5 种语言（en, zh, ja, ko, es）
- ✅ SEO 优化完成
- ✅ 生产级代码质量

### injective-helix-demo → biya-coin（主项目）
- 📅 **8周迁移计划** 已制定
- 📋 详细任务分解完成
- 📈 可视化进度图表已创建
- 🚀 准备开始执行

---

## 🎯 下一步

### 短期（1-2周）
1. 开始 Week 1 任务（项目搭建）
2. 建立 CI/CD 流程
3. 配置开发环境

### 中期（3-4周）
4. 完成核心功能迁移
5. 集成 Injective SDK
6. 实现 WebSocket 架构

### 长期（5-8周）
7. 完成所有功能迁移
8. 质量保证与测试
9. 性能优化
10. 灰度发布

---

## 📞 联系信息

- **项目负责人**: [待填写]
- **技术负责人**: [待填写]
- **代码仓库**: [待填写]
- **Wiki**: [待填写]

---

## 📝 更新日志

查看 [05-CHANGELOG.md](./05-CHANGELOG.md) 了解所有文档变更。

---

**最后更新**: 2025-10-22  
**文档版本**: v5.0

