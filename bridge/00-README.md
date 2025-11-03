# 🌉 Biya Helix 跨链桥 - 文档中心

> **最后更新**: 2025-10-30  
> **版本**: v1.0  
> **适合人群**: 新手开发者、业务人员、运维人员

---

## 📚 文档导航

### 🎯 快速开始
- [业务概述](./01-业务概述.md) - **从这里开始！** 了解跨链桥是什么、为什么需要它
- [核心概念](./03-核心概念.md) - 理解关键术语和概念

### 🏗️ 技术深入
- [架构设计](./02-架构设计.md) - 技术架构和模块划分
- [数据流程](./04-数据流程.md) - 数据如何在系统中流转
- [组件说明](./05-组件说明.md) - 各个代码模块的详细说明

### 🔧 实战指南
- [API 参考](./06-API参考.md) - 接口和方法说明
- [常见问题](./07-常见问题.md) - FAQ 和故障排查

---

## 🌉 什么是跨链桥？

**跨链桥（Bridge）** 是连接不同区块链网络的"桥梁"，允许用户在不同链之间转移资产。

### 简单类比

想象一下：
- **以太坊** = 美国
- **Injective** = 中国
- **BNB Chain** = 日本

如果你在美国有 100 美元（USDT），想在中国使用：
1. ❌ **不能直接用**：中国不认美元
2. ✅ **需要兑换**：通过"银行"（跨链桥）兑换成人民币

**跨链桥就是这个"银行"**，帮你：
- 锁定你在以太坊的 USDT
- 在 Injective 上给你对应的 USDT
- 保证两边的总量始终平衡

---

## 🎯 本项目支持的桥接方式

### 1. **Peggy Bridge** - 以太坊 ↔️ Injective
```
使用场景：ETH、USDT、INJ 等 ERC20 代币
桥接时间：5-15 分钟
费用：ETH Gas 费
```

### 2. **Axelar Bridge** - 多链 ↔️ Injective  
```
使用场景：BSC、Polygon 等多链资产
桥接时间：5-30 分钟
费用：各链的 Gas 费
```

---

## 🚀 核心功能

### 用户视角
1. **连接钱包**（Keplr + MetaMask）
2. **选择代币和网络**（USDT、INJ 等）
3. **输入金额**
4. **一键桥接**
5. **等待确认**（自动处理）

### 技术实现
1. **钱包管理**：连接多种钱包（Keplr、MetaMask、OKX）
2. **智能合约交互**：调用 Peggy/Axelar 合约
3. **交易广播**：提交到对应的区块链
4. **状态跟踪**：监听交易状态和确认

---

## 📂 代码结构概览

```
biya-helix-app/
├── lib/bridge/              # 核心业务逻辑
│   ├── contracts/          # 智能合约封装
│   ├── services/           # 业务服务
│   ├── wallet/             # 钱包管理
│   ├── data/               # 代币配置
│   └── utils/              # 工具函数
│
├── context/bridge/          # React 状态管理
│   ├── WalletProvider      # 钱包状态
│   ├── AccountProvider     # 账户余额
│   ├── PeggyProvider       # Peggy 桥接
│   ├── AxelarProvider      # Axelar 桥接
│   └── TokenProvider       # 代币价格
│
├── components/bridge/       # UI 组件
│   ├── Bridge.tsx          # 主组件
│   ├── BridgeFromV2.tsx    # 桥接表单
│   └── common/             # 通用组件
│
└── app/[locale]/bridge/    # 页面入口
    └── page.tsx
```

---

## 🎓 学习路径

### 第 1 天：理解业务
1. 阅读 [业务概述](./01-业务概述.md)
2. 阅读 [核心概念](./03-核心概念.md)
3. 在浏览器中体验跨链桥功能

### 第 2 天：了解架构
1. 阅读 [架构设计](./02-架构设计.md)
2. 查看代码结构
3. 理解各个模块的职责

### 第 3 天：深入代码
1. 阅读 [数据流程](./04-数据流程.md)
2. 阅读 [组件说明](./05-组件说明.md)
3. 尝试修改界面或添加功能

### 第 4 天：实战
1. 参考 [API 参考](./06-API参考.md)
2. 解决 [常见问题](./07-常见问题.md)
3. 独立完成一个小需求

---

## 💡 快速定位问题

### 我想知道...

| 问题 | 查看文档 |
|------|---------|
| 跨链桥的业务原理？ | [业务概述](./01-业务概述.md) |
| Peggy 和 Axelar 的区别？ | [核心概念](./03-核心概念.md) |
| 代码如何组织的？ | [架构设计](./02-架构设计.md) |
| 用户点击"桥接"后发生了什么？ | [数据流程](./04-数据流程.md) |
| 某个文件是干什么的？ | [组件说明](./05-组件说明.md) |
| 如何调用桥接功能？ | [API 参考](./06-API参考.md) |
| 遇到错误怎么办？ | [常见问题](./07-常见问题.md) |

---

## 🔗 相关资源

### 官方文档
- [Injective 官方文档](https://docs.injective.network/)
- [Peggy Bridge 介绍](https://docs.injective.network/learn/peggy)
- [Axelar 文档](https://docs.axelar.dev/)

### 工具
- [Injective Explorer](https://explorer.injective.network/)
- [Etherscan](https://etherscan.io/)
- [WalletConnect](https://walletconnect.com/)

### SDK
- [@injectivelabs/sdk-ts](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
- [@injectivelabs/wallet-strategy](https://www.npmjs.com/package/@injectivelabs/wallet-strategy)
- [@0xsquid/sdk](https://www.npmjs.com/package/@0xsquid/sdk)

---

## 📞 获取帮助

- **技术问题**：查看 [常见问题](./07-常见问题.md)
- **业务咨询**：阅读 [业务概述](./01-业务概述.md)
- **Bug 报告**：提供详细的错误信息和复现步骤

---

## 🎉 开始学习

👉 **推荐从 [业务概述](./01-业务概述.md) 开始阅读！**

---

*最后更新: 2025-10-30*

