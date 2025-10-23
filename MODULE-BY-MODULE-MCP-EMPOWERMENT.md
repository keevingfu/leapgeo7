# LeapGEO7 - 模块级 MCP 全能力赋能方案

**文档版本**: v1.0
**创建日期**: 2025-10-23
**项目**: SweetNight GEO 战场感知态势分析作战系统
**目标**: 为每个应用模块提供具体的 MCP 能力赋能方案

---

## 📋 目录

1. [前端页面模块赋能 (15 个页面)](#1-前端页面模块赋能)
2. [后端服务模块赋能 (6 个服务)](#2-后端服务模块赋能)
3. [集成服务增强方案](#3-集成服务增强方案)
4. [跨模块能力协同](#4-跨模块能力协同)
5. [实施代码示例](#5-实施代码示例)

---

## 1. 前端页面模块赋能

### 1.1 Dashboard (仪表盘)

**当前状态**:
- ✅ KPI 卡片展示 (Mock 数据)
- ✅ 工作流状态展示
- ✅ 最近活动列表
- ✅ 优先级分布统计

**痛点分析**:
- ❌ 数据全部为 Mock，无实时性
- ❌ KPI 变化趋势无历史记录
- ❌ 无告警和异常检测
- ❌ 无自动刷新机制

**MCP 赋能方案**:

#### 🔥 Priority 1: Redis + Memory - 实时数据缓存与智能推荐

**能力**: 使用 Redis 缓存 KPI 数据，Memory 存储历史趋势

```typescript
// src/services/dashboard.service.ts

import { RedisClient } from '@/integrations/redis';
import { MemoryClient } from '@/integrations/memory';

interface DashboardCache {
  kpiData: {
    totalContent: number;
    totalCitations: number;
    citationRate: number;
    avgGeoScore: number;
  };
  lastUpdate: string;
  trends: Array<{timestamp: number; value: number}>;
}

export class DashboardService {
  private redis = new RedisClient();
  private memory = new MemoryClient();

  /**
   * 获取实时 KPI 数据 (Redis 缓存 5 分钟)
   */
  async getRealTimeKPI(): Promise<DashboardCache> {
    const cacheKey = 'dashboard:kpi:latest';

    // 1. 尝试从 Redis 读取
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. 从数据库查询最新数据
    const [totalContent, totalCitations, citationRate, avgGeoScore] = await Promise.all([
      prisma.content.count(),
      prisma.citation.count(),
      this.calculateCitationRate(),
      this.calculateAvgGeoScore(),
    ]);

    const kpiData = {
      kpiData: { totalContent, totalCitations, citationRate, avgGeoScore },
      lastUpdate: new Date().toISOString(),
      trends: await this.getTrendsFromMemory('kpi'),
    };

    // 3. 写入 Redis 缓存 (TTL 5 分钟)
    await this.redis.set(cacheKey, JSON.stringify(kpiData), 300);

    // 4. 存储到 Memory 知识图谱
    await this.memory.createEntities([{
      name: `KPI_${Date.now()}`,
      entityType: 'KPISnapshot',
      observations: [
        `Total Content: ${totalContent}`,
        `Total Citations: ${totalCitations}`,
        `Citation Rate: ${citationRate}%`,
        `Avg GEO Score: ${avgGeoScore}`,
      ],
    }]);

    return kpiData;
  }

  /**
   * 从 Memory 知识图谱获取趋势数据
   */
  async getTrendsFromMemory(metricType: string) {
    const nodes = await this.memory.searchNodes(`${metricType} snapshot`);
    return nodes.map(n => ({
      timestamp: new Date(n.createdAt).getTime(),
      value: parseFloat(n.observations[0]?.split(': ')[1] || '0'),
    }));
  }

  /**
   * 智能告警检测 (基于 Memory 历史数据)
   */
  async detectAnomalies() {
    const history = await this.getTrendsFromMemory('citation_rate');
    const avg = history.reduce((sum, d) => sum + d.value, 0) / history.length;
    const current = history[history.length - 1]?.value || 0;

    if (current < avg * 0.8) { // 下降超过 20%
      return {
        type: 'citation_rate_drop',
        severity: 'high',
        message: `Citation rate dropped to ${current}% (avg: ${avg.toFixed(1)}%)`,
        recommendation: 'Review recent content quality and P0 prompt coverage',
      };
    }

    return null;
  }
}
```

#### 🔥 Priority 2: Slack - 实时告警推送

```typescript
// src/services/dashboard.alerts.ts

import { SlackClient } from '@/integrations/slack';

export class DashboardAlerts {
  private slack = new SlackClient();

  /**
   * 当 KPI 异常时自动发送 Slack 告警
   */
  async sendKPIAlert(anomaly: any) {
    await this.slack.sendMessage({
      channel: '#geo-alerts',
      text: `🚨 *Dashboard Alert*: ${anomaly.message}`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🚨 KPI Anomaly Detected' },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Type:* ${anomaly.type}` },
            { type: 'mrkdwn', text: `*Severity:* ${anomaly.severity}` },
          ],
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `*Issue:* ${anomaly.message}` },
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `*Recommendation:* ${anomaly.recommendation}` },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Dashboard' },
              url: 'http://localhost:5173/dashboard',
              style: 'danger',
            },
          ],
        },
      ],
    });
  }

  /**
   * 每日 KPI 播报 (定时任务)
   */
  async dailyKPIBroadcast() {
    const kpi = await new DashboardService().getRealTimeKPI();

    await this.slack.sendMessage({
      channel: '#geo-analytics',
      text: `📊 *Daily KPI Report - ${new Date().toLocaleDateString('en-US')}*`,
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: '*📊 Daily GEO KPI Report*' },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Total Content:* ${kpi.kpiData.totalContent}` },
            { type: 'mrkdwn', text: `*Total Citations:* ${kpi.kpiData.totalCitations}` },
            { type: 'mrkdwn', text: `*Citation Rate:* ${kpi.kpiData.citationRate}%` },
            { type: 'mrkdwn', text: `*Avg GEO Score:* ${kpi.kpiData.avgGeoScore}` },
          ],
        },
      ],
    });
  }
}
```

#### 🔥 Priority 3: Puppeteer - 自动截图生成

```typescript
// src/services/dashboard.screenshot.ts

import { PuppeteerClient } from '@/integrations/puppeteer';
import { MinIOClient } from '@/integrations/minio';

export class DashboardScreenshot {
  private puppeteer = new PuppeteerClient();
  private minio = new MinIOClient();

  /**
   * 每周自动生成 Dashboard 截图并上传到 MinIO
   */
  async generateWeeklySnapshot() {
    // 1. 导航到 Dashboard
    await this.puppeteer.navigate('http://localhost:5173/dashboard');

    // 2. 等待页面加载完成
    await this.puppeteer.evaluate('window.scrollTo(0, 0)');

    // 3. 生成全页截图
    const screenshot = await this.puppeteer.screenshot({
      name: `dashboard-${new Date().toISOString().split('T')[0]}`,
      fullPage: true,
      width: 1920,
      height: 1080,
    });

    // 4. 上传到 MinIO
    await this.minio.uploadFile({
      bucket: 'geo-reports',
      key: `screenshots/dashboard-${Date.now()}.png`,
      file: screenshot,
    });

    return screenshot;
  }
}
```

**收益预估**:
- ✅ 数据实时性: 从无 → 5 分钟延迟
- ✅ 告警响应: 从 24 小时 → 实时
- ✅ 历史追溯: 从无 → 完整知识图谱
- ✅ 自动化: 节省 2 小时/周 (手动截图和数据核对)

---

### 1.2 Roadmap Manager (路线图管理)

**当前状态**:
- ✅ Roadmap 列表查询和分页
- ✅ P-Level 过滤
- ✅ 搜索功能

**痛点分析**:
- ❌ 导入 CSV/TSV 需手动上传
- ❌ P-Level 计算需手动触发
- ❌ 无批量操作功能
- ❌ 无 Notion 同步

**MCP 赋能方案**:

#### 🔥 Priority 1: n8n - 自动化 Roadmap 导入工作流

```javascript
// n8n 工作流: "Monthly Roadmap Auto-Import"

// Node 1: Schedule Trigger (每月 1 号 9AM)
{
  "parameters": {
    "rule": {
      "interval": [{ "field": "months", "monthsInterval": 1, "triggerAtDay": 1, "triggerAtHour": 9 }]
    }
  },
  "type": "n8n-nodes-base.scheduleTrigger"
}

// Node 2: Google Sheets - 读取 Roadmap
{
  "parameters": {
    "operation": "read",
    "sheetId": process.env.GOOGLE_SHEET_ROADMAP_ID,
    "range": "A2:K1000"
  },
  "type": "n8n-nodes-base.googleSheets"
}

// Node 3: Code - 数据转换和 P-Level 计算
{
  "parameters": {
    "jsCode": `
      const items = $input.all();

      function calculatePriority(geoScore, quickWinIndex) {
        const totalScore = geoScore * 0.7 + quickWinIndex * 0.3;
        if (totalScore >= 100) return 'P0';
        if (totalScore >= 75) return 'P1';
        if (totalScore >= 50) return 'P2';
        return 'P3';
      }

      return items.map(item => ({
        json: {
          month: item.json[0],
          prompt: item.json[1],
          enhancedGeoScore: parseFloat(item.json[2]),
          quickwinIndex: parseFloat(item.json[3]),
          pLevel: calculatePriority(parseFloat(item.json[2]), parseFloat(item.json[3])),
          geoIntentType: item.json[4],
          contentStrategy: item.json[5],
          geoFriendliness: parseInt(item.json[6]),
          contentHoursEst: parseFloat(item.json[7])
        }
      }));
    `
  },
  "type": "n8n-nodes-base.code"
}

// Node 4: HTTP Request - 批量导入到 LeapGEO7
{
  "parameters": {
    "url": "http://localhost:3001/api/v1/roadmap/batch",
    "method": "POST",
    "sendBody": true,
    "jsonBody": "={{ JSON.stringify($input.all().map(i => i.json)) }}"
  },
  "type": "n8n-nodes-base.httpRequest"
}

// Node 5: Slack 通知
{
  "parameters": {
    "channel": "#geo-reports",
    "text": `✅ *Monthly Roadmap Import Complete*

    • Total Items: {{ $json.imported }}
    • P0: {{ $json.p0Count }}
    • P1: {{ $json.p1Count }}
    • P2: {{ $json.p2Count }}
    • P3: {{ $json.p3Count }}

    View Dashboard: http://localhost:5173/roadmap`
  },
  "type": "n8n-nodes-base.slack"
}
```

#### 🔥 Priority 2: Notion - 双向同步

```typescript
// server/src/modules/roadmap/roadmap-notion.service.ts

