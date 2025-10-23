# SweetNight GEO战场感知态势分析作战系统 - 开发文档

**版本**: v1.0.0  
**更新日期**: 2025-01-20  
**文档类型**: 技术开发文档

---

## 1. 系统架构总览

### 1.1 技术架构图

```
┌────────────────────────────────────────────────────────────┐
│                     前端展示层 (Frontend)                    │
│   React 18 + TypeScript + Material-UI + D3.js              │
├────────────────────────────────────────────────────────────┤
│                     API网关层 (API Gateway)                  │
│            Express/NestJS + JWT + Rate Limiting            │
├────────────────────────────────────────────────────────────┤
│                    业务逻辑层 (Business Logic)              │
│  ┌──────────────┬──────────────┬─────────────────────┐    │
│  │ 态势感知模块  │ 指挥调度模块  │ 内容生产模块        │    │
│  ├──────────────┼──────────────┼─────────────────────┤    │
│  │ 分析统计模块  │ 自动化工作流  │ 集成适配器          │    │
│  └──────────────┴──────────────┴─────────────────────┘    │
├────────────────────────────────────────────────────────────┤
│                      数据访问层 (Data Access)               │
│         Prisma ORM + Repository Pattern + Cache            │
├────────────────────────────────────────────────────────────┤
│                       数据存储层 (Storage)                   │
│  PostgreSQL │ Redis │ Neo4j │ MinIO │ ElasticSearch       │
└────────────────────────────────────────────────────────────┘
```

### 1.2 核心技术栈

| 层级 | 技术选型 | 版本要求 | 说明 |
|------|---------|---------|------|
| **前端** | React | 18.2+ | 主框架 |
| | TypeScript | 5.0+ | 类型系统 |
| | Material-UI | 5.14+ | UI组件库 |
| | D3.js | 7.8+ | 数据可视化 |
| | Redux Toolkit | 2.0+ | 状态管理 |
| | React Query | 5.0+ | 数据同步 |
| **后端** | Node.js | 20.0+ | 运行环境 |
| | NestJS | 10.0+ | 后端框架 |
| | Prisma | 5.7+ | ORM |
| | Bull | 4.11+ | 任务队列 |
| **数据库** | PostgreSQL | 15.0+ | 主数据库 |
| | Redis | 7.2+ | 缓存/队列 |
| | Neo4j | 5.15+ | 图数据库 |
| **存储** | MinIO | Latest | 对象存储 |
| **监控** | Prometheus | 2.48+ | 指标收集 |
| | Grafana | 10.2+ | 可视化 |

---

## 2. 数据库设计

### 2.1 核心数据模型

#### 2.1.1 Roadmap表 (roadmap)

```sql
CREATE TABLE roadmap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month VARCHAR(20) NOT NULL,
    prompt TEXT NOT NULL,
    p_level VARCHAR(2) CHECK (p_level IN ('P0', 'P1', 'P2', 'P3')),
    enhanced_geo_score DECIMAL(5,2) DEFAULT 0,
    quickwin_index DECIMAL(5,2) DEFAULT 0,
    geo_intent_type VARCHAR(50),
    ai_citation_eta VARCHAR(20),
    ai_citation_prob VARCHAR(10),
    content_strategy TEXT,
    geo_friendliness INTEGER CHECK (geo_friendliness BETWEEN 1 AND 5),
    content_hours_est DECIMAL(4,1),
    execution_priority INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_p_level (p_level),
    INDEX idx_month (month),
    INDEX idx_score (enhanced_geo_score DESC)
);
```

#### 2.1.2 Content Registry表 (content_registry)

```sql
CREATE TABLE content_registry (
    content_id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    content_type VARCHAR(30),
    covered_prompts TEXT[], -- PostgreSQL数组类型
    channel VARCHAR(30),
    publish_status VARCHAR(20) DEFAULT '规划中',
    publish_url TEXT,
    publish_date DATE,
    
    -- KPI指标
    kpi_ctr DECIMAL(5,2),
    kpi_views INTEGER DEFAULT 0,
    kpi_engagement DECIMAL(5,2),
    kpi_gmv DECIMAL(10,2) DEFAULT 0,
    
    -- 关联
    author_id UUID,
    reviewer_id UUID,
    
    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (publish_status),
    INDEX idx_channel (channel),
    INDEX idx_publish_date (publish_date DESC)
);
```

#### 2.1.3 Citation Tracking表 (citation_tracking)

