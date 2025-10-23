# KPI Dashboard Page - Design Specification

**Page**: KPI Dashboard
**Route**: `/kpi`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "KPI Dashboard"  │  [Export PDF] [Settings]        │
├─────────────────────────────────────────────────────────────┤
│  Time Range Selector: [7D] [30D] [90D] [YTD] [Custom]      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Primary KPI Cards (4 columns)                             │
│  ┌───────────────┬───────────────┬───────────────┬───────┐ │
│  │ Total         │ Citation      │ Content       │ ROI   │ │
│  │ Citations     │ Rate          │ Velocity      │       │ │
│  │   1,234       │   67%         │  89/month     │$45.2K │ │
│  │  +12.5% ↑     │  +8.2% ↑      │  +5 ↑         │+$12K↑ │ │
│  └───────────────┴───────────────┴───────────────┴───────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Left: Citation Performance (Line Chart, 60% width)        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Citations over Time                                   │ │
│  │ 300 │           ╱╲                                    │ │
│  │ 200 │       ╱───  ╲───╲                              │ │
│  │ 100 │   ╱───          ───╲                           │ │
│  │   0 └──────────────────────────────────► Time        │ │
│  │      Week 1  Week 2  Week 3  Week 4                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
│  Right: Platform Distribution (Pie Chart, 40% width)       │
│  ┌──────────────────────────────┐                          │
│  │ Citations by Platform        │                          │
│  │                              │                          │
│  │      ╱───────╲               │                          │
│  │    ╱ChatGPT  ╲               │                          │
│  │   │  45%     │               │                          │
│  │   │Perp 30%  │               │                          │
│  │    ╲Others   ╱               │                          │
│  │      ╲─────╱                 │                          │
│  └──────────────────────────────┘                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Content Performance Table                                  │
│  ┌────────────────┬─────┬───────┬──────┬──────┬─────────┐ │
│  │ Content        │ P   │ Cites │ CTR  │ Views│ GMV     │ │
│  ├────────────────┼─────┼───────┼──────┼──────┼─────────┤ │
│  │ YouTube: Best  │ P0  │ 156   │ 4.2% │ 12K  │ $8,400  │ │
│  │ Medium: Guide  │ P1  │ 89    │ 3.1% │ 7K   │ $4,200  │ │
│  │ Reddit: Disc   │ P2  │ 42    │ 2.5% │ 3K   │ $1,800  │ │
│  └────────────────┴─────┴───────┴──────┴──────┴─────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- KPI Card Background: #FFFFFF (Light), #1F2937 (Dark)
- Trend Up: #22C55E (Green-500)
- Trend Down: #EF4444 (Red-500)
- Chart Primary: #1976D2
- Chart Secondary: #FF6B35

**Spacing**:
- Card Gap: 24px
- Card Padding: 24px
- Chart Margin: 32px

**Typography**:
- KPI Label: 14px, Medium, #6B7280
- KPI Value: 36px, Bold, #111827
- Trend: 16px, Semibold
- Table Header: 14px, Semibold, #6B7280

## Components Used

1. **PageHeader**
   - Title: "KPI Dashboard"
   - Subtitle: "Performance metrics and ROI tracking"
   - Actions: [Export PDF, Settings]

2. **TimeRangeSelector**
   - Quick selects: 7D, 30D, 90D, YTD
   - Custom date range picker
   - Updates all charts and metrics

3. **KPICard** (×4)
   - Large number ticker for value
   - Trend indicator (up/down arrow + percentage)
   - Mini sparkline chart (optional)
   - Click to drill down

4. **CitationPerformanceChart** (recharts Line Chart)
   - Multi-line: Citations, Content Created, Engagement
   - Interactive tooltip
   - Zoom and pan
   - Export as PNG

5. **PlatformDistributionChart** (recharts Pie/Donut Chart)
   - 7 platform segments
   - Legend with percentages
   - Click segment to filter table

6. **ContentPerformanceTable**
   - Sortable columns
   - Priority filtering
   - KPI highlighting (green for above target, red for below)

## Primary KPIs

**1. Total Citations**
```typescript
interface CitationKPI {
  current: number;        // 1,234
  previous: number;       // 1,098
  change: number;         // +12.5%
  target: number;         // 1,500
  targetProgress: number; // 82%
}
```

**2. Citation Rate**
```typescript
interface CitationRateKPI {
  rate: number;           // 67%
  numerator: number;      // 1,234 citations
  denominator: number;    // 1,843 content items
  change: number;         // +8.2%
  target: number;         // 75%
}
```

**3. Content Velocity**
```typescript
interface ContentVelocityKPI {
  perMonth: number;       // 89
  perWeek: number;        // 22
  change: number;         // +5
  target: number;         // 100/month
}
```

**4. ROI**
```typescript
interface ROIKPI {
  revenue: number;        // $45,200
  cost: number;           // $18,000
  profit: number;         // $27,200
  roi: number;            // 151%
  change: number;         // +$12,000
}
```

## Secondary Metrics

**Engagement Metrics**:
- Avg. CTR: 3.2%
- Total Views: 156K
- Total Comments: 1,240
- Social Shares: 890

**Quality Metrics**:
- Avg. Citation Strength: 2.3 / 3
- Content Approval Rate: 92%
- Time to Citation: 18 days avg

**Efficiency Metrics**:
- Avg. Content Production Time: 5.2 hours
- Content Reuse Rate: 34%
- Automation Rate: 67%

