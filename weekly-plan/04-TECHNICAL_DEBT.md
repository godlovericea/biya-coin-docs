# 技术债务管理

**文档类型**: 质量管理指南  
**优先级**: ⭐⭐⭐⭐  
**适用项目**: 8周代码翻译计划  
**更新日期**: 2025-10-22

---

## 📋 文档说明

本文档是 [01-MIGRATION_PLAN_8WEEKS.md](./01-MIGRATION_PLAN_8WEEKS.md) 的质量管理补充文档，说明如何在8周快节奏开发中控制技术债务。

**代码翻译项目特点**: 
- ✅ Nuxt版本已验证，业务逻辑正确
- ✅ 主要债务来自语法转换和快速开发
- ✅ 相比从零开发，债务风险低50%

---

## 🎯 什么是技术债务？

### 定义

技术债务是指为了短期目标采取的次优解决方案，会在未来需要"偿还"（重构/修复）。

### 代码翻译项目的技术债务特点

**✅ 债务较少的方面**:
- 业务逻辑（已在Nuxt验证）
- UI设计（100%照搬）
- 架构设计（参考Nuxt）

**⚠️ 可能产生债务的方面**:
- Vue → React语法转换错误
- 状态管理迁移（Pinia → Zustand）
- 为赶进度跳过的优化
- 测试覆盖不足

---

## 📅 8周技术债务管理策略

### Week 1-5: 控制债务产生

**原则**: 快速开发但不能太随意

#### 必须做到（否则后果严重）

```typescript
✅ 1. TypeScript类型完整
// ❌ 错误：用any逃避类型
const data: any = fetchData();

// ✅ 正确：定义类型
interface MarketData {
  id: string;
  price: number;
  volume: string;
}
const data: MarketData = fetchData();

✅ 2. 关键计算必须准确
// 强平价、盈亏计算、手续费计算
// 必须使用BigNumber.js，绝不能用Number

✅ 3. 错误处理不能省略
// ❌ 错误
const data = await api.fetch();

// ✅ 正确
try {
  const data = await api.fetch();
} catch (error) {
  console.error('Fetch failed', error);
  showErrorToast('Failed to load data');
}

✅ 4. 关键组件要有注释
/**
 * 现货下单表单
 * 支持限价单和市价单
 * 
 * @param market - 市场信息
 * @param onSubmit - 提交回调
 */
export function SpotOrderForm({ market, onSubmit }: Props) {
  // ...
}
```

#### 可以暂时妥协（Week 7修复）

```typescript
⚠️ 1. 组件拆分不够细
// Week 1-5: 一个大组件也OK
// Week 7: 拆分为小组件

⚠️ 2. 性能优化不完美
// Week 1-5: 功能实现为主
// Week 7: useMemo, useCallback, React.memo

⚠️ 3. UI细节不完美
// Week 1-5: 功能可用即可
// Week 6: 完善UI

⚠️ 4. 代码重复
// Week 1-5: 允许少量重复
// Week 7: 提取公共逻辑
```

---

### Week 6: 偿还UI债务

**1天专门优化UI**

```
Day 36-37:
- 统一间距、颜色、字体
- 修复布局问题
- 完善响应式
- 优化交互细节
```

---

### Week 7: 偿还代码债务

**4天专门重构和优化**

```
Day 43-46:
- 提取重复代码
- 组件拆分
- 性能优化（memo, callback）
- 代码规范统一
- 添加注释
```

---

### Week 8: 偿还性能债务

**2天性能优化**

```
Day 50-51:
- 代码分割
- 懒加载
- Bundle优化
- 图片优化
- 缓存策略
```

---

## 🔧 债务管理工具

### 1. 代码质量工具

#### ESLint规则（必须）

```javascript
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    // 禁止any（除非有注释说明）
    "@typescript-eslint/no-explicit-any": "warn",
    
    // 禁止console.log（开发时warn，生产error）
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    
    // React Hooks规则
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // 未使用变量
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

#### TypeScript严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

#### Prettier格式化

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100
}
```

---

### 2. 债务追踪

#### TODO注释

```typescript
// 使用TODO标记需要后续处理的问题
// TODO(Week7): 提取为公共组件
// TODO(Performance): 优化渲染性能
// FIXME: 修复XXX问题
// HACK: 临时方案，需要重构
```

#### 债务清单（维护在文档中）

```markdown
## Week 1-5债务清单

### 高优先级（Week 7必修）
- [ ] OrderForm组件太大，需要拆分
- [ ] 订单簿更新没有节流，性能差
- [ ] WebSocket重连逻辑不完善

### 中优先级（Week 7选修）
- [ ] Button组件样式不统一
- [ ] 表单验证提示不够友好

### 低优先级（可延期）
- [ ] 代码注释不够详细
- [ ] 某些工具函数有重复
```

---

### 3. 每周代码审查

#### Code Review重点