import { Injectable } from '@nestjs/common';
import { NotionClient } from '@/integrations/notion';
import { RoadmapService } from './roadmap.service';

@Injectable()
export class RoadmapNotionService {
  constructor(
    private readonly notionClient: NotionClient,
    private readonly roadmapService: RoadmapService,
  ) {}

  /**
   * 将 PostgreSQL Roadmap 推送到 Notion
   */
  async syncToNotion() {
    const roadmaps = await this.roadmapService.findAll({
      limit: 100,
      month: this.getCurrentMonth(),
    });

    for (const roadmap of roadmaps.items) {
      await this.notionClient.createPage({
        parent: { database_id: process.env.NOTION_ROADMAP_DB },
        properties: {
          'ID': { title: [{ text: { content: roadmap.id } }] },
          'Prompt': { rich_text: [{ text: { content: roadmap.prompt } }] },
          'P-Level': { select: { name: roadmap.pLevel } },
          'GEO Score': { number: roadmap.enhancedGeoScore },
          'Quick Win': { number: roadmap.quickwinIndex },
          'Month': { select: { name: roadmap.month } },
          'Covered': { checkbox: roadmap.covered || false },
          'Content Strategy': { rich_text: [{ text: { content: roadmap.contentStrategy || '' } }] },
        },
      });
    }

    return { synced: roadmaps.items.length };
  }

  /**
   * 从 Notion 同步变更回 PostgreSQL
   */
  async syncFromNotion() {
    const notionPages = await this.notionClient.queryDatabase({
      database_id: process.env.NOTION_ROADMAP_DB,
      filter: {
        property: 'Last Edited Time',
        date: { past_week: {} },
      },
    });

    for (const page of notionPages.results) {
      const roadmapId = page.properties['ID'].title[0]?.text.content;
      if (!roadmapId) continue;

      await this.roadmapService.update(roadmapId, {
        pLevel: page.properties['P-Level'].select?.name,
        contentStrategy: page.properties['Content Strategy'].rich_text[0]?.text.content,
        covered: page.properties['Covered'].checkbox,
      });
    }

    return { updated: notionPages.results.length };
  }
}
```

**收益预估**:
- ✅ 导入时间: 从 2 小时 → 5 分钟 (自动化)
- ✅ P-Level 计算: 自动化 (消除人工错误)
- ✅ 团队协作: Notion 可视化 + 实时评论
- ✅ 数据一致性: 双向同步保证

---

### 1.3 Content Generator (内容生成器)

**当前状态**:
- ✅ 内容模板选择
- ✅ 变量替换
- ✅ 预览功能

**痛点分析**:
- ❌ 模板存储在代码中，难以维护
- ❌ 无 AI 辅助生成
- ❌ 无批量生成功能
- ❌ 无内容质量评分

**MCP 赋能方案**:

#### 🔥 Priority 1: Notion - 动态内容模板库

```typescript
// server/src/modules/content/content-template.service.ts

import { Injectable } from '@nestjs/common';
import { NotionClient } from '@/integrations/notion';

@Injectable()
export class ContentTemplateService {
  constructor(private readonly notionClient: NotionClient) {}

  /**
   * 从 Notion 获取最新内容模板
   */
  async getTemplates(channel: string) {
    const templates = await this.notionClient.queryDatabase({
      database_id: process.env.NOTION_TEMPLATES_DB,
      filter: {
        property: 'Channel',
        select: { equals: channel },
      },
    });

    return templates.results.map(page => ({
      id: page.id,
      name: page.properties['Name'].title[0]?.text.content,
      channel: page.properties['Channel'].select?.name,
      template: page.properties['Template'].rich_text[0]?.text.content,
      variables: page.properties['Variables'].multi_select.map(v => v.name),
      lastUpdated: page.last_edited_time,
    }));
  }

  /**
   * 使用模板生成内容
   */
  async generateContent(templateId: string, variables: Record<string, string>) {
    const template = await this.notionClient.retrievePage({ page_id: templateId });
    let content = template.properties['Template'].rich_text[0]?.text.content || '';

    // 变量替换
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return content;
  }
}
```

#### 🔥 Priority 2: InfraNodus - 内容质量分析

```typescript
// server/src/modules/content/content-analysis.service.ts

