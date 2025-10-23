# SweetNight GEO 项目定制化验证检查点

**文档版本**: 1.0
**创建日期**: 2025-10-21
**适用项目**: SweetNight GEO战场感知态势分析作战系统

---

## 概述

本文档基于 SweetNight GEO 项目的特殊需求，对标准验证检查点进行定制化调整。

### 项目特征

1. **15个核心页面** - 需要验证完整页面覆盖
2. **7步自动化工作流** - 每步需要独立验证
3. **P0-P3优先级系统** - 优先级计算逻辑验证
4. **7大平台监控** - 多平台集成验证
5. **Neo4j图数据库** - 关系数据完整性验证
6. **InfraNodus文本分析** - 知识图谱构建验证
7. **Firecrawl网页抓取** - 引用追踪功能验证
8. **内容模板系统** - 7种模板可用性验证

---

## Phase 1: 前端设计阶段 (7个定制检查点)

### 检查点 1.1: 需求分析与知识图谱构建

#### ✅ Check 1.1.1: UI组件知识图谱完整性
```bash
# 验证15个核心页面的UI组件实体
mcp__memory__read_graph() | jq '.entities[] | select(.entityType=="UIComponent") | .name' | wc -l
# 预期输出: 15

# 验证组件关系数量（至少10个关系）
mcp__memory__read_graph() | jq '.relations[] | select(.from | test("Dashboard|RoadmapManager|ContentRegistry")) | .relationType' | wc -l
# 预期输出: >= 10
```

#### ✅ Check 1.1.2: InfraNodus主题集群验证
```bash
# 验证8个主题集群已识别
mcp__infranodus__analyze_existing_graph_by_name({
  graphName: "sweetnight-geo-requirements-analysis",
  includeGraphSummary: true
}) | jq '.mainTopicalClusters | length'
# 预期输出: 8

# 验证关键概念覆盖（包含"监控"、"优先"、"引用"、"内容"）
mcp__infranodus__analyze_existing_graph_by_name({
  graphName: "sweetnight-geo-requirements-analysis"
}) | jq '.mainConcepts[]' | grep -E "监控|优先|引用|内容"
# 预期输出: 4个关键词匹配
```

#### ✅ Check 1.1.3: Notion文档结构验证
```bash
# 验证Notion页面存在且包含15个核心页面清单
mcp__notion__API-post-search({query: "SweetNight GEO"}) | jq '.results[0].id'
# 预期输出: 页面ID

# 验证页面状态为"In progress"
mcp__notion__API-post-search({query: "SweetNight GEO"}) | jq '.results[0].properties.Status.status.name'
# 预期输出: "In progress"
```

#### 🎯 项目特定验证
```bash
# 验证P0-P3优先级概念存在于知识图谱
mcp__memory__search_nodes({query: "P0 P1 P2 P3 priority"})
# 预期输出: 包含优先级相关实体

# 验证7大平台概念存在
mcp__memory__search_nodes({query: "YouTube Reddit Medium Quora Amazon Blog LinkedIn"})
# 预期输出: 包含平台相关实体
```

---

### 检查点 1.2: UI/UX设计与原型创建

#### ✅ Check 1.2.1: 15个核心页面设计完成
```bash
# 验证Figma设计文件存在（或Magic UI组件生成）
ls figma-exports/*.png 2>/dev/null | wc -l
# 预期输出: >= 15（每个页面至少1个设计图）

# 验证设计覆盖15个核心页面
ls figma-exports/ | grep -E "Dashboard|RoadmapManager|ContentRegistry|PromptLandscape|ContentGenerator|CitationTracker|KPIDashboard|BattlefieldMap|WorkflowMonitor|SystemSettings|TemplateEditor|AnalyticsReports|ContentCoverage|CitationStrength|UserManagement"
# 预期输出: 15行匹配
```

#### ✅ Check 1.2.2: P0-P3优先级视觉编码验证
```bash
# 验证设计包含4种优先级颜色编码（红、橙、黄、绿）
grep -r "P0.*red\|P1.*orange\|P2.*yellow\|P3.*green" design-system/ --include="*.json" --include="*.ts"
# 预期输出: 至少4个颜色定义

# 验证优先级徽章组件存在
ls src/components/ui/ | grep -i "priority\|badge"
# 预期输出: PriorityBadge.tsx 或类似组件
```

