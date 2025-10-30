# WebSocket 架构设计

**文档类型**: 技术设计文档  
**优先级**: ⭐⭐⭐⭐⭐（核心架构）  
**适用项目**: 8周代码翻译计划  
**更新日期**: 2025-10-22

---

## 📋 文档说明

本文档是 [01-MIGRATION_PLAN_8WEEKS.md](./01-MIGRATION_PLAN_8WEEKS.md) 的技术补充文档，详细说明WebSocket架构的设计和实现细节。

**对应8周计划位置**:
- **Week 1 Day 5-6**: WebSocket实时数据（基础）
- **Week 2**: WebSocket完善（订单簿、成交记录实时更新）
- **Week 3+**: 持续优化

---

## 🎯 WebSocket在交易系统中的作用

### 实时数据流

```
1. 市场数据
   - 实时价格 (每秒多次更新)
   - 订单簿变化 (每秒多次更新)
   - 最近成交 (每笔成交推送)
   - 24小时统计 (定期更新)

2. 订单数据
   - 订单状态变化 (成交/取消/拒绝)
   - 订单部分成交
   - 订单错误通知

3. 持仓数据（期货）
   - 持仓盈亏实时更新
   - 保证金变化
   - 强平预警

4. 账户数据
   - 余额变化
   - 资产变化
```

---

## 🏗️ 架构设计

### 1. 连接管理 (Week 1 Day 5-6)

#### 1.1 基础连接管理器

**文件位置**: `src/lib/services/websocket.service.ts`

**参考Nuxt代码**: `injective-helix-demo/app/client/streams/`

```typescript
export class WebSocketService {
  private connection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // 初始1秒
  private heartbeatInterval: NodeJS.Timeout | null = null;
  
  /**
   * 连接状态
   */
  state: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' = 'disconnected';
  
  /**
   * 建立连接
   */
  async connect(url: string): Promise<void> {
    if (this.state === 'connected' || this.state === 'connecting') {
      return;
    }
    
    this.state = 'connecting';
    
    return new Promise((resolve, reject) => {
      this.connection = new WebSocket(url);
      
      this.connection.onopen = () => {
        console.log('WebSocket connected');
        this.state = 'connected';
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        resolve();
      };
      
      this.connection.onclose = () => {
        this.handleDisconnect();
      };
      
      this.connection.onerror = (error) => {
        console.error('WebSocket error', error);
        reject(error);
      };
      
      this.connection.onmessage = (event) => {
        this.handleMessage(event.data);
      };
    });
  }
  
  /**
   * 自动重连（指数退避）
   */
  private handleDisconnect(): void {
    this.stopHeartbeat();
    this.state = 'disconnected';
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
        30000 // 最大30秒
      );
      
      console.log(`Reconnecting in ${delay}ms`);
      this.state = 'reconnecting';
      this.reconnectAttempts++;
      
      setTimeout(() => this.connect(this.url), delay);
    } else {
      console.error('Max reconnect attempts reached');
      // 通知用户刷新页面
    }
  }
  
  /**
   * 心跳机制
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.state === 'connected') {
        this.send({ type: 'ping' });
      }
    }, 10000); // 每10秒
  }
  
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }
}
```

---

### 2. 订阅管理 (Week 2)

#### 2.1 订阅去重

**文件位置**: `src/lib/services/subscription.service.ts`

```typescript
interface Subscription {
  channel: string;
  params: any;
  callbacks: Set<(data: any) => void>;
}

export class SubscriptionManager {
  private subscriptions: Map<string, Subscription> = new Map();
  
  /**
   * 订阅（自动去重）
   */
  subscribe(
    channel: string, 
    params: any, 
    callback: (data: any) => void
  ): () => void {
    const key = `${channel}:${JSON.stringify(params)}`;
    
    if (this.subscriptions.has(key)) {
      // 已有订阅，只添加回调
      const sub = this.subscriptions.get(key)!;
      sub.callbacks.add(callback);
    } else {
      // 新订阅
      const sub: Subscription = {
        channel,
        params,
        callbacks: new Set([callback]),
      };
      
      this.subscriptions.set(key, sub);
      
      // 发送订阅消息
      this.sendSubscription(channel, params);
    }
    
    // 返回取消订阅函数
    return () => this.unsubscribe(key, callback);
  }
  
  /**
   * 取消订阅
   */
  private unsubscribe(key: string, callback: (data: any) => void): void {
    const sub = this.subscriptions.get(key);
    if (!sub) return;
    
    sub.callbacks.delete(callback);
    
    // 没有回调了，取消服务器订阅
    if (sub.callbacks.size === 0) {
      this.subscriptions.delete(key);
      this.sendUnsubscription(sub.channel, sub.params);
    }
  }
  
  /**
   * 分发消息
   */
  distribute(message: any): void {
    const key = `${message.channel}:${JSON.stringify(message.params)}`;
    const sub = this.subscriptions.get(key);
    
    if (sub) {
      sub.callbacks.forEach(callback => {
        try {
          callback(message.data);
        } catch (error) {
          console.error('Subscription callback error', error);
        }
      });
    }
  }
}
```