```sql
CREATE TABLE citation_tracking (
    citation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id VARCHAR(50) REFERENCES content_registry(content_id),
    platform VARCHAR(30) NOT NULL,
    citation_url TEXT NOT NULL,
    citation_context TEXT,
    citation_strength VARCHAR(10), -- 强/中/弱
    ai_engine VARCHAR(30), -- ChatGPT/Perplexity/Gemini等
    detected_at TIMESTAMP NOT NULL,
    ai_indexed BOOLEAN DEFAULT FALSE,
    citation_score DECIMAL(5,2),
    
    INDEX idx_platform (platform),
    INDEX idx_content (content_id),
    INDEX idx_detected (detected_at DESC),
    INDEX idx_ai_engine (ai_engine)
);
```

#### 2.1.4 Performance Metrics表 (performance_metrics)

```sql
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    metric_type VARCHAR(30) NOT NULL,
    
    -- 核心指标
    ai_citation_rate DECIMAL(5,2),
    content_coverage_rate DECIMAL(5,2),
    gmv_contribution DECIMAL(10,2),
    ctr_average DECIMAL(5,2),
    
    -- 平台分布
    platform_distribution JSONB,
    
    -- P-Level分布
    p_level_performance JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(metric_date, metric_type),
    INDEX idx_date (metric_date DESC)
);
```

### 2.2 Neo4j图数据库设计

```cypher
// Prompt节点
CREATE (p:Prompt {
    id: 'prompt_id',
    text: 'best mattress for back pain',
    p_level: 'P0',
    score: 95.5
})

// Content节点
CREATE (c:Content {
    id: 'content_id',
    title: 'Ultimate Guide to Mattresses',
    type: 'blog',
    channel: 'official_blog'
})

// Citation节点
CREATE (ct:Citation {
    id: 'citation_id',
    platform: 'ChatGPT',
    url: 'citation_url',
    strength: 'strong'
})

// 关系定义
CREATE (p)-[:COVERED_BY]->(c)
CREATE (c)-[:CITED_IN]->(ct)
CREATE (p)-[:RELATES_TO {weight: 0.8}]->(p2)
```

---

## 3. API设计规范

### 3.1 RESTful API结构

```
/api/v1
├── /roadmap
│   ├── GET    /           # 获取路线图列表
│   ├── POST   /           # 创建路线图项
│   ├── GET    /:id        # 获取单个路线图项
│   ├── PUT    /:id        # 更新路线图项
│   ├── DELETE /:id        # 删除路线图项
│   └── POST   /import     # 批量导入
│
├── /content
│   ├── GET    /           # 获取内容列表
│   ├── POST   /           # 创建内容
│   ├── GET    /:id        # 获取内容详情
│   ├── PUT    /:id        # 更新内容
│   ├── POST   /:id/publish # 发布内容
│   └── GET    /coverage   # 获取覆盖率报告
│
├── /citations
│   ├── GET    /           # 获取引用列表
│   ├── POST   /track      # 追踪新引用
│   ├── GET    /metrics    # 获取引用指标
│   └── GET    /platforms  # 获取平台分布
│
├── /analytics
│   ├── GET    /dashboard  # 仪表盘数据
│   ├── GET    /kpi        # KPI指标
│   ├── GET    /trends     # 趋势分析
│   └── GET    /reports    # 生成报表
│
└── /workflow
    ├── GET    /status     # 工作流状态
    ├── POST   /trigger    # 触发工作流
    └── GET    /logs       # 工作流日志
```

### 3.2 API请求/响应示例

#### 3.2.1 获取P0优先级任务

**请求**:
```http
GET /api/v1/roadmap?p_level=P0&month=第1个月&sort=enhanced_geo_score:desc
Authorization: Bearer {token}
```

**响应**:
```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "prompt": "best cooling mattress for hot sleepers",
                "p_level": "P0",
                "enhanced_geo_score": 145.5,
                "quickwin_index": 85.2,
                "content_strategy": "深度评测+视频对比",
                "estimated_hours": 8,
                "status": "in_production"
            }
        ],
        "pagination": {
            "total": 25,
            "page": 1,
            "pageSize": 10
        }
    }
}
```

#### 3.2.2 创建内容并关联Prompt

**请求**:
```http
POST /api/v1/content
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "2024 Best Cooling Mattresses - Complete Guide",
    "content_type": "blog",
    "channel": "official_blog",
    "covered_prompts": ["prompt_001", "prompt_002"],
    "template": "FAQ-001",
    "variables": {
        "pain_point": "night sweats",
        "product": "SweetNight Breeze",
        "cta": "Shop Now with 20% Off"
    }
}
```