```
Week 1-2:
✅ 类型定义完整吗？
✅ 错误处理了吗？
✅ 计算准确吗？

Week 3-4:
✅ 组件是否太大（>500行）？
✅ 是否有明显重复代码？
✅ 性能是否有明显问题？

Week 5-6:
✅ UI是否与Nuxt一致？
✅ 交互是否流畅？

Week 7:
✅ 债务是否还清？
✅ 代码质量是否达标？
```

---

## 📊 质量指标

### 必须达标的指标

| 指标 | 目标 | Week | 说明 |
|-----|------|------|------|
| **TypeScript覆盖率** | 100% | 贯穿全程 | 不允许有any（除非注释说明） |
| **ESLint错误** | 0个 | 贯穿全程 | 不允许提交有error的代码 |
| **Console.log** | 0个 | Week 7清理 | 生产代码不允许有console |
| **功能完整性** | 100% | Week 5 | 与Nuxt版本功能对等 |
| **单元测试覆盖率** | > 70% | Week 7 | 核心计算函数必须测试 |
| **关键Bug** | 0个 | Week 7 | Critical Bug必须修复 |

---

## 🚨 警告信号

### 需要立即处理的信号

```
🔴 严重警告（立即处理）:
- TypeScript编译错误
- 功能完全不可用
- 数据计算错误
- 安全漏洞

🟡 中等警告（Week 7处理）:
- 性能明显差
- UI明显不对
- 大量代码重复
- 组件过大（>500行）

🟢 轻微警告（有时间处理）:
- 命名不规范
- 注释不够
- 小的样式问题
```

---

## ✅ 债务偿还Checklist

### Week 6: UI债务

- [ ] 统一颜色变量
- [ ] 统一间距（4px基准）
- [ ] 统一字体大小
- [ ] 修复布局错位
- [ ] 完善响应式
- [ ] 优化加载状态
- [ ] 优化错误提示

### Week 7: 代码债务

- [ ] 拆分大组件（>500行）
- [ ] 提取重复代码
- [ ] 添加React.memo
- [ ] 添加useCallback/useMemo
- [ ] 统一错误处理
- [ ] 添加关键注释
- [ ] 清理console.log
- [ ] 清理未使用代码

### Week 8: 性能债务

- [ ] 代码分割
- [ ] 懒加载组件
- [ ] 图片优化
- [ ] Bundle优化
- [ ] 缓存优化
- [ ] WebSocket优化
- [ ] 内存泄漏检查

---

## 📖 最佳实践

### 1. 边开发边测试

```typescript
// ✅ 好习惯：开发完立即测试
// 不要等到Week 7才测试

// 开发OrderForm组件
function OrderForm() {
  // ...
}

// 立即手动测试：
// 1. 输入价格、数量
// 2. 点击提交
// 3. 验证错误提示
// 4. 验证成功流程
```

### 2. 小步提交

```bash
# ✅ 好习惯：功能做完一点提交一点
git commit -m "feat: 添加价格输入框"
git commit -m "feat: 添加数量输入框"
git commit -m "feat: 添加表单验证"

# ❌ 坏习惯：攒一周一起提交
git commit -m "feat: 完成订单表单"  # 包含100个文件改动
```

### 3. 及时重构

```typescript
// 发现重复代码立即提取
// ❌ 坏习惯：想着Week 7再重构
const formattedPrice1 = (price * 100).toFixed(2);
const formattedPrice2 = (price * 100).toFixed(2);

// ✅ 好习惯：立即提取
function formatPrice(price: number): string {
  return (price * 100).toFixed(2);
}
```

---

## 🔗 相关文档

- [01-MIGRATION_PLAN_8WEEKS.md](./01-MIGRATION_PLAN_8WEEKS.md) - 8周详细计划
- [03-WEBSOCKET_ARCHITECTURE.md](./03-WEBSOCKET_ARCHITECTURE.md) - WebSocket架构
- [04-PARALLEL_DEVELOPMENT.md](./04-PARALLEL_DEVELOPMENT.md) - 并行开发协调

---

## 🎯 总结

### 代码翻译项目的债务管理特点

1. **债务风险低**: Nuxt版本已验证，主要是语法转换问题
2. **快速偿还**: Week 6-7专门时间偿还债务
3. **工具保障**: ESLint、TypeScript严格模式自动检查
4. **重点关注**: 类型安全、计算准确、错误处理

### 核心原则

> **Week 1-5**: 快速开发，但保证类型安全和计算准确  
> **Week 6**: 偿还UI债务  
> **Week 7**: 偿还代码债务  
> **Week 8**: 偿还性能债务  

### 成功标准

✅ Week 8结束时：
- 0个TypeScript错误
- 0个ESLint错误
- 0个Critical Bug
- 单元测试覆盖率 > 70%
- Lighthouse分数 > 90

---

**文档维护人**: Tech Lead  
**最后更新**: 2025-10-22  
**版本**: v2.0（适配8周计划）
