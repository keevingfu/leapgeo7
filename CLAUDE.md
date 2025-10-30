# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SweetNight GEO战场感知态势分析作战系统** is a GEO (Generative Engine Optimization) management platform designed for the SweetNight mattress brand. The system automates content production workflows and provides data-driven decision-making to maximize AI search engine citation rates and brand exposure.

## Development Commands

### Frontend (Root)
```bash
# Development
npm run dev              # Start Vite dev server (port 5173)
npm run build            # TypeScript compile + production build
npm run preview          # Preview production build
npm run type-check       # Run TypeScript compiler without emitting files
npm run lint             # ESLint on .ts/.tsx files
npm run ci               # Full CI pipeline (type-check + build)

# Testing
npm test                 # Run Vitest tests
npm run test:coverage    # Generate coverage report
npx playwright test      # Run E2E tests (requires dev server running)
npx playwright test --ui # Run E2E tests in UI mode

# Deployment
npm run deploy           # Auto-deploy with default commit message
npm run deploy:msg "msg" # Auto-deploy with custom commit message
npm run health-check     # Check deployment environment status
npm run setup:git        # Configure Git environment (first-time setup)
```

### Backend (server/)
```bash
cd server

# Development
npm run dev              # Start NestJS with ts-node (port 3001)
npm run build            # Compile TypeScript to dist/
npm start                # Run compiled code from dist/

# Database (Prisma)
npm run prisma:generate  # Generate Prisma Client after schema changes
npm run prisma:migrate   # Create and apply new migration
npm run prisma:reset     # Reset database (WARNING: deletes all data)
npm run prisma:studio    # Open Prisma Studio GUI
```

### Database Access
```bash
# PostgreSQL (primary data)
PGPASSWORD=claude_dev_2025 psql -h localhost -p 5437 -U claude -d claude_dev

# Neo4j (graph data - prompts, relationships)
# Browser: http://localhost:7475
# Credentials: neo4j / claude_neo4j_2025

# Redis (cache/queues)
redis-cli -h localhost -p 6382 -a claude_redis_2025

# MongoDB (raw scraped content)
mongosh mongodb://claude:claude_mongo_2025@localhost:27018/leapgeo7?authSource=admin
```

### Service Management
```bash
# Start all MCP services (databases, Firecrawl, MinIO, n8n)
bash scripts/mcp-quick-start.sh

# Stop all services
bash scripts/mcp-stop.sh

# Check Docker containers
docker ps | grep -E "postgres|neo4j|redis|mongodb|minio|firecrawl"
```

## Architecture

### Full-Stack Structure

**Monorepo Layout:**
```
leapgeo7/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page-level components (20 pages)
│   ├── services/           # API clients, business logic
│   ├── store/              # Redux Toolkit state management
│   ├── integrations/       # External API clients (Firecrawl, Neo4j)
│   └── App.tsx             # Main routing configuration
├── server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── modules/        # Feature modules (8 modules)
│   │   ├── prisma/         # Prisma ORM setup
│   │   └── main.ts         # NestJS bootstrap
│   └── prisma/schema.prisma
├── e2e/                    # Playwright E2E tests
└── scripts/                # Deployment and automation scripts
```

### Frontend Architecture

**Technology:** React 18 + TypeScript + Material-UI + D3.js + Redux Toolkit

**Page Structure (20 pages):**
- **Planning**: Dashboard, RoadmapManager, PromptLandscape
- **Content**: ContentRegistry, ContentGenerator, TemplateEditor
- **Analysis**: CitationTracker, CitationStrength, KPIDashboard, ContentCoverage
- **Visualization**: BattlefieldMap, GeoMappingNetwork, AnalyticsReports
- **Automation**: WorkflowMonitor
- **Admin**: SystemSettings, UserManagement, Help
- **Conversion**: Offers, Orders

**State Management:**
- Redux Toolkit for global state (roadmap, content, citations)
- React Query for server state synchronization
- Zustand for lightweight local state

**D3.js Visualizations:**
- `components/charts/GraphVisualization.tsx` - Force-directed graph for Prompt Landscape
- `components/charts/ThreeLayerNetworkGraph.tsx` - Canvas-based three-layer network (Prompts → Contents → Citations)
- `components/charts/HeatMap.tsx` - Competition intensity heatmap

### Backend Architecture

**Technology:** NestJS 10 + Prisma + Neo4j + PostgreSQL

