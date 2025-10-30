# 并行开发协调指南

**文档类型**: 团队协作指南  
**优先级**: ⭐⭐⭐⭐⭐  
**适用项目**: 8周代码翻译计划  
**团队规模**: 4-5人全职  
**更新日期**: 2025-10-22

---

## 📋 文档说明

本文档是 [01-MIGRATION_PLAN_8WEEKS.md](./01-MIGRATION_PLAN_8WEEKS.md) 的团队协作补充文档，详细说明4-5人团队如何高效并行开发。

**适用场景**: 代码翻译项目（而非从零开发）

---

## 👥 团队配置

### 标准5人团队配置

| 角色 | 人数 | 主要职责 | 并行工作内容 |
|-----|------|---------|-------------|
| **Tech Lead** | 1人 | 架构设计、Code Review、关键模块 | 基础架构、核心交易逻辑 |
| **高级前端A** | 1人 | 现货交易、订单管理 | Week 2-4核心功能 |
| **高级前端B** | 1人 | 期货交易、持仓管理 | Week 3-4核心功能 |
| **前端开发A** | 1人 | UI组件、页面开发 | 贯穿全程 |
| **前端开发B** | 1人 | 高级功能、图表集成 | Week 5-6 |

### 小团队配置（3-4人）

适合16周保守方案，分工更粗但仍可并行。

---

## 📅 8周并行开发时间表

### Week 1: 全员协作（基础架构）

**目标**: 项目搭建，基础组件，钱包连接

**分工**:
```
Day 1-2: 全员一起搭建基础
├── Tech Lead: 项目初始化、配置
├── 高级前端A: TypeScript配置、ESLint
├── 高级前端B: Tailwind、i18n配置
├── 前端开发A: 目录结构、静态资源
└── 前端开发B: Layout组件

Day 3-4: 开始分工（钱包连接）
├── Tech Lead + 高级前端A: 钱包连接核心逻辑
├── 高级前端B: 钱包UI组件
├── 前端开发A: 通用UI组件（Button, Input, Modal）
└── 前端开发B: 通用UI组件（Dropdown, Toast, Loading）

Day 5-6: 市场数据
├── Tech Lead: WebSocket基础架构
├── 高级前端A: Market Service和Store
├── 高级前端B: Market组件（列表、选择器）
├── 前端开发A: 继续通用组件
└── 前端开发B: 继续通用组件

Day 7: 集成测试
└── 全员: 测试、修复Bug
```

**协调要点**:
- ✅ 每日早会同步进度（15分钟）
- ✅ 基础组件优先完成（供后续使用）
- ✅ 类型定义统一由Tech Lead定义

---

### Week 2: 开始并行（现货交易）

**目标**: 现货交易完整功能

**分工**:
```
高级前端A（现货交易核心）:
├── Day 8: 订单簿Service和Store
├── Day 9-10: 下单表单（限价/市价）
└── Day 11-14: 订单管理、表单验证

高级前端B（辅助现货）:
├── Day 8: 订单簿组件
├── Day 9-10: 成交记录组件
└── Day 11-14: 订单列表组件

前端开发A（现货交易页面）:
├── Day 8-10: 交易页面布局
├── Day 11-12: 组件集成
└── Day 13-14: 样式调整

前端开发B（准备期货）:
├── Day 8-10: 学习现货逻辑（为期货做准备）
├── Day 11-12: 复用现货组件到期货
└── Day 13-14: 期货页面框架

Tech Lead:
├── Code Review现货交易代码
├── WebSocket优化
└── 解决技术难点
```

**协调要点**:
- ✅ 高级前端A负责核心逻辑，优先级最高
- ✅ 其他人配合A，提供组件和页面
- ✅ 前端开发B提前准备期货框架

---

### Week 3: 高度并行（期货交易）

**目标**: 期货交易完整功能

**分工**:
```
高级前端B（期货交易核心）:
├── Day 15: 期货Store和Service
├── Day 16-17: 期货下单表单（杠杆、保证金）
├── Day 18-19: 持仓管理
└── Day 20-21: 期货订单管理

高级前端A（已完成现货，支援期货）:
├── Day 15: 强平价、盈亏计算工具函数
├── Day 16-17: 杠杆选择器组件
├── Day 18-19: 持仓列表组件
└── Day 20-21: TradingView图表基础集成

前端开发A（页面整合）:
├── Day 15-17: 期货交易页面布局
├── Day 18-19: 持仓详情页面
└── Day 20-21: 集成测试

前端开发B（交易页面完善）:
├── Day 15-17: 完善现货交易页面
├── Day 18-19: 完善期货交易页面
└── Day 20-21: 市场信息栏、图表占位

Tech Lead:
├── Code Review期货代码
├── 计算函数验证（强平价、盈亏）
└── 性能优化
```