---

### 3. 消息队列与节流 (Week 2)

#### 3.1 消息队列

**目的**: 防止高频消息阻塞UI

```typescript
export class MessageQueue {
  private queue: any[] = [];
  private maxQueueSize = 1000;
  private processing = false;
  
  /**
   * 入队
   */
  enqueue(message: any): void {
    if (this.queue.length >= this.maxQueueSize) {
      console.warn('Queue full, dropping old messages');
      this.queue.shift();
    }
    
    this.queue.push(message);
    
    if (!this.processing) {
      this.startProcessing();
    }
  }
  
  /**
   * 批量处理（使用requestAnimationFrame）
   */
  private startProcessing(): void {
    this.processing = true;
    
    const process = () => {
      if (this.queue.length === 0) {
        this.processing = false;
        return;
      }
      
      // 每帧处理10条消息
      const batch = this.queue.splice(0, 10);
      batch.forEach(msg => this.handleMessage(msg));
      
      requestAnimationFrame(process);
    };
    
    requestAnimationFrame(process);
  }
}
```

#### 3.2 订单簿增量更新与节流

**目的**: 订单簿高频更新，需要节流避免过度渲染

```typescript
export class OrderbookUpdater {
  private orderbook: Orderbook = { bids: [], asks: [] };
  private updateThrottle = 100; // 100ms更新一次UI
  private lastUpdate = 0;
  private pendingUpdate = false;
  
  /**
   * 应用增量更新
   */
  applyUpdate(update: OrderbookUpdate): void {
    // 应用增量到内存
    this.applyDelta(update);
    
    // 节流更新UI
    this.scheduleUIUpdate();
  }
  
  /**
   * 应用增量
   */
  private applyDelta(update: OrderbookUpdate): void {
    update.bids.forEach(([price, size]) => {
      if (size === '0') {
        // 删除
        this.orderbook.bids = this.orderbook.bids.filter(
          bid => bid[0] !== price
        );
      } else {
        // 更新或添加
        const index = this.orderbook.bids.findIndex(
          bid => bid[0] === price
        );
        
        if (index >= 0) {
          this.orderbook.bids[index] = [price, size];
        } else {
          this.orderbook.bids.push([price, size]);
          // 保持排序
          this.orderbook.bids.sort((a, b) => 
            parseFloat(b[0]) - parseFloat(a[0])
          );
        }
      }
    });
    
    // 卖盘同理...
  }
  
  /**
   * 节流更新UI
   */
  private scheduleUIUpdate(): void {
    const now = Date.now();
    
    if (now - this.lastUpdate < this.updateThrottle) {
      // 还没到时间
      if (!this.pendingUpdate) {
        this.pendingUpdate = true;
        setTimeout(() => {
          this.updateUI();
          this.pendingUpdate = false;
        }, this.updateThrottle - (now - this.lastUpdate));
      }
    } else {
      // 立即更新
      this.updateUI();
    }
  }
  
  /**
   * 更新UI
   */
  private updateUI(): void {
    this.lastUpdate = Date.now();
    // 触发React组件更新
    this.emit('update', this.orderbook);
  }
}
```

---

### 4. 降级方案 (Week 7优化)

**WebSocket不可用时使用HTTP轮询**

```typescript
export class FallbackStrategy {
  private useFallback = false;
  private pollingInterval: NodeJS.Timeout | null = null;
  
  /**
   * 启动HTTP轮询
   */
  startFallback(): void {
    if (this.useFallback) return;
    
    this.useFallback = true;
    console.warn('WebSocket unavailable, using HTTP polling');
    
    this.startPolling();
  }
  
  /**
   * 轮询
   */
  private startPolling(): void {
    const poll = async () => {
      try {
        const data = await this.fetchData();
        this.handleData(data);
        
        // 1秒后继续
        this.pollingInterval = setTimeout(poll, 1000);
      } catch (error) {
        console.error('Polling error', error);
        // 5秒后重试
        this.pollingInterval = setTimeout(poll, 5000);
      }
    };
    
    poll();
  }
  
  /**
   * 恢复WebSocket
   */
  stopFallback(): void {
    if (!this.useFallback) return;
    
    this.useFallback = false;
    
    if (this.pollingInterval) {
      clearTimeout(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    console.log('WebSocket restored');
  }
}
```

---

## 📅 8周计划实施时间表

### Week 1 Day 5-6: WebSocket基础 (4小时)

**任务5.5**: WebSocket实时数据（基础版）

**工作内容**:
1. ✅ 创建WebSocket manager（2小时）
   - 初始化连接
   - 连接管理（连接、断开、重连）
   - 心跳机制

2. ✅ 市场价格订阅（2小时）
   - 订阅单个市场价格
   - 接收价格更新
   - 更新store状态

**参考文件**: `injective-helix-demo/app/client/streams/`

**验收标准**:
- WebSocket可连接
- 价格可实时更新
- 断线可自动重连

---

### Week 2 Day 8: 订单簿与成交记录 (2小时)

**任务8.1**: 创建Orderbook Service