**Module Structure:**
```
server/src/modules/
├── roadmap/              # Roadmap CRUD, priority calculation
├── content/              # Content registry, publication status
├── citation/             # Citation tracking across 7 platforms
├── analytics/            # KPI metrics, performance reports
├── neo4j/                # Neo4j connection and basic queries
├── neo4j-gds/            # Graph Data Science algorithms
│   ├── services/
│   │   ├── centrality.service.ts          # PageRank, Betweenness, Closeness
│   │   ├── community-detection.service.ts # Louvain, Label Propagation
│   │   └── similarity.service.ts          # Node Similarity, KNN
│   └── controllers/
│       └── neo4j-gds.controller.ts        # REST API endpoints
└── prompt-landscape/     # Prompt knowledge graph analysis
```

**API Structure:**
- Base URL: `http://localhost:3001/api/v1`
- Swagger Docs: `http://localhost:3001/api/docs`
- Key endpoints:
  - `/roadmap` - Roadmap management
  - `/content` - Content registry
  - `/citations` - Citation tracking
  - `/analytics` - KPI metrics
  - `/prompt-landscape` - Graph data with gap analysis
  - `/neo4j-gds` - Graph algorithms (PageRank, community detection, similarity)

### Data Models

**Priority System (P-Level):**
- **P0 (Core)**: Total Score ≥ 100, 8 hours/content, AI citation prob >75%, ROI 2 months
- **P1 (Important)**: 75-100 score, 6 hours/content, 50-75% citation prob, ROI 3 months
- **P2 (Opportunity)**: 50-75 score, 5 hours/content, 25-50% citation prob, ROI 4-6 months
- **P3 (Reserve)**: <50 score, 3 hours/content, <25% citation prob, strategic reserve

**Priority Calculation:**
```typescript
totalScore = (enhanced_geo_score * 0.7) + (quickwin_index * 0.3)
```

**Database Schema:**
- **PostgreSQL**: Roadmap, Content Registry, Citation Tracking, Analytics (Prisma schema in `server/prisma/schema.prisma`)
- **Neo4j**: Prompts graph, Content relationships, Citation networks
- **Redis**: Task queues, caching
- **MongoDB**: Raw scraped content from Firecrawl (TTL: 90 days)

### 7-Step Automated Workflow

This system implements a complete GEO workflow:

1. **Roadmap Ingestor** - Import monthly roadmap from CSV/TSV
2. **Content Registry** - Manage content inventory and coverage
3. **Prompt Landscape Builder** - Build P0-P3 priority hierarchy in Neo4j
4. **Content Ingestor** - Process multi-format content
5. **Content Generator** - Generate and distribute to multiple channels
6. **Citation Tracker** - Monitor 7 AI platforms (Perplexity, ChatGPT, Google AI Overview, etc.)
7. **Feedback Analyzer** - Analyze KPIs and optimize strategy

## Neo4j Graph Data Science Integration

**Purpose:** Advanced graph algorithms for content strategy optimization

**Location:** `server/src/modules/neo4j-gds/`

**Three Service Categories:**

### 1. Community Detection (Prompt Clustering)
- **Louvain Algorithm**: Hierarchical clustering, identifies 8+ semantic communities
- **Label Propagation**: Fast clustering for real-time topic identification
- **API**: `GET /api/v1/neo4j-gds/communities`
- **Use Case**: Auto-categorize prompts into theme clusters

### 2. Centrality Analysis (Influence Ranking)
- **PageRank**: Identify most influential prompts
- **Betweenness**: Find bridge prompts in user journeys
- **Closeness**: Detect content hubs
- **Comprehensive**: Combined score = PageRank×0.5 + Betweenness×0.3 + Closeness×0.2
- **API**: `GET /api/v1/neo4j-gds/centrality/{pagerank|betweenness|closeness|comprehensive}`
- **Use Case**: Prioritize content creation based on influence scores

### 3. Similarity Analysis (Content Recommendation)
- **Node Similarity**: Jaccard coefficient-based similarity
- **K-Nearest Neighbors**: Attribute-based recommendations
- **API**: `GET /api/v1/neo4j-gds/similarity/prompts/:id/{similar|knn}`
- **Use Case**: "Related prompts" recommendations, gap analysis

**Graph Projection Pattern:**
```cypher
CALL gds.graph.project(
  'prompt-graph',
  'Prompt',
  { RELATES_TO: { orientation: 'UNDIRECTED', properties: 'weight' } },
  { nodeProperties: ['score'] }  // Only numeric properties
)
```