**协调要点**:
- ✅ 现货和期货高度并行
- ✅ A完成现货后支援B做期货
- ✅ 共享计算函数需要Tech Lead验证

---

### Week 4: 并行扩展（订单/持仓/资产）

**目标**: 三个管理页面

**分工**:
```
高级前端A（订单管理）:
├── Day 22-23: 订单管理页面（筛选、导出）
└── Day 24-25: 订单通知系统

高级前端B（资产管理）:
├── Day 22-23: 资产管理页面（余额、充提）
└── Day 24-25: 资产分析图表

前端开发A（投资组合）:
├── Day 22-25: 投资组合页面
└── Day 26-28: 收益分析、交易统计

前端开发B（完善细节）:
├── Day 22-25: 完善订单和资产页面样式
└── Day 26-28: 子账户管理、资产详情

Tech Lead:
├── Day 22-25: Code Review
└── Day 26-28: 架构优化、性能优化
```

---

### Week 5: 完全并行（高级功能）

**目标**: Swap、流动性、网格交易

**分工**:
```
高级前端A（Swap）:
└── Day 29-30: Swap完整功能

高级前端B（流动性）:
└── Day 31-32: 流动性完整功能

前端开发A（网格交易）:
└── Day 33-35: 网格交易完整功能

前端开发B（辅助）:
└── Day 29-35: 辅助以上三个模块的UI工作

Tech Lead:
└── 持续Code Review和优化
```

---

### Week 6-8: 收敛（UI完善、测试、发布）

**Week 6**: 全员UI完善  
**Week 7**: 全员测试修复  
**Week 8**: 全员优化发布

---

## 🔧 协调机制

### 1. 日常沟通

#### 每日站会（15分钟）

**时间**: 每天早上10:00

**格式**:
```
每人回答3个问题（3分钟/人）:
1. 昨天完成了什么？
2. 今天计划做什么？
3. 有什么阻塞问题？

Tech Lead记录问题，会后解决
```

#### 实时沟通渠道

- **Slack/钉钉**: 日常问题
- **Code Review**: GitHub PR评论
- **技术讨论**: 预约30分钟会议

---

### 2. 代码协作

#### 2.1 Git分支策略

```
main（生产分支，保护）
 ↓
develop（开发主分支）
 ↓
├── feature/week1-基础架构
├── feature/week2-现货交易
├── feature/week3-期货交易
├── feature/week4-订单管理
├── feature/week5-高级功能
└── ...

每个feature分支由负责人管理
```

#### 2.2 提交规范

```bash
# 提交格式
<type>(<scope>): <subject>

# 示例
feat(spot): 添加现货下单表单
fix(wallet): 修复钱包断开连接bug
refactor(orderbook): 优化订单簿性能
docs(api): 更新API文档

# Type类型
feat: 新功能
fix: Bug修复
refactor: 重构
docs: 文档
style: 样式
test: 测试
chore: 构建工具
```

#### 2.3 PR规范

**PR标题**:
```
[Week2] 现货下单表单
```

**PR描述模板**:
```markdown
## 功能描述
实现现货限价单和市价单下单表单

## 改动内容
- 添加OrderForm组件
- 添加表单验证逻辑
- 集成trading service

## 测试
- [x] 限价单提交测试
- [x] 市价单提交测试
- [x] 表单验证测试

## 截图
[可选]

## 关联Issue
#123
```

**Review要求**:
- 必须至少1人Approve才能合并
- Tech Lead Review核心逻辑
- 其他人互相Review UI和样式

---

### 3. 接口协调

#### 3.1 类型定义优先

**由Tech Lead定义，其他人使用**

```typescript
// types/market.ts（Week 1定义）
export interface Market {
  id: string;
  slug: string;
  baseDenom: string;
  quoteDenom: string;
  // ... 所有字段
}

// 其他开发者导入使用
import type { Market } from '@/types/market';
```

#### 3.2 API契约

**在开始开发前定义好接口**

```typescript
// lib/services/market.service.ts

/**
 * 获取市场列表
 * @returns Promise<Market[]>
 */
export async function fetchMarkets(): Promise<Market[]> {
  // 实现...
}
```

**定义好后，其他人可以mock数据并行开发**

```typescript
// 前端开发可以先用mock数据
const mockMarkets: Market[] = [
  { id: '1', slug: 'inj-usdt', ... }
];
```

#### 3.3 Store接口稳定

**Store接口一旦定义，尽量不变**

```typescript
// lib/store/marketStore.ts

interface MarketState {
  markets: Market[];
  currentMarket: Market | null;
  // 接口稳定，内部实现可以改
  fetchMarkets: () => Promise<void>;
  setCurrentMarket: (marketId: string) => void;
}
```

