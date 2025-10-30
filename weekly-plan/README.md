# 8周迁移计划 - 每周详细指南

本目录包含8周迁移计划的详细分解，每周一个独立文件。

## 📚 文件导航

| 周次 | 文件 | 主题 | 天数 |
|------|------|------|------|
| Week 1 | [week-01.md](./week-01.md) | 基础架构与钱包 | Day 1-7 |
| Week 2 | [week-02.md](./week-02.md) | 现货交易核心 | Day 8-14 |
| Week 3 | [week-03.md](./week-03.md) | 期货交易核心 | Day 15-21 |
| Week 4 | [week-04.md](./week-04.md) | 订单持仓资产 | Day 22-28 |
| Week 5 | [week-05.md](./week-05.md) | 高级功能 | Day 29-35 |
| Week 6 | [week-06.md](./week-06.md) | UI完善 | Day 36-42 |
| Week 7 | [week-07.md](./week-07.md) | 测试与修复 | Day 43-49 |
| Week 8 | [week-08.md](./week-08.md) | 优化与发布 | Day 50-56 |

## 🎯 每周重点

### Week 1: 基础架构与钱包
- Next.js 15 项目搭建
- TypeScript、ESLint、Tailwind配置
- 钱包连接系统（4种主流钱包）
- 市场数据服务基础
- **验收**: 项目可运行，钱包可连接，显示市场列表

### Week 2: 现货交易核心
- 订单簿与成交记录（实时WebSocket）
- 现货下单表单（限价/市价）
- 订单管理（取消/批量操作）
- 交易计算工具函数
- **验收**: 可以下单和取消订单，订单簿实时更新

### Week 3: 期货交易核心
- 期货市场与订单簿
- 杠杆选择（1x-20x）
- 持仓管理（开仓/平仓/调整保证金）
- 强平价与盈亏计算
- TradingView图表基础集成
- **验收**: 可以开仓做多/做空，显示持仓和盈亏

### Week 4: 订单持仓资产
- 订单管理页面（筛选/导出/通知）
- 资产管理页面（余额/充提）
- 投资组合分析（收益/统计）
- 子账户管理
- **验收**: 订单/持仓/资产页面完整可用

### Week 5: 高级功能
- Swap功能（代币交换）
- 流动性功能（添加/移除流动性）
- 网格交易（策略创建/运行/监控）
- **验收**: Swap、流动性、网格交易基本可用

### Week 6: UI完善
- TradingView完整集成
- 深度图、资产图表、盈亏图表
- 设置页面（主题/语言/交易设置）
- 通知系统（Toast/通知中心/价格预警）
- 推荐与积分系统
- **验收**: 所有UI组件完善，用户体验良好

### Week 7: 测试与修复
- 单元测试（工具函数/Hooks/Store）
- 组件测试
- E2E测试（Playwright）
- 性能测试（Lighthouse）
- Bug修复（Critical/High/Medium）
- 兼容性测试
- **验收**: 测试覆盖率>70%，无Critical Bug

### Week 8: 优化与发布
- 性能优化（代码分割/懒加载/渲染优化）
- 部署配置（PM2/Docker/Nginx/CI-CD）
- 监控系统（Sentry/日志/告警）
- 灰度发布（内部→小范围→扩大→全量）
- 24小时监控
- **验收**: 生产环境稳定运行

## 📖 使用指南

### 阅读顺序
1. 先阅读 [../01-MIGRATION_OVERVIEW.md](../01-MIGRATION_OVERVIEW.md) 了解项目全貌
2. 按周次顺序阅读详细计划
3. 每周结束后对照验收标准检查完成情况

### 文档特点
- **每日任务**: 细化到每一天的工作内容
- **时间估算**: 每个任务都有预估工时
- **参考文件**: 明确标注Nuxt源码位置
- **详细步骤**: 10-20步的具体操作指南
- **交付物清单**: 明确每个任务的产出
- **验收标准**: 清晰的完成标准

### 团队协作
- 每周初团队会议：对齐本周目标
- 每日站会：同步进度和问题
- 每周五回顾：验收成果，规划下周
- 使用GitHub Issues/Jira跟踪任务

## 🔗 相关文档

### 文字版文档
- [完整计划](../MIGRATION_PLAN_8WEEKS.md) - 6300行完整详细计划
- [项目概览](../01-MIGRATION_OVERVIEW.md) - 8周计划概要说明
- [WebSocket架构](../02-WEBSOCKET_ARCHITECTURE.md) - WebSocket技术设计
- [并行开发](../03-PARALLEL_DEVELOPMENT.md) - 团队协作指南
- [技术债管理](../04-TECHNICAL_DEBT.md) - 质量管理策略
- [变更日志](../05-CHANGELOG.md) - 文档更新历史

### 🌐 可视化图表 (HTML预览)
- [visualizations/](./visualizations/) - **浏览器直接查看，零配置**
  - [index.html](./visualizations/index.html) - 🏠 主导航页面
  - [preview-gantt.html](./visualizations/preview-gantt.html) - 📅 甘特图总览
  - [preview-mindmap.html](./visualizations/preview-mindmap.html) - 🧠 思维导图总览
  - [preview-week1.html](./visualizations/preview-week1.html) - Week 1 详细图
  - [preview-week2.html](./visualizations/preview-week2.html) - Week 2 详细图
  - [preview-week3.html](./visualizations/preview-week3.html) - Week 3 详细图
  - [preview-weeks.html](./visualizations/preview-weeks.html) - Week 4-8 汇总
  
**使用方式**：双击任意HTML文件，浏览器直接打开，自动渲染图表！

## 💡 提示

- 这是**代码翻译项目**，不是从零开发
- Nuxt版本已完整实现，主要工作是语法转换
- 每周必须通过验收标准才能进入下周
- 遇到问题及时沟通，不要拖延
- 保持代码质量，注重可维护性

---

**创建日期**: 2025-10-22  
**最后更新**: 2025-10-22

