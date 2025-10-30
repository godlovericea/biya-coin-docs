# Week 2: 鐜拌揣浜ゆ槗鏍稿績 (Day 8-14)

**涓婁竴鍛?*: [Week 1](./week-01.md) | **涓嬩竴鍛?*: [Week 3](./week-03.md)
## Week 2: 现货交易核心 (Day 8-14)

**目标**: 完整的现货交易功能（订单簿、下单、订单管理）  
**负责人**: 2-3名高级开发  
**验收**: 可以成功下单（限价/市价），可以取消订单，订单簿实时更新

---

### Day 8: 订单簿与成交记录

**负责人**: 1名高级开发  
**工作时间**: 8小时

#### 任务8.1: 创建Orderbook Service (2小时)

**参考文件**: `injective-helix-demo/app/client/streams/spot.ts`

**详细步骤**:
1. 创建orderbook service
   - 创建 `src/lib/services/orderbook.service.ts`
   - 使用IndexerGrpcSpotApi获取订单簿

2. 实现获取订单簿快照
   - fetchOrderbook(marketId)
   - 返回买单和卖单列表
   - 数据格式化

3. 实现WebSocket订单簿订阅
   - 订阅订单簿更新
   - 增量更新处理
   - 合并更新到快照

4. 实现订单簿聚合
   - 按价格精度聚合
   - 计算累计数量
   - 计算深度百分比

5. 错误处理
   - 网络错误
   - 订阅失败
   - 数据异常

**交付物**:
- [ ] orderbook.service.ts
- [ ] 订单簿获取方法
- [ ] WebSocket订阅
- [ ] 数据聚合逻辑

**验收标准**:
- 可获取订单簿快照
- WebSocket订阅正常
- 增量更新正确
- 数据格式规范

---

#### 任务8.2: 创建Spot Store (2小时)

**参考文件**: `injective-helix-demo/store/spot.ts`

**详细步骤**:
1. 创建spot store
   - 创建 `src/lib/store/spotStore.ts`
   - 定义状态类型:
     ```typescript
     interface SpotState {
       // 当前市场
       currentMarket: SpotMarket | null
       
       // 订单簿
       orderbook: {
         buys: OrderbookLevel[]
         sells: OrderbookLevel[]
       }
       
       // 成交记录
       trades: Trade[]
       
       // 用户订单
       orders: Order[]
       
       // 订阅管理
       subscriptions: Map<string, Subscription>
       
       // 方法
       setMarket: (marketId: string) => void
       subscribeOrderbook: (marketId: string) => void
       unsubscribeOrderbook: () => void
       subscribeTrades: (marketId: string) => void
       fetchOrders: () => Promise<void>
     }
     ```

2. 实现市场切换
   - setMarket方法
   - 取消旧订阅
   - 订阅新市场数据

3. 实现订单簿订阅
   - 调用orderbook service
   - 更新store状态
   - 处理增量更新

4. 实现成交记录订阅
   - 订阅最近成交
   - 维护固定数量（如最近100条）
   - 实时推送新成交

5. 集成React Query
   - 缓存用户订单
   - 自动刷新策略

**交付物**:
- [ ] spotStore.ts
- [ ] SpotState类型
- [ ] 订阅管理方法

**验收标准**:
- Store状态管理正确
- 订阅/取消订阅正常
- 数据实时更新
- 无内存泄漏

---

#### 任务8.3: Orderbook组件 (3小时)

**参考文件**: `injective-helix-demo/components/Partials/Trade/Spot/Orderbook/`

**详细步骤**:
1. Orderbook主组件
   - 创建 `src/components/trading/Orderbook.tsx`
   - 布局：卖盘在上，买盘在下，中间显示价差
   - 支持三种显示模式：买+卖、只买、只卖

2. OrderbookRow组件
   - 显示：价格、数量、累计
   - 价格显示：红色(卖)/绿色(买)
   - 背景深度条：显示数量占比
   - 点击价格：填充到下单表单
   - Hover效果：高亮当前行

3. OrderbookSpread组件
   - 显示买卖价差
   - 显示价差百分比
   - 居中显示，醒目

4. 精度选择
   - Dropdown选择精度
   - 0.01, 0.1, 1, 10等
   - 根据精度聚合订单簿

