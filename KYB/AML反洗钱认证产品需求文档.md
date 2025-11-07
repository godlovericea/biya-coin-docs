# AML反洗钱认证产品需求文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档名称 | AML反洗钱认证产品需求文档（基于Sumsub API） |
| 文档版本 | V1.2 |
| 创建日期 | 2025年11月5日 |
| 最后更新 | 2025年11月5日 |
| 产品负责人 | - |
| 相关功能 | 个人AML认证、企业AML认证 |

---

## 目录

1. [产品概述](#1-产品概述)
   - 1.1 [产品定位](#11-产品定位)
   - 1.2 [核心价值](#12-核心价值)
   - 1.3 [产品特点](#13-产品特点)
   - 1.4 [重要说明](#14-重要说明)
2. [个人AML认证需求](#2-个人aml认证需求)
   - 2.1 [功能描述](#21-功能描述)
   - 2.2 [前置条件](#22-前置条件)
   - 2.3 [认证流程](#23-认证流程)
   - 2.4 [国家差异化字段](#24-国家差异化字段)
   - 2.5 [数据字段映射](#25-数据字段映射)
3. [企业AML认证需求](#3-企业aml认证需求)
   - 3.1 [功能描述](#31-功能描述)
   - 3.2 [前置条件](#32-前置条件)
   - 3.3 [认证流程](#33-认证流程)
   - 3.4 [国家差异化要求](#34-国家差异化要求)
   - 3.5 [数据字段映射](#35-数据字段映射)
4. [Sumsub API集成要求](#4-sumsub-api集成要求)
   - 4.1 [API端点说明](#41-api端点说明)
   - 4.2 [检查类型](#42-检查类型)
   - 4.3 [API调用流程](#43-api调用流程)
5. [审核状态管理](#5-审核状态管理)
   - 5.1 [状态定义](#51-状态定义)
   - 5.2 [状态流转](#52-状态流转)
   - 5.3 [状态展示](#53-状态展示)
6. [检查结果处理](#6-检查结果处理)
   - 6.1 [Clear（无风险）](#61-clear无风险)
   - 6.2 [Hit（命中风险）](#62-hit命中风险)
   - 6.3 [Review（需人工审核）](#63-review需人工审核)
7. [通知机制](#7-通知机制)
8. [后台管理功能](#8-后台管理功能)
9. [数据安全与隐私](#9-数据安全与隐私)
10. [异常处理](#10-异常处理)
11. [合规要求](#11-合规要求)

---

## 1. 产品概述

### 1.1 产品定位

AML（Anti-Money Laundering）反洗钱认证系统是基于Sumsub API的合规认证解决方案，用于对个人和企业进行全面的反洗钱背景调查，包括制裁名单筛查、PEP（政治公众人物）检查和负面媒体监控。

### 1.2 核心价值

- **合规保障**：满足全球各国的反洗钱（AML）法规要求
- **风险防控**：及时发现和拦截高风险用户和企业
- **自动化检查**：通过Sumsub API自动完成背景调查，提升效率
- **全球覆盖**：支持200+国家和地区的AML检查
- **实时监控**：持续监控用户/企业的风险状态变化

### 1.3 产品特点

1. **前置认证集成**：个人AML基于KYC，企业AML基于KYB
2. **国家差异化**：根据不同国家的法规要求，动态调整检查内容
3. **三重检查机制**：制裁名单 + PEP + 负面媒体
4. **结果不对用户展示**：检查结果仅供后台管理员查看
5. **持续监控能力**：支持定期重新检查（如每年一次）

### 1.4 重要说明

> **⚠️ 字段定义以第三方接口为准**
>
> 本文档中涉及的所有数据字段、API参数、请求格式等内容，均基于Sumsub API的当前版本（文档编写时）。在实际开发和集成过程中：
>
> 1. **以Sumsub官方API文档为准**：所有字段定义、数据类型、验证规则等，以Sumsub最新官方文档为最终标准
> 2. **动态适配**：如Sumsub API更新或调整字段要求，应及时同步更新系统实现
> 3. **国家差异**：不同国家的字段要求可能随监管政策调整而变化，需保持灵活性
> 4. **版本兼容**：建议在系统中预留字段扩展能力，以应对API版本升级
> 5. **文档参考**：本PRD中的字段仅供产品设计参考，技术实现时需查阅Sumsub最新API文档
>
> **Sumsub官方文档地址：** https://docs.sumsub.com/reference/about-sumsub-api

---

## 2. 个人AML认证需求

### 2.1 功能描述

个人AML认证是在用户完成KYC和KYC补充信息后，进行的反洗钱背景调查。系统将通过Sumsub API对用户的身份信息进行制裁名单筛查、PEP检查和负面媒体监控。

### 2.2 前置条件

**必须完成的认证：**
1. ✅ KYC个人认证（已通过）
2. ✅ KYC补充信息（已通过）

**可用的数据来源：**
- 姓名（名字、中间名、姓氏）
- 出生日期
- 国籍
- 出生国家/地区
- 出生省份/州
- 出生地
- 税务居住国家
- 居住地址
- 身份证件号码

### 2.3 认证流程

#### 步骤1：信息确认页

**页面元素：**
1. **标题区域**
   - 页面标题："个人AML反洗钱认证"
   - 副标题："基于已完成的KYC认证信息，进行全面的反洗钱背景调查"

2. **个人信息展示（来自KYC）**
   - 信息卡片标题："个人信息（来自KYC认证）"
   - 显示内容：
     - 姓名（First Name + Middle Name + Last Name）
     - 出生日期（Date of Birth）
     - 国籍（Nationality）
     - 出生国家（Birth Country）
     - 出生省份/州（Birth State/Province）
     - 出生地（Place of Birth）
     - 税务居住国家（Tax Residence Country）
     - 居住地址（Residential Address）
   - 样式：浅蓝色背景卡片，只读展示

3. **AML检查范围说明**
   - 信息卡片标题："AML检查范围"
   - 检查项目列表：
     - ✓ 制裁名单检查（Sanctions Screening）- 检查是否在国际制裁名单中
     - ✓ PEP检查（Politically Exposed Persons）- 检查是否为政治公众人物
     - ✓ 负面媒体检查（Adverse Media）- 检查是否有负面新闻报道
   - 样式：浅黄色背景卡片，警告色边框

4. **操作按钮**
   - 主按钮："开始AML检查"
   - 样式：蓝紫色渐变，全宽按钮
   - 提示文字："检查预计需要1-2分钟"

**交互逻辑：**
- 所有信息均为只读，不可编辑
- 点击"开始AML检查"后，直接跳转到提交成功页

**API调用时机：**
- 点击"开始AML检查"按钮时，立即调用Sumsub API的"Run AML check"端点
- 请求参数包含用户的完整个人信息
- 后台异步处理检查结果，通过webhook获取检查结果
- 用户无需等待检查完成，直接看到提交成功页

#### 步骤2：提交成功页

**页面元素：**
1. **成功图标**
   - 绿色大对勾图标

2. **标题和说明**
   - 标题："提交成功！"
   - 说明："您的个人AML认证申请已成功提交，管理员将在1-3个工作日内完成审核"

3. **信息概览卡片**
   - 卡片标题："检查信息概览"
   - 显示内容：
     - 姓名
     - 出生日期
     - 国籍
     - 检查项目："制裁名单 + PEP + 负面媒体"
     - AML检查状态："✓ 已完成"
   - 样式：浅蓝色背景卡片

4. **操作按钮**
   - 主按钮："完成"
   - 提示文字："系统将发送邮件和站内通知告知您审核结果"

**交互逻辑：**
- 点击"完成"按钮，返回首页或认证列表
- 用户无法看到具体的AML检查结果（Clear/Hit/Review）

### 2.4 国家差异化字段

根据Sumsub API的Non-Doc Verification端点，不同国家可能需要额外的特定字段：

#### 美国（USA）
**必需额外字段：**
- Social Security Number (SSN)
- Street Address
- City
- State
- Zip Code

**可选字段：**
- Driver's License Number
- State ID Number

#### 英国（United Kingdom）
**必需额外字段：**
- National Insurance Number (NIN)
- Postcode
- Address Line 1
- Town/City

**可选字段：**
- Address Line 2
- County

#### 中国（China）
**必需额外字段：**
- 身份证号码（ID Card Number）
- 省份（Province）
- 城市（City）
- 详细地址（Detailed Address）

#### 欧盟国家（EU）
**必需额外字段：**
- Tax Identification Number (TIN)
- Country of Residence
- Postal Code

#### 其他国家
- 根据Sumsub API返回的国家配置，动态请求必需字段
- 如果API未指定，使用通用字段集

### 2.5 数据字段映射

> **📌 说明：** 以下字段映射表基于Sumsub API当前版本整理，仅供参考。实际开发时，所有字段定义、数据类型、必填规则等，均以Sumsub官方API文档的最新版本为准。

#### Sumsub API字段映射表

| 我们的字段 | Sumsub API字段 | 字段类型 | 必填 | 说明 |
|-----------|---------------|---------|------|------|
| firstName | firstName | string | ✓ | 名字 |
| middleName | middleName | string | - | 中间名 |
| lastName | lastName | string | ✓ | 姓氏 |
| dateOfBirth | dob | string (YYYY-MM-DD) | ✓ | 出生日期 |
| nationality | country | string (ISO 3166-1 alpha-3) | ✓ | 国籍代码 |
| birthCountry | placeOfBirth.country | string (ISO 3166-1 alpha-3) | ✓ | 出生国家代码 |
| birthState | placeOfBirth.state | string | - | 出生省份/州 |
| birthCity | placeOfBirth.town | string | - | 出生城市 |
| taxResidenceCountry | taxResidence.country | string (ISO 3166-1 alpha-3) | ✓ | 税务居住国 |
| residentialAddress | addresses[0].street | string | ✓ | 居住地址 |
| residentialCity | addresses[0].town | string | ✓ | 居住城市 |
| residentialState | addresses[0].state | string | - | 居住州/省 |
| residentialCountry | addresses[0].country | string (ISO 3166-1 alpha-3) | ✓ | 居住国家 |
| zipCode | addresses[0].postCode | string | ✓ | 邮政编码 |

#### AML检查请求参数示例

```json
{
  "externalUserId": "user_12345",
  "info": {
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Smith",
    "dob": "1990-05-15",
    "country": "USA",
    "placeOfBirth": {
      "country": "USA",
      "state": "California",
      "town": "Los Angeles"
    },
    "taxResidence": {
      "country": "USA"
    },
    "addresses": [
      {
        "street": "1234 Main Street, Apt 567",
        "town": "Los Angeles",
        "state": "California",
        "country": "USA",
        "postCode": "90001"
      }
    ]
  },
  "type": "INDIVIDUAL"
}
```

---

## 3. 企业AML认证需求

### 3.1 功能描述

企业AML认证是在企业完成KYB认证后，进行的反洗钱背景调查。系统将通过Sumsub API对企业的注册信息、业务信息进行制裁名单筛查、PEP检查和负面媒体监控。

### 3.2 前置条件

**必须完成的认证：**
1. ✅ KYB机构认证（已通过）

**可用的数据来源（来自KYB）：**
- 公司名称
- 公司注册号/统一社会信用代码
- 注册国家/地区
- 公司类型
- 所属行业
- 税号（Tax ID）
- 注册地址
- 营业地址

### 3.3 认证流程

**UI设计原则：**
- 参考个人AML认证的UI风格和交互
- 简洁的白色背景，清晰的表单布局
- 统一的进度条、按钮、卡片样式
- 响应式设计，适配各种屏幕尺寸

#### 步骤1：首页

**页面元素：**
1. **标题区域**
   - 页面标题："企业AML反洗钱认证"
   - 副标题："根据国际反洗钱法规要求，需要对企业进行AML背景检查，确保符合监管合规要求。"

2. **说明卡片**
   - 卡片1："什么是企业AML？"
     - 背景色：浅蓝色（blue-50）
     - 左侧蓝色边框（border-l-4）
     - 内容：企业反洗钱检查将审核企业是否出现在制裁名单中，是否有政治公众人物关联，以及是否有负面媒体报道。
   
   - 卡片2："已从KYB获取的信息"
     - 背景色：浅绿色（green-50）
     - 左侧绿色边框
     - 显示内容：
       - 公司名称
       - 注册号
       - 注册国家
       - 公司类型
     - 样式：只读展示，灰色小字体

3. **流程步骤说明**
   - 步骤列表（带蓝色圆点）：
     - 1. 补充企业信息（符合美国监管要求）
     - 2. 提交AML认证申请，等待审核

4. **操作按钮**
   - 主按钮："开始认证"
   - 样式：蓝色背景（bg-blue-600），全宽，圆角
   - hover效果：bg-blue-700

**交互逻辑：**
- 点击"开始认证"后，进入补充信息页

#### 步骤2：补充信息页

**页面元素：**
1. **页面标题**
   - 主标题："请填写以下信息"
   - 副标题："这些信息符合美国监管要求，将用于AML背景检查，请如实填写"

2. **表单字段（美国企业必需字段）**

   **必填字段：**
   
   a. **雇主识别号（EIN）** ✓
   - 字段名：Employer Identification Number
   - 说明：美国国税局分配的9位数字
   - 格式：XX-XXXXXXX
   - 示例：12-3456789
   - 输入类型：text
   - 验证：必填
   
   b. **注册州（State of Incorporation）** ✓
   - 字段名：State of Incorporation
   - 说明：公司在美国的注册州
   - 输入类型：下拉选择（select）
   - 选项：全部50个州（Alabama, Alaska, Arizona... Wyoming）
   - 验证：必填
   
   c. **营业街道地址（Business Street Address）** ✓
   - 字段名：Business Street Address
   - 说明：公司实际营业的街道地址
   - 格式：完整街道地址
   - 示例：1234 Main Street, Suite 567
   - 输入类型：text
   - 验证：必填
   
   d. **城市（City）** ✓
   - 字段名：City
   - 示例：New York
   - 输入类型：text
   - 验证：必填
   
   e. **州（State）** ✓
   - 字段名：State
   - 说明：营业地址所在州
   - 输入类型：下拉选择（select）
   - 选项：全部50个州
   - 验证：必填
   
   f. **邮编（ZIP Code）** ✓
   - 字段名：ZIP Code
   - 格式：5位或9位数字
   - 示例：10001
   - 输入类型：text
   - 最大长度：10
   - 验证：必填

   **可选字段：**
   
   g. **DUNS编号（DUNS Number）** ○
   - 字段名：DUNS Number
   - 说明：邓白氏编码 - 9位数字的企业识别码
   - 格式：9位数字
   - 示例：123456789
   - 输入类型：text
   - 最大长度：9
   - 验证：可选
   
   h. **NAICS行业代码（NAICS Code）** ○
   - 字段名：NAICS Code
   - 说明：北美行业分类系统代码
   - 格式：6位数字
   - 示例：541511
   - 输入类型：text
   - 最大长度：6
   - 验证：可选

3. **AML检查范围说明**
   - 背景色：浅灰色（gray-50）
   - 圆角卡片，内边距
   - 三个检查项（带蓝色对勾图标）：
     - 制裁名单 (Sanctions) - 检查国际制裁组织名单
     - 政治公众人物 (PEP) - 检查企业关联人员
     - 负面媒体 (Adverse Media) - 不良新闻和媒体报道
   - 底部提示："系统将自动对以上所有项目进行检查"

4. **操作按钮区**
   - 返回按钮：灰色背景（bg-gray-200），左侧
   - 提交按钮："提交AML认证"，蓝色背景（bg-blue-600），右侧
   - 提交按钮状态：
     - 未填写完必填项：禁用状态（opacity-50, cursor-not-allowed）
     - 已填写完：正常状态（hover:bg-blue-700）

**表单验证规则：**
- 所有必填字段（✓标记）必须填写
- EIN格式验证：XX-XXXXXXX
- ZIP Code格式验证：5位或9位数字
- DUNS Number格式验证（如填写）：9位数字
- NAICS Code格式验证（如填写）：6位数字
- 州选择：从预定义列表中选择

**字段布局：**
- 单列布局（全宽）：EIN, State of Incorporation, Business Street Address
- 双列布局（grid-cols-2）：City + State
- 单列布局：ZIP Code, DUNS Number, NAICS Code
- 每个字段包含：标签、说明文字、输入框、示例文字

**交互逻辑：**
- 实时验证：必填字段未填写时，提交按钮禁用
- 点击"返回"：返回首页
- 点击"提交AML认证"：直接跳转到提交成功页

**API调用时机：**
- 点击"提交AML认证"按钮时，立即调用Sumsub API
- 后台异步处理检查结果
- 用户无需等待，直接看到提交成功页

#### 步骤3：提交成功页

**页面元素：**
1. **成功图标**
   - 绿色大对勾图标
   - 绿色圆形背景（bg-green-100）

2. **标题和说明**
   - 标题："提交成功"
   - 说明："您的企业AML认证信息已成功提交"

3. **下一步操作卡片**
   - 背景色：浅蓝色（blue-50）
   - 左侧蓝色边框（border-l-4）
   - 标题："下一步操作："
   - 内容："您的信息已提交至我们的合规团队。管理员将对您的企业AML认证进行审核，审核结果将通过邮件或站内通知发送给您。"

4. **信息概览卡片**
   - 白色背景，灰色边框（border-2）
   - 标题："提交信息"
   - 显示内容：
     - 公司名称：[来自KYB]
     - EIN：[用户填写]
     - 注册州：[用户填写]
     - 提交时间：[系统生成]
     - 申请ID：AML-ERP-XXXXXX（随机生成）
     - 审核状态：待审核（黄色标签）

5. **审核说明卡片**
   - 背景色：浅灰色（gray-50）
   - 标题："审核说明"
   - 列表项（带绿色对勾）：
     - 系统将在后台进行AML背景检查（制裁名单、PEP、负面媒体）
     - 管理员将在1-3个工作日内完成审核
     - 审核结果会通过邮件和站内通知发送给您
     - 认证通过后有效期为365天

6. **操作按钮**
   - 主按钮："完成"
   - 样式：蓝色背景（bg-blue-600），全宽
   - 点击后：返回首页并重置表单

**交互逻辑：**
- 点击"完成"按钮：返回首页，清空表单数据

### 3.4 国家差异化要求

根据Sumsub API的Business Verification端点，不同国家的企业验证要求：

#### 美国（USA）

**必需字段（用户需补充填写）：**

1. **Employer Identification Number (EIN)** - 雇主识别号
   - 格式：XX-XXXXXXX（9位数字）
   - 说明：美国国税局分配的企业税号
   - 示例：12-3456789

2. **State of Incorporation** - 注册州
   - 格式：2位州代码
   - 说明：公司在美国的法律注册州
   - 选项：50个州的下拉列表（AL, AK, AZ... WY）
   - 示例：DE（Delaware）, CA（California）

3. **Business Street Address** - 营业街道地址
   - 格式：完整街道地址
   - 说明：公司实际营业的街道地址
   - 示例：1234 Main Street, Suite 567

4. **City** - 城市
   - 格式：文本
   - 说明：营业地址所在城市
   - 示例：New York, Los Angeles

5. **State** - 州
   - 格式：2位州代码
   - 说明：营业地址所在州
   - 选项：50个州的下拉列表
   - 示例：NY（New York）, TX（Texas）

6. **ZIP Code** - 邮编
   - 格式：5位或9位数字
   - 说明：美国邮政编码
   - 示例：10001, 90001-1234

**可选字段：**

1. **DUNS Number** - DUNS编号
   - 格式：9位数字
   - 说明：邓白氏数据通用编号系统（Data Universal Numbering System）
   - 示例：123456789

2. **NAICS Code** - NAICS行业代码
   - 格式：6位数字
   - 说明：北美行业分类系统代码（North American Industry Classification System）
   - 示例：541511（自定义计算机编程服务）

#### 英国（United Kingdom）
**必需额外字段：**
- Company Registration Number (CRN)
- Registered Office Address
- Company Type (e.g., Limited, PLC)

**可选字段：**
- VAT Number
- SIC Code

#### 中国（China）
**必需额外字段：**
- 统一社会信用代码（Unified Social Credit Code）
- 注册省份（Province）
- 注册城市（City）
- 法定代表人姓名（Legal Representative Name）

#### 欧盟国家（EU）
**必需额外字段：**
- VAT Number
- Company Registration Number
- LEI Code（如适用）

#### 新加坡（Singapore）
**必需额外字段：**
- Unique Entity Number (UEN)
- Business Registration Number

### 3.5 数据字段映射

> **📌 说明：** 以下字段映射表基于Sumsub API当前版本整理，仅供参考。实际开发时，所有字段定义、数据类型、必填规则、国家差异化要求等，均以Sumsub官方API文档的最新版本为准。不同国家的企业认证字段可能有较大差异，请在集成时特别注意。

#### Sumsub API企业字段映射表

**基础字段（来自KYB）：**

| 我们的字段 | Sumsub API字段 | 字段类型 | 必填 | 说明 |
|-----------|---------------|---------|------|------|
| companyName | companyName | string | ✓ | 公司名称 |
| registrationNumber | registrationNumber | string | ✓ | 注册号 |
| registrationCountry | country | string (ISO 3166-1 alpha-3) | ✓ | 注册国家代码 |
| companyType | legalForm | string | ✓ | 公司法律形式 |
| industry | industry | string | - | 所属行业 |

**美国企业补充字段（用户填写）：**

| 我们的字段 | Sumsub API字段 | 字段类型 | 必填 | 说明 |
|-----------|---------------|---------|------|------|
| ein | taxId | string | ✓ | EIN（雇主识别号），格式：XX-XXXXXXX |
| stateOfIncorporation | incorporationState | string | ✓ | 注册州（2位州代码） |
| businessStreetAddress | businessAddress.street | string | ✓ | 营业街道地址 |
| city | businessAddress.town | string | ✓ | 城市 |
| state | businessAddress.state | string | ✓ | 州（2位州代码） |
| zipCode | businessAddress.postCode | string | ✓ | 邮编（5位或9位） |
| dunsNumber | dunsNumber | string | - | DUNS编号（9位数字） |
| naicsCode | naicsCode | string | - | NAICS行业代码（6位数字） |

#### AML检查请求参数示例（美国企业）

```json
{
  "externalUserId": "company_12345",
  "companyInfo": {
    "companyName": "Tech Innovations Inc.",
    "registrationNumber": "123456789",
    "country": "USA",
    "legalForm": "LLC",
    "industry": "TECHNOLOGY",
    "taxId": "12-3456789",
    "incorporationState": "DE",
    "incorporationDate": "2020-03-15",
    "businessAddress": {
      "street": "1234 Main Street, Suite 567",
      "town": "New York",
      "state": "NY",
      "country": "USA",
      "postCode": "10001"
    },
    "dunsNumber": "123456789",
    "naicsCode": "541511"
  },
  "type": "COMPANY"
}
```

**字段说明：**
- `taxId`: EIN（雇主识别号）
- `incorporationState`: 注册州代码（DE = Delaware）
- `businessAddress`: 营业地址
- `state`: 营业地址所在州代码（NY = New York）
- `postCode`: ZIP Code（美国邮编）
- `dunsNumber`: 可选，邓白氏编码
- `naicsCode`: 可选，北美行业分类代码

---

## 4. Sumsub API集成要求

> **⚠️ 重要提示：API以官方文档为准**
>
> 本章节列出的所有API端点、请求参数、响应格式、错误代码等内容，均基于Sumsub API当前版本整理。在实际开发集成时：
>
> - **接口定义**：请以Sumsub官方API文档为最终标准
> - **版本更新**：注意关注Sumsub API的版本更新和字段变更
> - **错误处理**：参考官方文档的错误代码表进行完整的错误处理
> - **认证方式**：按照官方文档要求配置API密钥和签名
> - **Webhook配置**：按照官方文档配置回调地址和验证机制
>
> **官方文档：** https://docs.sumsub.com/reference/about-sumsub-api

### 4.1 API端点说明

#### 4.1.1 创建申请人（Create Applicant）

**端点：** `POST /resources/applicants`

**用途：** 在Sumsub系统中创建个人或企业申请人记录

**请求参数：**
- `externalUserId`: 我们系统的用户ID（唯一标识）
- `type`: "INDIVIDUAL"（个人）或 "COMPANY"（企业）
- `info`: 个人或企业信息对象

**响应：**
- `id`: Sumsub系统中的申请人ID
- `createdAt`: 创建时间
- `review`: 审核信息

#### 4.1.2 运行AML检查（Run AML Check）

**端点：** `POST /resources/applicants/{applicantId}/status/amlCheck`

**用途：** 对已创建的申请人执行AML背景调查

**请求参数：**
- `applicantId`: Sumsub申请人ID
- 无请求体（使用已存储的申请人信息）

**响应：**
- `checkId`: 检查任务ID
- `status`: 检查状态（pending, completed）

#### 4.1.3 获取AML检查结果（Get AML Case Data）

**端点：** `GET /resources/applicants/{applicantId}/amlCheck`

**用途：** 获取AML检查的详细结果

**响应结构：**
```json
{
  "status": "clear|hit|review",
  "checks": [
    {
      "type": "SANCTIONS",
      "status": "clear|hit",
      "matches": []
    },
    {
      "type": "PEP",
      "status": "clear|hit",
      "matches": []
    },
    {
      "type": "ADVERSE_MEDIA",
      "status": "clear|hit",
      "matches": []
    }
  ],
  "completedAt": "2025-11-05T10:30:00Z"
}
```

### 4.2 检查类型

Sumsub支持的AML检查类型：

#### 4.2.1 制裁名单检查（SANCTIONS）

**检查内容：**
- OFAC (美国财政部外国资产控制办公室)
- EU Sanctions List (欧盟制裁名单)
- UN Sanctions List (联合国制裁名单)
- HM Treasury (英国财政部制裁名单)
- 其他国际制裁数据库

**匹配逻辑：**
- 姓名/企业名称完全匹配或模糊匹配
- 出生日期匹配
- 国籍/注册国匹配
- 地址匹配

#### 4.2.2 PEP检查（POLITICALLY EXPOSED PERSONS）

**检查内容：**
- 政治公众人物（政府官员、议员等）
- PEP的家庭成员
- PEP的密切关联人
- 企业的实际控制人是否为PEP

**风险等级：**
- High Risk: 当前在职的高级政治人物
- Medium Risk: 已卸任但不足2年的政治人物
- Low Risk: 卸任超过2年的政治人物

#### 4.2.3 负面媒体检查（ADVERSE MEDIA）

**检查内容：**
- 金融犯罪（欺诈、洗钱、贪污）
- 暴力犯罪
- 恐怖主义关联
- 网络犯罪
- 人权侵犯
- 环境犯罪

**数据源：**
- 国际新闻媒体
- 监管机构公告
- 法院判决记录
- 执法机构通报

### 4.3 API调用流程

#### 4.3.1 个人AML检查流程

```
1. 用户点击"开始AML检查"
   ↓
2. 前端立即跳转到"提交成功"页面
   ↓
3. 后端异步处理：
   a. 调用 POST /resources/applicants
      - 创建或更新Sumsub申请人
   b. 调用 POST /resources/applicants/{id}/status/amlCheck
      - 启动AML检查
   ↓
4. 后台通过Webhook接收检查结果
   ↓
5. 后端调用 GET /resources/applicants/{id}/amlCheck
   - 获取详细检查结果
   ↓
6. 后端将结果存储到数据库，更新状态为PENDING
   ↓
7. 发送通知给管理员进行审核
   ↓
8. 用户通过邮件/站内通知获知审核结果

注：用户提交后无需等待，检查在后台异步进行
```

#### 4.3.2 企业AML检查流程

（与个人流程相同，但type参数为"COMPANY"，使用企业信息字段）

#### 4.3.3 Webhook配置

**推荐使用Webhook而不是轮询**

**Webhook URL配置：**
- URL: `https://your-domain.com/api/sumsub/webhook`
- Method: POST
- Content-Type: application/json

**Webhook事件类型：**
- `applicantReviewed`: 申请人审核完成
- `applicantPending`: 申请人状态变为待审核
- `applicantOnHold`: 申请人被暂停

**Webhook Payload示例：**
```json
{
  "applicantId": "5f7d...",
  "inspectionId": "5f7d...",
  "correlationId": "req-...",
  "externalUserId": "user_12345",
  "type": "applicantReviewed",
  "reviewStatus": "completed",
  "reviewResult": {
    "reviewAnswer": "GREEN"
  },
  "createdAt": "2025-11-05 10:30:00"
}
```

---

## 5. 审核状态管理

### 5.1 状态定义

| 状态代码 | 状态名称 | 说明 | 用户可见 | 管理员可见 |
|---------|---------|------|---------|-----------|
| NOT_STARTED | 未开始 | 用户尚未启动AML检查 | ✓ | ✓ |
| CHECKING | 检查中 | Sumsub API正在后台执行AML检查 | ✗ | ✓ |
| PENDING | 待审核 | 用户已提交，等待管理员审核结果 | ✓ | ✓ |
| APPROVED | 已通过 | 管理员审核通过，无风险 | ✓ | ✓ |
| REJECTED | 已驳回 | 发现高风险，驳回申请 | ✓ | ✓ |
| UNDER_REVIEW | 需补充 | 检查结果不明确，需用户补充材料 | ✓ | ✓ |
| EXPIRED | 已过期 | AML认证已过期（365天有效期） | ✓ | ✓ |

**说明：**
- CHECKING状态仅在后台存在，用户提交后立即看到"提交成功"，实际状态为PENDING
- 后台异步进行AML检查，完成后更新为PENDING等待管理员审核

### 5.2 状态流转

```
NOT_STARTED (未开始)
    ↓ [用户点击"开始AML检查"]
PENDING (待审核) 
    ↑ [后台：CHECKING状态，对用户不可见]
    ↓ [管理员审核]
    ├─→ [Clear结果 + 管理员确认] → APPROVED (已通过)
    ├─→ [Hit结果 + 管理员驳回] → REJECTED (已驳回)
    └─→ [Review结果] → UNDER_REVIEW (需补充)
        ↓ [用户补充材料后]
        └─→ PENDING (重新提交，后台重新检查)

APPROVED (已通过)
    ↓ [365天后]
EXPIRED (已过期)
    ↓ [用户重新申请]
PENDING (待审核)
```

**用户视角的状态流转：**
```
NOT_STARTED → 提交后立即显示 → PENDING → APPROVED/REJECTED/UNDER_REVIEW
                                   ↓
                         (后台异步进行CHECKING)
```

### 5.3 状态展示

#### 5.3.1 用户端展示

**CHECKING（检查中）**
- ❌ **用户不可见**
- 此状态仅在后台系统中存在
- 用户提交后直接显示PENDING状态

**PENDING（待审核）**
- 图标：时钟图标
- 文字："待管理员审核"
- 颜色：黄色
- 说明："您的AML认证申请已提交，管理员将在1-3个工作日内审核"
- 备注：此时后台可能正在进行CHECKING，也可能已完成检查等待人工审核

**APPROVED（已通过）**
- 图标：绿色对勾
- 文字："AML认证已通过"
- 颜色：绿色
- 说明："您已通过反洗钱认证，有效期至 [日期]"
- 显示：通过时间、有效期

**REJECTED（已驳回）**
- 图标：红色叉号
- 文字："AML认证未通过"
- 颜色：红色
- 说明："很抱歉，您的申请未通过审核"
- 显示：驳回原因（管理员填写）
- 操作：无重新申请按钮（永久驳回）

**UNDER_REVIEW（需补充）**
- 图标：黄色感叹号
- 文字："需要补充材料"
- 颜色：橙色
- 说明："检查结果需进一步确认，请补充以下材料"
- 显示：补充要求列表
- 操作："查看要求"按钮

**EXPIRED（已过期）**
- 图标：灰色时钟
- 文字："AML认证已过期"
- 颜色：灰色
- 说明："您的AML认证已过期，请重新进行认证"
- 操作："重新认证"按钮

---

## 6. 检查结果处理

### 6.1 Clear（无风险）

**定义：** 所有AML检查均未发现匹配项，申请人/企业无风险记录

**Sumsub返回结果：**
```json
{
  "status": "clear",
  "checks": [
    {"type": "SANCTIONS", "status": "clear", "matches": []},
    {"type": "PEP", "status": "clear", "matches": []},
    {"type": "ADVERSE_MEDIA", "status": "clear", "matches": []}
  ]
}
```

**处理逻辑：**
1. 后端接收到Clear结果
2. 自动将认证状态更新为"PENDING"
3. 发送通知给管理员进行最终确认
4. 管理员可快速批准（推荐自动审批）

**推荐操作：**
- 低风险用户：自动审批通过
- 高额交易用户：人工复核后通过

### 6.2 Hit（命中风险）

**定义：** 在一个或多个检查中发现匹配项，存在潜在风险

**Sumsub返回结果示例：**
```json
{
  "status": "hit",
  "checks": [
    {
      "type": "SANCTIONS",
      "status": "hit",
      "matches": [
        {
          "matchType": "NAME",
          "matchScore": 95,
          "source": "OFAC",
          "details": {
            "listName": "SDN List",
            "addedDate": "2020-01-15",
            "reason": "Narcotics Trafficking"
          }
        }
      ]
    },
    {"type": "PEP", "status": "clear", "matches": []},
    {"type": "ADVERSE_MEDIA", "status": "clear", "matches": []}
  ]
}
```

**处理逻辑：**
1. 后端接收到Hit结果
2. 将认证状态更新为"PENDING"
3. 立即发送高优先级通知给管理员
4. 在后台管理界面突出显示
5. 管理员必须人工审核
6. 根据匹配详情决定：
   - 误报：批准通过
   - 真实风险：驳回申请

**匹配分数说明：**
- 90-100分：高度匹配，需重点关注
- 70-89分：中度匹配，需仔细审核
- 50-69分：低度匹配，可能是误报

### 6.3 Review（需人工审核）

**定义：** 检查结果不明确，需要进一步人工判断

**Sumsub返回结果示例：**
```json
{
  "status": "review",
  "checks": [
    {"type": "SANCTIONS", "status": "clear", "matches": []},
    {
      "type": "PEP",
      "status": "review",
      "matches": [
        {
          "matchType": "NAME",
          "matchScore": 75,
          "source": "WorldCheck",
          "details": {
            "position": "Former Minister",
            "country": "Example Country",
            "endDate": "2018-06-30"
          }
        }
      ]
    },
    {"type": "ADVERSE_MEDIA", "status": "clear", "matches": []}
  ]
}
```

**处理逻辑：**
1. 后端接收到Review结果
2. 将认证状态更新为"UNDER_REVIEW"
3. 通知管理员审核
4. 管理员可以：
   - 要求用户补充材料（如声明文件）
   - 直接批准（如PEP已卸任超过规定期限）
   - 驳回申请

**常见Review场景：**
- 姓名部分匹配但无其他确认信息
- PEP已卸任但时间不足
- 负面媒体报道年代久远或不严重
- 地址/出生日期不匹配但姓名匹配

---

## 7. 通知机制

### 7.1 通知渠道

所有通知通过以下渠道发送：
1. **邮件通知**（Email）
2. **站内通知**（In-App Notification）

### 7.2 通知场景

#### 7.2.1 用户端通知

| 触发事件 | 通知时机 | 邮件标题 | 站内通知标题 | 内容 |
|---------|---------|---------|-------------|------|
| 提交成功 | 用户提交后 | 【确认】您的AML认证已提交 | AML认证已提交 | 您的AML反洗钱认证申请已成功提交，我们将在后台进行检查，管理员将在1-3个工作日内完成审核。 |
| 认证通过 | 管理员批准后 | 【通知】您的AML认证已通过 | AML认证已通过 | 恭喜！您已通过AML反洗钱认证，有效期至[日期]。 |
| 认证驳回 | 管理员驳回后 | 【重要】您的AML认证未通过审核 | AML认证未通过 | 很抱歉，您的AML认证申请未通过审核。驳回原因：[原因]。 |
| 需要补充材料 | 管理员标记后 | 【行动】您的AML认证需要补充材料 | 需要补充材料 | 您的AML认证需要补充以下材料：[材料清单]，请及时提供。 |
| 过期前30天提醒 | 有效期前30天 | 【提醒】您的AML认证即将过期 | AML认证即将过期 | 您的AML认证将在30天后过期（[日期]），请及时重新认证。 |
| 过期前7天提醒 | 有效期前7天 | 【紧急】您的AML认证将在7天后过期 | AML认证即将过期 | 您的AML认证将在7天后过期（[日期]），请尽快重新认证。 |
| 过期当天通知 | 过期当天 | 【通知】您的AML认证已过期 | AML认证已过期 | 您的AML认证已于今日过期，请立即重新认证以继续使用服务。 |

#### 7.2.2 管理员端通知

| 触发事件 | 通知时机 | 通知标题 | 优先级 |
|---------|---------|---------|--------|
| 新的AML检查完成 | 检查完成后 | 新的AML认证申请待审核 | 普通 |
| Hit结果 | 发现风险匹配 | ⚠️ 高风险AML检查结果 | 高 |
| Review结果 | 需人工判断 | AML检查需要人工审核 | 中 |
| 用户补充材料完成 | 材料提交后 | 用户已补充AML认证材料 | 普通 |

### 7.3 通知内容模板

#### 7.3.1 用户通知模板

**认证通过邮件模板：**
```
尊敬的 [用户姓名]，

恭喜！您的AML反洗钱认证已通过审核。

认证信息：
- 认证类型：个人/企业AML认证
- 通过时间：[时间]
- 有效期至：[日期]

您现在可以继续使用平台的全部功能。

注意：AML认证有效期为365天，到期前我们会提前提醒您重新认证。

如有任何问题，请联系客服。

此致
[平台名称]
```

**需要补充材料邮件模板：**
```
尊敬的 [用户姓名]，

您的AML反洗钱认证需要补充以下材料：

补充要求：
[具体要求内容]

请在7个工作日内提供所需材料，否则您的申请将被自动驳回。

如有任何问题，请联系客服。

此致
[平台名称]
```

#### 7.3.2 管理员通知模板

**高风险结果通知：**
```
⚠️ 高风险AML检查结果

用户信息：
- 用户ID：[ID]
- 姓名/企业：[名称]
- 国籍/注册国：[国家]

风险类型：[SANCTIONS/PEP/ADVERSE_MEDIA]
匹配分数：[分数]
匹配来源：[数据源]

详细信息：
[匹配详情]

请立即审核此申请。

查看详情：[链接]
```

---

## 8. 后台管理功能

### 8.1 AML审核列表页

**页面功能：**
1. **筛选器**
   - 认证类型：个人/企业
   - 状态：全部/待审核/已通过/已驳回/需补充
   - 检查结果：Clear/Hit/Review
   - 风险等级：高/中/低
   - 提交时间范围
   - 国籍/注册国

2. **列表字段**
   - 用户ID/企业ID
   - 姓名/企业名称
   - 国籍/注册国
   - 提交时间
   - 检查结果（Clear/Hit/Review）
   - 当前状态
   - 操作按钮：查看详情

3. **批量操作**
   - 批量审批（仅Clear结果）
   - 批量导出

### 8.2 AML详情审核页

**页面布局：**

#### 8.2.1 用户/企业基本信息卡片

**个人AML：**
- 姓名（完整）
- 出生日期
- 国籍
- 出生地信息
- 税务居住国
- 居住地址
- 提交时间

**企业AML：**
- 公司名称
- 注册号
- 注册国家
- 公司类型
- 所属行业
- 税号
- 注册地址
- 提交时间

#### 8.2.2 AML检查结果卡片

**总体结果：**
- 检查状态：Clear / Hit / Review
- 完成时间
- Sumsub申请人ID
- 检查ID

**详细检查结果（三个子卡片）：**

**1. 制裁名单检查（SANCTIONS）**
- 检查状态：Clear / Hit
- 匹配数量：[数字]
- 如有匹配，显示：
  - 匹配姓名/企业名
  - 匹配分数
  - 名单来源（OFAC/EU/UN等）
  - 列入原因
  - 列入日期
  - 详细链接

**2. PEP检查（POLITICALLY EXPOSED PERSONS）**
- 检查状态：Clear / Hit / Review
- 匹配数量：[数字]
- 如有匹配，显示：
  - 匹配姓名
  - 匹配分数
  - 职位/头衔
  - 所属国家/组织
  - 在职时间
  - 卸任时间（如适用）
  - 关系类型（本人/家庭成员/关联人）

**3. 负面媒体检查（ADVERSE MEDIA）**
- 检查状态：Clear / Hit / Review
- 匹配数量：[数字]
- 如有匹配，显示：
  - 新闻标题
  - 新闻来源
  - 发布日期
  - 关键词（金融犯罪/暴力/恐怖主义等）
  - 严重程度（高/中/低）
  - 新闻链接

#### 8.2.3 审核操作区

**操作按钮：**

1. **批准通过**
   - 按钮文字："批准通过"
   - 颜色：绿色
   - 点击后弹窗：
     - 标题："确认批准AML认证？"
     - 说明："通过后，用户将获得365天有效期的AML认证"
     - 输入框：审核备注（可选）
     - 确认按钮、取消按钮

2. **驳回申请**
   - 按钮文字："驳回申请"
   - 颜色：红色
   - 点击后弹窗：
     - 标题："确认驳回AML认证？"
     - 说明："驳回后，用户将无法重新申请（除非解除限制）"
     - 输入框：驳回原因（必填）
     - 常用原因选择：
       - ☑ 在国际制裁名单中
       - ☑ PEP高风险且无法排除
       - ☑ 存在严重负面媒体记录
       - ☑ 提供虚假信息
       - ☑ 其他（请填写）
     - 确认按钮、取消按钮

3. **要求补充材料**
   - 按钮文字："要求补充"
   - 颜色：橙色
   - 点击后弹窗：
     - 标题："要求用户补充材料"
     - 输入框：补充要求（必填）
     - 常用要求选择：
       - ☑ 提供PEP关系声明文件
       - ☑ 提供负面媒体事件说明
       - ☑ 提供资金来源证明
       - ☑ 提供身份证明的补充文件
       - ☑ 其他（请填写）
     - 期限选择：7天/14天/30天
     - 确认按钮、取消按钮

4. **查看原始数据**
   - 按钮文字："查看Sumsub原始数据"
   - 颜色：灰色
   - 点击后：在新标签页打开Sumsub Dashboard对应页面

#### 8.2.4 操作日志卡片

**显示内容：**
- 时间
- 操作人
- 操作类型（提交/审核/通过/驳回/补充）
- 操作说明/备注

**示例：**
```
2025-11-05 10:30:00 | 用户 user_12345 | 提交申请 | -
2025-11-05 10:35:00 | 系统 | 检查完成 | Sumsub返回Clear结果
2025-11-05 11:00:00 | 管理员 admin_001 | 批准通过 | 无风险，正常通过
```

### 8.3 统计数据面板

**显示指标：**
1. **今日数据**
   - 新提交申请数
   - 待审核数量
   - 已审核数量
   - 通过率

2. **检查结果分布**
   - Clear数量及占比
   - Hit数量及占比
   - Review数量及占比

3. **风险分布**
   - 制裁名单命中数
   - PEP命中数
   - 负面媒体命中数

4. **国家分布**
   - Top 10国家的申请量

---

## 9. 数据安全与隐私

### 9.1 数据存储

**存储在我们系统的数据：**
- 用户/企业ID
- 提交时间
- 认证状态
- Sumsub申请人ID
- 检查结果概要（Clear/Hit/Review）
- 审核记录和备注

**不存储在我们系统的数据：**
- 详细的匹配记录（仅存储在Sumsub）
- 原始检查报告
- 第三方数据源的原始数据

### 9.2 数据传输

1. **与Sumsub通信**
   - 使用HTTPS加密传输
   - API密钥通过Header传递
   - 使用App Token进行身份验证

2. **Webhook安全**
   - 验证Webhook签名
   - 使用HTTPS接收Webhook
   - 记录所有Webhook请求日志

### 9.3 数据访问控制

**权限级别：**
1. **用户**
   - 查看自己的认证状态
   - 无法查看检查详情（Clear/Hit/Review结果）
   - 无法查看匹配记录

2. **管理员**
   - 查看所有认证申请
   - 查看完整的检查结果
   - 审批权限

3. **超级管理员**
   - 管理员的所有权限
   - 查看系统日志
   - 配置Sumsub集成参数

### 9.4 数据保留

- **活跃认证数据**：永久保留
- **已驳回记录**：保留5年
- **操作日志**：保留3年
- **通知记录**：保留1年

---

## 10. 异常处理

### 10.1 API调用失败

#### 场景1：Sumsub API超时

**错误表现：**
- API请求超过30秒未响应

**用户端处理：**
- 显示错误提示："检查服务暂时不可用，请稍后重试"
- 提供"重试"按钮
- 自动返回首页

**后台处理：**
- 记录错误日志
- 发送告警通知给技术团队
- 将认证状态保持为"NOT_STARTED"

**恢复方案：**
- 用户可重新发起检查
- 技术团队检查Sumsub服务状态

#### 场景2：API返回错误状态码

**可能的错误：**
- 401 Unauthorized：认证失败
- 403 Forbidden：权限不足
- 429 Too Many Requests：请求过于频繁
- 500 Internal Server Error：服务器错误

**处理逻辑：**
- 401/403：检查API密钥配置，通知技术团队
- 429：实施请求队列，延迟重试
- 500：记录错误，通知Sumsub支持

**用户提示：**
- "系统正在维护中，请稍后重试"
- 提供客服联系方式

#### 场景3：API返回数据格式错误

**错误表现：**
- 返回的JSON结构不符合预期
- 缺少必需字段

**处理逻辑：**
- 记录完整的响应内容
- 发送告警
- 显示通用错误提示

### 10.2 检查结果处理异常

#### 场景4：后台检查长时间未完成

**定义：**
- 用户提交后，后台检查超过10分钟仍未收到Sumsub结果

**处理逻辑：**
1. 用户提交后已显示"提交成功"页面，状态为PENDING
2. 后台每隔2分钟轮询一次Sumsub API状态
3. 超过10分钟后：
   - 记录异常日志
   - 发送告警给技术团队
   - 继续等待Webhook或轮询
   - 结果到达后更新状态并发送通知给用户

**用户体验：**
- 用户无感知，已在"提交成功"页面
- 通过邮件/站内通知告知最终审核结果
- 用户可在认证列表查看状态：显示"待审核"

#### 场景5：Webhook丢失

**定义：**
- Sumsub发送了Webhook但我们系统未收到

**预防措施：**
- 实施定时任务，每5分钟检查后台"CHECKING"状态的申请
- 检查规则：创建时间超过10分钟且状态仍为CHECKING
- 如发现长时间无更新，主动调用API获取结果

**恢复流程：**
```
定时任务检测到CHECKING状态超过10分钟
    ↓
调用 GET /resources/applicants/{id}/amlCheck
    ↓
获取最新结果并更新状态为PENDING
    ↓
通知管理员审核
```

**对用户影响：**
- 无影响，用户已看到"提交成功"
- 仅在后台完成状态同步

### 10.3 数据一致性问题

#### 场景6：状态更新失败

**错误表现：**
- Sumsub显示已完成，但我们系统状态未更新

**处理逻辑：**
1. 在关键状态更新时使用事务
2. 更新失败时回滚并重试
3. 记录详细日志

**恢复方案：**
- 管理员可手动同步状态
- 提供"强制刷新"功能

#### 场景7：重复提交

**错误表现：**
- 用户快速多次点击"开始AML检查"

**预防措施：**
1. 前端按钮防抖（1秒内只能点击一次）
2. 后端检查是否已有进行中的检查
3. 使用幂等性键（externalUserId）

**处理逻辑：**
- 如已有进行中的检查，返回现有检查ID
- 不创建重复的Sumsub申请人

### 10.4 用户操作异常

#### 场景8：提交后用户关闭页面

**处理逻辑：**
- 用户提交后即可关闭页面，不影响后台处理
- 后台检查继续异步进行
- 用户重新打开后，在认证列表中看到"待审核"状态
- 审核完成后通过邮件/站内通知告知结果

**用户体验：**
- 提交即完成，无需等待
- 随时可查看状态，不影响使用

#### 场景9：已过期后继续使用

**错误表现：**
- AML认证已过期，但用户尝试进行交易

**处理逻辑：**
- 拦截操作
- 显示提示："您的AML认证已过期，请重新认证"
- 提供"立即认证"快捷入口

---

## 11. 合规要求

### 11.1 反洗钱法规

**适用法规：**
- **美国**：Bank Secrecy Act (BSA)、USA PATRIOT Act
- **欧盟**：4AMLD、5AMLD、6AMLD
- **英国**：Money Laundering Regulations 2017
- **中国**：《反洗钱法》
- **全球**：FATF（金融行动特别工作组）建议

**核心要求：**
1. 识别和验证客户身份（CDD）
2. 持续监控客户交易
3. 制裁名单筛查
4. PEP识别
5. 可疑交易报告（STR/SAR）

### 11.2 数据保护法规

**适用法规：**
- **欧盟**：GDPR（通用数据保护条例）
- **美国**：各州隐私法（CCPA、CPRA等）
- **中国**：《个人信息保护法》

**核心要求：**
1. 数据最小化原则
2. 明确的用户同意
3. 数据访问权和删除权
4. 数据跨境传输限制
5. 数据泄露通知义务

### 11.3 检查频率要求

**个人AML：**
- 初始认证：注册后必须完成
- 定期复核：每365天一次
- 触发复核：
  - 交易行为异常
  - 风险等级提升
  - 监管要求变更

**企业AML：**
- 初始认证：注册后必须完成
- 定期复核：每365天一次
- 触发复核：
  - 企业信息重大变更（如股东变更）
  - 业务范围变更
  - 交易行为异常

### 11.4 记录保存要求

**保存期限：**
- **交易记录**：至少5年（FATF建议）
- **身份验证记录**：至少5年
- **AML检查记录**：至少5年
- **可疑交易报告**：至少5年

**记录内容：**
1. 检查时间
2. 检查结果
3. 匹配详情（如有）
4. 审核决策
5. 审核人员
6. 审核时间和理由

### 11.5 风险分类

**风险等级定义：**

**高风险：**
- 在制裁名单中
- 当前在职的PEP
- 有严重金融犯罪记录
- 高风险国家/地区

**中风险：**
- PEP家庭成员或关联人
- 已卸任PEP（不足2年）
- 有一般负面媒体记录
- 中风险国家/地区

**低风险：**
- 无任何匹配
- 已卸任PEP（超过2年）
- 低风险国家/地区

**风险管理措施：**
- **高风险**：直接驳回或加强尽职调查（EDD）
- **中风险**：要求补充材料，增强监控
- **低风险**：正常审批，常规监控

### 11.6 跨境合规

**不同地区要求：**

**美国：**
- 必须筛查OFAC制裁名单
- 需识别美国公民的全球收入

**欧盟：**
- 必须筛查EU制裁名单
- 严格的GDPR数据保护要求
- PEP范围更广（包括国际组织官员）

**中国：**
- 必须符合《反洗钱法》
- 数据本地化要求
- 人民银行监管

**Sumsub支持：**
- 自动根据国家应用相应的制裁名单
- 支持200+国家的合规要求
- 实时更新制裁名单数据

---

## 附录

### A. Sumsub API字段完整列表

#### A.1 个人信息字段

| 字段名 | API字段 | 类型 | 必填 | 示例 |
|-------|---------|------|------|------|
| 外部用户ID | externalUserId | string | ✓ | "user_12345" |
| 名字 | firstName | string | ✓ | "John" |
| 中间名 | middleName | string | - | "Michael" |
| 姓氏 | lastName | string | ✓ | "Smith" |
| 出生日期 | dob | string | ✓ | "1990-05-15" |
| 性别 | gender | string | - | "M"/"F" |
| 国籍 | country | string | ✓ | "USA" |
| 出生国家 | placeOfBirth.country | string | ✓ | "USA" |
| 出生州/省 | placeOfBirth.state | string | - | "California" |
| 出生城市 | placeOfBirth.town | string | - | "Los Angeles" |
| 税务居住国 | taxResidence.country | string | ✓ | "USA" |

#### A.2 企业信息字段（美国企业完整示例）

| 字段名 | API字段 | 类型 | 必填 | 示例 |
|-------|---------|------|------|------|
| 外部用户ID | externalUserId | string | ✓ | "company_12345" |
| 公司名称 | companyName | string | ✓ | "Tech Innovations Inc." |
| 注册号 | registrationNumber | string | ✓ | "123456789" |
| 注册国家 | country | string | ✓ | "USA" |
| 公司类型 | legalForm | string | ✓ | "LLC" |
| 行业 | industry | string | - | "TECHNOLOGY" |
| EIN（税号） | taxId | string | ✓ | "12-3456789" |
| 注册州 | incorporationState | string | ✓ | "DE" |
| 营业街道地址 | businessAddress.street | string | ✓ | "1234 Main Street, Suite 567" |
| 营业城市 | businessAddress.town | string | ✓ | "New York" |
| 营业州 | businessAddress.state | string | ✓ | "NY" |
| 营业国家 | businessAddress.country | string | ✓ | "USA" |
| 邮编 | businessAddress.postCode | string | ✓ | "10001" |
| DUNS编号 | dunsNumber | string | - | "123456789" |
| NAICS代码 | naicsCode | string | - | "541511" |
| 注册日期 | incorporationDate | string | - | "2020-03-15" |

### B. 国家代码对照表

| 国家 | ISO 3166-1 alpha-2 | ISO 3166-1 alpha-3 |
|------|-------------------|-------------------|
| 中国 | CN | CHN |
| 美国 | US | USA |
| 英国 | GB | GBR |
| 新加坡 | SG | SGP |
| 香港 | HK | HKG |
| 日本 | JP | JPN |
| 德国 | DE | DEU |
| 法国 | FR | FRA |

### C. 错误代码对照表

| 错误代码 | 说明 | 处理方式 |
|---------|------|---------|
| INVALID_PARAMETERS | 请求参数无效 | 检查参数格式 |
| APPLICANT_NOT_FOUND | 申请人不存在 | 先创建申请人 |
| CHECK_ALREADY_RUNNING | 检查已在进行中 | 等待当前检查完成 |
| INSUFFICIENT_DATA | 数据不足 | 补充必需字段 |
| RATE_LIMIT_EXCEEDED | 请求频率超限 | 实施限流 |
| SERVICE_UNAVAILABLE | 服务不可用 | 稍后重试 |

### D. 测试场景清单

#### D.1 正常流程测试

- [ ] 个人AML - Clear结果 - 通过
- [ ] 企业AML - Clear结果 - 通过
- [ ] 过期后重新认证

#### D.2 异常流程测试

- [ ] 个人AML - Hit结果 - 驳回
- [ ] 企业AML - Review结果 - 补充材料
- [ ] API超时处理
- [ ] 重复提交防护

#### D.3 国家差异测试

**个人AML：**
- [ ] 美国个人AML（含SSN）
- [ ] 中国个人AML（含身份证号）
- [ ] 英国个人AML（含NIN）

**企业AML：**
- [ ] 美国企业AML（含EIN + State of Incorporation + Business Address + ZIP Code）
- [ ] 美国企业AML（含可选字段DUNS + NAICS）
- [ ] 英国企业AML（含CRN）
- [ ] 中国企业AML（含统一社会信用代码）

#### D.4 UI/UX测试

**个人AML：**
- [ ] 首页信息展示正确（来自KYC的数据）
- [ ] 补充信息表单验证
- [ ] 提交成功页显示正确
- [ ] 进度条准确显示

**企业AML：**
- [ ] 首页信息展示正确（来自KYB的数据）
- [ ] 美国50个州下拉列表完整
- [ ] EIN格式验证（XX-XXXXXXX）
- [ ] ZIP Code格式验证（5位或9位）
- [ ] DUNS Number可选验证（9位数字）
- [ ] NAICS Code可选验证（6位数字）
- [ ] 必填字段未填写时按钮禁用
- [ ] 提交成功页信息概览正确
- [ ] 审核说明清晰展示

---

**文档版本历史：**
- V1.0 (2025-11-05)：初始版本，基于Sumsub API创建
- V1.1 (2025-11-05)：
  - 优化个人AML流程，去掉检查进度页，改为异步处理
  - 重写企业AML流程，参考个人AML的UI风格和交互
  - 添加美国企业详细字段要求（EIN、State of Incorporation、Business Address等）
  - 更新企业字段映射表和API请求示例
  - 完善测试场景清单，增加UI/UX测试项
- V1.2 (2025-11-05)：
  - 新增"1.4 重要说明"章节，明确字段定义以第三方接口为准
  - 在个人AML字段映射部分添加参考说明
  - 在企业AML字段映射部分添加参考说明（特别强调国家差异）
  - 在Sumsub API集成要求部分添加官方文档参考提示
  - 更新目录结构，包含1.4章节链接

**文档审核：**
- [ ] 产品负责人审核
- [ ] 技术负责人审核
- [ ] 合规负责人审核
- [ ] 法务审核

---

*本文档为产品需求文档，具体技术实现细节请参考技术设计文档。*

