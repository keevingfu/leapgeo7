# Citation Strength Analysis Page - Design Specification

**Page**: Citation Strength Analysis
**Route**: `/citation-strength`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Citation Strength Analysis"  │  [Export Report]   │
├─────────────────────────────────────────────────────────────┤
│  Strength Overview Cards (3 columns)                        │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Direct (⭐⭐⭐)│ Referenced(⭐⭐)│ Mentioned (⭐) │            │
│  │    342       │     567      │     325      │            │
│  │  +15 (7d)    │  +28 (7d)    │  +12 (7d)    │            │
│  │  Primary     │  Secondary   │  Tertiary    │            │
│  └──────────────┴──────────────┴──────────────┘            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Strength Distribution Chart (Left 50%)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Citation Strength Over Time (Last 90 Days)          │  │
│  │                                                       │  │
│  │ 100% │                                               │  │
│  │      │         ████████████████ Direct (⭐⭐⭐)        │  │
│  │  80% │     ████████████████████ Referenced (⭐⭐)     │  │
│  │      │ ████████████████████████ Mentioned (⭐)       │  │
│  │  60% │████████████████████████                       │  │
│  │      │                                               │  │
│  │   0% └──────────────────────────────────────────►   │  │
│  │      D-90  D-60  D-30  D-15  D-7   Today           │  │
│  │                                                       │  │
│  │ Stacked Area Chart (Recharts)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Platform Strength Breakdown (Right 50%)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Strength by Platform                                 │  │
│  │                                                       │  │
│  │ ChatGPT:    ⭐⭐⭐ 45  ⭐⭐ 78  ⭐ 23  (Total: 146)     │  │
│  │ Progress:   [████████████░░░] 73% strong             │  │
│  │                                                       │  │
│  │ Perplexity: ⭐⭐⭐ 38  ⭐⭐ 62  ⭐ 19  (Total: 119)     │  │
│  │ Progress:   [██████████░░░░░] 67% strong             │  │
│  │                                                       │  │
│  │ Claude:     ⭐⭐⭐ 32  ⭐⭐ 56  ⭐ 28  (Total: 116)     │  │
│  │ Progress:   [█████████░░░░░░] 62% strong             │  │
│  │                                                       │  │
│  │ Gemini:     ⭐⭐⭐ 28  ⭐⭐ 48  ⭐ 32  (Total: 108)     │  │
│  │ Progress:   [████████░░░░░░░] 58% strong             │  │
│  │                                                       │  │
│  │ [View All Platforms...]                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Content-Citation Correlation Matrix (Full Width)          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Content Performance × Citation Strength              │  │
│  │                                                       │  │
│  │         │ Direct (⭐⭐⭐)│Referenced(⭐⭐)│Mentioned(⭐)│  │
│  │ ────────┼──────────┼───────────┼──────────┤  │
│  │ P0 (24) │   18     │    4      │    2     │  │
│  │         │  75% 🟢  │   17% 🟡  │   8% 🔴  │  │
│  │ ────────┼──────────┼───────────┼──────────┤  │
│  │ P1 (56) │   42     │   10      │    4     │  │
│  │         │  75% 🟢  │   18% 🟡  │   7% 🔴  │  │
│  │ ────────┼──────────┼───────────┼──────────┤  │
│  │ P2 (89) │   48     │   28      │   13     │  │
│  │         │  54% 🟡  │   31% 🟡  │  15% 🔴  │  │
│  │ ────────┼──────────┼───────────┼──────────┤  │
│  │ P3(142) │   52     │   58      │   32     │  │
│  │         │  37% 🔴  │   41% 🔴  │  23% 🔴  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Color Legend: 🟢 >70%  🟡 40-70%  🔴 <40%                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Bottom: Top Performing Content (Sorted by Strength)       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ # │ Content Title            │ Strength│ Citations│ │  │
│  │ 1 │ Best mattress for back   │ ⭐⭐⭐    │   12     │ │  │
│  │   │ pain - YouTube video     │ Direct  │ 7 plat.  │ │  │
│  │ ──┼──────────────────────────┼─────────┼──────────┤ │  │
│  │ 2 │ Memory foam vs spring    │ ⭐⭐⭐    │    8     │ │  │
│  │   │ comparison - Medium      │ Direct  │ 5 plat.  │ │  │
│  │ ──┼──────────────────────────┼─────────┼──────────┤ │  │
│  │ 3 │ Sleep quality tips       │ ⭐⭐     │   15     │ │  │
│  │   │ - Reddit discussion      │ Ref'd   │ 6 plat.  │ │  │
│  │                                                       │  │
│  │ [Load More...]                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Direct Citation (⭐⭐⭐): #10B981 (Emerald-500)
- Referenced Citation (⭐⭐): #3B82F6 (Blue-500)
- Mentioned Citation (⭐): #F59E0B (Amber-500)
- Strength Good (>70%): #22C55E (Green-500)
- Strength Medium (40-70%): #F59E0B (Amber-500)
- Strength Low (<40%): #EF4444 (Red-500)