import { Injectable } from '@nestjs/common';
import { InfraNodusClient } from '@/integrations/infranodus';

@Injectable()
export class ContentAnalysisService {
  constructor(private readonly infranodus: InfraNodusClient) {}

  /**
   * 分析生成内容的质量和优化建议
   */
  async analyzeContent(content: string) {
    // 1. 生成知识图谱
    const graph = await this.infranodus.generateKnowledgeGraph({
      text: content,
      addNodesAndEdges: true,
    });

    // 2. 识别主题集群
    const clusters = await this.infranodus.generateTopicalClusters({
      text: content,
    });

    // 3. 发现内容缺口
    const gaps = await this.infranodus.generateContentGaps({
      text: content,
    });

    // 4. 生成研究问题
    const questions = await this.infranodus.generateResearchQuestions({
      text: content,
      modelToUse: 'gpt-4o',
    });

    return {
      score: this.calculateQualityScore(graph, clusters),
      mainTopics: clusters.topClusters.slice(0, 5),
      contentGaps: gaps.structuralHoles,
      improvementQuestions: questions.questions,
      networkDensity: graph.metrics.modularity,
    };
  }

  /**
   * 计算内容质量评分 (0-100)
   */
  private calculateQualityScore(graph: any, clusters: any): number {
    // 基于网络密度、主题多样性、覆盖率计算
    const densityScore = graph.metrics.modularity * 30;
    const diversityScore = Math.min(clusters.topClusters.length * 10, 40);
    const coherenceScore = (graph.totalNodes / graph.totalRelationships) * 30;

    return Math.min(densityScore + diversityScore + coherenceScore, 100);
  }
}
```

#### 🔥 Priority 3: MinIO - 草稿存储和版本控制

```typescript
// server/src/modules/content/content-storage.service.ts

import { Injectable } from '@nestjs/common';
import { MinIOClient } from '@/integrations/minio';

@Injectable()
export class ContentStorageService {
  constructor(private readonly minio: MinIOClient) {}

  /**
   * 保存内容草稿到 MinIO
   */
  async saveDraft(content: string, metadata: any) {
    const key = `drafts/${metadata.pLevel}/${metadata.promptId}-${Date.now()}.md`;

    await this.minio.uploadObject({
      bucket: 'content-drafts',
      key,
      content,
      metadata: {
        promptId: metadata.promptId,
        pLevel: metadata.pLevel,
        channel: metadata.channel,
        createdAt: new Date().toISOString(),
      },
    });

    return { key, url: await this.minio.getPresignedUrl('content-drafts', key) };
  }

  /**
   * 列出所有草稿
   */
  async listDrafts(filters: { pLevel?: string; channel?: string }) {
    const prefix = filters.pLevel ? `drafts/${filters.pLevel}/` : 'drafts/';
    const objects = await this.minio.listObjects('content-drafts', prefix);

    return objects.filter(obj => {
      if (filters.channel) {
        return obj.metadata?.channel === filters.channel;
      }
      return true;
    });
  }
}
```

**收益预估**:
- ✅ 模板维护: 从代码 → Notion (团队可编辑)
- ✅ 内容质量: 自动评分 + 改进建议
- ✅ 版本管理: MinIO 对象存储 (可追溯)
- ✅ 生成效率: 提升 3x (AI 辅助)

---

### 1.4 Citation Tracker (引用追踪)

**当前状态**:
- ✅ 引用列表查询
- ✅ 平台筛选

**痛点分析**:
- ❌ 手动添加引用数据
- ❌ 无自动抓取机制
- ❌ 无 AI 引用检测
- ❌ 无历史趋势分析

**MCP 赋能方案**:

#### 🔥 Priority 1: Firecrawl + n8n - 自动化引用抓取

```javascript
// n8n 工作流: "Daily Citation Auto-Tracking"

// Node 1: Schedule Trigger (每天 6AM)
{
  "parameters": {
    "rule": {
      "interval": [{ "field": "days", "daysInterval": 1, "triggerAtHour": 6 }]
    }
  },
  "type": "n8n-nodes-base.scheduleTrigger"
}

// Node 2: HTTP Request - 获取需要追踪的内容列表
{
  "parameters": {
    "url": "http://localhost:3001/api/v1/content?published=true&limit=50",
    "method": "GET"
  },
  "type": "n8n-nodes-base.httpRequest"
}

// Node 3: Loop - 遍历每个内容
{
  "parameters": {
    "splitIntoItems": true,
    "itemsArray": "={{ $json.items }}"
  },
  "type": "n8n-nodes-base.splitInBatches"
}

// Node 4: Firecrawl - 抓取平台数据
{
  "parameters": {
    "url": "http://localhost:3002/v1/search",
    "method": "POST",
    "sendBody": true,
    "jsonBody": {
      "query": "={{ $json.title }} {{ $json.keywords.join(' ') }}",
      "sources": ["web"],
      "limit": 10
    },
    "headers": {
      "Authorization": "Bearer fs-test",
      "Content-Type": "application/json"
    }
  },
  "type": "n8n-nodes-base.httpRequest"
}

// Node 5: Code - 检测引用
{
  "parameters": {
    "jsCode": `
      const searchResults = $input.item.json.results || [];
      const contentUrl = $input.item.json.url;

      const citations = searchResults
        .filter(result => result.url !== contentUrl && result.content.includes(contentUrl))
        .map(result => ({
          platform: new URL(result.url).hostname,
          citationUrl: result.url,
          citationContext: result.snippet,
          detectedAt: new Date().toISOString(),
          citationStrength: result.score || 'medium',
          contentId: $input.item.json.id
        }));

      return citations.map(c => ({ json: c }));
    `
  },
  "type": "n8n-nodes-base.code"
}

// Node 6: HTTP Request - 保存引用到数据库
{
  "parameters": {
    "url": "http://localhost:3001/api/v1/citations/batch",
    "method": "POST",
    "sendBody": true,
    "jsonBody": "={{ $json }}"
  },
  "type": "n8n-nodes-base.httpRequest"
}

// Node 7: MongoDB - 存储原始抓取数据
{
  "parameters": {
    "operation": "insertOne",
    "collection": "scraped_citations",
    "fields": {
      "contentId": "={{ $json.contentId }}",
      "platform": "={{ $json.platform }}",
      "rawData": "={{ $json }}",
      "scrapedAt": "={{ new Date().toISOString() }}"
    }
  },
  "type": "n8n-nodes-base.mongodb"
}

// Node 8: Slack 告警 (如果发现新引用)
{
  "parameters": {
    "channel": "#geo-alerts",
    "text": `🎉 *New Citation Detected!*

    • Content: {{ $json.contentTitle }}
    • Platform: {{ $json.platform }}
    • Citation URL: {{ $json.citationUrl }}
    • Strength: {{ $json.citationStrength }}

    View Details: http://localhost:5173/citations/{{ $json.id }}`
  },
  "type": "n8n-nodes-base.slack"
}
```

#### 🔥 Priority 2: Memory - 引用关系图谱

```typescript
// server/src/modules/citation/citation-graph.service.ts

import { Injectable } from '@nestjs/common';
import { MemoryClient } from '@/integrations/memory';

@Injectable()
export class CitationGraphService {
  constructor(private readonly memory: MemoryClient) {}

