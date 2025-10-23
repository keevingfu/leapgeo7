# SweetNight GEO - 7-Step Workflow Visualization System

## Overview

The 7-step automated workflow is the core operational engine of the SweetNight GEO system. This document defines the visual design for representing workflow states, progress, and data flow across all 15 pages.

## The 7 Steps

1. **Roadmap Ingestor** - Monthly GEO roadmap intake
2. **Content Registry** - Content inventory management
3. **Prompt Landscape Builder** - P0-P3 priority hierarchy
4. **Content Ingestor** - Multi-format content processing
5. **Content Generator** - Multi-channel content distribution
6. **Citation Tracker** - 7-platform monitoring
7. **Feedback Analyzer** - KPI analysis and optimization

## Visual Design Principles

### Step Representation

Each step has:
- **Unique Color**: For instant visual identification
- **Icon**: Representing the step's function
- **Status Indicator**: Current state (idle, active, complete, error)
- **Progress Metric**: Percentage or count of processed items

### Color System

```typescript
const WorkflowColors = {
  step1: {
    primary: '#8B5CF6',    // Purple-500 (Ingest)
    light: '#EDE9FE',      // Purple-50
    dark: '#6D28D9',       // Purple-700
    icon: '📥'
  },
  step2: {
    primary: '#06B6D4',    // Cyan-500 (Registry)
    light: '#CFFAFE',      // Cyan-50
    dark: '#0E7490',       // Cyan-700
    icon: '📋'
  },
  step3: {
    primary: '#F59E0B',    // Amber-500 (Landscape)
    light: '#FEF3C7',      // Amber-50
    dark: '#D97706',       // Amber-700
    icon: '🗺️'
  },
  step4: {
    primary: '#3B82F6',    // Blue-500 (Ingest Content)
    light: '#DBEAFE',      // Blue-50
    dark: '#1D4ED8',       // Blue-700
    icon: '📥'
  },
  step5: {
    primary: '#10B981',    // Emerald-500 (Generate)
    light: '#D1FAE5',      // Emerald-50
    dark: '#059669',       // Emerald-700
    icon: '✍️'
  },
  step6: {
    primary: '#EC4899',    // Pink-500 (Track)
    light: '#FCE7F3',      // Pink-50
    dark: '#DB2777',       // Pink-700
    icon: '🔍'
  },
  step7: {
    primary: '#6366F1',    // Indigo-500 (Analyze)
    light: '#E0E7FF',      // Indigo-50
    dark: '#4F46E5',       // Indigo-700
    icon: '📊'
  }
};
```

## Component Specifications

### 1. Horizontal Workflow Stepper

**Use Cases**: Main navigation, progress tracking, dashboard overview

```typescript
interface WorkflowStepperProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  completedSteps: number[];
  errorSteps: number[];
  onStepClick: (step: number) => void;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Visual Layout:
// [1]───[2]───[3]───[4]───[5]───[6]───[7]
//  ✓    ✓    ▶    ○    ○    ○    ○
```

**Visual States**:
- **Completed**: Checkmark icon, step color background, solid connector
- **Current**: Play icon, animated pulse, bright color
- **Pending**: Circle outline, gray, dashed connector
- **Error**: X icon, red border, alert indicator

**Responsive Behavior**:
- **Desktop**: Full horizontal layout with labels
- **Tablet**: Compact icons, labels on hover
- **Mobile**: Vertical scrollable list

### 2. Circular Progress Indicator

**Use Cases**: Per-step progress on detail pages, mini-cards

```typescript
interface StepProgressProps {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  progress: number; // 0-100
  total?: number;
  processed?: number;
  size?: number; // diameter in pixels
}

// Magic UI Component: animated-circular-progress-bar
```

**Visual Specifications**:
- **Circle Size**: 80px (sm), 120px (md), 160px (lg)
- **Stroke Width**: 8px
- **Background Track**: Step color at 15% opacity
- **Progress Track**: Full step color
- **Center Content**: Step number + progress percentage

### 3. Flow Diagram (D3.js Force-Directed Graph)

**Use Cases**: BattlefieldMap page, relationship visualization

```typescript
interface FlowNode {
  id: string;
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  label: string;
  status: 'idle' | 'active' | 'complete' | 'error';
  metrics?: {
    count: number;
    throughput: number;
    latency: number;
  };
}

interface FlowEdge {
  source: string;
  target: string;
  dataFlow: number; // items per minute
  status: 'normal' | 'congested' | 'blocked';
}
```

