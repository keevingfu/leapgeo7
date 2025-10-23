# Content Coverage Page - Design Specification

**Page**: Content Coverage Analysis
**Route**: `/coverage`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Content Coverage"  │  [Generate Gap Report]       │
├─────────────────────────────────────────────────────────────┤
│  Coverage Overview Cards (4 columns)                        │
│  ┌──────────────┬──────────────┬──────────────┬───────────┐│
│  │ Total Prompts│ Covered      │ Gaps (P0-P1) │ Coverage  ││
│  │    542       │    311       │     82       │   57.4%   ││
│  │              │  +12 (7d)    │    -5 (7d)   │  +2.1% ↑  ││
│  └──────────────┴──────────────┴──────────────┴───────────┘│
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Coverage Heatmap (2D: Channels × Priority)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         │ YouTube│ Medium │ Reddit │ Blog │ LinkedIn ││  │
│  │ ────────┼────────┼────────┼────────┼──────┼──────────││  │
│  │ P0 (24) │   18   │   12   │   15   │   8  │    10    ││  │
│  │         │ 75%🟢  │ 50%🟡  │ 63%🟡  │ 33%🔴│  42%🔴   ││  │
│  │ ────────┼────────┼────────┼────────┼──────┼──────────││  │
│  │ P1 (56) │   42   │   28   │   35   │  22  │    26    ││  │
│  │         │ 75%🟢  │ 50%🟡  │ 63%🟡  │ 39%🔴│  46%🔴   ││  │
│  │ ────────┼────────┼────────┼────────┼──────┼──────────││  │
│  │ P2 (89) │   58   │   45   │   52   │  38  │    42    ││  │
│  │         │ 65%🟡  │ 51%🟡  │ 58%🟡  │ 43%🔴│  47%🔴   ││  │
│  │ ────────┼────────┼────────┼────────┼──────┼──────────││  │
│  │ P3(142) │   78   │   68   │   72   │  58  │    62    ││  │
│  │         │ 55%🟡  │ 48%🔴  │ 51%🟡  │ 41%🔴│  44%🔴   ││  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Color Legend: 🟢 >70%  🟡 40-70%  🔴 <40%                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Left: Gap Analysis (40% width)                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Critical Gaps (P0-P1 only)                         │    │
│  │                                                     │    │
│  │ Sorted by: [Priority ▼] [GEO Score] [Quick Win]   │    │
│  │                                                     │    │
│  │ ┌────────────────────────────────────────────┐    │    │
│  │ │ ⚠️  Best mattress for back pain            │    │    │
│  │ │ P0 │ GEO: 95 │ QW: 85                      │    │    │
│  │ │ Missing: Medium, Blog, LinkedIn (3/7)      │    │    │
│  │ │ [Create Content]                           │    │    │
│  │ └────────────────────────────────────────────┘    │    │
│  │                                                     │    │
│  │ ┌────────────────────────────────────────────┐    │    │
│  │ │ ⚠️  Memory foam mattress comparison         │    │    │
│  │ │ P1 │ GEO: 82 │ QW: 78                      │    │    │
│  │ │ Missing: Reddit, Blog, Amazon Q&A (3/7)    │    │    │
│  │ │ [Create Content]                           │    │    │
│  │ └────────────────────────────────────────────┘    │    │
│  │                                                     │    │
│  │ [Load More Gaps...]                                │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Right: Completion Timeline (60% width)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Coverage Progress Over Time (Last 90 Days)           │  │
│  │                                                       │  │
│  │ 100% │                                 ╱─────────     │  │
│  │  80% │                         ╱───────              │  │
│  │  60% │                 ╱───────                      │  │
│  │  40% │         ╱───────                              │  │
│  │  20% │ ╱───────                                      │  │
│  │   0% └──────────────────────────────────────────►   │  │
│  │      D-90  D-60  D-30  D-15  D-7   Today           │  │
│  │                                                       │  │
│  │ Projection: 75% coverage by [2025-11-30] (+30 days) │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Coverage Good (>70%): #22C55E (Green-500)
- Coverage Medium (40-70%): #F59E0B (Amber-500)
- Coverage Low (<40%): #EF4444 (Red-500)
- Gap Alert: #FEF3C7 (Yellow-50) background

**Spacing**:
- Card Gap: 24px
- Card Padding: 20px
- Heatmap Cell Padding: 12px

**Typography**:
- Heatmap Header: 14px, Semibold, #374151
- Cell Count: 24px, Bold, #111827
- Cell Percentage: 14px, Medium, #6B7280
- Gap Card Title: 16px, Semibold, #111827

## Components Used