---

## 4. 核心模块开发指南

### 4.1 七步自动化工作流实现

```typescript
// workflow/GeoWorkflowEngine.ts
export class GeoWorkflowEngine {
    private queue: Bull.Queue;
    
    constructor(private readonly services: WorkflowServices) {
        this.queue = new Bull('geo-workflow', {
            redis: redisConfig
        });
        this.registerProcessors();
    }
    
    async executeWorkflow(): Promise<WorkflowResult> {
        const steps = [
            this.step1_roadmapIngest,
            this.step2_contentRegistryIngest,
            this.step3_promptLandscapeBuild,
            this.step4_contentIngest,
            this.step5_contentLandscapeGenerate,
            this.step6_citationTrack,
            this.step7_feedbackAnalyze
        ];
        
        for (const [index, step] of steps.entries()) {
            try {
                await this.queue.add(`step-${index + 1}`, {
                    stepName: step.name,
                    timestamp: Date.now()
                });
                
                const result = await step.call(this);
                await this.logStepResult(index + 1, result);
                
            } catch (error) {
                await this.handleStepError(index + 1, error);
                throw error;
            }
        }
    }
    
    private async step1_roadmapIngest(): Promise<StepResult> {
        // 导入路线图数据
        const csvData = await this.services.fileService.readCSV('roadmap_en.csv');
        const normalized = this.normalizeRoadmapData(csvData);
        const saved = await this.services.roadmapService.bulkCreate(normalized);
        
        return {
            success: true,
            recordsProcessed: saved.length,
            nextStep: 'content_registry_ingest'
        };
    }
    
    // ... 其他步骤实现
}
```

### 4.2 优先级计算引擎

```typescript
// services/PriorityCalculator.ts
export class PriorityCalculator {
    private readonly weights = {
        enhanced_geo_score: 0.7,
        quickwin_index: 0.3
    };
    
    calculatePLevel(item: RoadmapItem): PriorityLevel {
        const totalScore = 
            (item.enhanced_geo_score * this.weights.enhanced_geo_score) +
            (item.quickwin_index * this.weights.quickwin_index);
        
        if (totalScore >= 100) return 'P0';
        if (totalScore >= 75) return 'P1';
        if (totalScore >= 50) return 'P2';
        return 'P3';
    }
    
    calculateContentHours(geoFriendliness: number): number {
        const hoursMap = {
            5: 8,  // ★★★★★
            4: 6,  // ★★★★☆
            3: 5,  // ★★★☆☆
            2: 4,  // ★★☆☆☆
            1: 3   // ★☆☆☆☆
        };
        return hoursMap[geoFriendliness] || 4;
    }
    
    calculateAICitationProbability(probText: string): number {
        const probMap = {
            '极高': 0.9,
            '高': 0.75,
            '中': 0.5,
            '中低': 0.35,
            '低': 0.2
        };
        return probMap[probText] || 0.5;
    }
}
```

### 4.3 内容模板引擎

```typescript
// services/ContentTemplateEngine.ts
export class ContentTemplateEngine {
    private templates: Map<string, ContentTemplate>;
    
    async generateContent(
        templateId: string,
        variables: Record<string, string>
    ): Promise<string> {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }
        
        let content = template.content;
        
        // 变量替换
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value);
        }
        
        // 验证必填变量
        const missingVars = this.findMissingVariables(content);
        if (missingVars.length > 0) {
            throw new Error(`Missing variables: ${missingVars.join(', ')}`);
        }
        
        return content;
    }
    
    private findMissingVariables(content: string): string[] {
        const pattern = /{{(\w+)}}/g;
        const matches = content.match(pattern) || [];
        return matches.map(m => m.replace(/[{}]/g, ''));
    }
}
```

### 4.4 引用追踪服务