**Visual Elements**:
- **Nodes**: Circles sized by throughput, colored by step
- **Edges**: Animated arrows showing data flow direction
- **Labels**: Step name + current count
- **Tooltips**: Detailed metrics on hover

**Animations**:
- Data particles flow along edges (SVG circles)
- Node pulse when processing
- Edge color changes based on congestion (green → yellow → red)

### 4. Timeline Visualization

**Use Cases**: WorkflowMonitor page, execution history

```typescript
interface WorkflowTimelineProps {
  executions: Array<{
    id: string;
    startTime: Date;
    endTime: Date;
    steps: Array<{
      step: number;
      duration: number;
      status: 'success' | 'failure';
    }>;
  }>;
  timeRange: 'hour' | 'day' | 'week' | 'month';
}

// Visual: Gantt-style chart with step colors
```

**Layout**:
- **X-axis**: Time (horizontal)
- **Y-axis**: Execution ID (vertical)
- **Bars**: Colored segments for each step
- **Height**: Bar height indicates parallel processing capacity

### 5. Workflow Status Cards

**Use Cases**: Dashboard, quick status overview

```typescript
interface StepStatusCardProps {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  status: 'idle' | 'active' | 'complete' | 'error';
  metrics: {
    processed: number;
    failed: number;
    remaining: number;
    avgTime: string;
  };
  lastRun?: Date;
}

// Magic UI Components:
// - magic-card (spotlight effect)
// - number-ticker (animated counts)
// - animated-circular-progress-bar
```

**Card Layout**:
```
┌─────────────────────────────┐
│ 📥 Step 1: Roadmap Ingestor│
│                             │
│  [Progress Circle: 75%]     │
│                             │
│  Processed: 180             │
│  Remaining: 60              │
│  Avg Time: 2.3s             │
│  Last Run: 2 mins ago       │
│                             │
│  [View Details →]           │
└─────────────────────────────┘
```

**Visual States**:
- **Idle**: Gray border, no animation
- **Active**: Step color border, pulsing glow
- **Complete**: Green checkmark, subtle shine
- **Error**: Red border, shake animation

## Integration Patterns

### Dashboard Page

```tsx
// Top: Horizontal Workflow Stepper
<WorkflowStepper
  currentStep={3}
  completedSteps={[1, 2]}
  showLabels={true}
/>

// Grid: 7 Status Cards (3 columns on desktop, 1 on mobile)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {steps.map(step => (
    <StepStatusCard key={step.id} {...step} />
  ))}
</div>
```

### WorkflowMonitor Page

```tsx
// Left Sidebar: Vertical Step Navigator
<VerticalWorkflowNav currentStep={activeStep} />

// Main Content: Timeline + Flow Diagram
<WorkflowTimeline executions={recentRuns} />
<FlowDiagram nodes={workflowNodes} edges={dataFlow} />
```

### BattlefieldMap Page

```tsx
// Full-Screen: D3.js Force-Directed Graph
<ForceDirectedWorkflow
  nodes={contentNodes}
  edges={relationships}
  highlightStep={selectedStep}
  onNodeClick={handleNodeClick}
/>
```

## Animations & Transitions

### Data Flow Animation

**Particle System**: Small circles travel along edges from source to target
- **Particle Color**: Inherits step color
- **Speed**: Proportional to data flow rate
- **Density**: More particles = higher throughput

**Implementation**:
```typescript
// D3.js particle animation along path
const particles = svg.selectAll('.particle')
  .data(edgeData)
  .enter().append('circle')
  .attr('r', 3)
  .attr('fill', d => WorkflowColors[d.sourceStep].primary)
  .transition()
  .duration(d => 2000 / d.flowRate)
  .ease(d3.easeLinear)
  .attrTween('transform', pathTween);
```

### Step Activation Animation

When a step becomes active:
1. **Scale**: Grow from 100% → 110% → 105% (bounce effect)
2. **Glow**: Pulsing shadow with step color
3. **Border**: Animated border-beam effect (Magic UI)

```css
@keyframes stepActivate {
  0% { transform: scale(1); box-shadow: none; }
  50% { transform: scale(1.1); box-shadow: 0 0 20px var(--step-color); }
  100% { transform: scale(1.05); box-shadow: 0 0 15px var(--step-color); }
}
```

### Progress Transition

When progress updates:
- **Number Ticker**: Animate from old value to new (Magic UI)
- **Progress Bar**: Smooth fill animation with easing
- **Circular Progress**: Arc draws clockwise with spring physics

## Status Indicators