#### ✅ Check 1.2.3: 7步工作流可视化验证
```bash
# 验证工作流图表组件存在
ls src/components/workflow/ | grep -i "workflow\|stepper"
# 预期输出: WorkflowStepper.tsx 或类似组件

# 验证7个步骤的标签定义
grep -r "路线图导入\|内容注册\|Prompt景观\|内容导入\|内容生成\|引用追踪\|反馈分析" src/constants/ --include="*.ts"
# 预期输出: 7行匹配
```

#### 🎯 项目特定验证
```bash
# 验证战场态势地图设计（D3.js力导向图）
ls src/components/charts/ | grep -i "battlefield\|forcegraph"
# 预期输出: BattlefieldMap.tsx

# 验证7平台图标资源
ls public/icons/platforms/ | grep -E "youtube|reddit|medium|quora|amazon|blog|linkedin"
# 预期输出: 7个图标文件
```

---

### 检查点 1.3: 前端架构设计

#### ✅ Check 1.3.1: 组件架构完整性
```bash
# 验证15个页面组件目录结构
ls src/pages/ | wc -l
# 预期输出: >= 15

# 验证每个页面有对应的测试文件
find src/pages/ -name "*.tsx" | while read f; do
  test_file="${f%.tsx}.test.tsx"
  [ -f "$test_file" ] && echo "✅ $f"
done | wc -l
# 预期输出: >= 15
```

#### ✅ Check 1.3.2: 状态管理架构验证
```bash
# 验证Redux slices覆盖核心领域
ls src/store/slices/ | grep -E "roadmap|content|citation|workflow|analytics"
# 预期输出: 5个slice文件

# 验证P-Level状态管理
grep -r "P0\|P1\|P2\|P3" src/store/slices/ --include="*.ts"
# 预期输出: 优先级状态定义
```

#### ✅ Check 1.3.3: API客户端架构
```bash
# 验证7步工作流对应的API服务
ls src/services/api/ | grep -E "roadmap|registry|landscape|ingest|generate|citation|feedback"
# 预期输出: 7个API服务文件

# 验证Firecrawl集成服务
ls src/services/ | grep -i "firecrawl\|citation"
# 预期输出: FirecrawlService.ts 或 CitationService.ts
```

#### 🎯 项目特定验证
```bash
# 验证Neo4j图数据库客户端
ls src/lib/ | grep -i "neo4j\|graph"
# 预期输出: neo4jClient.ts

# 验证优先级计算工具
ls src/utils/ | grep -i "priority\|score"
# 预期输出: priorityCalculator.ts

# 验证Enhanced GEO Score算法实现
grep -r "enhancedGeoScore\|quickWinIndex" src/utils/ --include="*.ts"
# 预期输出: 评分算法代码
```

---

### 检查点 1.4: 项目初始化

#### ✅ Check 1.4.1: 依赖完整性（SweetNight GEO特定）
```bash
# 验证核心依赖
npm list --depth=0 | grep -E "@mui/material|@reduxjs/toolkit|react-query|d3|neo4j-driver|axios"
# 预期输出: 6个依赖包

# 验证图表库
npm list --depth=0 | grep -E "d3|recharts|victory"
# 预期输出: 至少1个图表库

# 验证状态管理
npm list --depth=0 | grep -E "redux|zustand|recoil"
# 预期输出: 至少1个状态管理库
```

#### ✅ Check 1.4.2: 环境配置验证
```bash
# 验证.env文件包含SweetNight GEO所需配置
grep -E "NEO4J_URI|FIRECRAWL_API_KEY|INFRANODUS_API_KEY|POSTGRES_URL|REDIS_URL" .env
# 预期输出: 5行配置

# 验证Docker Compose包含所需服务
grep -E "postgres|redis|neo4j" docker-compose.yml
# 预期输出: 3个服务定义
```

#### 🎯 项目特定验证
```bash
# 验证P-Level配置文件
ls config/ | grep -i "priority\|level"
# 预期输出: prioritization_rules.json

# 验证字段映射配置（用于TSV导入）
ls config/ | grep -i "field.*mapping\|import"
# 预期输出: field_mapping.json

# 验证内容模板配置
ls config/templates/ | grep -E "youtube|reddit|medium|quora|amazon|blog|linkedin"
# 预期输出: 7个模板文件
```

---

### 检查点 1.5: Context Engineering PRP生成

