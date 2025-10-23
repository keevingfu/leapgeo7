# Prompt Landscape Page - Design Specification

**Page**: Prompt Landscape
**Route**: `/landscape`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Prompt Landscape"  │  [Export PNG] [Settings]     │
├─────────────────────────────────────────────────────────────┤
│  Filter Panel                                                │
│  [P0] [P1] [P2] [P3] │ Show: [All] [Covered] [Gaps]        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  2D Scatter Plot (D3.js + WebGL)                           │
│                                                              │
│  High GEO Score ↑                                           │
│  │           ● P0 (Red)                                     │
│  │      ●  ●  ● P0                                          │
│  │         ●     ● P1 (Orange)                              │
│  │    ●  ●   ●                                              │
│  │       ● P2    ● P1                                       │
│  │  ●       ●                                               │
│  │     ● P3  ● P2                                           │
│  │ ● P3          ● P3                                       │
│  └──────────────────────────────► High Quick Win Index      │
│                                                              │
│  Hover Tooltip: "Best mattress for back pain"              │
│  GEO: 95 | QW: 85 | P0 | Status: Not Covered               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Priority Distribution (Donut Chart)                        │
│  P0: 24 (4%) │ P1: 56 (10%) │ P2: 89 (16%) │ P3: 142 (26%) │
│  Gaps: 231 (42%)  ← Prompts without content                │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Background: #FAFAFA (Light), #0F172A (Dark)
- Grid Lines: #E5E7EB (subtle)
- Axis Labels: #6B7280
- Dot Colors: Priority colors (P0-P3)

**Spacing**:
- Chart Padding: 60px (for axis labels)
- Panel Margin: 24px

**Typography**:
- Axis Labels: 12px, Medium, #6B7280
- Tooltip: 14px, Regular, #111827
- Legend: 13px, Medium

## Components Used

1. **PageHeader**
   - Title: "Prompt Landscape"
   - Subtitle: "2D visualization of GEO opportunity space"
   - Actions: [Export PNG, Settings]

2. **FilterPanel**
   - Priority toggles (multi-select)
   - Coverage filter: All, Covered, Gaps
   - Visual indicators for active filters

3. **ScatterPlot** (D3.js + WebGL for performance)
   - X-axis: Quick Win Index (0-100)
   - Y-axis: Enhanced GEO Score (0-100)
   - Dots: One per prompt, colored by priority
   - Size: Proportional to content_hours_est
   - Zoom: Mouse wheel, pinch gesture
   - Pan: Click and drag

4. **InteractiveTooltip**
   - Position: Follow cursor with offset
   - Content: Prompt text, scores, priority, status
   - Appearance: Fade in 150ms
   - Disappearance: Fade out 100ms delay

5. **PriorityDistributionChart**
   - Donut chart (recharts)
   - Center: Total prompt count
   - Segments: P0, P1, P2, P3, Gaps
   - Legend: Bottom position with counts

6. **QuadrantOverlay**
   - Dividing lines at mean values
   - Quadrant labels: "Quick Wins", "Strategic", "Experimental", "Deprioritize"
   - Semi-transparent background tint per quadrant

## Scatter Plot Specifications

**D3.js Configuration**:
```typescript
interface PromptDataPoint {
  id: string;
  prompt: string;
  geo_score: number;
  quickwin_index: number;
  p_level: 'P0' | 'P1' | 'P2' | 'P3';
  covered: boolean;
  content_hours_est: number;
}

const xScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);

const radiusScale = d3.scaleSqrt()
  .domain([0, d3.max(data, d => d.content_hours_est)])
  .range([4, 20]);
```

**Dot Styling**:
- Filled dots: Covered prompts (solid color)
- Hollow dots: Uncovered prompts (border only)
- Border width: 2px
- Opacity: 0.8 (default), 1.0 (hover), 0.3 (filtered out)

**Zoom & Pan**:
- Zoom range: 0.5x to 10x
- Smooth transitions: 300ms
- Reset button: Double-click anywhere

## Quadrant Analysis