1. **PageHeader**
   - Title: "Content Coverage"
   - Subtitle: "Analyze prompt coverage across channels"
   - Actions: [Generate Gap Report]

2. **CoverageOverviewCards** (×4)
   - Total Prompts
   - Covered Prompts (with 7-day change)
   - Critical Gaps (P0-P1 only)
   - Overall Coverage Percentage

3. **CoverageHeatmap**
   - 2D grid: Channels (X) × Priority (Y)
   - Each cell: Count + Percentage + Color
   - Click cell → Filter gap list
   - Hover → Tooltip with details

4. **GapAnalysisList**
   - List of prompts missing content
   - Sorted by priority, GEO score, or Quick Win
   - Shows missing channels per prompt
   - "Create Content" button per gap

5. **CompletionTimeline** (recharts Area Chart)
   - Coverage percentage over time
   - Linear projection to target (75%)
   - Milestones marked

## Coverage Calculation

```typescript
interface CoverageData {
  totalPrompts: number;
  coveredPrompts: number;
  coveragePercentage: number;
  gapsByPriority: {
    P0: number;
    P1: number;
    P2: number;
    P3: number;
  };
  channelCoverage: {
    [channel: string]: {
      total: number;
      covered: number;
      percentage: number;
    };
  };
}

function calculateCoverage(prompts: Prompt[], content: Content[]): CoverageData {
  const totalPrompts = prompts.length;
  const coveredPromptIds = new Set(content.flatMap(c => c.covered_prompts));
  const coveredPrompts = coveredPromptIds.size;
  const coveragePercentage = (coveredPrompts / totalPrompts) * 100;

  // ... calculate gaps, channel coverage
  return {
    totalPrompts,
    coveredPrompts,
    coveragePercentage,
    gapsByPriority,
    channelCoverage
  };
}
```

## Coverage Heatmap Specifications

**Cell Content**:
```
┌────────────┐
│    18      │ ← Count (covered / total)
│   75% 🟢   │ ← Percentage + Indicator
└────────────┘
```