```typescript
// services/CitationTracker.ts
export class CitationTracker {
    private readonly platforms = [
        'YouTube', 'Reddit', 'Medium', 'Quora', 
        'Wiki', 'Amazon', 'Blog', 'LinkedIn'
    ];
    
    async trackCitations(): Promise<CitationReport> {
        const results: PlatformCitation[] = [];
        
        for (const platform of this.platforms) {
            const tracker = this.getTrackerForPlatform(platform);
            const citations = await tracker.findCitations();
            
            for (const citation of citations) {
                await this.saveCitation({
                    ...citation,
                    platform,
                    detectedAt: new Date(),
                    strength: this.calculateStrength(citation)
                });
            }
            
            results.push({
                platform,
                count: citations.length,
                strongCitations: citations.filter(c => 
                    this.calculateStrength(c) === 'strong'
                ).length
            });
        }
        
        return {
            totalCitations: results.reduce((sum, r) => sum + r.count, 0),
            platformBreakdown: results,
            aiIndexingRate: await this.calculateAIIndexingRate()
        };
    }
    
    private calculateStrength(citation: Citation): CitationStrength {
        // 基于位置、上下文长度、关键词密度等计算
        const factors = {
            position: citation.position < 3 ? 1.0 : 0.5,
            contextLength: citation.context.length > 100 ? 1.0 : 0.5,
            hasLink: citation.hasDirectLink ? 1.0 : 0.3
        };
        
        const score = Object.values(factors).reduce((a, b) => a + b) / 3;
        
        if (score >= 0.8) return 'strong';
        if (score >= 0.5) return 'medium';
        return 'weak';
    }
}
```

---

## 5. 前端开发指南

### 5.1 项目结构

```
src/
├── app/                    # Next.js 14 App Router
│   ├── dashboard/
│   │   ├── page.tsx       # 仪表盘页面
│   │   └── layout.tsx
│   ├── roadmap/
│   │   ├── page.tsx       # 路线图管理
│   │   └── [id]/page.tsx
│   ├── content/
│   │   ├── page.tsx       # 内容管理
│   │   └── create/page.tsx
│   └── api/               # API路由
│       └── v1/
├── components/
│   ├── charts/            # 图表组件
│   │   ├── HeatMap.tsx
│   │   ├── SankeyDiagram.tsx
│   │   └── TrendChart.tsx
│   ├── tables/            # 表格组件
│   ├── forms/             # 表单组件
│   └── layout/            # 布局组件
├── hooks/                 # 自定义Hooks
├── lib/                   # 工具库
├── services/              # API服务
├── store/                 # Redux store
└── types/                 # TypeScript类型
```

### 5.2 核心组件实现

#### 5.2.1 态势感知地图组件

```tsx
// components/charts/BattlefieldMap.tsx
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface BattlefieldMapProps {
    data: PromptLandscapeData;
    onNodeClick?: (node: PromptNode) => void;
}

export const BattlefieldMap: React.FC<BattlefieldMapProps> = ({
    data,
    onNodeClick
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    
    useEffect(() => {
        if (!svgRef.current || !data) return;
        
        const svg = d3.select(svgRef.current);
        const width = 1200;
        const height = 800;
        
        // 创建力导向图
        const simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links)
                .id((d: any) => d.id)
                .distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));
        
        // P-Level颜色映射
        const colorScale = d3.scaleOrdinal()
            .domain(['P0', 'P1', 'P2', 'P3'])
            .range(['#FF4136', '#FF851B', '#FFDC00', '#2ECC40']);
        
        // 绘制连接线
        const links = svg.selectAll('.link')
            .data(data.links)
            .enter().append('line')
            .attr('class', 'link')
            .style('stroke', '#999')
            .style('stroke-width', d => d.weight || 1);
        
        // 绘制节点
        const nodes = svg.selectAll('.node')
            .data(data.nodes)
            .enter().append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
        
        nodes.append('circle')
            .attr('r', d => Math.sqrt(d.score) * 2)
            .style('fill', d => colorScale(d.p_level))
            .on('click', (event, d) => onNodeClick?.(d));
        
        nodes.append('text')
            .text(d => d.prompt)
            .attr('dx', 12)
            .attr('dy', 4);
        
        // 更新位置
        simulation.on('tick', () => {
            links
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            nodes
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });
        
    }, [data, onNodeClick]);
    
    return (
        <svg ref={svgRef} width="100%" height="800px" />
    );
};
```

#### 5.2.2 KPI仪表盘组件