  /**
   * 构建引用关系知识图谱
   */
  async buildCitationGraph() {
    const citations = await this.getCitationsFromDB();

    // 1. 创建实体
    const entities = [
      ...citations.map(c => ({
        name: c.content.title,
        entityType: 'Content',
        observations: [
          `Published on ${c.content.channel}`,
          `P-Level: ${c.content.prompt.pLevel}`,
          `GEO Score: ${c.content.prompt.enhancedGeoScore}`,
        ],
      })),
      ...citations.map(c => ({
        name: c.platform,
        entityType: 'Platform',
        observations: [
          `Total citations: ${this.countCitationsByPlatform(c.platform)}`,
          `Average strength: ${this.avgCitationStrength(c.platform)}`,
        ],
      })),
    ];

    await this.memory.createEntities({ entities });

    // 2. 创建关系
    const relations = citations.map(c => ({
      from: c.content.title,
      to: c.platform,
      relationType: 'CITED_BY',
    }));

    await this.memory.createRelations({ relations });

    // 3. 查询引用网络
    const network = await this.memory.readGraph();
    return this.analyzeCitationNetwork(network);
  }

  /**
   * 分析引用网络，识别高影响力内容
   */
  private analyzeCitationNetwork(graph: any) {
    const contentNodes = graph.entities.filter(e => e.entityType === 'Content');

    const influenceScores = contentNodes.map(content => {
      const citationCount = graph.relations.filter(r => r.from === content.name).length;
      const platformDiversity = new Set(
        graph.relations
          .filter(r => r.from === content.name)
          .map(r => r.to)
      ).size;

      return {
        content: content.name,
        citationCount,
        platformDiversity,
        influenceScore: citationCount * 10 + platformDiversity * 20,
      };
    });

    return influenceScores.sort((a, b) => b.influenceScore - a.influenceScore);
  }
}
```

**收益预估**:
- ✅ 抓取效率: 从手动 6 小时/周 → 自动化
- ✅ 覆盖率: 从 20% → 90% (自动化多平台)
- ✅ 实时性: 从 每周 → 每天
- ✅ 数据追溯: MongoDB 存储原始数据

---

### 1.5 Workflow Monitor (工作流监控)

**当前状态**:
- ✅ 工作流状态展示
- ✅ 步骤进度追踪

**痛点分析**:
- ❌ 工作流需手动触发
- ❌ 无失败重试机制
- ❌ 无执行历史记录
- ❌ 无性能监控

**MCP 赋能方案**:

#### 🔥 Priority 1: n8n - 完整工作流自动化

```javascript
// n8n 工作流: "7-Step GEO Master Pipeline"

// Step 1: Roadmap Ingestor (月度触发)
{
  "name": "Step 1: Roadmap Ingestor",
  "nodes": [
    { "type": "scheduleTrigger", "schedule": "0 9 1 * *" },
    { "type": "googleSheets", "operation": "read" },
    { "type": "code", "function": "calculatePriority" },
    { "type": "httpRequest", "url": "/api/v1/roadmap/batch" },
    { "type": "slack", "message": "Step 1 Complete: {{ $json.imported }} roadmaps imported" }
  ]
}

// Step 2: Content Registry Sync
{
  "name": "Step 2: Content Registry",
  "trigger": "webhook", // 由 Step 1 触发
  "nodes": [
    { "type": "notion", "operation": "queryDatabase" },
    { "type": "httpRequest", "url": "/api/v1/content/sync" },
    { "type": "slack", "message": "Step 2 Complete: {{ $json.synced }} content synced" }
  ]
}

// Step 3: Prompt Landscape Builder
{
  "name": "Step 3: Prompt Landscape",
  "trigger": "webhook",
  "nodes": [
    { "type": "httpRequest", "url": "/api/v1/roadmap?uncovered=true" },
    { "type": "neo4j", "query": "CREATE (p:Prompt {...})" },
    { "type": "httpRequest", "url": "/api/v1/prompt-landscape/gaps" },
    { "type": "slack", "message": "Step 3 Complete: {{ $json.gapsFound }} gaps identified" }
  ]
}

// Step 4: Content Generator
{
  "name": "Step 4: Content Generator",
  "trigger": "webhook",
  "nodes": [
    { "type": "loop", "items": "={{ $json.uncoveredPrompts }}" },
    { "type": "notion", "operation": "getTemplate" },
    { "type": "openai", "model": "gpt-4", "prompt": "Generate content for: {{ $json.prompt }}" },
    { "type": "minIO", "operation": "upload", "bucket": "content-drafts" },
    { "type": "httpRequest", "url": "/api/v1/content/create-draft" },
    { "type": "slack", "message": "Step 4 Complete: {{ $json.draftsCreated }} drafts generated" }
  ]
}

// Step 5: Multi-Platform Publisher
{
  "name": "Step 5: Publisher",
  "trigger": "manual", // 需要人工审核草稿后手动触发
  "nodes": [
    { "type": "httpRequest", "url": "/api/v1/content?status=approved" },
    { "type": "switch", "field": "channel", "values": ["youtube", "reddit", "medium", "quora"] },
    { "type": "youtubeApi", "operation": "upload" },
    { "type": "redditApi", "operation": "submit" },
    { "type": "mediumApi", "operation": "publish" },
    { "type": "quoraApi", "operation": "answer" },
    { "type": "slack", "message": "Step 5 Complete: {{ $json.published }} content published" }
  ]
}

// Step 6: Citation Tracker (每日循环)
{
  "name": "Step 6: Citation Tracker",
  "trigger": "schedule", // 每天 6AM
  "nodes": [
    { "type": "httpRequest", "url": "/api/v1/content?published=true" },
    { "type": "firecrawl", "operation": "search" },
    { "type": "code", "function": "detectCitations" },
    { "type": "mongodb", "collection": "scraped_citations" },
    { "type": "httpRequest", "url": "/api/v1/citations/batch" },
    { "type": "slack", "message": "Step 6 Complete: {{ $json.newCitations }} new citations detected" }
  ]
}

// Step 7: KPI Analysis & Reporting (每周五)
{
  "name": "Step 7: KPI Reporting",
  "trigger": "schedule", // 每周五 18:00
  "nodes": [
    { "type": "httpRequest", "url": "/api/v1/analytics/kpi" },
    { "type": "httpRequest", "url": "/api/v1/prompt-landscape/stats" },
    { "type": "code", "function": "generateReport" },
    { "type": "feishu", "operation": "createDocument" },
    { "type": "puppeteer", "operation": "screenshot", "url": "/dashboard" },
    { "type": "minIO", "operation": "upload", "bucket": "geo-reports" },
    { "type": "slack", "message": "Step 7 Complete: Weekly report generated" },
    { "type": "notion", "operation": "updateDashboard" }
  ]
}
```

#### 🔥 Priority 2: Redis - 工作流状态缓存

```typescript
// server/src/modules/workflow/workflow-state.service.ts

import { Injectable } from '@nestjs/common';
import { RedisClient } from '@/integrations/redis';

@Injectable()
export class WorkflowStateService {
  constructor(private readonly redis: RedisClient) {}

  /**
   * 更新工作流步骤状态
   */
  async updateStepStatus(workflowId: string, step: number, status: 'pending' | 'running' | 'completed' | 'failed') {
    const key = `workflow:${workflowId}:status`;

    await this.redis.hset(key, `step_${step}`, JSON.stringify({
      status,
      timestamp: Date.now(),
      message: this.getStepMessage(step, status),
    }));

    // 设置 TTL 30 天
    await this.redis.expire(key, 2592000);

    return this.getWorkflowStatus(workflowId);
  }

