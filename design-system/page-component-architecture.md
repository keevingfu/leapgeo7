# SweetNight GEO - 15 Core Pages Component Architecture

## Design Philosophy

Each page follows a consistent layout pattern with domain-specific components, ensuring:
- **Unified Visual Language**: Consistent header, navigation, and action patterns
- **Priority-First Design**: P0-P3 visual system integrated throughout
- **Workflow Integration**: 7-step workflow indicators on relevant pages
- **Data-Driven UI**: Real-time metrics and visualizations

## Common Layout Structure

```tsx
interface PageLayout {
  header: PageHeader;        // Title + breadcrumb + actions
  filters: FilterBar;        // P-level, date range, search
  content: ContentArea;      // Page-specific content
  sidebar?: SideNav;         // Optional navigation
  modals?: Modal[];          // Dialogs and overlays
}
```

## Page-by-Page Specifications

---

### 1. Dashboard (Homepage)

**Route**: `/`
**Purpose**: High-level KPI overview and quick access to key functions

**Components**:

```tsx
<Dashboard>
  {/* Header */}
  <PageHeader
    title="GEO Command Center"
    subtitle="Real-time insights and workflow status"
    actions={[
      <Button variant="primary">New Roadmap</Button>,
      <Button variant="outline">Generate Report</Button>
    ]}
  />

  {/* Workflow Stepper */}
  <WorkflowStepper
    currentStep={activeStep}
    completedSteps={[1, 2, 3]}
    className="mb-8"
  />

  {/* KPI Metrics Grid */}
  <BentoGrid cols={4} gap={6} className="mb-8">
    <MetricCard
      title="Total Prompts"
      value={542}
      change="+12%"
      trend="up"
      icon="📋"
      priority="P0"
    />
    <MetricCard
      title="Active Content"
      value={89}
      change="+5"
      trend="up"
      icon="✍️"
    />
    <MetricCard
      title="Citation Rate"
      value="67%"
      change="+8%"
      trend="up"
      icon="🔍"
    />
    <MetricCard
      title="ROI (3M)"
      value="$45.2K"
      change="+$12K"
      trend="up"
      icon="💰"
    />
  </BentoGrid>

  {/* Priority Distribution Chart */}
  <Card className="mb-8">
    <CardHeader>
      <h3>Priority Distribution</h3>
    </CardHeader>
    <CardContent>
      <DonutChart
        data={[
          { label: 'P0', value: 24, color: '#EF4444' },
          { label: 'P1', value: 56, color: '#F97316' },
          { label: 'P2', value: 89, color: '#EAB308' },
          { label: 'P3', value: 142, color: '#22C55E' }
        ]}
      />
    </CardContent>
  </Card>

  {/* Recent Activity */}
  <AnimatedList
    items={recentActivities}
    renderItem={(activity) => (
      <ActivityItem
        icon={activity.icon}
        title={activity.title}
        timestamp={activity.timestamp}
        priority={activity.priority}
      />
    )}
  />
</Dashboard>
```

**Magic UI Components Used**:
- `bento-grid` for KPI layout
- `number-ticker` for animated metrics
- `animated-list` for activity feed
- `animated-circular-progress-bar` for completion rates

---

### 2. RoadmapManager

**Route**: `/roadmap`
**Purpose**: Manage monthly GEO roadmaps and prompt intake

**Components**:

```tsx
<RoadmapManager>
  <PageHeader
    title="Roadmap Management"
    subtitle="Step 1: Roadmap Ingestor"
    actions={[
      <ImportButton>Import TSV</ImportButton>,
      <Button>Add Prompt</Button>
    ]}
  />

  {/* Filters */}
  <FilterBar>
    <PriorityFilter selectedPriorities={['P0', 'P1']} />
    <MonthSelector currentMonth="2025-10" />
    <SearchInput placeholder="Search prompts..." />
  </FilterBar>

  {/* Roadmap Table */}
  <DataTable
    columns={[
      { key: 'prompt', label: 'Prompt', width: '40%' },
      { key: 'p_level', label: 'Priority', render: (row) => (
        <PriorityBadge level={row.p_level} score={row.totalScore} />
      )},
      { key: 'geo_score', label: 'GEO Score', align: 'right' },
      { key: 'quickwin_index', label: 'Quick Win', align: 'right' },
      { key: 'hours', label: 'Est. Hours', align: 'right' },
      { key: 'actions', label: 'Actions', render: (row) => (
        <DropdownMenu>
          <MenuItem onClick={() => editPrompt(row)}>Edit</MenuItem>
          <MenuItem onClick={() => deletePrompt(row)}>Delete</MenuItem>
        </DropdownMenu>
      )}
    ]}
    data={roadmapItems}
    sortable={true}
    filterable={true}
    pagination={{
      pageSize: 50,
      currentPage: 1
    }}
  />

  {/* Bulk Actions */}
  <BulkActionBar
    selectedCount={selectedItems.length}
    actions={[
      { label: 'Export CSV', onClick: exportCSV },
      { label: 'Assign Priority', onClick: assignPriority },
      { label: 'Delete', onClick: bulkDelete, destructive: true }
    ]}
  />
</RoadmapManager>
```

**Key Features**:
- CSV/TSV import with field mapping
- Inline editing of priority scores
- Bulk priority recalculation
- Export to Content Registry

---

### 3. ContentRegistry

**Route**: `/content-registry`
**Purpose**: Content inventory management (Step 2)

**Components**:

```tsx
<ContentRegistry>
  <PageHeader
    title="Content Registry"
    subtitle="Step 2: Content Inventory Management"
    actions={[
      <Button>Add Content</Button>,
      <Button variant="outline">Import Inventory</Button>
    ]}
  />

  {/* View Switcher */}
  <ViewSwitcher
    views={['Grid', 'List', 'Coverage Map']}
    activeView="Grid"
  />

  {/* Grid View */}
  <ContentGrid>
    {contents.map(content => (
      <ContentCard
        key={content.id}
        contentId={content.id}
        title={content.title}
        channel={content.channel}
        coveredPrompts={content.coveredPrompts}
        kpis={{
          ctr: content.kpi_ctr,
          views: content.kpi_views,
          gmv: content.kpi_gmv
        }}
        status={content.publish_status}
        thumbnail={content.thumbnail}
        actions={[
          <IconButton icon="edit" onClick={() => edit(content)} />,
          <IconButton icon="analytics" onClick={() => viewAnalytics(content)} />,
          <IconButton icon="delete" onClick={() => delete(content)} />
        ]}
      />
    ))}
  </ContentGrid>

  {/* Coverage Heatmap */}
  <CoverageHeatmap
    prompts={allPrompts}
    contents={allContents}
    onCellClick={(prompt, content) => showRelationship(prompt, content)}
  />
</ContentRegistry>
```

**Key Features**:
- Multi-view (grid, list, heatmap)
- Content-to-prompt relationship mapping
- KPI tracking per content piece
- Channel distribution analysis

---

### 4. PromptLandscape

**Route**: `/prompt-landscape`
**Purpose**: P0-P3 priority hierarchy visualization (Step 3)

**Components**:

```tsx
<PromptLandscape>
  <PageHeader
    title="Prompt Landscape"
    subtitle="Step 3: Priority Hierarchy Builder"
    actions={[
      <Button>Recalculate Priorities</Button>,
      <Button variant="outline">Export Landscape</Button>
    ]}
  />

  {/* Priority Distribution */}
  <Card className="mb-6">
    <PriorityDistributionChart
      data={{
        P0: { count: 24, totalHours: 192 },
        P1: { count: 56, totalHours: 336 },
        P2: { count: 89, totalHours: 445 },
        P3: { count: 142, totalHours: 426 }
      }}
    />
  </Card>

  {/* 2D Scatter Plot: GEO Score vs Quick Win Index */}
  <Card>
    <CardHeader>
      <h3>Priority Landscape Visualization</h3>
      <p className="text-sm text-gray-600">
        Formula: Total Score = (GEO Score × 0.7) + (Quick Win × 0.3)
      </p>
    </CardHeader>
    <CardContent>
      <ScatterPlot
        data={prompts}
        xAxis={{ key: 'enhanced_geo_score', label: 'Enhanced GEO Score' }}
        yAxis={{ key: 'quickwin_index', label: 'Quick Win Index' }}
        colorBy="p_level"
        colorMap={{
          P0: '#EF4444',
          P1: '#F97316',
          P2: '#EAB308',
          P3: '#22C55E'
        }}
        onPointClick={(prompt) => showPromptDetail(prompt)}
        quadrants={[
          { x: 50, y: 50, label: 'High GEO / High Quick Win → P0' },
          { x: 50, y: 50, label: 'High GEO / Low Quick Win → P1' },
          { x: 50, y: 50, label: 'Low GEO / High Quick Win → P2' },
          { x: 50, y: 50, label: 'Low GEO / Low Quick Win → P3' }
        ]}
      />
    </CardContent>
  </Card>

  {/* Priority Thresholds Config */}
  <Card className="mt-6">
    <CardHeader>
      <h3>Priority Calculation Settings</h3>
    </CardHeader>
    <CardContent>
      <FormGroup>
        <Label>GEO Score Weight</Label>
        <Slider min={0} max={1} step={0.1} value={0.7} />
        <span>70%</span>
      </FormGroup>
      <FormGroup>
        <Label>Quick Win Weight</Label>
        <Slider min={0} max={1} step={0.1} value={0.3} />
        <span>30%</span>
      </FormGroup>
    </CardContent>
  </Card>
</PromptLandscape>
```

**Key Features**:
- Interactive 2D scatter plot (D3.js)
- Priority threshold configuration
- Automated recalculation engine
- Export to Neo4j graph database

---

### 5. ContentGenerator

**Route**: `/content-generator`
**Purpose**: Multi-channel content distribution (Step 5)

**Components**:

```tsx
<ContentGenerator>
  <PageHeader
    title="Content Generator"
    subtitle="Step 5: Multi-Channel Distribution"
    actions={[
      <ShimmerButton className="bg-red-500">
        Generate P0 Content
      </ShimmerButton>,
      <Button variant="outline">Queue Management</Button>
    ]}
  />

  {/* Template Selector */}
  <Card className="mb-6">
    <CardHeader>
      <h3>Select Content Template</h3>
    </CardHeader>
    <CardContent>
      <TemplateGrid>
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            name={template.name}
            icon={template.icon}
            description={template.description}
            onClick={() => selectTemplate(template)}
          />
        ))}
      </TemplateGrid>
    </CardContent>
  </Card>

  {/* Generation Form */}
  <Card>
    <CardHeader>
      <h3>Content Generation</h3>
    </CardHeader>
    <CardContent>
      <FormGroup>
        <Label>Source Prompt</Label>
        <Select
          options={prompts}
          value={selectedPrompt}
          onChange={setSelectedPrompt}
          renderOption={(prompt) => (
            <div className="flex items-center gap-2">
              <PriorityBadge level={prompt.p_level} size="sm" />
              <span>{prompt.text}</span>
            </div>
          )}
        />
      </FormGroup>

      <FormGroup>
        <Label>Target Channels</Label>
        <CheckboxGroup
          options={[
            { value: 'youtube', label: 'YouTube', icon: '📹' },
            { value: 'reddit', label: 'Reddit', icon: '🔴' },
            { value: 'medium', label: 'Medium', icon: 'M' },
            { value: 'quora', label: 'Quora', icon: 'Q' },
            { value: 'blog', label: 'Blog', icon: '📝' },
            { value: 'amazon', label: 'Amazon', icon: '🛒' },
            { value: 'linkedin', label: 'LinkedIn', icon: '💼' }
          ]}
          value={selectedChannels}
          onChange={setSelectedChannels}
        />
      </FormGroup>

      <FormGroup>
        <Label>Template Variables</Label>
        <VariableEditor
          template={selectedTemplate}
          values={templateValues}
          onChange={setTemplateValues}
        />
      </FormGroup>

      <Button
        onClick={generateContent}
        loading={isGenerating}
        className="w-full"
      >
        Generate Content
      </Button>
    </CardContent>
  </Card>

  {/* Generation Queue */}
  <Card className="mt-6">
    <CardHeader>
      <h3>Generation Queue</h3>
    </CardHeader>
    <CardContent>
      <QueueList
        items={generationQueue}
        renderItem={(item) => (
          <QueueItem
            status={item.status}
            prompt={item.prompt}
            channels={item.channels}
            progress={item.progress}
          />
        )}
      />
    </CardContent>
  </Card>
</ContentGenerator>
```