```tsx
// components/dashboard/KPIDashboard.tsx
import { Grid, Paper, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface KPICardProps {
    title: string;
    value: string | number;
    change: number;
    target?: number;
    unit?: string;
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    change,
    target,
    unit = ''
}) => {
    const isPositive = change >= 0;
    
    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="textSecondary">
                {title}
            </Typography>
            <Typography variant="h3" sx={{ my: 2 }}>
                {value}{unit}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
                {isPositive ? (
                    <TrendingUp color="success" />
                ) : (
                    <TrendingDown color="error" />
                )}
                <Typography
                    variant="body2"
                    color={isPositive ? 'success.main' : 'error.main'}
                >
                    {isPositive ? '+' : ''}{change}%
                </Typography>
                {target && (
                    <Typography variant="body2" color="textSecondary">
                        目标: {target}{unit}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export const KPIDashboard: React.FC = () => {
    const kpiData = useKPIData(); // 自定义Hook获取数据
    
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
                <KPICard
                    title="AI引用率"
                    value={kpiData.aiCitationRate}
                    unit="%"
                    change={12.5}
                    target={60}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <KPICard
                    title="内容覆盖率"
                    value={kpiData.contentCoverage}
                    unit="%"
                    change={8.3}
                    target={80}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <KPICard
                    title="月度GMV"
                    value={formatCurrency(kpiData.monthlyGMV)}
                    change={20.1}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <KPICard
                    title="平均CTR"
                    value={kpiData.averageCTR}
                    unit="%"
                    change={-2.3}
                />
            </Grid>
        </Grid>
    );
};
```

---

## 6. 集成接口开发

### 6.1 Firecrawl集成

```typescript
// integrations/FirecrawlService.ts
export class FirecrawlService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://api.firecrawl.dev/v1';
    
    async crawlForCitations(url: string): Promise<CitationData[]> {
        const response = await fetch(`${this.baseUrl}/crawl`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                patterns: ['SweetNight', 'cooling mattress', 'memory foam'],
                depth: 2,
                extractSchema: {
                    citation: {
                        selector: '.citation, .reference',
                        attributes: ['href', 'text']
                    }
                }
            })
        });
        
        const data = await response.json();
        return this.parseCitations(data);
    }
}
```

### 6.2 Neo4j图数据库集成

```typescript
// integrations/Neo4jService.ts
import neo4j from 'neo4j-driver';

export class Neo4jService {
    private driver: neo4j.Driver;
    
    constructor(config: Neo4jConfig) {
        this.driver = neo4j.driver(
            config.uri,
            neo4j.auth.basic(config.user, config.password)
        );
    }
    
    async buildPromptNetwork(prompts: Prompt[]): Promise<void> {
        const session = this.driver.session();
        
        try {
            // 创建节点
            for (const prompt of prompts) {
                await session.run(
                    `
                    MERGE (p:Prompt {id: $id})
                    SET p.text = $text,
                        p.p_level = $p_level,
                        p.score = $score
                    `,
                    {
                        id: prompt.id,
                        text: prompt.text,
                        p_level: prompt.p_level,
                        score: prompt.enhanced_geo_score
                    }
                );
            }
            
            // 创建关系
            await this.createRelationships(session, prompts);
            
        } finally {
            await session.close();
        }
    }
    
    async findContentGaps(): Promise<ContentGap[]> {
        const session = this.driver.session();
        
        try {
            const result = await session.run(
                `
                MATCH (p:Prompt)
                WHERE NOT (p)-[:COVERED_BY]->(:Content)
                AND p.p_level IN ['P0', 'P1']
                RETURN p.id as promptId, 
                       p.text as prompt,
                       p.p_level as priority
                ORDER BY p.score DESC
                LIMIT 20
                `
            );
            
            return result.records.map(record => ({
                promptId: record.get('promptId'),
                prompt: record.get('prompt'),
                priority: record.get('priority')
            }));
            
        } finally {
            await session.close();
        }
    }
}
```

---

## 7. 部署方案

### 7.1 Docker容器化

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### 7.2 Docker Compose配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/sweetnight_geo
      REDIS_URL: redis://redis:6379
      NEO4J_URI: bolt://neo4j:7687
    depends_on:
      - postgres
      - redis
      - neo4j
    
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: sweetnight_geo
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7.2-alpine
    volumes:
      - redis_data:/data
    
  neo4j:
    image: neo4j:5.15
    environment:
      NEO4J_AUTH: neo4j/password
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4j_data:/data
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
  neo4j_data:
```

### 7.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run E2E tests
        run: npm run test:e2e
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t sweetnight-geo:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push sweetnight-geo:${{ github.sha }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /app/sweetnight-geo
            docker-compose pull
            docker-compose up -d --force-recreate
            docker system prune -f
```

---

## 8. 测试策略

### 8.1 单元测试示例