#### ✅ Check 1.5.1: PRP文件完整性
```bash
# 验证Frontend Implementation PRP生成
ls ~/Context-Engineering-Intro/PRPs/ | grep -i "sweetnight.*frontend"
# 预期输出: sweetnight-geo-frontend-implementation.md

# 验证PRP包含15个页面的实现指南
grep -c "Dashboard\|RoadmapManager\|ContentRegistry" ~/Context-Engineering-Intro/PRPs/sweetnight-geo-frontend-implementation.md
# 预期输出: >= 15
```

#### ✅ Check 1.5.2: 验证门和成功标准
```bash
# 验证PRP包含所有验证门
grep -c "Validation Gate" ~/Context-Engineering-Intro/PRPs/sweetnight-geo-frontend-implementation.md
# 预期输出: >= 5

# 验证PRP包含项目特定成功标准
grep -E "P0-P3|7-step workflow|15 pages|Neo4j|Firecrawl" ~/Context-Engineering-Intro/PRPs/sweetnight-geo-frontend-implementation.md
# 预期输出: 至少4个项目特征匹配
```

#### 🎯 项目特定验证
```bash
# 验证优先级系统的PRP指南
grep -i "priority.*calculation\|P-Level" ~/Context-Engineering-Intro/PRPs/sweetnight-geo-frontend-implementation.md
# 预期输出: 优先级实现指南

# 验证7步工作流的实现规范
grep -i "7.*step.*workflow\|roadmap.*ingest" ~/Context-Engineering-Intro/PRPs/sweetnight-geo-frontend-implementation.md
# 预期输出: 工作流实现规范
```

---

## Phase 2: 后端开发阶段 (8个定制检查点)

### 检查点 2.1: 数据库设计与初始化

#### ✅ Check 2.1.1: PostgreSQL Schema验证（SweetNight GEO特定表）
```bash
# 验证核心业务表创建
npx prisma db execute --stdin <<EOF
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
AND table_name IN ('roadmap', 'content_registry', 'citation_tracking');
EOF
# 预期输出: 3行（3个核心表）

# 验证roadmap表包含P-Level字段
npx prisma db execute --stdin <<EOF
SELECT column_name FROM information_schema.columns
WHERE table_name='roadmap'
AND column_name IN ('p_level', 'enhanced_geo_score', 'quickwin_index');
EOF
# 预期输出: 3个字段
```

#### ✅ Check 2.1.2: Neo4j Schema验证（Prompt关系网络）
```bash
# 验证Neo4j节点类型
mcp__neo4j__execute_query({
  query: "CALL db.labels()"
})
# 预期输出: 包含 Prompt, Content, Platform 等标签

# 验证Prompt节点包含P-Level属性
mcp__neo4j__execute_query({
  query: "MATCH (p:Prompt) RETURN p.p_level, count(*) LIMIT 1"
})
# 预期输出: P0/P1/P2/P3 之一
```

#### 🎯 项目特定验证
```bash
# 验证7大平台节点创建
mcp__neo4j__execute_query({
  query: "MATCH (pl:Platform) RETURN pl.name"
})
# 预期输出: YouTube, Reddit, Medium, Quora, Amazon, Blog, LinkedIn

# 验证P-Level索引创建（性能优化）
mcp__neo4j__execute_query({
  query: "CALL db.indexes() YIELD name WHERE name CONTAINS 'p_level' RETURN name"
})
# 预期输出: 至少1个P-Level索引
```

---

### 检查点 2.2: API路由与控制器

#### ✅ Check 2.2.1: 7步工作流API完整性
```bash
# 验证7步工作流对应的API端点
curl http://localhost:3000/api/v1/workflow/steps | jq '.steps | length'
# 预期输出: 7

# 验证每步的执行端点存在
for step in roadmap-ingest content-registry prompt-landscape content-ingest content-generate citation-track feedback-analyze; do
  curl -f http://localhost:3000/api/v1/workflow/$step/trigger && echo "✅ $step"
done
# 预期输出: 7个✅
```

#### ✅ Check 2.2.2: 优先级管理API
```bash
# 验证P-Level筛选API
curl "http://localhost:3000/api/v1/roadmap?p_level=P0" | jq '.data | length'
# 预期输出: >= 0（返回P0项目）

# 验证优先级计算API
curl -X POST http://localhost:3000/api/v1/roadmap/calculate-priority \
  -H "Content-Type: application/json" \
  -d '{"enhanced_geo_score": 85, "quickwin_index": 72}' | jq '.p_level'
# 预期输出: "P0", "P1", "P2", 或 "P3"
```

