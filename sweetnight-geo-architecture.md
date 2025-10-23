# SweetNight GEO战场感知态势分析作战系统
## 系统架构、业务流程图、数据流程图

---

## 一、系统总体架构

### 1.1 系统架构概览

```mermaid
graph TB
    subgraph "用户接入层 User Access Layer"
        U1[内容运营团队]
        U2[SEO分析师]
        U3[产品经理]
        U4[数据分析师]
    end

    subgraph "应用服务层 Application Service Layer"
        A1[GEO飞轮控制中心]
        A2[内容生产引擎]
        A3[引用追踪系统]
        A4[KPI监控台]
        A5[智能调度器]
    end

    subgraph "核心引擎层 Core Engine Layer"
        E1[Roadmap Ingestor<br/>路线图摄取器]
        E2[Content Registry<br/>内容注册器]
        E3[Prompt Landscape Builder<br/>提示词景观构建器]
        E4[Content Ingestor<br/>内容摄取器]
        E5[Content Generator<br/>内容生成器]
        E6[Citation Tracker<br/>引用追踪器]
        E7[Feedback Analyzer<br/>反馈分析器]
    end

    subgraph "AI智能层 AI Intelligence Layer"
        AI1[LLM接口<br/>GPT/Claude]
        AI2[Neo4j GraphRAG<br/>知识图谱]
        AI3[InfraNodus<br/>文本网络分析]
        AI4[Leap GEO Writer<br/>内容生成AI]
    end

    subgraph "数据存储层 Data Storage Layer"
        D1[(Roadmap DB<br/>路线图数据库)]
        D2[(Content Registry<br/>内容注册库)]
        D3[(Citation DB<br/>引用数据库)]
        D4[(KPI Metrics<br/>KPI指标库)]
        D5[File Storage<br/>文件存储]
    end

    subgraph "外部集成层 External Integration Layer"
        EX1[YouTube API]
        EX2[Reddit API]
        EX3[Medium API]
        EX4[Quora API]
        EX5[Amazon API]
        EX6[Firecrawl爬虫]
    end

    U1 & U2 & U3 & U4 --> A1
    A1 --> A2 & A3 & A4 & A5
    A2 --> E1 & E2 & E3 & E4 & E5
    A3 --> E6
    A4 --> E7
    A5 --> E1 & E2 & E3 & E4 & E5 & E6 & E7

    E1 & E2 & E3 & E4 --> AI2
    E5 --> AI1 & AI4
    E6 --> AI3
    E7 --> AI1

    E1 --> D1
    E2 & E4 --> D2
    E6 --> D3
    E7 --> D4
    E1 & E2 & E3 & E4 & E5 --> D5

    E6 --> EX1 & EX2 & EX3 & EX4 & EX5 & EX6
```

### 1.2 技术栈架构

| 层级 | 技术组件 | 用途说明 |
|------|----------|----------|
| **前端展示** | Markdown Reports + Mermaid | 报告生成与可视化 |
| **应用服务** | Python 3.9+ | 核心业务逻辑 |
| **AI引擎** | GPT-4/Claude API | 内容生成与分析 |
| **知识图谱** | Neo4j GraphRAG | 提示词关系管理 |
| **文本分析** | InfraNodus | 语义网络分析 |
| **数据处理** | Pandas + NumPy | 数据ETL处理 |
| **爬虫服务** | Firecrawl API | 引用数据采集 |
| **文件存储** | Local FileSystem | CSV/TSV/JSON存储 |
| **监控系统** | Swinline Dashboard | KPI实时监控 |

---

## 二、核心业务流程图

### 2.1 GEO飞轮7步工作流

```mermaid
flowchart LR
    Start([月度开始]) --> S1
    
    subgraph "Phase 1: 数据摄取 Data Ingestion"
        S1[1.Roadmap Ingestor<br/>路线图摄取]
        S2[2.Content Registry<br/>内容注册]
    end
    
    subgraph "Phase 2: 策略构建 Strategy Building"
        S3[3.Prompt Landscape<br/>提示词景观构建]
        S4[4.Content Ingestor<br/>内容覆盖分析]
    end
    
    subgraph "Phase 3: 内容生产 Content Production"
        S5[5.Content Generator<br/>多渠道内容生成]
    end
    
    subgraph "Phase 4: 监控优化 Monitor & Optimize"
        S6[6.Citation Tracker<br/>引用追踪]
        S7[7.Feedback Analyzer<br/>反馈分析]
    end
    
    S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7
    S7 --> Adjust[优先级调整]
    Adjust --> S3
    
    S1 -.->|输出| B1[月度Backlog]
    S2 -.->|输出| B2[Prompt↔Content映射]
    S3 -.->|输出| B3[P0-P3层级图]
    S4 -.->|输出| B4[覆盖缺口报告]
    S5 -.->|输出| B5[7类内容资产]
    S6 -.->|输出| B6[引用状态表]
    S7 -.->|输出| B7[KPI报告]
```