5. 性能优化
   - 使用React.memo减少重渲染
   - 虚拟滚动（如果订单多）
   - 节流更新（如100ms一次）

6. 测试组件
   - 测试订单簿显示
   - 测试实时更新
   - 测试精度切换
   - 测试点击价格

**交付物**:
- [ ] Orderbook组件
- [ ] OrderbookRow组件
- [ ] OrderbookSpread组件
- [ ] 精度选择器

**验收标准**:
- 订单簿正确显示
- 实时更新流畅
- 点击价格填充
- 性能良好（无卡顿）
- UI美观

---

#### 任务8.4: TradesList组件 (1小时)

**参考文件**: `injective-helix-demo/components/Partials/Trade/Spot/TradesList/`

**详细步骤**:
1. TradesList组件
   - 创建 `src/components/trading/TradesList.tsx`
   - 显示：价格、数量、时间
   - 价格颜色：红色(卖)/绿色(买)
   - 固定高度，滚动显示

2. 实时更新
   - 订阅成交流
   - 新成交插入到顶部
   - 保持固定数量（如100条）
   - 新成交闪烁动画

3. 样式设计
   - 紧凑布局
   - 与订单簿风格一致

4. 测试组件
   - 测试成交记录显示
   - 测试实时更新
   - 测试滚动

**交付物**:
- [ ] TradesList组件
- [ ] 实时更新逻辑

**验收标准**:
- 成交记录正确显示
- 实时更新流畅
- 新成交有视觉提示
- UI美观

---

### Day 9-10: 现货下单表单

**负责人**: 1名高级开发 + 1名开发  
**工作时间**: 16小时

#### 任务9.1: 创建Trading Service (3小时)

**参考文件**: `injective-helix-demo/app/services/spot.ts`

**详细步骤**:
1. 创建trading service
   - 创建 `src/lib/services/trading.service.ts`
   - 初始化MsgBroadcaster

2. 实现限价单提交
   - 构造MsgCreateSpotLimitOrder消息
   - 设置价格、数量、方向（买/卖）
   - 计算手续费
   - 签名交易
   - 广播交易
   - 返回交易哈希

3. 实现市价单提交
   - 构造MsgCreateSpotMarketOrder消息
   - 设置数量、方向
   - 计算预期成交价
   - 签名并广播

4. 实现订单取消
   - 构造MsgCancelSpotOrder消息
   - 签名并广播

5. 实现批量取消
   - 构造MsgBatchCancelSpotOrders消息
   - 取消多个订单

6. 错误处理
   - 余额不足
   - Gas不足
   - 订单价格/数量验证失败
   - 用户拒绝签名
   - 交易失败

7. 测试service
   - 单元测试（模拟）
   - 集成测试（testnet）

**交付物**:
- [ ] trading.service.ts
- [ ] 下单方法
- [ ] 取消订单方法
- [ ] 错误处理

**验收标准**:
- 限价单可提交
- 市价单可提交
- 订单可取消
- 错误处理完善
- 测试通过

---

#### 任务9.2: 表单验证逻辑 (2小时)

**详细步骤**:
1. 创建validation utils
   - 创建 `src/lib/utils/validation.ts`
   - 使用Zod定义验证schema

2. 价格验证
   - 必填
   - 必须大于0
   - 精度验证（如最多8位小数）
   - 范围验证（如不能超过当前价±20%）

3. 数量验证
   - 必填
   - 必须大于0
   - 最小数量限制
   - 精度验证

4. 余额验证
   - 检查可用余额
   - 计算所需金额（价格×数量+手续费）
   - 提示余额不足

5. 创建useOrderForm hook
   - 使用react-hook-form
   - 集成Zod验证
   - 提供表单状态和方法

**交付物**:
- [ ] validation.ts
- [ ] Zod schema
- [ ] useOrderForm hook

**验收标准**:
- 验证规则正确
- 错误提示友好
- 表单状态管理正确

---

#### 任务9.3: OrderForm组件 (5小时)

**参考文件**: `injective-helix-demo/components/Partials/Trade/Spot/OrderForm/`

**详细步骤**:
1. OrderForm主组件
   - 创建 `src/components/trading/OrderForm.tsx`
   - 买/卖Tab切换
   - 限价/市价Tab切换