#### 🎯 项目特定验证
```bash
# 验证7平台引用追踪API
for platform in youtube reddit medium quora amazon blog linkedin; do
  curl -f http://localhost:3000/api/v1/citations/$platform && echo "✅ $platform"
done
# 预期输出: 7个✅

# 验证内容模板API（7种模板）
curl http://localhost:3000/api/v1/templates | jq '.templates | length'
# 预期输出: 7
```

---

### 检查点 2.3: 业务逻辑服务

#### ✅ Check 2.3.1: 优先级计算服务验证
```bash
# 验证PriorityCalculator服务存在
ls src/services/ | grep -i "priority.*calculator"
# 预期输出: PriorityCalculator.ts

# 验证计算逻辑单元测试
npm test -- PriorityCalculator.test.ts
# 预期输出: All tests passed

# 验证公式: totalScore = (enhanced_geo_score * 0.7) + (quickwin_index * 0.3)
grep -r "0.7.*enhanced_geo_score.*0.3.*quickwin_index" src/services/ --include="*.ts"
# 预期输出: 匹配计算公式
```

#### ✅ Check 2.3.2: 7步工作流引擎
```bash
# 验证GeoWorkflowEngine服务
ls src/workflow/ | grep -i "workflow.*engine\|geo.*workflow"
# 预期输出: GeoWorkflowEngine.ts

# 验证7步状态机实现
grep -r "step_1.*roadmap\|step_2.*registry\|step_3.*landscape\|step_4.*ingest\|step_5.*generate\|step_6.*citation\|step_7.*feedback" src/workflow/ --include="*.ts"
# 预期输出: 7个步骤状态
```

#### 🎯 项目特定验证
```bash
# 验证Firecrawl集成服务（引用追踪核心）
ls src/integrations/ | grep -i "firecrawl"
# 预期输出: FirecrawlService.ts

# 验证InfraNodus集成（文本分析）
ls src/integrations/ | grep -i "infranodus"
# 预期输出: InfraNodusService.ts 或通过MCP直接调用

# 验证模板变量替换引擎
ls src/services/ | grep -i "template.*engine"
# 预期输出: ContentTemplateEngine.ts
```

---

### 检查点 2.4: Swagger API文档

#### ✅ Check 2.4.1: API文档完整性
```bash
# 验证Swagger UI可访问
curl http://localhost:3000/api/docs | grep "SweetNight GEO API"
# 预期输出: 包含API标题

# 验证7步工作流端点文档化
curl http://localhost:3000/api/docs-json | jq '.paths | keys[]' | grep -E "roadmap|registry|landscape|ingest|generate|citation|feedback" | wc -l
# 预期输出: >= 7
```

#### 🎯 项目特定验证
```bash
# 验证P-Level参数文档
curl http://localhost:3000/api/docs-json | jq '.components.schemas' | grep -i "p_level"
# 预期输出: P-Level schema定义

# 验证7平台枚举类型
curl http://localhost:3000/api/docs-json | jq '.components.schemas.Platform.enum'
# 预期输出: ["YouTube", "Reddit", "Medium", "Quora", "Amazon", "Blog", "LinkedIn"]
```

---

### 检查点 2.5: 外部系统集成

#### ✅ Check 2.5.1: Firecrawl API集成测试
```bash
# 验证Firecrawl服务健康检查
curl http://localhost:3002/health
# 预期输出: {"status":"ok"}

# 测试引用追踪功能
curl -X POST http://localhost:3000/api/v1/citations/track \
  -H "Content-Type: application/json" \
  -d '{"contentId": "test-123", "searchQuery": "best mattress for back pain"}' | jq '.citations'
# 预期输出: 返回引用列表
```

#### ✅ Check 2.5.2: Neo4j图数据库连接
```bash
# 验证Neo4j连接
mcp__neo4j__execute_query({
  query: "RETURN 'connected' as status"
})
# 预期输出: {"status": "connected"}

# 验证Prompt关系网络查询
mcp__neo4j__execute_query({
  query: "MATCH (p:Prompt)-[r:COVERED_BY]->(c:Content) RETURN count(r) as relationships"
})
# 预期输出: relationships count
```