**Spacing**:
- Card Gap: 24px
- Card Padding: 20px
- Chart Gap: 32px

**Typography**:
- Section Title: 20px, Semibold, #111827
- Card Title: 16px, Medium, #374151
- Star Rating: 18px, Bold, #F59E0B
- Count: 24px, Bold, #111827
- Percentage: 14px, Medium, #6B7280

## Components Used

1. **PageHeader**
   - Title: "Citation Strength Analysis"
   - Subtitle: "Analyze citation quality across AI platforms"
   - Actions: [Export Report]

2. **StrengthOverviewCards** (×3)
   - Direct Citations (⭐⭐⭐) - Primary source
   - Referenced Citations (⭐⭐) - Secondary mention
   - Mentioned Citations (⭐) - Tertiary reference
   - 7-day change indicator

3. **StrengthDistributionChart** (recharts StackedArea)
   - Time-series data (90 days)
   - 3 layers: Direct, Referenced, Mentioned
   - Interactive tooltips
   - Zoom and pan controls

4. **PlatformStrengthBreakdown**
   - 7 AI platforms
   - Strength counts per platform
   - Progress bars showing "strong citation %" (Direct/Total)
   - Expand to see all platforms

5. **CorrelationMatrix**
   - 2D grid: Priority (Y) × Strength (X)
   - Cell color-coding by percentage
   - Click cell → Filter content list
   - Hover → Detailed tooltip

6. **TopPerformingContentTable**
   - Sortable columns
   - Strength badge per row
   - Citation count + platform count
   - Click row → View citation details

## Citation Strength Definitions

**Three-Tier System**:

### ⭐⭐⭐ Direct Citation (Strength: 3)
- **Definition**: Content is cited as primary source with explicit attribution
- **Examples**:
  - "According to SweetNight's guide on..."
  - "SweetNight recommends..."
  - "As explained in SweetNight's video..."