```typescript
// tests/unit/PriorityCalculator.test.ts
describe('PriorityCalculator', () => {
    let calculator: PriorityCalculator;
    
    beforeEach(() => {
        calculator = new PriorityCalculator();
    });
    
    describe('calculatePLevel', () => {
        it('should return P0 for high scores', () => {
            const item = {
                enhanced_geo_score: 140,
                quickwin_index: 85
            };
            
            expect(calculator.calculatePLevel(item)).toBe('P0');
        });
        
        it('should calculate content hours based on friendliness', () => {
            expect(calculator.calculateContentHours(5)).toBe(8);
            expect(calculator.calculateContentHours(3)).toBe(5);
            expect(calculator.calculateContentHours(1)).toBe(3);
        });
    });
});
```

### 8.2 集成测试示例

```typescript
// tests/integration/workflow.test.ts
describe('GEO Workflow Integration', () => {
    let app: INestApplication;
    
    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    
    it('should complete full workflow cycle', async () => {
        // 触发工作流
        const response = await request(app.getHttpServer())
            .post('/api/v1/workflow/trigger')
            .expect(200);
        
        const workflowId = response.body.workflowId;
        
        // 等待完成
        await waitForWorkflowCompletion(workflowId);
        
        // 验证结果
        const status = await request(app.getHttpServer())
            .get(`/api/v1/workflow/status/${workflowId}`)
            .expect(200);
        
        expect(status.body.status).toBe('completed');
        expect(status.body.steps).toHaveLength(7);
    });
});
```

### 8.3 E2E测试示例

```typescript
// tests/e2e/dashboard.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
    test('should display KPI metrics', async ({ page }) => {
        await page.goto('/dashboard');
        
        // 等待数据加载
        await page.waitForSelector('[data-testid="kpi-card"]');
        
        // 验证KPI卡片
        const kpiCards = await page.$$('[data-testid="kpi-card"]');
        expect(kpiCards.length).toBe(4);
        
        // 验证引用率显示
        const citationRate = await page.textContent(
            '[data-testid="ai-citation-rate"]'
        );
        expect(citationRate).toMatch(/\d+%/);
    });
    
    test('should navigate to roadmap page', async ({ page }) => {
        await page.goto('/dashboard');
        await page.click('[data-testid="nav-roadmap"]');
        
        await expect(page).toHaveURL('/roadmap');
        await expect(page.locator('h1')).toContainText('路线图管理');
    });
});
```

---

## 9. 性能优化

### 9.1 数据库优化

```sql
-- 创建索引优化查询性能
CREATE INDEX CONCURRENTLY idx_roadmap_composite 
ON roadmap(p_level, month, enhanced_geo_score DESC);

CREATE INDEX CONCURRENTLY idx_content_search 
ON content_registry USING gin(to_tsvector('english', title || ' ' || content));

-- 分区表设计（按月分区）
CREATE TABLE citation_tracking_2024_01 PARTITION OF citation_tracking
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- 物化视图加速统计
CREATE MATERIALIZED VIEW mv_daily_metrics AS
SELECT 
    DATE(detected_at) as metric_date,
    platform,
    COUNT(*) as citation_count,
    AVG(citation_score) as avg_score
FROM citation_tracking
GROUP BY DATE(detected_at), platform;

CREATE UNIQUE INDEX ON mv_daily_metrics(metric_date, platform);

-- 定时刷新
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('refresh-metrics', '0 */6 * * *', 
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_metrics');
```

### 9.2 缓存策略

```typescript
// cache/CacheService.ts
export class CacheService {
    private redis: Redis;
    
    // 多级缓存策略
    async getWithCache<T>(
        key: string,
        fetcher: () => Promise<T>,
        options: CacheOptions = {}
    ): Promise<T> {
        // L1: 内存缓存
        const memoryCache = this.memoryCache.get(key);
        if (memoryCache) return memoryCache;
        
        // L2: Redis缓存
        const redisCache = await this.redis.get(key);
        if (redisCache) {
            const data = JSON.parse(redisCache);
            this.memoryCache.set(key, data, options.memoryTTL);
            return data;
        }
        
        // L3: 数据库
        const data = await fetcher();
        
        // 写入缓存
        await this.redis.setex(
            key,
            options.redisTTL || 3600,
            JSON.stringify(data)
        );
        this.memoryCache.set(key, data, options.memoryTTL);
        
        return data;
    }
    
    // 缓存失效策略
    async invalidate(pattern: string): Promise<void> {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
        this.memoryCache.flushAll();
    }
}
```