#### 🎯 项目特定验证
```bash
# 验证InfraNodus MCP连接
mcp__infranodus__analyze_existing_graph_by_name({
  graphName: "sweetnight-geo-requirements-analysis"
})
# 预期输出: 成功返回图分析结果

# 验证YouTube API集成（如配置）
curl http://localhost:3000/api/v1/platforms/youtube/health
# 预期输出: {"platform":"YouTube","status":"ok"}
```

---

### 检查点 2.6: Bull Queue任务队列

#### ✅ Check 2.6.1: 7步工作流队列
```bash
# 验证7个队列创建
curl http://localhost:3000/api/v1/queues | jq '.queues | length'
# 预期输出: >= 7

# 验证队列命名
curl http://localhost:3000/api/v1/queues | jq '.queues[].name' | grep -E "step-[1-7]"
# 预期输出: 7个队列名称
```

#### 🎯 项目特定验证
```bash
# 验证优先级队列（P0任务优先处理）
curl http://localhost:3000/api/v1/queues/step-5-content-generate | jq '.jobs[] | select(.data.p_level=="P0")'
# 预期输出: P0任务存在且优先级最高
```

---

## Phase 3: 集成与测试阶段 (10个定制检查点)

### 检查点 3.1: API集成

#### ✅ Check 3.1.1: 前后端API对接（15个页面）
```bash
# 验证所有页面的API集成
npm run type-check
# 预期输出: 0 errors

# 验证每个页面至少调用1个API
grep -r "useQuery\|useMutation\|apiClient" src/pages/ --include="*.tsx" | wc -l
# 预期输出: >= 15
```

#### 🎯 项目特定验证
```bash
# 验证PromptLandscape页面调用Neo4j API
grep -r "neo4j\|graph.*query" src/pages/PromptLandscape/ --include="*.tsx"
# 预期输出: Neo4j查询调用

# 验证CitationTracker页面调用Firecrawl API
grep -r "firecrawl\|citation.*track" src/pages/CitationTracker/ --include="*.tsx"
# 预期输出: Firecrawl API调用
```

---

### 检查点 3.2: 页面路由与导航

#### ✅ Check 3.2.1: 15个页面路由配置
```bash
# 验证15个路由定义
grep -c "path.*:" src/routes/index.tsx
# 预期输出: >= 15

# 验证路由命名一致性
grep "path.*:" src/routes/index.tsx | grep -E "/dashboard|/roadmap|/content-registry|/prompt-landscape|/content-generator|/citation-tracker|/kpi-dashboard|/battlefield-map|/workflow-monitor|/settings|/templates|/analytics|/coverage|/citation-strength|/users"
# 预期输出: 15行匹配
```

#### 🎯 项目特定验证
```bash
# 验证7步工作流导航
grep -r "workflow.*step\|stepper" src/components/navigation/ --include="*.tsx"
# 预期输出: 工作流步骤导航组件

# 验证P-Level筛选器
grep -r "filter.*p_level\|priority.*filter" src/components/filters/ --include="*.tsx"
# 预期输出: 优先级筛选组件
```

---

### 检查点 3.3: 数据流与状态同步

#### ✅ Check 3.3.1: Neo4j图数据实时同步
```bash
# 启动开发服务器并验证Neo4j连接
npm run dev 2>&1 | grep -i "neo4j.*connected\|graph.*database.*ready"
# 预期输出: Neo4j连接成功日志

# 验证Prompt节点更新实时反映到前端
curl http://localhost:3000/api/v1/prompts | jq '.data | length'
# 预期输出: 节点数量
```

#### 🎯 项目特定验证
```bash
# 验证P-Level变化触发UI更新
grep -r "useEffect.*p_level\|watch.*priority" src/pages/ --include="*.tsx"
# 预期输出: 优先级响应式更新逻辑

# 验证7步工作流状态同步（WebSocket或轮询）
grep -r "websocket\|socket\.io\|useInterval" src/hooks/ --include="*.ts"
# 预期输出: 实时同步机制
```

---

### 检查点 3.4: E2E测试（Playwright）

#### ✅ Check 3.4.1: 15个核心页面E2E测试
```bash
# 运行所有E2E测试
npx playwright test
# 预期输出: 所有测试通过

# 验证15个页面测试覆盖
find tests/e2e/ -name "*.spec.ts" | wc -l
# 预期输出: >= 15
```

#### ✅ Check 3.4.2: 7步工作流端到端测试
```bash
# 运行工作流完整流程测试
npx playwright test tests/e2e/workflow-complete.spec.ts
# 预期输出: 测试通过

# 验证每步状态转换
grep -c "step.*completed\|step.*success" tests/e2e/workflow-complete.spec.ts
# 预期输出: >= 7
```