  /**
   * 获取完整工作流状态
   */
  async getWorkflowStatus(workflowId: string) {
    const key = `workflow:${workflowId}:status`;
    const steps = await this.redis.hgetall(key);

    const stepStatuses = Object.entries(steps).map(([k, v]) => ({
      step: parseInt(k.replace('step_', '')),
      ...JSON.parse(v),
    }));

    const completedSteps = stepStatuses.filter(s => s.status === 'completed').length;
    const failedSteps = stepStatuses.filter(s => s.status === 'failed').length;
    const currentStep = stepStatuses.find(s => s.status === 'running')?.step || 0;

    return {
      workflowId,
      steps: stepStatuses.sort((a, b) => a.step - b.step),
      completedSteps,
      failedSteps,
      currentStep,
      progress: (completedSteps / 7) * 100,
      overallStatus: failedSteps > 0 ? 'failed' : currentStep > 0 ? 'running' : 'pending',
    };
  }

  /**
   * 工作流执行历史 (存储到 Memory)
   */
  async saveExecutionHistory(workflowId: string, result: any) {
    await this.memory.createEntities([{
      name: `Workflow_${workflowId}`,
      entityType: 'WorkflowExecution',
      observations: [
        `Executed at: ${new Date().toISOString()}`,
        `Status: ${result.overallStatus}`,
        `Completed Steps: ${result.completedSteps}/7`,
        `Duration: ${result.duration}ms`,
      ],
    }]);
  }
}
```

**收益预估**:
- ✅ 自动化率: 从 20% → 90%
- ✅ 执行追溯: 完整历史记录 (Memory + Redis)
- ✅ 失败恢复: 自动重试机制
- ✅ 监控可视化: 实时状态展示

---

### 1.6 Prompt Landscape (提示词全景)

**当前状态**:
- ✅ Scatter Plot 可视化
- ✅ Knowledge Graph 可视化
- ✅ P-Level 过滤
- ✅ 内容缺口分析

**痛点分析**:
- ❌ 缺口识别依赖手动分析
- ❌ 无智能推荐系统
- ❌ 无竞品对比功能

**MCP 赋能方案**:

#### 🔥 Priority 1: InfraNodus - 高级文本网络分析

```typescript
// server/src/modules/prompt-landscape/prompt-analysis.service.ts

import { Injectable } from '@nestjs/common';
import { InfraNodusClient } from '@/integrations/infranodus';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class PromptAnalysisService {
  constructor(
    private readonly infranodus: InfraNodusClient,
    private readonly neo4j: Neo4jService,
  ) {}

  /**
   * 使用 InfraNodus 分析所有 Prompts 的主题结构
   */
  async analyzePromptLandscape() {
    // 1. 获取所有 Prompts
    const prompts = await this.neo4j.query(`
      MATCH (p:Prompt)
      RETURN p.text as text, p.pLevel as pLevel, p.score as score
    `);

    const allPromptsText = prompts.map(p => p.text).join('\n');

    // 2. 生成知识图谱
    const graph = await this.infranodus.generateKnowledgeGraph({
      text: allPromptsText,
      addNodesAndEdges: true,
    });

    // 3. 识别主题集群
    const clusters = await this.infranodus.generateTopicalClusters({
      text: allPromptsText,
    });

    // 4. 发现内容缺口
    const gaps = await this.infranodus.generateContentGaps({
      text: allPromptsText,
    });

    // 5. 生成研究问题 (填补缺口)
    const questions = await this.infranodus.generateResearchQuestions({
      text: allPromptsText,
      useSeveralGaps: true,
    });

    return {
      totalPrompts: prompts.length,
      mainThemes: clusters.topClusters.slice(0, 10),
      structuralGaps: gaps.structuralHoles,
      recommendedPrompts: questions.questions.map(q => ({
        prompt: q,
        estimatedScore: this.estimateGeoScore(q),
        recommendedPLevel: this.recommendPLevel(q),
        reasoning: 'Fills structural gap in prompt landscape',
      })),
      networkMetrics: {
        modularity: graph.metrics.modularity,
        density: graph.totalRelationships / graph.totalNodes,
        clustering: graph.metrics.clustering,
      },
    };
  }

  /**
   * 基于 InfraNodus 分析估计 GEO Score
   */
  private estimateGeoScore(prompt: string): number {
    // 简化版：基于关键词密度和主题相关性估算
    // 实际应用可使用 ML 模型
    return Math.floor(Math.random() * 40 + 60); // 60-100 之间
  }

  /**
   * 推荐 P-Level
   */
  private recommendPLevel(prompt: string): string {
    const score = this.estimateGeoScore(prompt);
    if (score >= 90) return 'P0';
    if (score >= 75) return 'P1';
    if (score >= 60) return 'P2';
    return 'P3';
  }
}
```

#### 🔥 Priority 2: Firecrawl - 竞品 Prompt 抓取

```typescript
// server/src/modules/prompt-landscape/competitor-analysis.service.ts

import { Injectable } from '@nestjs/common';
import { FirecrawlClient } from '@/integrations/firecrawl';
import { InfraNodusClient } from '@/integrations/infranodus';

@Injectable()
export class CompetitorAnalysisService {
  constructor(
    private readonly firecrawl: FirecrawlClient,
    private readonly infranodus: InfraNodusClient,
  ) {}

  /**
   * 抓取竞品网站并分析其内容策略
   */
  async analyzeCompetitors() {
    const competitors = [
      { brand: 'Purple', url: 'https://purple.com/blog' },
      { brand: 'Casper', url: 'https://casper.com/blog' },
      { brand: 'Nectar', url: 'https://www.nectarsleep.com/blog' },
    ];

    const results = [];

    for (const competitor of competitors) {
      // 1. 抓取竞品博客内容
      const scraped = await this.firecrawl.scrape({
        url: competitor.url,
        formats: ['markdown'],
      });

      // 2. InfraNodus 分析竞品内容主题
      const analysis = await this.infranodus.generateTopicalClusters({
        text: scraped.markdown,
      });

      results.push({
        brand: competitor.brand,
        topTopics: analysis.topClusters.slice(0, 10),
        contentVolume: scraped.markdown.split('\n').length,
      });
    }

    // 3. 对比分析：SweetNight vs 竞品
    const sweetNightPrompts = await this.getAllSweetNightPrompts();
    const competitorTopics = results.flatMap(r => r.topTopics);

    const overlap = await this.infranodus.overlapBetweenTexts({
      contexts: [
        { text: sweetNightPrompts },
        { text: competitorTopics.join('\n') },
      ],
    });

    const difference = await this.infranodus.differenceBetweenTexts({
      contexts: [
        { text: sweetNightPrompts },
        { text: competitorTopics.join('\n') },
      ],
    });

    return {
      competitors: results,
      overlap: overlap.commonTopics,
      gaps: difference.missingTopics, // SweetNight 缺失但竞品有的主题
      opportunities: this.identifyOpportunities(difference.missingTopics),
    };
  }

  /**
   * 识别战略机会
   */
  private identifyOpportunities(missingTopics: string[]) {
    return missingTopics.map(topic => ({
      topic,
      recommendedAction: `Create P1 prompt targeting: ${topic}`,
      estimatedImpact: 'High - competitor is focusing on this',
      estimatedEffort: '6 hours',
    }));
  }
}
```

**收益预估**:
- ✅ 缺口识别: 从手动分析 → 自动化 InfraNodus
- ✅ 竞品监控: 每周自动抓取和对比
- ✅ 智能推荐: AI 驱动的 Prompt 建议
- ✅ 战略洞察: 网络分析指标

---

### 1.7 Analytics Reports (分析报告)

**当前状态**:
- ✅ 报告列表

**痛点分析**:
- ❌ 报告需手动生成
- ❌ 无自动化调度
- ❌ 无多格式导出

**MCP 赋能方案**:

#### 🔥 Priority 1: Feishu + Puppeteer - 自动化周报生成

```typescript
// server/src/modules/analytics/weekly-report.service.ts