- **Value**: Highest credibility, strongest SEO impact
- **Color**: Emerald (#10B981)

### ⭐⭐ Referenced Citation (Strength: 2)
- **Definition**: Content is referenced without explicit attribution
- **Examples**:
  - "Experts suggest..." (with our content as source)
  - "Studies show..." (referencing our data)
  - "According to research..." (from our article)
- **Value**: Moderate credibility, good SEO impact
- **Color**: Blue (#3B82F6)

### ⭐ Mentioned Citation (Strength: 1)
- **Definition**: Brand or content topic is mentioned indirectly
- **Examples**:
  - "Brands like SweetNight offer..."
  - "Options include..." (listing us among others)
  - Peripheral mention without deep reference
- **Value**: Low credibility, minimal SEO impact
- **Color**: Amber (#F59E0B)

## Data Structure

```typescript
interface CitationStrength {
  citationId: string;
  contentId: string;
  platform: AIplatform;
  strength: 1 | 2 | 3; // Mentioned | Referenced | Direct
  detectedAt: Date;
  query: string;
  context: string; // Surrounding text
  attribution: string | null; // Exact attribution text
  url: string; // URL where citation appeared
}

interface StrengthMetrics {
  direct: {
    count: number;
    change7d: number;
    byPlatform: { [platform: string]: number };
  };
  referenced: {
    count: number;
    change7d: number;
    byPlatform: { [platform: string]: number };
  };
  mentioned: {
    count: number;
    change7d: number;
    byPlatform: { [platform: string]: number };
  };
  totalCitations: number;
  strongCitationRate: number; // (direct + referenced) / total
}

interface ContentStrengthScore {
  contentId: string;
  contentTitle: string;
  channel: Channel;
  citations: {
    direct: number;
    referenced: number;
    mentioned: number;
  };
  averageStrength: number; // Weighted average (3*direct + 2*ref + 1*mentioned) / total
  platformCount: number; // How many platforms cited this
  strengthTrend: 'improving' | 'stable' | 'declining';
}
```

## Strength Distribution Chart

**recharts StackedAreaChart**:
```tsx
<AreaChart width={800} height={400} data={strengthTimelineData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis label={{ value: 'Citation Count', angle: -90 }} />
  <Tooltip content={<CustomTooltip />} />
  <Legend />
  <Area
    type="monotone"
    dataKey="direct"
    stackId="1"
    stroke="#10B981"
    fill="#D1FAE5"
    name="Direct (⭐⭐⭐)"
  />
  <Area
    type="monotone"
    dataKey="referenced"
    stackId="1"
    stroke="#3B82F6"
    fill="#DBEAFE"
    name="Referenced (⭐⭐)"
  />
  <Area
    type="monotone"
    dataKey="mentioned"
    stackId="1"
    stroke="#F59E0B"
    fill="#FEF3C7"
    name="Mentioned (⭐)"
  />
</AreaChart>
```

**Data Structure**:
```typescript
interface TimelineData {
  date: string; // YYYY-MM-DD
  direct: number;
  referenced: number;
  mentioned: number;
  total: number;
}
```

## Platform Strength Breakdown

**Card Layout**:
```
┌────────────────────────────────────────────┐
│ ChatGPT 🤖                                 │
│                                            │
│ ⭐⭐⭐ Direct:      45 citations (31%)      │
│ ⭐⭐   Referenced:  78 citations (53%)      │
│ ⭐     Mentioned:   23 citations (16%)      │
│                                            │
│ Total: 146 citations                       │
│ Strong Citation Rate: 84% (⭐⭐⭐ + ⭐⭐)      │
│                                            │
│ [███████████████████░░] 84%                │
│                                            │
│ Trend: ↑ +12 citations (7d)                │
│ [View Details]                             │
└────────────────────────────────────────────┘
```

**Metrics**:
- Strong Citation Rate = (Direct + Referenced) / Total
- Color-coded progress bar:
  - Green (>80%): Excellent
  - Amber (60-80%): Good
  - Red (<60%): Needs improvement

## Correlation Matrix Specifications

**Cell Content**:
```
┌──────────┐
│    18    │ ← Count (Direct citations)
│  75% 🟢  │ ← Percentage + Indicator
└──────────┘
```

**Cell Color Coding**:
- Green (#DCFCE7): >70% strong citations
- Amber (#FEF3C7): 40-70% strong citations
- Red (#FEE2E2): <40% strong citations

**Calculation**:
```typescript
function calculateCellPercentage(
  priorityLevel: 'P0' | 'P1' | 'P2' | 'P3',
  strength: 1 | 2 | 3
): number {
  const totalContent = getContentCountByPriority(priorityLevel);
  const contentWithStrength = getContentWithCitationStrength(priorityLevel, strength);
  return (contentWithStrength / totalContent) * 100;
}

// Example: P0 content with Direct citations
// 18 out of 24 P0 content pieces have Direct citations = 75%
```

**Interaction**:
- Click cell → Filter content list to show only that priority + strength combination
- Hover → Tooltip with breakdown:
  ```
  P0 × Direct Citations:
  18 of 24 prompts have Direct citations (75%)
  Top performing:
  • Best mattress for back pain (12 citations)
  • Memory foam comparison (8 citations)
  [View All →]
  ```

## Top Performing Content Table

**Columns**:
1. **Rank** (#)
2. **Content Title** (with channel icon)
3. **Strength Badge** (⭐⭐⭐, ⭐⭐, ⭐)
4. **Citation Count** (total citations)
5. **Platform Count** (how many platforms)
6. **Average Strength** (weighted score)
7. **Trend** (↑↓→)
8. **Actions** ([View Details])

**Sorting Options**:
- Average Strength (default, descending)
- Citation Count (descending)
- Platform Count (descending)
- Recent Activity (newest first)

**Row Click**:
- Opens citation detail modal
- Shows all citations with context
- Grouped by platform
- Filterable by strength

## Interactions

**View Platform Details**:
1. Click platform card (e.g., ChatGPT)
2. Drill-down modal opens
3. Shows:
   - Citation timeline for this platform
   - Top cited content on this platform
   - Strength distribution chart
   - Recent citations with context

**Export Report**:
1. Click "Export Report" button
2. Modal opens with options:
   - Date range selector
   - Platform filter (all or specific)
   - Strength filter (all or specific)
   - Format: PDF, Excel, PowerPoint
3. Click "Generate" → Report generated
4. Download link appears

**Filter by Strength**:
1. Click strength badge in overview cards (⭐⭐⭐, ⭐⭐, ⭐)
2. Content table filters to show only that strength
3. Correlation matrix highlights relevant cells
4. Badge outlined to indicate active filter

**Correlation Matrix Cell Click**:
1. Click matrix cell (e.g., P0 × Direct)
2. Content table filters to:
   - Priority: P0
   - Strength: Direct (⭐⭐⭐)
3. Cell highlighted with blue border
4. Shows count: "Showing 18 content pieces"

## Strength Improvement Recommendations

**AI-Generated Insights Panel** (Bottom right):
```
💡 Recommendations to Improve Citation Strength:

1. P3 content has 37% Direct citations (below target 60%)
   → Action: Enhance P3 content with more data and research
   → Priority: Medium

2. Gemini shows only 58% strong citations
   → Action: Optimize content for Gemini's citation style
   → Priority: High

3. Top 10 performing content all have video format
   → Action: Prioritize video content creation
   → Priority: High

[Generate Full Report]
```

**Recommendation Types**:
- Platform-specific optimization
- Content format suggestions
- Priority rebalancing
- Citation style improvements

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Side-by-side charts (50/50)
- Full correlation matrix
- All overview cards visible

**Tablet (640px - 1024px)**:
- Stacked charts
- Compact correlation matrix (scrollable)
- 2-column overview cards

**Mobile (< 640px)**:
- Single column layout
- Simplified matrix (one strength at a time)
- Collapsible platform breakdown

## Accessibility

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader**: Matrix cells announced with priority, strength, percentage
- **Color Independence**: Strength indicators use stars + text (not just color)
- **Focus States**: Blue ring on focused elements

## Magic UI Integration

**Used Components**:
- `number-ticker` - Animated citation counts
- `animated-list` - Top performing content table
- `badge` - Strength badges with star icons
- `shimmer-button` - "Export Report" CTA
- `tooltip` - Matrix cell tooltips

**Implementation Example**:
```tsx
<CitationStrengthAnalysis>
  <StrengthOverviewCards data={strengthMetrics} />

  <StrengthDistributionChart
    data={timelineData}
    height={400}
  />

  <PlatformStrengthBreakdown
    platforms={platformStrengthData}
    onPlatformClick={handlePlatformDrilldown}
  />

  <CorrelationMatrix
    data={matrixData}
    onCellClick={handleCellFilter}
  />

  <TopPerformingContentTable
    content={topContent}
    sortBy="averageStrength"
    onRowClick={openCitationDetails}
  />
</CitationStrengthAnalysis>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-citation-strength.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react` + star emoji (⭐)
- Chart Library: recharts

**Status**: ✅ Design Complete, Ready for Implementation