### 9.3 查询优化

```typescript
// repositories/RoadmapRepository.ts
export class RoadmapRepository {
    // 使用查询构建器优化复杂查询
    async findPrioritizedItems(
        filters: RoadmapFilters
    ): Promise<PaginatedResult<RoadmapItem>> {
        const query = this.prisma.roadmap.findMany({
            where: {
                AND: [
                    filters.p_level ? { p_level: filters.p_level } : {},
                    filters.month ? { month: filters.month } : {},
                    filters.minScore ? { 
                        enhanced_geo_score: { gte: filters.minScore } 
                    } : {}
                ]
            },
            include: {
                content: {
                    select: {
                        content_id: true,
                        publish_status: true,
                        kpi_gmv: true
                    }
                },
                citations: {
                    where: {
                        ai_indexed: true
                    },
                    select: {
                        platform: true,
                        citation_strength: true
                    }
                }
            },
            orderBy: [
                { p_level: 'asc' },
                { enhanced_geo_score: 'desc' }
            ],
            skip: (filters.page - 1) * filters.pageSize,
            take: filters.pageSize
        });
        
        // 并行执行count查询
        const [items, total] = await Promise.all([
            query,
            this.prisma.roadmap.count({ where: query.where })
        ]);
        
        return {
            items,
            pagination: {
                total,
                page: filters.page,
                pageSize: filters.pageSize,
                totalPages: Math.ceil(total / filters.pageSize)
            }
        };
    }
}
```

---

## 10. 安全最佳实践

### 10.1 认证与授权

```typescript
// auth/AuthService.ts
export class AuthService {
    // JWT Token生成
    generateToken(user: User): TokenPair {
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles
        };
        
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });
        
        const refreshToken = jwt.sign(
            { sub: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        
        return { accessToken, refreshToken };
    }
    
    // RBAC权限控制
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'editor')
    async updateContent(@Param('id') id: string) {
        // 只有admin和editor可以更新内容
    }
}
```

### 10.2 数据安全

```typescript
// security/DataSecurity.ts
export class DataSecurity {
    // 敏感数据加密
    encryptSensitiveData(data: string): string {
        const cipher = crypto.createCipheriv(
            'aes-256-gcm',
            Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
            crypto.randomBytes(16)
        );
        
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return encrypted;
    }
    
    // SQL注入防护
    sanitizeInput(input: string): string {
        return input
            .replace(/[^\w\s\-\.@]/gi, '') // 移除特殊字符
            .trim()
            .substring(0, 255); // 限制长度
    }
    
    // XSS防护
    sanitizeHTML(html: string): string {
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
            ALLOWED_ATTR: ['href']
        });
    }
}
```

---

## 11. 监控与日志

### 11.1 日志配置

```typescript
// logger/LoggerConfig.ts
import winston from 'winston';

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        // 控制台输出
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        // 文件输出
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

// 请求日志中间件
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });
    
    next();
};
```

### 11.2 性能监控

```typescript
// monitoring/MetricsCollector.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

export class MetricsCollector {
    private httpRequestDuration: Histogram<string>;
    private httpRequestTotal: Counter<string>;
    private activeConnections: Gauge<string>;
    
    constructor() {
        // HTTP请求持续时间
        this.httpRequestDuration = new Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status']
        });
        
        // HTTP请求总数
        this.httpRequestTotal = new Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status']
        });
        
        // 活跃连接数
        this.activeConnections = new Gauge({
            name: 'active_connections',
            help: 'Number of active connections'
        });
    }
    
    // 导出Prometheus指标
    async getMetrics(): Promise<string> {
        return register.metrics();
    }
}
```

---

## 12. 故障处理

### 12.1 错误处理机制

```typescript
// errors/ErrorHandler.ts
export class GlobalErrorHandler {
    handle(error: Error, req: Request, res: Response) {
        // 日志记录
        logger.error({
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            request: {
                url: req.url,
                method: req.method,
                body: req.body
            }
        });
        
        // 错误分类处理
        if (error instanceof ValidationError) {
            return res.status(400).json({
                error: 'Validation Error',
                details: error.details
            });
        }
        
        if (error instanceof NotFoundError) {
            return res.status(404).json({
                error: 'Resource Not Found'
            });
        }
        
        // 默认500错误
        res.status(500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' 
                ? error.message 
                : 'Something went wrong'
        });
    }
}
```

### 12.2 服务降级策略