**Key Features**:
- 7 content templates (YouTube, Reddit, etc.)
- Variable substitution engine
- Batch generation with Bull queue
- Progress tracking per channel

---

### 6. CitationTracker

**Route**: `/citation-tracker`
**Purpose**: 7-platform citation monitoring (Step 6)

**Components**:

```tsx
<CitationTracker>
  <PageHeader
    title="Citation Tracker"
    subtitle="Step 6: Multi-Platform Monitoring"
    actions={[
      <Button>Scan Platforms</Button>,
      <Button variant="outline">Export Citations</Button>
    ]}
  />

  {/* Platform Status Grid */}
  <BentoGrid cols={4} gap={4} className="mb-8">
    {platforms.map(platform => (
      <PlatformStatusCard
        key={platform.name}
        name={platform.name}
        icon={platform.icon}
        citationCount={platform.citationCount}
        indexedPercent={platform.indexedPercent}
        lastScan={platform.lastScan}
        status={platform.status}
      />
    ))}
  </BentoGrid>

  {/* Citation Stream */}
  <Card>
    <CardHeader>
      <h3>Recent Citations</h3>
      <FilterBar>
        <PlatformFilter />
        <StrengthFilter options={['strong', 'medium', 'weak']} />
      </FilterBar>
    </CardHeader>
    <CardContent>
      <AnimatedList
        items={citations}
        renderItem={(citation) => (
          <CitationCard
            platform={citation.platform}
            url={citation.citation_url}
            contentId={citation.content_id}
            strength={citation.citation_strength}
            indexed={citation.ai_indexed}
            discoveredAt={citation.discovered_at}
          />
        )}
      />
    </CardContent>
  </Card>

  {/* Citation Strength Heatmap */}
  <Card className="mt-6">
    <CardHeader>
      <h3>Citation Strength Matrix</h3>
    </CardHeader>
    <CardContent>
      <HeatmapChart
        rows={contents}
        cols={platforms}
        getValue={(content, platform) => getCitationStrength(content, platform)}
        colorScale={['#FEE2E2', '#EF4444']}
      />
    </CardContent>
  </Card>
</CitationTracker>
```

**Key Features**:
- Real-time citation discovery (Firecrawl)
- Citation strength scoring
- Platform-specific tracking
- AI indexing verification

---

### 7. KPIDashboard

**Route**: `/kpi`
**Purpose**: Performance metrics and ROI analysis

**Components**:

```tsx
<KPIDashboard>
  <PageHeader
    title="KPI Dashboard"
    subtitle="Performance Metrics & ROI Analysis"
    actions={[
      <DateRangePicker />,
      <Button variant="outline">Export Report</Button>
    ]}
  />

  {/* Key Metrics */}
  <MetricRowLayout>
    <KPICard
      title="Citation Rate"
      value="67.3%"
      target="75%"
      change="+5.2%"
      trend="up"
      sparkline={citationRateHistory}
    />
    <KPICard
      title="Content Velocity"
      value="23"
      suffix="pieces/week"
      change="+4"
      trend="up"
      sparkline={velocityHistory}
    />
    <KPICard
      title="ROI (3M)"
      value="$45.2K"
      change="+$12K"
      trend="up"
      sparkline={roiHistory}
    />
    <KPICard
      title="P0 Completion"
      value="91%"
      target="95%"
      change="+3%"
      trend="up"
      sparkline={p0CompletionHistory}
    />
  </MetricRowLayout>

  {/* Charts */}
  <Grid cols={2} gap={6}>
    <Card>
      <CardHeader><h3>Citation Trend</h3></CardHeader>
      <CardContent>
        <LineChart
          data={citationTrendData}
          xAxis="date"
          yAxis="count"
          groupBy="platform"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><h3>Content Performance</h3></CardHeader>
      <CardContent>
        <BarChart
          data={contentPerformanceData}
          xAxis="content_id"
          yAxis={['views', 'ctr', 'gmv']}
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><h3>Priority Distribution</h3></CardHeader>
      <CardContent>
        <PieChart
          data={priorityDistribution}
          valueKey="count"
          labelKey="priority"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><h3>ROI by Priority</h3></CardHeader>
      <CardContent>
        <StackedBarChart
          data={roiByPriority}
          xAxis="month"
          stacks={['P0', 'P1', 'P2', 'P3']}
        />
      </CardContent>
    </Card>
  </Grid>
</KPIDashboard>
```

**Key Features**:
- Real-time metric updates (React Query)
- Sparkline trend indicators
- Comparative analytics
- Drill-down into individual metrics

---

### 8. BattlefieldMap

**Route**: `/battlefield-map`
**Purpose**: Force-directed graph of prompt relationships

**Components**:

```tsx
<BattlefieldMap>
  <PageHeader
    title="Battlefield Map"
    subtitle="Content Relationship Network"
    actions={[
      <Button>Refresh Graph</Button>,
      <Button variant="outline">Export SVG</Button>
    ]}
  />

  {/* Graph Controls */}
  <Card className="mb-4">
    <CardContent className="flex gap-4">
      <FormGroup>
        <Label>Layout Algorithm</Label>
        <Select
          options={['force-directed', 'hierarchical', 'circular']}
          value={layoutAlgorithm}
        />
      </FormGroup>
      <FormGroup>
        <Label>Filter by Priority</Label>
        <PriorityFilter />
      </FormGroup>
      <FormGroup>
        <Label>Node Size</Label>
        <Select options={['impact', 'citations', 'connections']} />
      </FormGroup>
    </CardContent>
  </Card>

  {/* Force-Directed Graph */}
  <Card className="h-[800px]">
    <ForceDirectedGraph
      nodes={graphNodes}
      edges={graphEdges}
      onNodeClick={(node) => showNodeDetail(node)}
      onNodeHover={(node) => highlightConnections(node)}
      colorBy="priority"
      sizeBy="citationCount"
      physics={{
        linkDistance: 100,
        chargeStrength: -300,
        centerForce: 0.1
      }}
    />
  </Card>

  {/* Legend */}
  <Card className="mt-4">
    <CardContent>
      <GraphLegend
        nodeTypes={[
          { color: '#EF4444', label: 'P0 Prompts' },
          { color: '#F97316', label: 'P1 Prompts' },
          { color: '#22C55E', label: 'Content' },
          { color: '#6366F1', label: 'Citations' }
        ]}
        edgeTypes={[
          { style: 'solid', label: 'Strong Relationship' },
          { style: 'dashed', label: 'Weak Relationship' }
        ]}
      />
    </CardContent>
  </Card>
</BattlefieldMap>
```

**Key Features**:
- D3.js force-directed layout
- Neo4j integration for graph queries
- Interactive node exploration
- Relationship strength visualization

---

### 9. WorkflowMonitor

**Route**: `/workflow-monitor`
**Purpose**: Real-time workflow execution tracking

**Components**:

```tsx
<WorkflowMonitor>
  <PageHeader
    title="Workflow Monitor"
    subtitle="Real-Time Execution Tracking"
    actions={[
      <Button>Trigger Workflow</Button>,
      <Button variant="outline">View Logs</Button>
    ]}
  />

  {/* Workflow Stepper with Live Status */}
  <WorkflowStepper
    currentStep={activeStep}
    completedSteps={[1, 2, 3]}
    errorSteps={[]}
    stepMetrics={{
      1: { processed: 240, total: 240, avgTime: '2.3s' },
      2: { processed: 89, total: 240, avgTime: '5.1s' },
      3: { processed: 240, total: 240, avgTime: '1.8s' },
      4: { processed: 45, total: 89, avgTime: '12.4s' }
    }}
  />

  {/* Execution Timeline */}
  <Card className="mt-6">
    <CardHeader><h3>Execution History</h3></CardHeader>
    <CardContent>
      <TimelineChart
        executions={workflowExecutions}
        xAxis="timestamp"
        yAxis="executionId"
        colorBy="status"
        onBarClick={(execution) => showExecutionDetail(execution)}
      />
    </CardContent>
  </Card>

  {/* Step Performance Metrics */}
  <Grid cols={3} gap={4} className="mt-6">
    {steps.map(step => (
      <Card key={step.id}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span>{step.icon}</span>
            <h4>Step {step.id}: {step.name}</h4>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatedCircularProgressBar
            value={(step.processed / step.total) * 100}
            size={100}
            strokeWidth={8}
            color={WorkflowColors[`step${step.id}`].primary}
          />
          <div className="mt-4 space-y-2">
            <MetricRow label="Processed" value={step.processed} />
            <MetricRow label="Remaining" value={step.total - step.processed} />
            <MetricRow label="Avg Time" value={step.avgTime} />
            <MetricRow label="Throughput" value={`${step.throughput}/min`} />
          </div>
        </CardContent>
      </Card>
    ))}
  </Grid>
</WorkflowMonitor>
```

**Key Features**:
- Live workflow status updates (WebSocket)
- Execution timeline (Gantt chart)
- Per-step performance metrics
- Error tracking and alerting

---

### 10. SystemSettings

**Route**: `/settings`
**Purpose**: System configuration and user preferences

**Components**:

```tsx
<SystemSettings>
  <PageHeader
    title="System Settings"
    subtitle="Configuration & Preferences"
  />

  <Tabs defaultValue="general">
    <TabsList>
      <TabsTrigger value="general">General</TabsTrigger>
      <TabsTrigger value="priority">Priority System</TabsTrigger>
      <TabsTrigger value="workflow">Workflow</TabsTrigger>
      <TabsTrigger value="integrations">Integrations</TabsTrigger>
      <TabsTrigger value="users">User Management</TabsTrigger>
    </TabsList>

    <TabsContent value="general">
      <Card>
        <CardHeader><h3>General Settings</h3></CardHeader>
        <CardContent>
          <FormGroup>
            <Label>System Name</Label>
            <Input value="SweetNight GEO" />
          </FormGroup>
          <FormGroup>
            <Label>Theme</Label>
            <Select options={['light', 'dark', 'system']} value="light" />
          </FormGroup>
          <FormGroup>
            <Label>Language</Label>
            <Select options={['en', 'zh']} value="en" />
          </FormGroup>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="priority">
      <Card>
        <CardHeader><h3>Priority Calculation</h3></CardHeader>
        <CardContent>
          <FormGroup>
            <Label>GEO Score Weight</Label>
            <Slider min={0} max={1} step={0.1} value={0.7} />
          </FormGroup>
          <FormGroup>
            <Label>Quick Win Weight</Label>
            <Slider min={0} max={1} step={0.1} value={0.3} />
          </FormGroup>
          <FormGroup>
            <Label>P0 Threshold</Label>
            <Input type="number" value={100} />
          </FormGroup>
          <FormGroup>
            <Label>P1 Threshold</Label>
            <Input type="number" value={75} />
          </FormGroup>
          <FormGroup>
            <Label>P2 Threshold</Label>
            <Input type="number" value={50} />
          </FormGroup>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Additional tabs... */}
  </Tabs>
</SystemSettings>
```

**Key Features**:
- Priority calculation configuration
- Workflow step customization
- API integration management
- User role and permission settings

---

### 11-15. Remaining Pages (Summary)