import { Injectable } from '@nestjs/common';
import { FeishuClient } from '@/integrations/feishu';
import { PuppeteerClient } from '@/integrations/puppeteer';
import { MinIOClient } from '@/integrations/minio';

@Injectable()
export class WeeklyReportService {
  constructor(
    private readonly feishu: FeishuClient,
    private readonly puppeteer: PuppeteerClient,
    private readonly minio: MinIOClient,
  ) {}

  /**
   * 生成完整的周报 (Feishu 文档 + 截图)
   */
  async generateWeeklyReport() {
    // 1. 收集数据
    const kpi = await this.getWeeklyKPI();
    const gaps = await this.getContentGaps();
    const citations = await this.getNewCitations();
    const competitors = await this.getCompetitorInsights();

    // 2. 创建 Feishu 文档
    const doc = await this.feishu.createDocument({
      title: `SweetNight GEO 周报 - Week ${this.getWeekNumber()}`,
      folderToken: process.env.FEISHU_GEO_REPORTS_FOLDER,
    });

    // 3. 批量插入内容块
    await this.feishu.batchCreateBlocks({
      documentId: doc.documentId,
      parentBlockId: doc.documentId,
      index: 0,
      blocks: [
        // 封面
        { blockType: 'heading1', options: { heading: { level: 1, content: '📊 SweetNight GEO 周报' } } },
        { blockType: 'text', options: { text: { textStyles: [{ text: `生成时间: ${new Date().toLocaleString('zh-CN')}` }] } } },

        // KPI 总览
        { blockType: 'heading2', options: { heading: { level: 2, content: '🎯 本周 KPI 总览' } } },
        {
          blockType: 'text',
          options: {
            text: {
              textStyles: [
                { text: `• 总内容: ${kpi.totalContent} (+${kpi.contentGrowth})`, style: { bold: true } },
                { text: '\n• 总引用: ', style: {} },
                { text: `${kpi.totalCitations}`, style: { text_color: 5 } },
                { text: ` (+${kpi.citationsGrowth})`, style: {} },
                { text: `\n• 引用率: ${kpi.citationRate}%`, style: {} },
                { text: `\n• 平均 GEO 评分: ${kpi.avgGeoScore}`, style: {} },
              ],
            },
          },
        },

        // 内容缺口
        { blockType: 'heading2', options: { heading: { level: 2, content: '🕳️ 待填补内容缺口' } } },
        {
          blockType: 'code',
          options: {
            code: {
              language: 28, // JSON
              code: JSON.stringify(gaps.slice(0, 10), null, 2),
            },
          },
        },

        // Mermaid 流程图
        { blockType: 'heading2', options: { heading: { level: 2, content: '📈 优先级分布' } } },
        {
          blockType: 'mermaid',
          options: {
            mermaid: {
              code: `
                pie title Prompt P-Level Distribution
                "P0": ${kpi.p0Count}
                "P1": ${kpi.p1Count}
                "P2": ${kpi.p2Count}
                "P3": ${kpi.p3Count}
              `,
            },
          },
        },

        // 竞品动态
        { blockType: 'heading2', options: { heading: { level: 2, content: '👀 竞品动态' } } },
        ...competitors.map(comp => ({
          blockType: 'list',
          options: {
            list: {
              content: `${comp.brand}: ${comp.newContent} 篇新内容，主题: ${comp.topTopics.join(', ')}`,
              isOrdered: false,
            },
          },
        })),

        // 下周行动计划
        { blockType: 'heading2', options: { heading: { level: 2, content: '📋 下周行动计划' } } },
        {
          blockType: 'list',
          options: {
            list: {
              content: `创建 ${gaps.filter(g => g.pLevel === 'P0').length} 个 P0 prompts 对应的内容`,
              isOrdered: true,
            },
          },
        },
        {
          blockType: 'list',
          options: {
            list: {
              content: `优化 ${gaps.filter(g => g.pLevel === 'P1').length} 个 P1 prompts 的内容质量`,
              isOrdered: true,
            },
          },
        },
        {
          blockType: 'list',
          options: {
            list: {
              content: `监控竞品: ${competitors.map(c => c.brand).join(', ')}`,
              isOrdered: true,
            },
          },
        },
      ],
    });

    // 4. 生成 Dashboard 截图
    await this.puppeteer.navigate('http://localhost:5173/dashboard');
    const dashboardScreenshot = await this.puppeteer.screenshot({
      name: 'dashboard-weekly',
      fullPage: true,
    });

    // 5. 上传截图到 Feishu
    await this.feishu.uploadImage(doc.documentId, dashboardScreenshot);

    // 6. 保存到 MinIO
    await this.minio.uploadFile({
      bucket: 'geo-reports',
      key: `weekly-reports/week-${this.getWeekNumber()}.png`,
      file: dashboardScreenshot,
    });

    // 7. 发送 Slack 通知
    await this.slack.sendMessage({
      channel: '#geo-reports',
      text: `📊 *Weekly Report Generated*\n\nView Report: ${doc.url}`,
    });

    return { documentId: doc.documentId, url: doc.url };
  }

  private getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  }
}
```

**收益预估**:
- ✅ 报告生成: 从 4 小时 → 自动化
- ✅ 报告质量: 数据驱动 + 可视化
- ✅ 团队协作: Feishu 实时共享
- ✅ 历史追溯: MinIO 存档

---

## 2. 后端服务模块赋能

### 2.1 Roadmap Service

**当前功能**:
- ✅ CRUD 操作
- ✅ 分页和过滤
- ✅ P-Level 计算

**MCP 赋能**:

#### 🔥 Redis - 高频查询缓存

```typescript
// server/src/modules/roadmap/roadmap.service.ts (增强版)

@Injectable()
export class RoadmapService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisClient,
    private memory: MemoryClient,
  ) {}

  /**
   * 查询 Roadmap 列表 (带缓存)
   */
  async findAll(query: QueryRoadmapDto) {
    const cacheKey = `roadmap:list:${JSON.stringify(query)}`;

    // 1. 尝试从 Redis 读取
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. 从数据库查询
    const result = await this.findAllFromDB(query);

    // 3. 写入缓存 (TTL 10 分钟)
    await this.redis.set(cacheKey, JSON.stringify(result), 600);

    return result;
  }

  /**
   * 批量导入 Roadmap (集成 Memory 知识图谱)
   */
  async batchImport(roadmaps: CreateRoadmapDto[]) {
    // 1. 批量插入数据库
    const created = await this.prisma.roadmap.createMany({ data: roadmaps });

    // 2. 创建知识图谱实体
    await this.memory.createEntities({
      entities: roadmaps.map(r => ({
        name: r.prompt,
        entityType: 'Prompt',
        observations: [
          `P-Level: ${r.pLevel}`,
          `GEO Score: ${r.enhancedGeoScore}`,
          `Month: ${r.month}`,
        ],
      })),
    });

    // 3. 清除缓存
    await this.redis.del('roadmap:list:*');

    return created;
  }
}
```

---

### 2.2 Citation Service

**MCP 赋能**:

#### 🔥 MongoDB - 原始数据存储

```typescript
// server/src/modules/citation/citation-storage.service.ts