---

### 4. 冲突解决

#### 4.1 预防冲突

**文件归属明确**:
```
高级前端A负责:
├── src/lib/services/spot.service.ts
├── src/lib/store/spotStore.ts
└── src/components/trading/SpotOrderForm.tsx

高级前端B负责:
├── src/lib/services/derivatives.service.ts
├── src/lib/store/derivativesStore.ts
└── src/components/trading/FuturesOrderForm.tsx

共享文件由Tech Lead负责:
├── src/lib/services/websocket.service.ts
├── src/lib/utils/calculations.ts
└── src/types/
```

#### 4.2 共享文件修改流程

**如果需要修改共享文件**:

1. 先在Slack/钉钉询问Tech Lead
2. Tech Lead同意后创建PR
3. Tech Lead Review并合并
4. 通知所有人更新代码

#### 4.3 解决Git冲突

```bash
# 1. 拉取最新代码
git checkout develop
git pull origin develop

# 2. 合并到自己的分支
git checkout feature/my-feature
git merge develop

# 3. 解决冲突
# 手动编辑冲突文件

# 4. 完成合并
git add .
git commit -m "merge: 解决冲突"
git push
```

**如果冲突复杂，找Tech Lead协助**

---

### 5. 集成联调

#### 5.1 每周五集成

**时间**: 每周五下午

**流程**:
1. 合并所有feature分支到develop
2. 运行完整测试
3. 手工测试核心流程
4. 记录问题
5. 周末修复严重问题

#### 5.2 持续集成

**GitHub Actions自动运行**:
```yaml
# .github/workflows/ci.yml
on:
  pull_request:
    branches: [develop, main]
  
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install
        run: yarn install
      - name: Lint
        run: yarn lint
      - name: Type Check
        run: yarn type-check
      - name: Test
        run: yarn test
```

---

## 🚨 常见问题

### Q1: 代码冲突太多怎么办？

**A**: 代码翻译项目冲突较少，因为：
- ✅ 文件归属明确（A做现货，B做期货）
- ✅ 共享文件少（主要是types和utils）
- ✅ 每天及时合并develop分支

**预防措施**:
```bash
# 每天早上第一件事
git checkout develop
git pull origin develop
git checkout feature/my-feature
git merge develop
```

### Q2: API接口变了影响很多人怎么办？

**A**: 
1. ⚠️ Week 1定义好所有类型，尽量不改
2. 如果必须改，Tech Lead统一修改
3. 通知所有人更新代码
4. 提供迁移脚本或指南

### Q3: 组件不满足需求怎么办？

**A**:
1. 先用现有组件完成功能
2. 记录改进需求
3. Week 6统一优化UI

### Q4: 性能问题影响开发怎么办？

**A**:
1. Week 1-5先实现功能
2. Week 7专门优化性能
3. 严重性能问题及时找Tech Lead

---

## 📊 协调效率评估

### 每周评估指标

| 指标 | 目标 | 评估方式 |
|-----|------|---------|
| **代码冲突率** | < 5% | Git冲突次数/PR总数 |
| **PR合并时间** | < 4小时 | PR创建到合并的时间 |
| **阻塞问题** | < 2个/周 | 站会记录的阻塞问题 |
| **返工率** | < 10% | 因接口变更导致的返工 |
| **集成问题** | < 5个/周 | 每周五集成发现的问题 |

### 改进措施

**如果指标不达标**:
1. 增加沟通频率（每日站会 → 早晚两次）
2. 强化Code Review
3. 增加集成频率（每周 → 每3天）

---

## 🔗 相关文档

- [01-MIGRATION_PLAN_8WEEKS.md](./01-MIGRATION_PLAN_8WEEKS.md) - 8周详细计划
- [03-WEBSOCKET_ARCHITECTURE.md](./03-WEBSOCKET_ARCHITECTURE.md) - WebSocket架构
- [05-TECHNICAL_DEBT.md](./05-TECHNICAL_DEBT.md) - 技术债务管理

---

## 📝 Checklist

### Week 1开始前

- [ ] 确认团队配置（4-5人）
- [ ] 设置Slack/钉钉频道
- [ ] 配置GitHub仓库权限
- [ ] 定义分支策略
- [ ] 定义提交规范
- [ ] 设置CI/CD
- [ ] 第一次团队会议（分工、协调机制）

### 每周开始前

- [ ] 上周工作回顾
- [ ] 本周任务分配
- [ ] 识别风险和依赖

### 每周结束后

- [ ] 代码集成
- [ ] 完成度评估
- [ ] 下周计划调整

---

**文档维护人**: Tech Lead  
**最后更新**: 2025-10-22  
**版本**: v2.0（适配8周计划）