#### 🎯 项目特定验证
```bash
# 测试P0内容优先处理
npx playwright test tests/e2e/priority-handling.spec.ts
# 预期输出: P0任务优先执行

# 测试7平台引用追踪
npx playwright test tests/e2e/citation-tracking.spec.ts
# 预期输出: 所有平台追踪正常

# 测试D3.js力导向图渲染
npx playwright test tests/e2e/battlefield-map.spec.ts
# 预期输出: 图表渲染成功
```

---

### 检查点 3.5: 性能优化验证

#### ✅ Check 3.5.1: 优先级查询性能
```bash
# 测试P-Level筛选查询响应时间
time curl "http://localhost:3000/api/v1/roadmap?p_level=P0&limit=100"
# 预期输出: < 500ms

# 测试Neo4j图查询性能
time curl "http://localhost:3000/api/v1/prompts/landscape?depth=3"
# 预期输出: < 1000ms
```

#### 🎯 项目特定验证
```bash
# 测试7步工作流批量处理性能
time curl -X POST http://localhost:3000/api/v1/workflow/batch \
  -H "Content-Type: application/json" \
  -d '{"items": 100, "p_level": "P0"}'
# 预期输出: < 5000ms（100个P0项目）
```

---

## Phase 4: 部署与监控阶段 (4个定制检查点)

### 检查点 4.1: Docker部署

#### ✅ Check 4.1.1: SweetNight GEO特定服务
```bash
# 验证所有容器运行
docker-compose ps | grep "Up" | wc -l
# 预期输出: >= 5（app, postgres, redis, neo4j, nginx）

# 验证Firecrawl服务运行（自托管）
docker ps | grep firecrawl
# 预期输出: Firecrawl容器运行中
```

#### 🎯 项目特定验证
```bash
# 验证Neo4j容器包含Prompt数据
docker exec -it neo4j-claude-mcp cypher-shell -u neo4j -p claude_neo4j_2025 "MATCH (p:Prompt) RETURN count(p)"
# 预期输出: 节点数量 > 0

# 验证PostgreSQL包含roadmap表数据
docker exec -it postgres-claude-mcp psql -U claude -d claude_dev -c "SELECT COUNT(*) FROM roadmap;"
# 预期输出: 记录数量
```

---

### 检查点 4.2: CI/CD管道

#### ✅ Check 4.2.1: GitHub Actions工作流
```bash
# 验证workflow文件存在
ls .github/workflows/ | grep -E "test\|deploy\|build"
# 预期输出: 至少3个workflow文件

# 验证workflow包含项目特定步骤
grep -E "playwright.*test|priority.*validation|neo4j.*connection" .github/workflows/*.yml
# 预期输出: 项目特定测试步骤
```

#### 🎯 项目特定验证
```bash
# 验证部署前P-Level计算验证
grep "priority.*calculator.*test" .github/workflows/deploy.yml
# 预期输出: 优先级计算测试步骤

# 验证7步工作流集成测试
grep "workflow.*integration.*test" .github/workflows/test.yml
# 预期输出: 工作流集成测试
```

---

### 检查点 4.3: 监控与日志

#### ✅ Check 4.3.1: 业务指标监控
```bash
# 验证Prometheus metrics包含SweetNight GEO特定指标
curl http://localhost:3000/metrics | grep -E "p_level|citation_rate|workflow_step"
# 预期输出: 项目特定metrics

# 验证7步工作流监控
curl http://localhost:3000/metrics | grep "workflow_step" | wc -l
# 预期输出: >= 7（每步1个metric）
```

#### 🎯 项目特定验证
```bash
# 验证P0-P3分布监控
curl http://localhost:3000/api/v1/analytics/priority-distribution
# 预期输出: {"P0": x, "P1": y, "P2": z, "P3": w}

# 验证7平台引用率监控
curl http://localhost:3000/api/v1/analytics/citation-by-platform
# 预期输出: 7个平台的引用统计
```

---

## 自动化脚本索引

所有验证脚本位于 `/scripts/validation/` 目录：