```typescript
// resilience/CircuitBreaker.ts
export class CircuitBreaker {
    private failureCount = 0;
    private lastFailTime: Date | null = null;
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    
    async execute<T>(
        fn: () => Promise<T>,
        fallback?: () => T
    ): Promise<T> {
        // 熔断器开启，直接返回降级响应
        if (this.state === 'OPEN') {
            if (this.shouldAttemptReset()) {
                this.state = 'HALF_OPEN';
            } else if (fallback) {
                return fallback();
            } else {
                throw new Error('Service temporarily unavailable');
            }
        }
        
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            
            if (fallback) {
                return fallback();
            }
            throw error;
        }
    }
    
    private onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }
    
    private onFailure() {
        this.failureCount++;
        this.lastFailTime = new Date();
        
        if (this.failureCount >= 5) {
            this.state = 'OPEN';
        }
    }
    
    private shouldAttemptReset(): boolean {
        if (!this.lastFailTime) return false;
        
        const now = new Date();
        const diff = now.getTime() - this.lastFailTime.getTime();
        
        return diff > 30000; // 30秒后尝试恢复
    }
}
```

---

## 13. 开发规范

### 13.1 代码规范

```typescript
// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { 
            argsIgnorePattern: '^_' 
        }],
        'no-console': ['warn', { 
            allow: ['warn', 'error'] 
        }]
    }
};
```

### 13.2 Git提交规范

```bash
# commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', [
            'feat',     # 新功能
            'fix',      # Bug修复
            'docs',     # 文档更新
            'style',    # 代码格式
            'refactor', # 重构
            'test',     # 测试
            'chore',    # 构建/工具
            'perf',     # 性能优化
        ]]
    }
};
```

---

## 14. 项目启动指南

### 14.1 开发环境设置

```bash
# 1. 克隆项目
git clone https://github.com/sweetnight/geo-command-center.git
cd geo-command-center

# 2. 安装依赖
npm install

# 3. 环境配置
cp .env.example .env
# 编辑.env文件，配置数据库等连接信息

# 4. 数据库初始化
npx prisma migrate dev
npx prisma db seed

# 5. 启动开发服务器
npm run dev

# 6. 启动前端开发服务器（如果前后端分离）
cd client && npm run dev
```

### 14.2 生产部署检查清单

- [ ] 环境变量配置完整
- [ ] 数据库连接测试通过
- [ ] Redis缓存服务就绪
- [ ] Neo4j图数据库连接正常
- [ ] MinIO对象存储配置
- [ ] SSL证书配置
- [ ] 日志目录权限设置
- [ ] 备份策略配置
- [ ] 监控告警设置
- [ ] 负载均衡配置
- [ ] CDN配置（静态资源）
- [ ] 安全扫描通过

---

## 15. 附录

### 15.1 API文档示例

完整的API文档使用Swagger/OpenAPI规范，访问 `/api/docs` 查看。

### 15.2 常用命令

```bash
# 数据库操作
npm run db:migrate         # 执行数据库迁移
npm run db:seed            # 填充测试数据
npm run db:reset           # 重置数据库

# 测试
npm run test              # 运行单元测试
npm run test:e2e          # 运行E2E测试
npm run test:coverage     # 生成测试覆盖率报告

# 构建部署
npm run build            # 构建生产版本
npm run docker:build     # 构建Docker镜像
npm run docker:push      # 推送到镜像仓库

# 代码质量
npm run lint            # 代码检查
npm run format          # 代码格式化
```

### 15.3 故障排查指南

| 问题 | 可能原因 | 解决方案 |
|-----|---------|---------|
| 数据库连接失败 | 连接字符串错误 | 检查DATABASE_URL环境变量 |
| Redis连接超时 | Redis服务未启动 | 启动Redis服务 |
| API响应慢 | 缺少数据库索引 | 执行索引优化脚本 |
| 内存泄漏 | 未释放资源 | 检查事件监听器和定时器 |
| 构建失败 | 依赖版本冲突 | 清除node_modules重新安装 |

---

**文档维护说明**

本文档应与代码同步更新，每次重大功能变更都需要更新相应章节。文档版本与系统版本保持一致。

**联系方式**

- 技术支持：tech@sweetnight.com
- 项目仓库：https://github.com/sweetnight/geo-command-center
- 问题跟踪：https://github.com/sweetnight/geo-command-center/issues

---

*最后更新：2025-01-20*  
*下次评审：2025-02-20*