**Important Notes:**
- Neo4j GDS requires numeric node properties only (String properties cause errors)
- All parameters must be type-converted: `toInteger($limit)`, `toInteger($topK)`
- Always clean up graph projections: `CALL gds.graph.drop($graphName)`
- For detailed implementation, see `NEO4J-GDS-UPGRADE-PLAN.md`

## MCP Integration

This project leverages 23+ MCP (Model Context Protocol) servers for automation:

**Key Integrations:**
- **n8n** (port 5678): Workflow automation hub, 8 active workflows
- **Firecrawl** (port 3002): Self-hosted web scraping (unlimited SERP monitoring)
- **Neo4j** (port 7475): Graph database for prompt relationships
- **MinIO** (port 9001): Object storage for content backups
- **Feishu**: Team documentation and reports
- **Slack**: Real-time alerts and notifications
- **InfraNodus**: Text network analysis and gap detection
- **GEO Knowledge Graph**: 15 specialized GEO tools

**Automation Workflows:**
1. Daily SERP monitoring and competitor tracking
2. Weekly automated report generation (Feishu)
3. Real-time citation tracking across 7 AI platforms
4. Content gap analysis and recommendations
5. Graph health monitoring and maintenance

**Quick Start:**
```bash
bash scripts/mcp-quick-start.sh  # Start all services
```

For complete MCP documentation, see `MCP-EMPOWERMENT-README.md` and `MCP-EMPOWERMENT-STRATEGY.md`.

## CI/CD Pipeline

**Automated Deployment Flow:**
```
Local Dev → Type Check → Build → Git Push → GitHub Actions → Vercel
```

**Deployment Commands:**
```bash
npm run deploy              # Auto-deploy with default message
npm run deploy:msg "feat"   # Auto-deploy with custom message
```

**What happens automatically:**
1. TypeScript type checking (`npm run type-check`)
2. Production build (`npm run build`)
3. Git commit and push
4. GitHub Actions CI runs tests
5. Vercel auto-deploys to production

**Monitoring:**
- GitHub Actions: https://github.com/keevingfu/leapgeo7/actions
- Vercel Dashboard: https://vercel.com/dashboard

**Commit Convention:**
Use Conventional Commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `test:` - Test additions
- `chore:` - Build/tooling updates

For detailed CI/CD guide, see `CICD-README.md`.

## Testing

**Unit Tests (Vitest):**
```bash
npm test                  # Run all tests
npm run test:coverage     # Generate coverage report
```

**E2E Tests (Playwright):**
```bash
npx playwright test                # Run all E2E tests
npx playwright test --ui           # Run in UI mode
npx playwright test navigation     # Run specific test file
npx playwright show-report         # View HTML report
```

**Test Coverage:**
- `e2e/navigation.spec.ts` - Page navigation and routing
- `e2e/interactions.spec.ts` - User interactions, filters, data entry

**E2E Test Notes:**
- Tests run against `http://localhost:5173`
- Frontend dev server must be running before E2E tests
- Tests use Material-UI selectors (`.MuiChip-root`, `.MuiButton-root`)
- Current pass rate: 80% (8/10 tests passing)

## Key Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies and scripts |
| `server/package.json` | Backend dependencies and scripts |
| `tsconfig.json` | TypeScript configuration (frontend) |
| `server/tsconfig.json` | TypeScript configuration (backend) |
| `vite.config.ts` | Vite build configuration |
| `playwright.config.ts` | E2E test configuration |
| `server/prisma/schema.prisma` | Database schema |
| `server/.env` | Backend environment variables |
| `.env.mcp` | MCP service credentials (not in git) |

## Common Development Workflows

### Adding a New Page
1. Create component in `src/pages/NewPage/index.tsx`
2. Add route in `src/App.tsx`
3. Add menu item in `src/components/layout/Sidebar.tsx`
4. Add E2E test in `e2e/navigation.spec.ts`

### Adding a New Backend Module
1. Create module directory: `server/src/modules/new-module/`
2. Create module file: `new-module.module.ts`
3. Create controller: `new-module.controller.ts`
4. Create service: `new-module.service.ts`
5. Register in `server/src/app.module.ts`