### 2.2 内容优先级决策流程

```mermaid
flowchart TD
    Input[新提示词输入] --> Cal1{计算综合得分}
    
    Cal1 --> Score1[增强GEO得分<br/>权重:0.7]
    Cal1 --> Score2[快赢指数<br/>权重:0.3]
    
    Score1 & Score2 --> TotalScore[总分计算]
    
    TotalScore --> Priority{优先级判定}
    
    Priority -->|总分≥120| P0[P0:核心GEO意图]
    Priority -->|90≤总分<120| P1[P1:高价值推荐]
    Priority -->|60≤总分<90| P2[P2:长尾关键词]
    Priority -->|总分<60| P3[P3:储备关键词]
    
    P0 --> Channel1[FAQ+专家答疑+视频教程]
    P1 --> Channel2[产品对比+购买指南+评测]
    P2 --> Channel3[Blog+社区答疑]
    P3 --> Channel4[储备内容池]
    
    Channel1 & Channel2 & Channel3 & Channel4 --> Publish[发布执行]
```

### 2.3 AI引用概率映射流程

```mermaid
flowchart LR
    subgraph "引用概率评估 Citation Probability"
        CP1[极高 90%] --> Time1[1个月内]
        CP2[高 75%] --> Time2[2个月内]
        CP3[中 50%] --> Time3[3个月内]
        CP4[中低 35%] --> Time4[4-6个月]
        CP5[低 20%] --> Time5[6个月+]
    end
    
    subgraph "内容投入决策 Content Investment"
        Time1 --> Effort1[8小时/篇<br/>★★★★★]
        Time2 --> Effort2[6小时/篇<br/>★★★★☆]
        Time3 --> Effort3[5小时/篇<br/>★★★☆☆]
        Time4 --> Effort4[4小时/篇<br/>★★☆☆☆]
        Time5 --> Effort5[3小时/篇<br/>★☆☆☆☆]
    end
```

---

## 三、数据流程图

### 3.1 主数据流转图

```mermaid
graph LR
    subgraph "输入数据源 Input Sources"
        I1[roadmap_cn.tsv<br/>中文路线图]
        I2[content_inventory_cn.tsv<br/>中文内容清单]
        I3[content_registry_cn.tsv<br/>中文内容注册]
        I4[citation_sources.csv<br/>引用源]
    end
    
    subgraph "数据标准化 Normalization"
        N1[field_mapping.json<br/>字段映射]
        N2[数据清洗ETL]
        N3[编码转换UTF-8]
    end
    
    subgraph "核心数据集 Core Datasets"
        C1[roadmap_en.csv<br/>英文路线图]
        C2[content_inventory_en.csv<br/>英文内容清单]
        C3[content_registry_en.csv<br/>英文内容注册]
        C4[content_prompt_map.csv<br/>提示词映射]
    end
    
    subgraph "处理引擎 Processing"
        P1[优先级计算器]
        P2[覆盖分析器]
        P3[内容生成器]
        P4[引用追踪器]
    end
    
    subgraph "输出报告 Output Reports"
        O1[month_1_backlog.md<br/>月度待办]
        O2[coverage_report.md<br/>覆盖报告]
        O3[content_kpi_baseline.json<br/>KPI基线]
        O4[publish_sitemap.csv<br/>发布地图]
    end
    
    I1 --> N1 --> N2 --> C1
    I2 --> N1 --> N3 --> C2
    I3 --> N1 --> N3 --> C3
    
    C1 --> P1 --> O1
    C2 & C3 --> P2 --> O2
    C1 & C4 --> P3 --> O4
    I4 & C3 --> P4 --> O3
```

### 3.2 内容生成数据流