## Charts Specifications

### Citation Performance Chart (recharts)

```tsx
<LineChart width={800} height={400} data={performanceData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip content={<CustomTooltip />} />
  <Legend />
  <Line
    type="monotone"
    dataKey="citations"
    stroke="#1976D2"
    strokeWidth={3}
    dot={{ r: 5 }}
    activeDot={{ r: 7 }}
  />
  <Line
    type="monotone"
    dataKey="contentCreated"
    stroke="#FF6B35"
    strokeWidth={2}
    strokeDasharray="5 5"
  />
  <Line
    type="monotone"
    dataKey="engagement"
    stroke="#10B981"
    strokeWidth={2}
  />
</LineChart>
```

**Data Structure**:
```typescript
interface PerformanceData {
  date: string;
  citations: number;
  contentCreated: number;
  engagement: number;
  roi: number;
}
```

### Platform Distribution Chart (recharts)

```tsx
<PieChart width={400} height={400}>
  <Pie
    data={platformData}
    cx={200}
    cy={200}
    labelLine={false}
    label={renderCustomLabel}
    outerRadius={120}
    innerRadius={60}
    fill="#8884d8"
    dataKey="value"
  >
    {platformData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

**Data Structure**:
```typescript
interface PlatformData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const platformData = [
  { name: 'ChatGPT', value: 556, color: '#10A37F', percentage: 45 },
  { name: 'Perplexity', value: 370, color: '#6B46C1', percentage: 30 },
  { name: 'Claude', value: 185, color: '#C77B4A', percentage: 15 },
  { name: 'Others', value: 123, color: '#6B7280', percentage: 10 }
];
```

## Content Performance Table

**Columns**:
1. **Content** (40% width)
   - Thumbnail + Title
   - Channel badge
   - Priority badge

2. **Priority** (10%)
   - P0/P1/P2/P3 badge
   - Sortable

3. **Citations** (10%)
   - Number
   - Sortable
   - Color-coded (>100: green, 50-100: yellow, <50: red)

4. **CTR** (10%)
   - Percentage
   - Sortable
   - Sparkline chart

5. **Views** (10%)
   - Number with K/M formatting
   - Sortable

6. **GMV** (10%)
   - Currency formatted
   - Sortable
   - Trend indicator

7. **Actions** (10%)
   - View Details
   - Edit
   - Archive

**Sorting & Filtering**:
- Default sort: Citations DESC
- Filter by: Priority, Channel, Date Range
- Search by: Content title, Prompt

## Interactions

**KPI Card Click**:
1. Click KPI card
2. Drill-down modal opens
3. Shows detailed breakdown
4. Historical trend chart
5. Contributing factors

**Chart Interaction**:
1. Hover over data point → Tooltip shows details
2. Click data point → Filters table to that period
3. Zoom: Scroll wheel or pinch
4. Pan: Click and drag

**Platform Segment Click**:
1. Click pie chart segment
2. Table filters to that platform
3. Chart highlights selected segment
4. URL updates with filter

**Export PDF**:
1. Click "Export PDF" button
2. Generates PDF report with:
   - Current KPI values
   - All charts (as images)
   - Content performance table
   - Executive summary
3. Download file: `kpi-report-{date}.pdf`

## Target Lines & Alerts

**Target Lines on Charts**:
- Dashed horizontal line showing targets
- Color: #FFA500 (Orange)
- Tooltip: "Target: {value}"

**Alerts**:
- Citation rate below 60% → Yellow alert banner
- ROI below target → Red alert banner
- Content velocity below target → Orange alert

**Alert Banner**:
```
⚠️ Citation Rate Alert: Currently at 58%, target is 75%.
Review content strategy. [View Details →]
```

## Responsive Breakpoints

**Desktop (> 1024px)**:
- 4-column KPI cards
- Side-by-side charts (60/40 split)
- Full table with all columns

**Tablet (640px - 1024px)**:
- 2-column KPI cards
- Stacked charts
- Hide "Views" column in table

**Mobile (< 640px)**:
- Single column KPI cards
- Simplified charts (smaller size)
- Card-based table view
- Swipe to see more metrics

## Accessibility

- **Keyboard Navigation**: Tab through KPIs, chart controls
- **Screen Reader**: KPI values announced with trend direction
- **High Contrast**: Option to use patterns in charts instead of colors
- **Focus States**: Blue ring on focused elements

## Magic UI Integration

**Used Components**:
- `number-ticker` - Animated KPI values
- `animated-circular-progress-bar` - Target progress indicators
- `sparkles-text` - KPI labels
- `shimmer-button` - "Export PDF" CTA
- `badge` - Priority and status badges

**Implementation Example**:
```tsx
<KPICard>
  <KPILabel>Total Citations</KPILabel>
  <KPIValue>
    <NumberTicker value={1234} />
  </KPIValue>
  <TrendIndicator direction="up" value={12.5} />
  <AnimatedCircularProgressBar
    value={(1234 / 1500) * 100}
    size={80}
    strokeWidth={8}
    primaryColor="#10B981"
  />
</KPICard>

<CitationPerformanceChart
  data={performanceData}
  height={400}
  onDataPointClick={handleChartClick}
/>

<ContentPerformanceTable
  data={contentData}
  sortBy="citations"
  sortDirection="desc"
  onRowClick={handleRowClick}
/>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-kpi.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Chart Library: recharts

**Status**: ✅ Design Complete, Ready for Implementation