### Running Full Development Stack
```bash
# Terminal 1: Start MCP services
bash scripts/mcp-quick-start.sh

# Terminal 2: Start backend
cd server && npm run dev

# Terminal 3: Start frontend
npm run dev

# Access:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001/api/v1
# Swagger Docs: http://localhost:3001/api/docs
```

### Database Migrations
```bash
cd server

# Create migration after schema change
npm run prisma:migrate

# View/edit data
npm run prisma:studio

# Reset database (development only)
npm run prisma:reset
```

## Important Notes

### Date Convention
All mock data uses dates starting from **2025-09** (September 2025):
- 2025-09 (September) for Q3 data
- 2025-10 (October) for Q4 data
- 2025-11 (November) for future planning
- 2025-12 (December) for year-end projections

### Environment Requirements
- Node.js ≥ 20.0.0
- npm ≥ 10.0.0
- Docker Desktop (for databases)
- 4 Docker containers must be running:
  - postgres-claude-mcp (port 5437)
  - neo4j-claude-mcp (ports 7688, 7475)
  - redis-claude-mcp (port 6382)
  - mongodb-claude-mcp (port 27018)

### Neo4j Cypher Query Best Practices
- Always use `toInteger()` for LIMIT clauses
- Only include numeric properties in graph projections
- Clean up graph projections after algorithm execution
- Use parameterized queries to prevent injection
- Add indexes for frequently queried properties

### Material-UI Component Usage
- Use `sx` prop for styling (not `style`)
- Prefer MUI components over raw HTML
- Use `@mui/icons-material` for icons
- Follow design system colors and spacing

## Troubleshooting

### Frontend Build Fails
```bash
npm run type-check  # Check for TypeScript errors
rm -rf node_modules && npm install  # Reinstall dependencies
```

### Backend Won't Start
```bash
cd server
rm -rf node_modules && npm install
npm run prisma:generate  # Regenerate Prisma Client
```

### Database Connection Issues
```bash
# Check Docker containers
docker ps | grep -E "postgres|neo4j|redis|mongodb"

# Restart containers
docker restart postgres-claude-mcp neo4j-claude-mcp redis-claude-mcp mongodb-claude-mcp
```

### E2E Tests Failing
```bash
# Make sure dev server is running
npm run dev

# Run tests in UI mode to debug
npx playwright test --ui
```

## Documentation References

| Document | Description |
|----------|-------------|
| `README.md` | Project overview and quick start |
| `CICD-README.md` | CI/CD deployment guide |
| `MCP-EMPOWERMENT-README.md` | MCP integration quick start |
| `MCP-EMPOWERMENT-STRATEGY.md` | Complete MCP automation strategy (40+ pages) |
| `NEO4J-GDS-UPGRADE-PLAN.md` | Neo4j Graph Data Science implementation details |
| `sweetnight-geo-requirements.md` | Product requirements document |
| `sweetnight-geo-architecture.md` | System architecture diagrams |
| `sweetnight-geo-dev-doc.md` | Detailed API specifications |
| `/Users/cavin/CLAUDE.md` | Global Claude Code configuration (24 MCP servers) |

---

## Latest Development Status

### 🎉 2025-10-30: System Recovery & Process A Implementation

**Status**: ✅ Completed and Operational

**Completed Tasks**:

#### 1. System Recovery from Connection Errors
- ✅ Fixed frontend server connection refused error (port 5174)
- ✅ Resolved TypeScript enum compilation errors in `data-acquisition.service.ts`
- ✅ Installed missing dependencies (@nestjs/bull, socket.io, @nestjs/websockets)
- ✅ Created PostgreSQL database `claude_dev` and ran migrations
- ✅ Successfully started both frontend (5174) and backend (3001) servers

#### 2. Process A: Data Acquisition Hub Implementation
**Location**: `server/src/modules/data-acquisition/`

**Implemented Components**:
- ✅ **DataAcquisitionModule** - Complete NestJS module
- ✅ **DataAcquisitionService** - MCP integration service (384 lines)
- ✅ **DataAcquisitionController** - REST API endpoints
- ✅ **DataAcquisitionGateway** - WebSocket real-time updates
- ✅ **DTO definitions** - Type-safe data transfer objects

**API Endpoints** (Base: `/api/v1/data-acquisition`):
```
GET    /sources              # List all data sources
POST   /sources              # Create new data source
POST   /scrape/start         # Start scraping job
POST   /scrape/stop/:id      # Stop scraping
POST   /scrape/pause/:id     # Pause scraping
POST   /scrape/resume/:id    # Resume scraping
GET    /mcp-stats           # MCP usage statistics
GET    /logs                # Scraping activity logs
```