```mermaid
sequenceDiagram
    participant User as 用户
    participant System as 系统
    participant AI as AI引擎
    participant DB as 数据库
    participant Platform as 发布平台

    User->>System: 选择目标提示词
    System->>DB: 查询提示词属性
    DB-->>System: 返回P-Level, GEO Score
    
    System->>System: 判断内容渠道
    Note over System: FAQ→官网Blog<br/>评测→YouTube<br/>对比→Medium
    
    System->>AI: 请求生成内容
    Note over AI: 使用模板变量：<br/>{{pain_point}}<br/>{{product}}<br/>{{feature}}
    
    AI-->>System: 返回生成内容
    System->>DB: 保存content_id
    System->>Platform: 发布到目标平台
    Platform-->>System: 返回publish_url
    System->>DB: 更新发布状态
    
    loop 每日监控
        System->>Platform: 采集引用数据
        Platform-->>System: CTR, Views, Citations
        System->>DB: 更新KPI指标
    end
```

### 3.3 KPI监控数据流

```mermaid
flowchart TD
    subgraph "数据采集 Collection"
        DC1[YouTube Analytics API]
        DC2[Reddit Karma API]
        DC3[Medium Stats API]
        DC4[Quora Views API]
        DC5[Amazon Rankings]
        DC6[Firecrawl爬虫]
    end
    
    subgraph "指标聚合 Aggregation"
        AG1[CTR点击率]
        AG2[Views浏览量]
        AG3[Engagement互动率]
        AG4[Citations引用数]
        AG5[GMV成交额]
    end
    
    subgraph "分析处理 Analysis"
        AN1[时间序列分析]
        AN2[归因分析]
        AN3[ROI计算]
        AN4[异常检测]
    end
    
    subgraph "决策输出 Decision"
        DE1[优先级调整建议]
        DE2[内容策略优化]
        DE3[渠道分配调整]
        DE4[预算重新分配]
    end
    
    DC1 & DC2 & DC3 & DC4 & DC5 & DC6 --> AG1 & AG2 & AG3 & AG4 & AG5
    AG1 & AG2 & AG3 & AG4 & AG5 --> AN1 & AN2 & AN3 & AN4
    AN1 & AN2 & AN3 & AN4 --> DE1 & DE2 & DE3 & DE4
```

---

## 四、关键数据结构

### 4.1 Roadmap数据结构

```json
{
  "prompt": "best mattress for back pain",
  "month": "第1个月",
  "p_level": "P0",
  "enhanced_geo_score": 145,
  "quickwin_index": 0.85,
  "geo_intent_type": "Core-GEO-Intent",
  "ai_citation_eta": "1个月内",
  "ai_citation_prob": "极高",
  "content_strategy": "FAQ+专家答疑+视频教程",
  "geo_friendliness": "★★★★★",
  "content_hours_est": 8,
  "target_channels": ["官网Blog", "YouTube长讲解", "Reddit r/Mattress"],
  "expected_ctr": 3.2,
  "expected_gmv": 4500
}
```

### 4.2 Content Registry数据结构

```json
{
  "content_id": "FAQ-001",
  "covered_prompts": ["best mattress for back pain", "memory foam for back support"],
  "channel": "官网Blog",
  "publish_status": "已发布",
  "publish_url": "https://sweetnight.com/blog/best-mattress-back-pain",
  "publish_date": "2024-01-15",
  "kpi_ctr": 3.2,
  "kpi_views": 12000,
  "kpi_engagement": 0.45,
  "kpi_citations": 8,
  "kpi_gmv": 4500,
  "ai_indexing_status": "已收录",
  "last_update": "2024-02-01"
}
```

### 4.3 Citation Tracking数据结构

```json
{
  "citation_id": "CIT-2024-001",
  "source_platform": "YouTube",
  "source_url": "https://youtube.com/watch?v=xxx",
  "cited_content_id": "FAQ-001",
  "citation_type": "直接引用",
  "citation_context": "视频描述中引用",
  "discovered_date": "2024-02-10",
  "citation_status": "AI收录",
  "impact_score": 8.5,
  "attributed_prompts": ["best mattress for back pain"],
  "estimated_reach": 25000
}
```

---

## 五、系统集成架构

### 5.1 外部系统集成