2. 价格输入
   - Input组件
   - 显示当前市场价
   - 快速调整按钮：+1%, +5%, +10%, -1%, -5%, -10%
   - 实时验证

3. 数量输入
   - Input组件
   - 显示可用余额
   - 百分比快捷按钮：25%, 50%, 75%, 100%
   - 点击快捷按钮自动计算数量
   - 实时验证

4. 总额显示
   - 实时计算：价格 × 数量
   - 显示手续费
   - 显示最终总额
   - 反向计算：输入总额反推数量

5. 提交按钮
   - 未连接钱包：显示"Connect Wallet"
   - 表单invalid：disabled状态
   - 表单valid：显示"Buy"或"Sell"
   - 提交中：显示loading
   - 余额不足：显示提示并disabled

6. 确认Modal
   - 点击提交弹出确认框
   - 显示订单详情
   - 确认后提交
   - 支持"不再提示"选项

7. 成功/失败提示
   - Toast提示提交结果
   - 显示交易哈希
   - 链接到区块浏览器

8. 样式设计
   - 与Nuxt版本一致
   - 买单绿色主题
   - 卖单红色主题
   - 响应式布局

9. 测试组件
   - 测试表单输入
   - 测试验证
   - 测试提交流程
   - 测试错误处理

**交付物**:
- [ ] OrderForm组件
- [ ] 价格/数量输入组件
- [ ] 确认Modal
- [ ] 完整的提交流程

**验收标准**:
- 表单输入正常
- 验证规则正确
- 快捷按钮正常
- 计算准确
- 提交流程完整
- 错误处理友好
- UI美观

---

#### 任务9.4: 计算工具函数 (2小时)

**参考文件**: `injective-helix-demo/app/utils/`

**详细步骤**:
1. 创建calculation utils
   - 创建 `src/lib/utils/calculations.ts`
   - 使用BigNumber.js处理精度

2. 价格计算
   - 格式化价格显示
   - 价格变化百分比
   - 价格调整（+/-百分比）

3. 数量计算
   - 根据百分比计算数量
   - 根据总额反推数量
   - 数量精度处理

4. 手续费计算
   - Maker费率
   - Taker费率
   - 根据订单类型计算费用

5. 总额计算
   - 买单总额：价格 × 数量 + 手续费
   - 卖单总额：价格 × 数量 - 手续费

6. 测试计算函数
   - 单元测试所有计算函数
   - 边界值测试
   - 精度测试

**交付物**:
- [ ] calculations.ts
- [ ] 所有计算函数
- [ ] 单元测试

**验收标准**:
- 计算准确无误
- 精度处理正确
- 测试覆盖率高

---

#### 任务9.5: 集成测试 (4小时)

**详细步骤**:
1. 功能测试
   - 测试限价买单完整流程
   - 测试限价卖单完整流程
   - 测试市价买单完整流程
   - 测试市价卖单完整流程
   - 测试表单验证
   - 测试快捷按钮
   - 测试余额检查

2. 边界测试
   - 余额不足情况
   - 价格/数量异常值
   - 网络错误
   - 用户拒绝签名
   - 交易失败

3. UI测试
   - 测试响应式布局
   - 测试主题切换
   - 测试Tab切换
   - 测试Modal交互

4. 性能测试
   - 测试实时计算性能
   - 测试表单输入流畅度

5. 修复Bug
   - 记录所有Bug
   - 按优先级修复
   - 回归测试

**交付物**:
- [ ] 测试报告
- [ ] Bug列表和修复记录

**验收标准**:
- 所有核心流程测试通过
- 无严重Bug
- UI交互流畅

---

继续创建后续周的详细计划...

**由于字数限制，我将文档分为多个部分。以上是Week 1-2的详细内容。**

---

## 文档说明

本文档提供了**8周代码翻译计划**的详细工作内容，包括：

### 每个任务包含：
- **负责人**: 明确谁负责
- **工作时间**: 预计时间
- **参考文件**: Nuxt源文件位置
- **详细步骤**: 具体做什么
- **交付物**: 产出什么
- **验收标准**: 如何验证完成


---

**涓婁竴鍛?*: [Week 1](./week-01.md) | **涓嬩竴鍛?*: [Week 3](./week-03.md)