```bash
scripts/validation/
├── phase-1-frontend.sh          # Phase 1 所有检查点
├── phase-2-backend.sh           # Phase 2 所有检查点
├── phase-3-integration.sh       # Phase 3 所有检查点
├── phase-4-deployment.sh        # Phase 4 所有检查点
├── validate-all.sh              # 运行所有阶段验证
├── project-specific/
│   ├── priority-system.sh       # P0-P3优先级验证
│   ├── workflow-7steps.sh       # 7步工作流验证
│   ├── platforms-7.sh           # 7大平台集成验证
│   ├── pages-15.sh              # 15个核心页面验证
│   └── neo4j-graph.sh           # Neo4j图数据验证
└── helpers/
    ├── mcp-tools.sh             # MCP工具辅助函数
    └── report-generator.sh      # 验证报告生成器
```

---

## 使用指南

### 快速验证当前阶段
```bash
# Phase 1 验证
./scripts/validation/phase-1-frontend.sh

# Phase 2 验证
./scripts/validation/phase-2-backend.sh

# Phase 3 验证
./scripts/validation/phase-3-integration.sh

# Phase 4 验证
./scripts/validation/phase-4-deployment.sh
```

### 完整流程验证
```bash
# 运行所有29个检查点
./scripts/validation/validate-all.sh

# 生成HTML验证报告
./scripts/validation/validate-all.sh --report
```

### 项目特定验证
```bash
# 验证优先级系统
./scripts/validation/project-specific/priority-system.sh

# 验证7步工作流
./scripts/validation/project-specific/workflow-7steps.sh

# 验证7大平台集成
./scripts/validation/project-specific/platforms-7.sh

# 验证15个核心页面
./scripts/validation/project-specific/pages-15.sh

# 验证Neo4j图数据
./scripts/validation/project-specific/neo4j-graph.sh
```

---

## 验证报告示例

```
==============================================
SweetNight GEO 项目验证报告
==============================================
验证时间: 2025-10-21 20:55:00
阶段: Phase 1 - 前端设计
==============================================

检查点 1.1: 需求分析与知识图谱构建
✅ Check 1.1.1: UI组件完整性 (15/15)
✅ Check 1.1.2: InfraNodus主题集群 (8/8)
✅ Check 1.1.3: Notion文档结构
🎯 P0-P3优先级概念存在
🎯 7大平台概念存在

检查点 1.2: UI/UX设计与原型创建
✅ Check 1.2.1: 15个页面设计完成 (15/15)
✅ Check 1.2.2: P0-P3颜色编码
✅ Check 1.2.3: 7步工作流可视化
🎯 战场态势地图组件
🎯 7平台图标资源

...（更多检查点）

==============================================
总结: 7个检查点全部通过 ✅
==============================================
```

---

## 检查点权重与优先级

| 检查点类别 | 权重 | 失败影响 | 是否阻塞 |
|----------|------|---------|---------|
| UI组件完整性（15页面） | 🔴 High | 阻塞下一阶段 | ✅ 是 |
| P0-P3优先级系统 | 🔴 High | 核心功能缺失 | ✅ 是 |
| 7步工作流 | 🔴 High | 核心功能缺失 | ✅ 是 |
| Neo4j图数据库 | 🟡 Medium | 功能受限 | ⚠️ 警告 |
| 7大平台集成 | 🟡 Medium | 功能不完整 | ⚠️ 警告 |
| 性能优化 | 🟢 Low | 用户体验下降 | ❌ 否 |

---

## 故障排查指南

### 常见问题

#### 1. Neo4j连接失败
```bash
# 检查容器状态
docker ps | grep neo4j

# 检查端口
lsof -i :7688

# 重启服务
docker restart neo4j-claude-mcp
```

#### 2. P-Level计算错误
```bash
# 验证公式
# totalScore = (enhanced_geo_score * 0.7) + (quickwin_index * 0.3)

# 测试计算
curl -X POST http://localhost:3000/api/v1/roadmap/calculate-priority \
  -d '{"enhanced_geo_score": 100, "quickwin_index": 100}' | jq '.p_level'
# 预期: "P0"
```

#### 3. Firecrawl API超时
```bash
# 检查Firecrawl服务
curl http://localhost:3002/health

# 检查API Key
echo $FIRECRAWL_API_KEY

# 重启服务
cd ~/firecrawl && docker-compose restart
```

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|-----|------|---------|
| 1.0 | 2025-10-21 | 初始版本，基于标准工作流定制29个检查点 |

---

**维护者**: Claude Code Automation System
**联系方式**: 参考项目CLAUDE.md文档