**MCP Integration Pipeline**:
```
Firecrawl (Scraping) → InfraNodus (Analysis) → MongoDB (Storage) → Neo4j (Graph)
```

**WebSocket Events**:
- `scraping-progress` - Real-time progress updates
- `data-source-created` - New source notifications
- `data-source-updated` - Status changes

#### 3. Current Running Services
```
Frontend (Vite + React):    ✅ Port 5174
Backend (NestJS):          ✅ Port 3001
PostgreSQL:                ✅ Port 5437
Neo4j:                     ✅ Port 7688 (Bolt), 7475 (HTTP)
Redis (Bull Queue):        ✅ Port 6382
WebSocket:                 ✅ Initialized
```

### Next Development Phase

#### Phase 1: Complete Process B-H (Priority: High)

**Process B: ETL Pipeline Viewer**
- [ ] Implement ETL monitoring dashboard
- [ ] Create data transformation pipeline visualization
- [ ] Add error handling and retry logic
- [ ] Integrate with Bull queue monitoring

**Process C: AIGC Studio**
- [ ] Build content generation interface
- [ ] Integrate Claude/GPT APIs for content creation
- [ ] Implement template management system
- [ ] Add batch generation capabilities

**Process D: Content Scoring Center**
- [ ] Implement E-E-A-T scoring algorithms
- [ ] Create scoring dashboard with metrics
- [ ] Add historical tracking and trends
- [ ] Integrate with content recommendations

**Process E: Multi-Channel Publisher**
- [ ] Build publishing workflow interface
- [ ] Integrate with Feishu, Notion, Slack
- [ ] Implement scheduling and automation
- [ ] Add publication status tracking

**Process F: Citation Monitor**
- [ ] Real-time citation tracking across 7 platforms
- [ ] Implement alert system for new citations
- [ ] Build citation strength analysis
- [ ] Create competitive comparison dashboard

**Process G: Analytics Dashboard**
- [ ] Aggregate metrics from all processes
- [ ] Build executive dashboard with KPIs
- [ ] Implement custom report generation
- [ ] Add data export capabilities

**Process H: GEO Mapping Network**
- [ ] Enhance three-layer visualization
- [ ] Add real-time data binding from Neo4j
- [ ] Implement interactive filtering
- [ ] Build export functionality

#### Phase 2: Integration & Optimization (Priority: Medium)

**MCP Workflow Automation**:
- [ ] Configure n8n workflows for all 8 processes
- [ ] Set up daily SERP monitoring workflow
- [ ] Implement weekly report generation
- [ ] Create content gap analysis automation

**Performance Optimization**:
- [ ] Implement Redis caching layer
- [ ] Optimize Neo4j queries with indexes
- [ ] Add pagination to all list endpoints
- [ ] Implement lazy loading for visualizations

#### Phase 3: Testing & Documentation (Priority: Medium)

**Testing Coverage**:
- [ ] Add unit tests for all services (target: 80%)
- [ ] Create E2E tests for critical workflows
- [ ] Implement integration tests for MCP pipelines
- [ ] Add performance benchmarking

**Documentation**:
- [ ] Create API documentation with examples
- [ ] Write user guide for each process
- [ ] Document MCP integration patterns
- [ ] Create troubleshooting guide

### Technical Debt & Issues

**Known Issues**:
- E2E tests: 2 tests failing (channel tags, report generation)
- API route duplication in DataAcquisitionController (`/api/v1/api/v1/`)
- Multiple background npm dev processes running (needs cleanup)

**Technical Debt**:
- Refactor mock data to use actual database queries
- Implement proper error boundaries in React components
- Add request validation middleware
- Standardize API response format

### Development Metrics

| Metric | Value | Target |
|--------|-------|---------|
| Frontend Pages Completed | 20/20 | 100% ✅ |
| Backend Modules | 8/8 | 100% ✅ |
| Process Implementation | 1/8 | 100% 🔄 |
| E2E Test Coverage | 80% | 95% |
| API Endpoints | 45+ | 60+ |
| MCP Integrations | 5/23 | 23 |

---

**Last Updated**: 2025-10-30
**Project Version**: 1.0.1
**Architecture**: Full-stack TypeScript (React + NestJS)
**Current Sprint**: Process Implementation (A-H)