**11. TemplateEditor** (`/template-editor`)
- Rich text editor for 7 content templates
- Variable placeholder management
- Template versioning and preview

**12. AnalyticsReports** (`/analytics`)
- Custom report builder
- Scheduled report generation
- Export to PDF/Excel/CSV

**13. ContentCoverage** (`/coverage`)
- Prompt-to-content coverage matrix
- Gap analysis and recommendations
- Content reuse suggestions

**14. CitationStrength** (`/citation-strength`)
- Citation quality scoring
- Platform-specific strength analysis
- Improvement recommendations

**15. UserManagement** (`/users`)
- User roles and permissions
- Activity logs and audit trails
- Team collaboration settings

---

## Shared Component Library

### Core Components

```typescript
// Priority System
export { PriorityBadge } from './priority/PriorityBadge';
export { PriorityFilter } from './priority/PriorityFilter';
export { PriorityScoreIndicator } from './priority/PriorityScoreIndicator';

// Workflow
export { WorkflowStepper } from './workflow/WorkflowStepper';
export { StepStatusCard } from './workflow/StepStatusCard';
export { ForceDirectedWorkflow } from './workflow/ForceDirectedWorkflow';
export { WorkflowTimeline } from './workflow/WorkflowTimeline';

// Data Visualization
export { DonutChart } from './charts/DonutChart';
export { LineChart } from './charts/LineChart';
export { BarChart } from './charts/BarChart';
export { ScatterPlot } from './charts/ScatterPlot';
export { HeatmapChart } from './charts/HeatmapChart';

// Data Display
export { DataTable } from './data/DataTable';
export { MetricCard } from './data/MetricCard';
export { KPICard } from './data/KPICard';
export { ActivityItem } from './data/ActivityItem';

// Layout
export { PageHeader } from './layout/PageHeader';
export { FilterBar } from './layout/FilterBar';
export { BentoGrid } from './layout/BentoGrid';
export { Card, CardHeader, CardContent } from './layout/Card';

// Forms
export { Input } from './forms/Input';
export { Select } from './forms/Select';
export { Checkbox, CheckboxGroup } from './forms/Checkbox';
export { Slider } from './forms/Slider';
export { DateRangePicker } from './forms/DateRangePicker';

// Actions
export { Button } from './actions/Button';
export { ShimmerButton } from './actions/ShimmerButton';
export { IconButton } from './actions/IconButton';
export { DropdownMenu } from './actions/DropdownMenu';

// Feedback
export { Toast } from './feedback/Toast';
export { Modal } from './feedback/Modal';
export { ConfirmDialog } from './feedback/ConfirmDialog';
export { LoadingSpinner } from './feedback/LoadingSpinner';
```

---

## Design Tokens

```javascript
// colors.ts
export const colors = {
  priority: {
    p0: { primary: '#EF4444', light: '#FEE2E2', dark: '#DC2626' },
    p1: { primary: '#F97316', light: '#FFEDD5', dark: '#EA580C' },
    p2: { primary: '#EAB308', light: '#FEF9C3', dark: '#CA8A04' },
    p3: { primary: '#22C55E', light: '#DCFCE7', dark: '#16A34A' }
  },
  workflow: {
    step1: { primary: '#8B5CF6', light: '#EDE9FE', dark: '#6D28D9' },
    step2: { primary: '#06B6D4', light: '#CFFAFE', dark: '#0E7490' },
    step3: { primary: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
    step4: { primary: '#3B82F6', light: '#DBEAFE', dark: '#1D4ED8' },
    step5: { primary: '#10B981', light: '#D1FAE5', dark: '#059669' },
    step6: { primary: '#EC4899', light: '#FCE7F3', dark: '#DB2777' },
    step7: { primary: '#6366F1', light: '#E0E7FF', dark: '#4F46E5' }
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

// typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

// spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem'
};
```

---

**Version**: 1.0
**Last Updated**: 2025-10-21
**Designer**: Claude Code + Magic UI Integration
**Status**: Component Architecture Defined ✅