```mermaid
graph TB
    subgraph "SweetNight GEO系统"
        Core[核心引擎]
    end
    
    subgraph "AI服务集成"
        AI1[OpenAI GPT-4]
        AI2[Anthropic Claude]
        AI3[Neo4j GraphRAG]
        AI4[InfraNodus]
    end
    
    subgraph "内容平台集成"
        CP1[YouTube Data API v3]
        CP2[Reddit API]
        CP3[Medium Partner API]
        CP4[Quora Partner API]
        CP5[Amazon MWS API]
    end
    
    subgraph "监控工具集成"
        MT1[Swinline Dashboard]
        MT2[Google Analytics]
        MT3[Search Console]
    end
    
    subgraph "爬虫服务"
        CR1[Firecrawl API]
        CR2[Custom Scrapers]
    end
    
    Core <--> AI1 & AI2 & AI3 & AI4
    Core <--> CP1 & CP2 & CP3 & CP4 & CP5
    Core --> MT1 & MT2 & MT3
    Core <--> CR1 & CR2
```

### 5.2 API接口设计

| API端点 | 方法 | 功能描述 | 输入参数 | 输出格式 |
|---------|------|----------|----------|----------|
| `/ingest/roadmap` | POST | 摄取月度路线图 | CSV/TSV文件 | JSON状态 |
| `/generate/backlog` | GET | 生成优先级待办 | month, p_level | Markdown |
| `/analyze/coverage` | GET | 分析内容覆盖 | prompt_list | JSON报告 |
| `/create/content` | POST | 生成内容资产 | prompt, template | 内容文本 |
| `/track/citation` | GET | 追踪引用状态 | content_id | JSON数组 |
| `/report/kpi` | GET | 获取KPI报告 | date_range | JSON/MD |

---

## 六、部署架构

### 6.1 部署拓扑图

```mermaid
graph TB
    subgraph "生产环境 Production"
        P1[主服务器<br/>8 Core/32GB]
        P2[AI处理节点<br/>GPU Enabled]
        P3[数据存储<br/>500GB SSD]
        P4[CDN<br/>全球加速]
    end
    
    subgraph "开发环境 Development"
        D1[开发服务器<br/>4 Core/16GB]
        D2[测试数据库]
        D3[Mock API]
    end
    
    subgraph "监控环境 Monitoring"
        M1[监控服务器]
        M2[日志收集]
        M3[告警系统]
    end
    
    P1 --> P2 & P3
    P1 --> P4
    P1 -.-> M1 & M2 & M3
    D1 --> D2 & D3
    D1 -.-> P1
```

### 6.2 容量规划

| 组件 | 规格要求 | 扩展性 |
|------|----------|---------|
| **应用服务器** | 8 Core CPU, 32GB RAM | 水平扩展 |
| **AI处理** | GPU T4/V100, 16GB VRAM | 按需扩展 |
| **文件存储** | 500GB SSD, RAID 1 | 可扩展至2TB |
| **数据库** | PostgreSQL 14+, 100GB | 主从复制 |
| **缓存** | Redis 6+, 8GB | 集群模式 |
| **带宽** | 100Mbps上行 | CDN加速 |

---

## 七、安全架构

### 7.1 安全层级设计

```mermaid
graph LR
    subgraph "安全边界 Security Perimeter"
        S1[WAF防火墙]
        S2[DDoS防护]
        S3[SSL/TLS加密]
    end
    
    subgraph "认证授权 Auth"
        A1[JWT Token]
        A2[RBAC权限]
        A3[API Key管理]
    end
    
    subgraph "数据安全 Data Security"
        D1[数据加密存储]
        D2[传输加密]
        D3[备份恢复]
    end
    
    subgraph "审计监控 Audit"
        AU1[操作日志]
        AU2[访问审计]
        AU3[异常检测]
    end
    
    S1 --> A1 --> D1 --> AU1
    S2 --> A2 --> D2 --> AU2
    S3 --> A3 --> D3 --> AU3
```

### 7.2 权限矩阵

| 角色 | 路线图管理 | 内容生成 | 引用追踪 | KPI查看 | 系统配置 |
|------|------------|----------|----------|---------|----------|
| **超级管理员** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **运营经理** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **内容编辑** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **数据分析师** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **访客** | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 八、性能优化架构

### 8.1 缓存策略