**工作内容**:
1. ✅ 订单簿WebSocket订阅（1小时）
   - 订阅订单簿更新
   - 增量更新处理
   - 合并更新到快照

2. ✅ 订单簿聚合（1小时）
   - 按价格精度聚合
   - 计算累计数量
   - 计算深度百分比

**验收标准**:
- WebSocket订阅正常
- 增量更新正确
- 数据格式规范

---

### Week 2-3: 持续优化

**优化项**:
1. ✅ 订阅管理器（去重、合并）
2. ✅ 消息队列（防阻塞）
3. ✅ 节流更新（100ms一次）
4. ✅ 性能监控

---

### Week 7: 压力测试与优化

**测试内容**:
1. ✅ 高频消息处理能力
2. ✅ 并发订阅数量
3. ✅ 内存占用
4. ✅ 断线重连稳定性

**优化方向**:
1. ✅ 降级方案实现
2. ✅ 消息优先级处理
3. ✅ 连接池管理（如果需要）

---

## 🔧 代码翻译要点

### 从Nuxt翻译到Next.js

#### 1. 文件位置对应

| Nuxt | Next.js |
|------|---------|
| `app/client/streams/` | `src/lib/services/websocket/` |
| `store/` | `src/lib/store/` (Zustand) |
| `composables/` | `src/lib/hooks/` (React Hooks) |

#### 2. 语法转换

**Nuxt (Vue Composable)**:
```typescript
// composables/useWebSocket.ts
export const useWebSocket = () => {
  const ws = ref<WebSocket | null>(null)
  
  const connect = () => {
    ws.value = new WebSocket(url)
  }
  
  return { ws, connect }
}
```

**Next.js (React Hook)**:
```typescript
// hooks/useWebSocket.ts
export const useWebSocket = () => {
  const [ws, setWs] = useState<WebSocket | null>(null)
  
  const connect = useCallback(() => {
    setWs(new WebSocket(url))
  }, [])
  
  return { ws, connect }
}
```

#### 3. 状态管理转换

**Nuxt (Pinia)**:
```typescript
// store/websocket.ts
export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    connected: false
  }),
  actions: {
    setConnected(value: boolean) {
      this.connected = value
    }
  }
})
```

**Next.js (Zustand)**:
```typescript
// store/websocketStore.ts
export const useWebSocketStore = create<WebSocketState>((set) => ({
  connected: false,
  setConnected: (value: boolean) => set({ connected: value })
}))
```

---

## ⚠️ 注意事项

### 1. 代码翻译项目特点

- ✅ **Nuxt版本已验证**: WebSocket逻辑已在生产环境运行
- ✅ **只需翻译语法**: Vue → React，Pinia → Zustand
- ✅ **业务逻辑不变**: 连接管理、订阅管理逻辑100%复用
- ⚠️ **重点测试**: 语法转换可能引入的Bug

### 2. 性能优化优先级

**Week 1-2（必须）**:
- ✅ 基础连接管理
- ✅ 自动重连
- ✅ 订单簿增量更新

**Week 3-6（重要）**:
- ✅ 订阅去重
- ✅ 消息节流
- ✅ 性能监控

**Week 7-8（优化）**:
- ✅ 降级方案
- ✅ 连接池（如果需要）
- ✅ 高级优化

### 3. 调试技巧

```typescript
// 开发环境开启详细日志
if (process.env.NODE_ENV === 'development') {
  console.log('[WS] Message received:', message);
  console.log('[WS] Subscription count:', this.subscriptions.size);
  console.log('[WS] Queue size:', this.queue.length);
}
```

---

## 📊 性能指标

### 目标指标

| 指标 | 目标值 | 说明 |
|-----|--------|------|
| **连接建立时间** | < 500ms | 首次连接 |
| **重连时间** | < 2s | 断线后 |
| **消息延迟** | < 100ms | 收到消息到UI更新 |
| **订单簿更新频率** | 10次/秒 | 节流后 |
| **内存占用** | < 50MB | WebSocket相关 |
| **CPU占用** | < 5% | 正常运行时 |

### 监控方法

```typescript
// 性能监控
export class WebSocketMonitor {
  private metrics = {
    messagesReceived: 0,
    messagesProcessed: 0,
    averageLatency: 0,
    reconnectCount: 0,
  }
  
  recordMessage(latency: number): void {
    this.metrics.messagesReceived++;
    this.metrics.averageLatency = 
      (this.metrics.averageLatency * (this.metrics.messagesReceived - 1) + latency) 
      / this.metrics.messagesReceived;
  }
  
  getMetrics() {
    return this.metrics;
  }
}
```

---

## 🔗 相关文档

- [01-MIGRATION_PLAN_8WEEKS.md](./01-MIGRATION_PLAN_8WEEKS.md) - 8周详细计划
- [04-PARALLEL_DEVELOPMENT.md](./04-PARALLEL_DEVELOPMENT.md) - 并行开发协调
- [05-TECHNICAL_DEBT.md](./05-TECHNICAL_DEBT.md) - 技术债务管理

---

**文档维护人**: Tech Lead  
**最后更新**: 2025-10-22  
**版本**: v2.0（适配8周计划）