**Quadrant Definitions**:
```typescript
const quadrants = {
  quickWins: {
    label: "🚀 Quick Wins",
    xRange: [50, 100],
    yRange: [50, 100],
    bgColor: "rgba(34, 197, 94, 0.05)", // Green tint
    description: "High ROI, low effort - prioritize these!"
  },
  strategic: {
    label: "💎 Strategic",
    xRange: [0, 50],
    yRange: [50, 100],
    bgColor: "rgba(59, 130, 246, 0.05)", // Blue tint
    description: "High value, requires investment"
  },
  experimental: {
    label: "🧪 Experimental",
    xRange: [50, 100],
    yRange: [0, 50],
    bgColor: "rgba(234, 179, 8, 0.05)", // Yellow tint
    description: "Test and learn opportunities"
  },
  deprioritize: {
    label: "⏸️ Deprioritize",
    xRange: [0, 50],
    yRange: [0, 50],
    bgColor: "rgba(148, 163, 184, 0.05)", // Gray tint
    description: "Low priority, consider later"
  }
};
```

## Interactions

**Dot Hover**:
1. Dot enlarges to 125% size
2. Tooltip appears with fade-in
3. All other dots reduce opacity to 0.3
4. Border color intensifies

**Dot Click**:
1. Opens detail modal
2. Shows full prompt text
3. Displays covered content (if any)
4. Shows related prompts in Neo4j graph
5. Action buttons: Edit Priority, Create Content, View Details

**Filter Application**:
- Click priority toggle → Dots of that priority hide/show
- Coverage filter → Show only covered/uncovered prompts
- Transition: Fade out 200ms, fade in 200ms
- URL updates with filter params

**Export PNG**:
- Captures current view (including zoom/pan state)
- Includes legend and quadrant labels
- Resolution: 1920x1080
- Filename: `prompt-landscape-{date}.png`

## Priority Distribution Chart

**Donut Chart Specs**:
- Outer Radius: 100px
- Inner Radius: 60px (40% hole)
- Segment Colors: Priority colors + Gray for gaps
- Hover: Segment grows by 5px
- Click: Filters scatter plot to that priority

**Center Label**:
- Total Count: Large (32px, bold)
- Subtitle: "Total Prompts" (14px, regular)

**Legend**:
```
[●] P0 Core: 24 (4%)
[●] P1 Important: 56 (10%)
[●] P2 Opportunity: 89 (16%)
[●] P3 Reserve: 142 (26%)
[●] Gaps (No Content): 231 (42%)
```

## Performance Optimization

**WebGL Rendering**:
- Use WebGL for >1000 dots (via D3.js canvas)
- Fallback to SVG for <1000 dots
- Debounce zoom/pan events (16ms)

**Data Aggregation**:
- Pre-calculate quadrant counts
- Cache tooltip data
- Lazy load prompt text (on hover)

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Full scatter plot: 800x600px
- Quadrant overlay visible
- Donut chart: side-by-side with scatter

**Tablet (640px - 1024px)**:
- Reduced scatter plot: 600x500px
- Simplified quadrant labels
- Donut chart below scatter plot

**Mobile (< 640px)**:
- List view recommended instead of scatter
- Show priority distribution only
- Link to full desktop view

## Accessibility

- **Keyboard Navigation**: Tab to dots, Enter to view details
- **Screen Reader**: Each dot announced with priority and scores
- **High Contrast**: Option to use shapes instead of colors (circle, square, triangle, diamond for P0-P3)
- **Focus State**: Blue ring around focused dot

## Magic UI Integration

**Used Components**:
- `animated-gradient-text` - Quadrant labels
- `number-ticker` - Animated counts in donut center
- `shimmer-button` - "Export PNG" action
- `tooltip` - Interactive tooltips on dots

**Implementation Example**:
```tsx
<D3ScatterPlot
  data={promptData}
  xAccessor={(d) => d.quickwin_index}
  yAccessor={(d) => d.geo_score}
  colorAccessor={(d) => priorityColors[d.p_level]}
  sizeAccessor={(d) => d.content_hours_est}
  onDotClick={handleDotClick}
  onDotHover={handleDotHover}
  quadrants={quadrantConfig}
/>

<DonutChart
  data={priorityDistribution}
  colors={priorityColors}
  centerLabel={totalPrompts}
  onSegmentClick={filterByPriority}
/>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-landscape.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Chart Library: D3.js + recharts

**Status**: ✅ Design Complete, Ready for Implementation