```mermaid
flowchart LR
    Request[用户请求] --> L1[L1缓存<br/>CDN边缘]
    L1 -->|未命中| L2[L2缓存<br/>Redis]
    L2 -->|未命中| L3[L3缓存<br/>应用内存]
    L3 -->|未命中| DB[(数据库)]
    
    DB --> L3
    L3 --> L2
    L2 --> L1
    L1 --> Response[响应用户]
    
    L1 -.->|TTL:1小时| Refresh1[刷新]
    L2 -.->|TTL:10分钟| Refresh2[刷新]
    L3 -.->|TTL:1分钟| Refresh3[刷新]
```

### 8.2 性能指标

| 指标项 | 目标值 | 监控方式 |
|--------|--------|----------|
| **API响应时间** | <200ms | P95延迟 |
| **内容生成时间** | <30秒 | 平均生成时间 |
| **引用更新延迟** | <5分钟 | 实时监控 |
| **系统可用性** | >99.9% | 健康检查 |
| **并发处理能力** | 1000 QPS | 压力测试 |

---

## 九、扩展性设计

### 9.1 微服务架构演进路径

```mermaid
graph TD
    subgraph "Phase 1: 单体架构"
        M1[单体应用]
    end
    
    subgraph "Phase 2: 服务拆分"
        S1[路线图服务]
        S2[内容服务]
        S3[引用服务]
        S4[分析服务]
    end
    
    subgraph "Phase 3: 微服务架构"
        MS1[API网关]
        MS2[服务注册]
        MS3[配置中心]
        MS4[消息队列]
    end
    
    M1 --> S1 & S2 & S3 & S4
    S1 & S2 & S3 & S4 --> MS1
    MS1 --> MS2 & MS3 & MS4
```

### 9.2 插件化扩展机制

| 扩展点 | 接口定义 | 扩展示例 |
|--------|----------|----------|
| **内容模板** | IContentTemplate | 新增Instagram模板 |
| **引用源** | ICitationSource | 集成TikTok |
| **AI引擎** | IAIProvider | 接入Gemini |
| **分析算法** | IAnalyzer | 自定义评分算法 |
| **报告格式** | IReporter | PDF导出器 |

---

## 十、灾备与恢复

### 10.1 备份策略

```mermaid
graph LR
    subgraph "备份类型"
        B1[全量备份<br/>每周日00:00]
        B2[增量备份<br/>每日02:00]
        B3[实时同步<br/>关键数据]
    end
    
    subgraph "存储位置"
        S1[本地备份]
        S2[异地备份]
        S3[云端备份]
    end
    
    subgraph "恢复机制"
        R1[快速恢复<br/>RTO<1小时]
        R2[数据恢复<br/>RPO<10分钟]
        R3[故障切换<br/>自动]
    end
    
    B1 --> S1 & S2 & S3
    B2 --> S1 & S2
    B3 --> S3
    
    S1 & S2 & S3 --> R1 & R2 & R3
```

### 10.2 故障恢复流程

| 故障级别 | 影响范围 | RTO目标 | RPO目标 | 恢复流程 |
|----------|----------|---------|---------|----------|
| **P0-严重** | 全系统宕机 | 30分钟 | 5分钟 | 自动切换备用系统 |
| **P1-重要** | 核心功能故障 | 1小时 | 10分钟 | 热备切换 |
| **P2-一般** | 部分功能异常 | 4小时 | 30分钟 | 服务降级 |
| **P3-轻微** | 性能下降 | 24小时 | 1小时 | 计划维护 |

---

## 总结

SweetNight GEO战场感知态势分析作战系统采用分层架构设计，通过7步自动化工作流实现从路线图摄取到反馈优化的完整闭环。系统集成多个AI引擎和外部平台API，支持多渠道内容生成与分发，并通过实时KPI监控和引用追踪实现数据驱动的优化决策。

### 核心优势：
- 🎯 **精准定位**：P0-P3四级优先级体系，精确匹配GEO意图
- 🚀 **高效生产**：7种内容模板，覆盖全渠道发布需求
- 📊 **数据驱动**：实时KPI监控，AI引用率追踪
- 🔄 **闭环优化**：反馈分析自动调整内容策略
- 🛡️ **稳定可靠**：完善的安全架构和灾备机制

### 下一步行动：
1. 完成核心模块开发和集成测试
2. 部署生产环境并进行性能优化
3. 接入外部平台API并验证数据流
4. 启动首月试运行并收集反馈
5. 根据KPI表现持续优化算法模型