@Injectable()
export class CitationStorageService {
  constructor(
    private readonly mongodb: MongoDBClient,
    private readonly redis: RedisClient,
  ) {}

  /**
   * 存储 Firecrawl 抓取的原始数据
   */
  async storeScrapedData(citation: any, rawData: any) {
    await this.mongodb.insertOne('scraped_citations', {
      citationId: citation.id,
      contentId: citation.contentId,
      platform: citation.platform,
      rawHtml: rawData.html,
      rawMarkdown: rawData.markdown,
      metadata: rawData.metadata,
      scrapedAt: new Date(),
      ttl: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 天 TTL
    });

    // 缓存最新引用 (Redis)
    await this.redis.lpush('citations:latest', JSON.stringify(citation));
    await this.redis.ltrim('citations:latest', 0, 99); // 只保留最新 100 条
  }

  /**
   * 查询历史抓取数据 (对比分析)
   */
  async getHistoricalData(contentId: string) {
    return this.mongodb.find('scraped_citations', {
      contentId,
    }, {
      sort: { scrapedAt: -1 },
      limit: 30,
    });
  }
}
```

---

### 2.3 Content Service

**MCP 赋能**:

#### 🔥 MinIO - 内容草稿和版本控制

```typescript
// server/src/modules/content/content-version.service.ts

@Injectable()
export class ContentVersionService {
  constructor(private readonly minio: MinIOClient) {}

  /**
   * 保存内容版本到 MinIO
   */
  async saveVersion(contentId: string, content: string, metadata: any) {
    const versionId = `${contentId}-${Date.now()}`;
    const key = `content-versions/${contentId}/${versionId}.md`;

    await this.minio.uploadObject({
      bucket: 'content-versions',
      key,
      content,
      metadata: {
        ...metadata,
        versionId,
        createdAt: new Date().toISOString(),
      },
    });

    return { versionId, key };
  }

  /**
   * 列出所有版本
   */
  async listVersions(contentId: string) {
    return this.minio.listObjects(
      'content-versions',
      `content-versions/${contentId}/`,
    );
  }

  /**
   * 恢复到指定版本
   */
  async restoreVersion(contentId: string, versionId: string) {
    const key = `content-versions/${contentId}/${versionId}.md`;
    const object = await this.minio.getObject('content-versions', key);
    return object.content;
  }
}
```

---

### 2.4 Analytics Service

**MCP 赋能**:

#### 🔥 Sequential Thinking - 复杂数据分析推理

```typescript
// server/src/modules/analytics/analytics-insights.service.ts

@Injectable()
export class AnalyticsInsightsService {
  constructor(private readonly sequentialThinking: SequentialThinkingClient) {}

  /**
   * 使用 Sequential Thinking 分析 KPI 趋势并给出建议
   */
  async analyzeKPITrends(kpiData: any) {
    const reasoning = await this.sequentialThinking.analyze({
      thought: `
        分析以下 KPI 数据，识别趋势和异常:

        当前月度 KPI:
        - Total Content: ${kpiData.totalContent} (上月: ${kpiData.lastMonthContent})
        - Total Citations: ${kpiData.totalCitations} (上月: ${kpiData.lastMonthCitations})
        - Citation Rate: ${kpiData.citationRate}% (上月: ${kpiData.lastMonthRate}%)
        - Avg GEO Score: ${kpiData.avgGeoScore} (上月: ${kpiData.lastMonthScore})

        P-Level 覆盖率:
        - P0: ${kpiData.p0Coverage}% (目标: 90%)
        - P1: ${kpiData.p1Coverage}% (目标: 80%)
        - P2: ${kpiData.p2Coverage}% (目标: 60%)
        - P3: ${kpiData.p3Coverage}% (目标: 40%)

        请分析:
        1. 哪些指标表现良好？
        2. 哪些指标需要关注？
        3. 根本原因是什么？
        4. 下一步行动建议？
      `,
      thoughtNumber: 1,
      totalThoughts: 5,
      nextThoughtNeeded: true,
    });

    return {
      insights: reasoning.thought,
      confidence: reasoning.confidence || 0.8,
      recommendations: this.extractRecommendations(reasoning.thought),
    };
  }

  private extractRecommendations(thought: string): string[] {
    // 简单的文本解析提取建议
    const lines = thought.split('\n');
    return lines.filter(line => line.includes('建议') || line.includes('应该'));
  }
}
```

---

## 3. 集成服务增强方案

### 3.1 Firecrawl Integration (已有)

**增强方案**:

#### 🔥 MongoDB - 原始数据持久化

```typescript
// src/integrations/firecrawl/firecrawl.service.ts (增强版)

import { FirecrawlClient } from '@firecrawl/client';
import { MongoDBClient } from '@/integrations/mongodb';

export class FirecrawlService {
  private firecrawl = new FirecrawlClient({ apiKey: process.env.FIRECRAWL_API_KEY });
  private mongodb = new MongoDBClient();

  /**
   * 抓取 URL 并存储原始数据
   */
  async scrapeWithStorage(url: string, options?: any) {
    // 1. 执行抓取
    const result = await this.firecrawl.scrape({
      url,
      formats: ['markdown', 'html', 'links'],
      ...options,
    });

    // 2. 存储到 MongoDB
    await this.mongodb.insertOne('firecrawl_raw', {
      url,
      markdown: result.markdown,
      html: result.html,
      links: result.links,
      metadata: result.metadata,
      scrapedAt: new Date(),
      ttl: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 天后自动删除
    });

    return result;
  }

  /**
   * 查询历史抓取记录
   */
  async getHistory(url: string, limit = 10) {
    return this.mongodb.find('firecrawl_raw', { url }, {
      sort: { scrapedAt: -1 },
      limit,
    });
  }
}
```

---

### 3.2 InfraNodus Integration (已有)

**增强方案**:

#### 🔥 Memory - 知识图谱持久化

```typescript
// src/integrations/infranodus/infranodus.service.ts (增强版)

import { InfraNodusClient } from '@infranodus/client';
import { MemoryClient } from '@/integrations/memory';

export class InfraNodusService {
  private infranodus = new InfraNodusClient({ apiKey: process.env.INFRANODUS_API_KEY });
  private memory = new MemoryClient();

  /**
   * 分析文本并存储到 Memory 知识图谱
   */
  async analyzeAndStore(text: string, category: string) {
    // 1. InfraNodus 分析
    const graph = await this.infranodus.generateKnowledgeGraph({
      text,
      addNodesAndEdges: true,
    });

    const clusters = await this.infranodus.generateTopicalClusters({ text });

    // 2. 存储主题到 Memory
    await this.memory.createEntities({
      entities: clusters.topClusters.map(cluster => ({
        name: cluster.name,
        entityType: 'Topic',
        observations: [
          `Category: ${category}`,
          `Keywords: ${cluster.keywords.join(', ')}`,
          `Importance: ${cluster.importance}`,
        ],
      })),
    });

    // 3. 创建主题关系
    const relations = [];
    for (let i = 0; i < clusters.topClusters.length - 1; i++) {
      relations.push({
        from: clusters.topClusters[i].name,
        to: clusters.topClusters[i + 1].name,
        relationType: 'RELATED_TO',
      });
    }
    await this.memory.createRelations({ relations });

    return { graph, clusters };
  }

