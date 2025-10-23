# Dashboard Page - Design Specification

**Page**: Dashboard (Homepage)
**Route**: `/`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "GEO Command Center"  │  [New Roadmap] [Report]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Workflow Stepper (7 steps)                                │
│  ●──●──●──○──○──○──○                                        │
│                                                              │
├────────────────┬────────────────┬────────────────┬──────────┤
│ Total Prompts  │ Active Content │ Citation Rate  │ ROI      │
│    542         │      89        │     67%        │ $45.2K   │
│   +12% ↑       │     +5 ↑       │    +8% ↑       │ +$12K ↑  │
└────────────────┴────────────────┴────────────────┴──────────┘

├─────────────────────────────────────────────────────────────┤
│  Priority Distribution (Donut Chart)                        │
│                                                              │
│        [P0: 24]  [P1: 56]  [P2: 89]  [P3: 142]             │
│                                                              │
└─────────────────────────────────────────────────────────────┘

├─────────────────────────────────────────────────────────────┤
│  Recent Activity (Animated List)                            │
│  📋 Roadmap imported: 2025-10.tsv (2 mins ago)              │
│  ✍️  Content generated: YouTube script for P0 prompt        │
│  🔍 Citation discovered: Medium article cited               │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Background: #FFFFFF (Light), #111827 (Dark)
- Card Background: #F9FAFB (Light), #1F2937 (Dark)
- Primary Action: #1976D2
- Border: #E5E7EB

**Spacing**:
- Page Padding: 24px
- Card Gap: 24px
- Section Margin: 32px

**Typography**:
- Page Title: 32px, Bold, #111827
- Card Title: 18px, Semibold, #374151
- Metric Value: 36px, Bold, #111827
- Metric Label: 14px, Medium, #6B7280

## Components Used

1. **PageHeader**
   - Title: "GEO Command Center"
   - Subtitle: "Real-time insights and workflow status"
   - Actions: Primary button + Outline button

2. **WorkflowStepper**
   - Size: Large (120px per step)
   - Show Labels: Yes
   - Current Step: 3
   - Completed: [1, 2]

3. **BentoGrid**
   - Columns: 4 (Desktop), 2 (Tablet), 1 (Mobile)
   - Gap: 24px

4. **MetricCard** (×4)
   - Height: 140px
   - Background: White with subtle gradient
   - Border: 1px solid #E5E7EB
   - Hover: Shadow elevation

5. **DonutChart**
   - Diameter: 240px
   - Hole Radius: 40%
   - Legend Position: Bottom

6. **AnimatedList**
   - Item Height: 64px
   - Animation: Slide in from right (200ms stagger)
   - Max Items: 10

## Interactions

**On Page Load**:
1. Header fades in (300ms)
2. Workflow stepper animates from left (400ms)
3. Metric cards stagger in (100ms delay each)
4. Chart animates arc draws (500ms)
5. Activity list items slide in (200ms stagger)

**Metric Card Hover**:
- Scale: 102%
- Shadow: 0 4px 12px rgba(0,0,0,0.1)
- Transition: 200ms ease-out

**Activity Item Click**:
- Navigate to detail page
- Highlight animation (pulse once)

## Responsive Breakpoints

**Desktop (> 1024px)**:
- 4-column metric grid
- Full workflow stepper with labels
- Side-by-side chart and activity list

**Tablet (640px - 1024px)**:
- 2-column metric grid
- Compact workflow stepper
- Stacked chart and activity list

**Mobile (< 640px)**:
- 1-column layout
- Vertical workflow list
- Simplified chart

## Accessibility

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader**: aria-labels on all metrics and charts
- **Color Contrast**: WCAG AA compliant (4.5:1)
- **Focus States**: 3px blue ring on focused elements

## Magic UI Integration

**Used Components**:
- `bento-grid` - Metric card layout
- `number-ticker` - Animated metric values
- `animated-list` - Activity feed
- `shine-border` - Metric card borders (subtle)

**Implementation Example**:
```tsx
<BentoGrid cols={4} gap={6}>
  <MetricCard
    title="Total Prompts"
    value={542}
    change="+12%"
    trend="up"
  />
  {/* More metrics... */}
</BentoGrid>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-dashboard.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Chart Library: `recharts` + `d3.js`

**Status**: ✅ Design Complete, Ready for Implementation