### Idle State
- **Color**: Gray-400 (#9CA3AF)
- **Icon**: Circle outline
- **Animation**: None
- **Opacity**: 60%

### Active State
- **Color**: Step color (full saturation)
- **Icon**: Play or spinning loader
- **Animation**: Pulse (1.5s interval)
- **Opacity**: 100%

### Complete State
- **Color**: Green-500 (#22C55E)
- **Icon**: Checkmark
- **Animation**: Subtle shine sweep
- **Opacity**: 85%

### Error State
- **Color**: Red-500 (#EF4444)
- **Icon**: X or alert triangle
- **Animation**: Shake (triggered once)
- **Opacity**: 100%

### Warning State
- **Color**: Yellow-500 (#EAB308)
- **Icon**: Exclamation mark
- **Animation**: Slow pulse
- **Opacity**: 90%

## Accessibility

### Keyboard Navigation
- **Tab Order**: Steps 1-7 in sequence
- **Enter/Space**: Activate step, view details
- **Arrow Keys**: Navigate between steps

### Screen Reader Support
```html
<div
  role="progressbar"
  aria-valuenow="75"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Step 1: Roadmap Ingestor - 75% complete"
>
  <!-- Visual progress indicator -->
</div>
```

### Color Contrast
- All step colors meet WCAG AA standards (4.5:1)
- Text labels always use dark text on light backgrounds
- Icon + text combination for clarity

## Data Flow Patterns

### Linear Flow (Default)
```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7
```

### Branching Flow
```
Step 3 (Prompt Landscape)
  ├─→ P0 Content → Step 5 (Fast Track)
  ├─→ P1 Content → Step 4 → Step 5
  └─→ P2/P3 Content → Queue
```

### Feedback Loop
```
Step 7 (Feedback) ──┐
                    ↓
                 Step 1 (Roadmap Update)
                    ↓
              [Workflow Restarts]
```

### Parallel Processing
```
Step 4 (Content Ingestor)
  ├─→ YouTube Content  ─┐
  ├─→ Reddit Content   ─┤
  ├─→ Medium Content   ─┼─→ Step 5 (Generator)
  ├─→ Blog Content     ─┤
  └─→ LinkedIn Content ─┘
```

## Responsive Design

### Desktop (> 1024px)
- Full horizontal stepper with labels
- 3-column card grid
- Side-by-side flow diagram and timeline
- Rich tooltips and hover states

### Tablet (640px - 1024px)
- Compact horizontal stepper
- 2-column card grid
- Stacked flow diagram and timeline
- Tap-friendly touch targets

### Mobile (< 640px)
- Vertical step list with icons
- Single column card layout
- Scrollable timeline
- Simplified flow diagram

## Theme Support

### Light Mode
- Use colors as specified
- White card backgrounds
- Subtle shadows

### Dark Mode
- Darker step colors (use -300 variants)
- Dark card backgrounds (#1F2937)
- Stronger shadows for depth
- Reduce glow intensity

## Example Implementations

### Horizontal Stepper (React + Tailwind)

```tsx
export function WorkflowStepper({ currentStep, completedSteps }: Props) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isComplete = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const stepColor = WorkflowColors[`step${step.id}`];

        return (
          <React.Fragment key={step.id}>
            <div className={cn(
              "flex flex-col items-center",
              isCurrent && "animate-pulse"
            )}>
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  "border-2 transition-all duration-300",
                  isComplete && `bg-[${stepColor.primary}] border-[${stepColor.primary}]`,
                  isCurrent && `border-[${stepColor.primary}] ring-4 ring-[${stepColor.light}]`,
                  !isComplete && !isCurrent && "bg-gray-200 border-gray-300"
                )}
              >
                <span className="text-lg">{stepColor.icon}</span>
              </div>
              <span className="mt-2 text-sm font-medium">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2",
                isComplete ? `bg-[${stepColor.primary}]` : "bg-gray-300"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
```

### Flow Diagram (D3.js)

```typescript
// Force simulation for workflow visualization
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(edges).id(d => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

// Node rendering
const node = svg.selectAll(".node")
  .data(nodes)
  .enter().append("g")
  .attr("class", "node")
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

node.append("circle")
  .attr("r", d => d.metrics.throughput / 10)
  .attr("fill", d => WorkflowColors[`step${d.step}`].primary)
  .attr("stroke", "#fff")
  .attr("stroke-width", 2);

node.append("text")
  .text(d => d.label)
  .attr("text-anchor", "middle")
  .attr("dy", ".35em");
```

---

**Version**: 1.0
**Last Updated**: 2025-10-21
**Designer**: Claude Code + BMAD UX Expert
**Status**: Design System Approved ✅