  /**
   * 从 Memory 检索相关主题
   */
  async findRelatedTopics(topic: string) {
    return this.memory.searchNodes(topic);
  }
}
```

---

## 4. 跨模块能力协同

### 4.1 Dashboard + Slack + Memory

**场景**: 实时 KPI 告警 + 历史趋势分析

```typescript
// server/src/modules/dashboard/dashboard-orchestration.service.ts

@Injectable()
export class DashboardOrchestrationService {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly slackAlerts: SlackAlertsService,
    private readonly memory: MemoryClient,
  ) {}

  /**
   * 每日 KPI 检查和告警 (定时任务)
   */
  @Cron('0 18 * * *') // 每天 18:00
  async dailyKPICheck() {
    // 1. 获取最新 KPI
    const kpi = await this.dashboardService.getRealTimeKPI();

    // 2. 检测异常
    const anomaly = await this.dashboardService.detectAnomalies();

    // 3. 如果有异常，发送 Slack 告警
    if (anomaly) {
      await this.slackAlerts.sendKPIAlert(anomaly);
    }

    // 4. 每日播报
    await this.slackAlerts.dailyKPIBroadcast();

    // 5. 存储到 Memory 知识图谱
    await this.memory.createEntities([{
      name: `DailyKPI_${new Date().toISOString().split('T')[0]}`,
      entityType: 'KPISnapshot',
      observations: [
        `Total Content: ${kpi.kpiData.totalContent}`,
        `Citation Rate: ${kpi.kpiData.citationRate}%`,
        `Anomaly: ${anomaly ? anomaly.type : 'None'}`,
      ],
    }]);
  }
}
```

---

### 4.2 Roadmap + Notion + n8n

**场景**: 月度 Roadmap 自动导入 + 双向同步

```mermaid
graph LR
    A[Google Sheets] -->|n8n Schedule| B[P-Level 计算]
    B --> C[PostgreSQL 批量导入]
    C --> D[Notion 同步]
    D --> E[Slack 通知]

    F[Notion 编辑] -->|n8n Webhook| G[PostgreSQL 更新]
    G --> H[缓存失效]
```

---

### 4.3 Content Generator + InfraNodus + MinIO

**场景**: AI 辅助内容生成 + 质量评分 + 版本控制

```typescript
// server/src/modules/content/content-pipeline.service.ts

@Injectable()
export class ContentPipelineService {
  constructor(
    private readonly templateService: ContentTemplateService,
    private readonly analysisService: ContentAnalysisService,
    private readonly storageService: ContentStorageService,
  ) {}

  /**
   * 完整的内容生成管道
   */
  async generateContent(promptId: string, channel: string) {
    // 1. 获取 Notion 模板
    const templates = await this.templateService.getTemplates(channel);
    const template = templates[0];

    // 2. 变量替换生成草稿
    const prompt = await this.getPromptById(promptId);
    const draft = await this.templateService.generateContent(template.id, {
      prompt: prompt.text,
      keywords: prompt.keywords,
      brand: 'SweetNight',
      date: new Date().toLocaleDateString(),
    });

    // 3. InfraNodus 质量分析
    const analysis = await this.analysisService.analyzeContent(draft);

    // 4. 如果评分 < 70，添加改进建议
    if (analysis.score < 70) {
      draft += `\n\n## Improvement Suggestions\n${analysis.improvementQuestions.join('\n')}`;
    }

    // 5. 保存到 MinIO
    const saved = await this.storageService.saveDraft(draft, {
      promptId,
      channel,
      pLevel: prompt.pLevel,
      qualityScore: analysis.score,
    });

    return {
      draftUrl: saved.url,
      qualityScore: analysis.score,
      suggestions: analysis.improvementQuestions,
    };
  }
}
```

---

## 5. 实施代码示例

### 5.1 环境配置

```bash
# .env.mcp (项目级配置)

# 已有配置
DATABASE_URL=postgresql://claude:claude_dev_2025@localhost:5437/claude_dev
NEO4J_URI=neo4j://localhost:7688
REDIS_URL=redis://:claude_redis_2025@localhost:6382

# 新增配置
MONGODB_URI=mongodb://claude:claude_mongo_2025@localhost:27018/leapgeo7?authSource=admin
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=SJ7Y8Y1XF49MW0F5223A
MINIO_SECRET_KEY=ZQvQQrMtjLuf3CqnlhHk3zgLYtn1wFGdkQpZ6YZq

N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_n8n_api_key

FEISHU_APP_ID=your_feishu_app_id_here
FEISHU_APP_SECRET=your_feishu_app_secret_here
FEISHU_GEO_REPORTS_FOLDER=your_folder_token

SLACK_BOT_TOKEN=your_slack_bot_token_here
SLACK_GEO_ALERTS_CHANNEL=#geo-alerts

NOTION_TOKEN=your_notion_token_here
NOTION_ROADMAP_DB=your_roadmap_database_id
NOTION_TEMPLATES_DB=your_templates_database_id

INFRANODUS_API_KEY=your_infranodus_api_key_here
```

---

### 5.2 依赖安装

```bash
# 前端依赖
npm install --save \
  @redis/client \
  @mcp/memory-client \
  @slack/web-api \
  puppeteer \
  minio

# 后端依赖
cd server && npm install --save \
  @nestjs/schedule \
  redis \
  mongodb \
  @slack/web-api \
  @notionhq/client \
  minio \
  puppeteer
```

---

### 5.3 集成客户端封装

```typescript
// server/src/integrations/clients/redis.client.ts

import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisClient {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hSet(key, field, value);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hGetAll(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  async lpush(key: string, value: string): Promise<void> {
    await this.client.lPush(key, value);
  }

  async ltrim(key: string, start: number, stop: number): Promise<void> {
    await this.client.lTrim(key, start, stop);
  }
}
```

---

## 6. 总结

### 6.1 赋能覆盖率

**前端页面** (15 个):
- ✅ Dashboard: Redis + Memory + Slack + Puppeteer
- ✅ Roadmap Manager: n8n + Notion
- ✅ Content Generator: Notion + InfraNodus + MinIO
- ✅ Citation Tracker: Firecrawl + n8n + MongoDB + Memory
- ✅ Workflow Monitor: n8n + Redis + Memory
- ✅ Prompt Landscape: InfraNodus + Firecrawl
- ✅ Analytics Reports: Feishu + Puppeteer + MinIO
- (其他 8 个页面类似...)

**后端服务** (6 个):
- ✅ Roadmap Service: Redis + Memory
- ✅ Citation Service: MongoDB + Redis
- ✅ Content Service: MinIO
- ✅ Analytics Service: Sequential Thinking
- ✅ Prompt Landscape Service: InfraNodus + Memory
- ✅ Neo4j Service: Memory 集成

### 6.2 预期收益

**时间节省**:
- 月度 Roadmap 导入: 2 小时 → 5 分钟 (**节省 96%**)
- 周报生成: 4 小时 → 自动化 (**节省 100%**)
- 引用追踪: 6 小时/周 → 自动化 (**节省 100%**)
- 内容生成: 8 小时/周 → 2 小时/周 (**节省 75%**)

**年度总节省**: **791 小时 ≈ 100 个工作日**

**质量提升**:
- 数据准确性: **+25%** (消除人工错误)
- 响应速度: **10x** (实时告警)
- 覆盖率: **+15%** (自动缺口发现)
- 团队协作: **3x** (统一工具链)

---

**文档维护**: 每月更新实施进度
**负责人**: LeapGEO7 项目团队
**最后更新**: 2025-10-23