**Cell Color Coding**:
- Green (#DCFCE7): >70% coverage
- Amber (#FEF3C7): 40-70% coverage
- Red (#FEE2E2): <40% coverage

**Cell States**:
- **Default**: Filled with coverage color
- **Hover**: Border highlight, tooltip shows details
- **Click**: Filters gap list to that cell (Priority + Channel)

**Tooltip Content**:
```
P0 × YouTube:
18 of 24 prompts covered (75%)
6 gaps remaining
Top gaps:
• Best mattress for back pain
• Memory foam comparison
[View All Gaps →]
```

## Gap Analysis List Specifications

**Gap Card Layout**:
```
┌────────────────────────────────────────────┐
│ ⚠️  Best mattress for back pain            │ ← Alert icon + Prompt text
│ P0 │ GEO: 95 │ QW: 85                      │ ← Priority + Scores
│                                            │
│ Coverage: 4/7 channels (57%)               │ ← Coverage summary
│ ✅ YouTube ✅ Reddit ✅ Quora ✅ Amazon     │ ← Covered channels (green)
│ ❌ Medium ❌ Blog ❌ LinkedIn               │ ← Missing channels (red)
│                                            │
│ Impact: High │ Effort: 6 hours             │ ← Quick Win metrics
│                                            │
│ [Create Content for Medium]                │ ← Primary action
│ [View Details] [Dismiss Gap]               │ ← Secondary actions
└────────────────────────────────────────────┘
```

**Sorting Options**:
- Priority (Default): P0 → P1 → P2 → P3
- GEO Score: Highest to lowest
- Quick Win Index: Highest to lowest
- Missing Channels: Most missing to least

**Filtering**:
- Priority: P0, P1, P2, P3, All
- Channel: Filter by specific missing channel
- Impact: High, Medium, Low

## Completion Timeline Chart

**recharts Area Chart**:
```tsx
<AreaChart width={800} height={300} data={timelineData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis domain={[0, 100]} label={{ value: 'Coverage %', angle: -90 }} />
  <Tooltip content={<CustomTooltip />} />
  <Area
    type="monotone"
    dataKey="coverage"
    stroke="#1976D2"
    fill="#EBF5FF"
    fillOpacity={0.6}
  />
  <ReferenceLine
    y={75}
    label="Target: 75%"
    stroke="#F59E0B"
    strokeDasharray="3 3"
  />
  <ReferenceLine
    x={projectedDate}
    label="Projected"
    stroke="#22C55E"
    strokeDasharray="5 5"
  />
</AreaChart>
```

**Data Structure**:
```typescript
interface TimelineData {
  date: string;
  coverage: number; // 0-100%
  coveredCount: number;
  totalCount: number;
  newContent: number; // Content added that day
}
```

**Projection Algorithm**:
```typescript
function projectCoverageDate(
  currentCoverage: number,
  targetCoverage: number,
  historicalData: TimelineData[]
): Date {
  // Calculate average daily coverage increase over last 30 days
  const avgDailyIncrease = calculateAverageDailyIncrease(historicalData);

  // Calculate days needed to reach target
  const coverageGap = targetCoverage - currentCoverage;
  const daysToTarget = Math.ceil(coverageGap / avgDailyIncrease);

  // Return projected date
  return addDays(new Date(), daysToTarget);
}
```

## Interactions

**Click Heatmap Cell**:
1. Click cell (e.g., P0 × Medium)
2. Gap list filters to show only P0 prompts missing Medium content
3. Cell highlights with blue border
4. Count shown: "Showing 12 gaps"
5. Click again to reset filter

**Create Content from Gap**:
1. Click "Create Content" on gap card
2. Redirects to ContentGenerator page
3. Pre-selects:
   - Prompt (from gap)
   - Channel (first missing channel)
   - Template (channel-specific)
4. User can immediately start creating

**Dismiss Gap**:
1. Click "Dismiss Gap" on gap card
2. Confirmation: "Mark this gap as intentional?"
3. Click "Dismiss" → Gap removed from list
4. Gap still tracked but not shown in critical list

**Generate Gap Report**:
1. Click "Generate Gap Report" in header
2. Report modal opens
3. Shows:
   - All gaps grouped by priority
   - Estimated effort per gap
   - Recommended action plan
   - Timeline to 100% coverage
4. Export as PDF or CSV

## Gap Report Structure

**Executive Summary**:
- Total gaps: 231
- Critical gaps (P0-P1): 82
- Estimated total effort: 420 hours
- Projected completion: 2025-12-15 (8 weeks)

**Gap Breakdown by Priority**:
```
P0 Gaps (24):
1. Best mattress for back pain
   Missing: Medium, Blog, LinkedIn
   Effort: 18 hours
   Impact: Very High

2. Memory foam comparison
   ...
```

**Recommended Action Plan**:
- Week 1-2: Focus on P0 gaps (24 prompts, 8 hours each)
- Week 3-4: P1 gaps with highest Quick Win Index
- Week 5-8: Remaining P1 and strategic P2 gaps

**Resource Allocation**:
- Content creators needed: 3 FTE
- Estimated budget: $12,000
- Tools required: Template library, AI assist

## Coverage Alerts

**Alert Types**:
1. **Critical Gap Alert**:
   - Trigger: New P0 prompt with <3 channels covered
   - Display: Red banner at top of page
   - Example: "⚠️  5 new P0 prompts have low coverage (<50%)"

2. **Stagnant Coverage Alert**:
   - Trigger: No coverage increase for 14+ days
   - Display: Yellow banner
   - Example: "⚠️  Coverage has not improved in 2 weeks. Review content strategy."

3. **Target Miss Alert**:
   - Trigger: Projected completion date > target date
   - Display: Orange banner
   - Example: "⚠️  Current pace won't meet Q4 target (75%). Increase velocity by 30%."

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Full heatmap (7 channels × 4 priorities)
- Side-by-side gap list and timeline (40/60)
- All coverage cards visible

**Tablet (640px - 1024px)**:
- Compact heatmap (scrollable horizontal)
- Stacked gap list and timeline
- 2-column coverage cards

**Mobile (< 640px)**:
- Simplified heatmap (one channel at a time, swipe to change)
- Single column layout
- Simplified gap cards

## Accessibility

- **Keyboard Navigation**: Tab through heatmap cells, gap cards
- **Screen Reader**: Heatmap cells announced with priority, channel, coverage percentage
- **Color Independence**: Coverage indicators use emoji + percentage (not just color)
- **Focus States**: Blue ring on focused elements

## Magic UI Integration

**Used Components**:
- `number-ticker` - Animated coverage percentages
- `animated-list` - Gap cards with entrance animation
- `badge` - Priority and channel badges
- `shimmer-button` - "Create Content" CTA

**Implementation Example**:
```tsx
<ContentCoverage>
  <CoverageOverviewCards data={coverageData} />

  <CoverageHeatmap
    data={heatmapData}
    onCellClick={handleCellClick}
  />

  <GapAnalysisList
    gaps={filteredGaps}
    sortBy={sortBy}
    onCreateContent={handleCreateContent}
  />

  <CompletionTimeline
    data={timelineData}
    target={75}
    projection={projectedDate}
  />
</ContentCoverage>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-coverage.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Chart Library: recharts

**Status**: ✅ Design Complete, Ready for Implementation
