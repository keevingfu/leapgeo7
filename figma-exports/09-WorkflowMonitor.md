# Workflow Monitor Page - Design Specification

**Page**: Workflow Monitor
**Route**: `/workflow`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Workflow Monitor"  │  [Trigger Run] [Settings]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Horizontal Workflow Stepper (7 steps)                     │
│  ●──────●──────●──────○──────○──────○──────○               │
│  Step1  Step2  Step3  Step4  Step5  Step6  Step7           │
│   ✅     ✅     ▶      ○      ○      ○      ○               │
│  2.3s   1.8s   45s                                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Left: Step Status Cards (30% width)                       │
│  ┌────────────────────────────┐                            │
│  │ ✅ Step 1: Roadmap Ingest  │                            │
│  │ 240 items processed        │                            │
│  │ 2.3s avg │ 100% success    │                            │
│  │ Last run: 2 mins ago       │                            │
│  └────────────────────────────┘                            │
│                                                              │
│  │ ✅ Step 2: Content Registry│                            │
│  │ 180 items indexed          │                            │
│  │ 1.8s avg │ 100% success    │                            │
│  └────────────────────────────┘                            │
│                                                              │
│  │ ▶ Step 3: Prompt Landscape │ ← Currently Running        │
│  │ 120/240 processed (50%)    │                            │
│  │ 45s elapsed │ ~45s remaining│                           │
│  │ [View Logs]                │                            │
│  └────────────────────────────┘                            │
│                                                              │
│  Right: Execution Timeline (70% width)                     │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Gantt-Style Timeline (Last 10 Executions)           │  │
│  │                                                      │  │
│  │ Run #123 │█████████████████████████│ 5.2min         │  │
│  │ Run #122 │█████████████████████████│ 5.0min         │  │
│  │ Run #121 │███████████████████████xx│ 4.8min (2 err) │  │
│  │ Run #120 │█████████████████████████│ 5.3min         │  │
│  │                                                      │  │
│  │ Color Legend:                                        │  │
│  │ █ Step1 █ Step2 █ Step3 █ Step4 ... █ Step7        │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Bottom: Real-Time Logs (Scrollable, 200px height)         │
│  [14:32:45] [Step 3] Processing prompt "Best mattress..."  │
│  [14:32:46] [Step 3] Calculated priority: P0, Score: 95    │
│  [14:32:47] [Step 3] Node created in Neo4j: prompt_542     │
│  [14:32:48] [Step 3] 121/240 complete (50.4%)              │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Step Colors: Workflow step colors (Purple, Cyan, Amber, Blue, Emerald, Pink, Indigo)
- Status Colors:
  - Running: #3B82F6 (Blue-500) with pulse animation
  - Success: #22C55E (Green-500)
  - Error: #EF4444 (Red-500)
  - Pending: #9CA3AF (Gray-400)
- Log Levels:
  - INFO: #6B7280 (Gray-500)
  - WARN: #F59E0B (Amber-500)
  - ERROR: #EF4444 (Red-500)

**Spacing**:
- Stepper Height: 120px
- Card Gap: 16px
- Card Padding: 20px

**Typography**:
- Step Label: 14px, Semibold
- Step Time: 12px, Regular, #6B7280
- Log Text: 13px, Monospace, #374151

## Components Used

1. **PageHeader**
   - Title: "Workflow Monitor"
   - Subtitle: "Real-time 7-step workflow execution monitoring"
   - Actions: [Trigger Manual Run, Settings]

2. **WorkflowStepper**
   - 7 steps horizontal layout
   - Step icons and labels
   - Progress indicator per step
   - Execution time below each step
   - Current step highlighted with pulse

3. **StepStatusCard** (×7)
   - Step number and name
   - Status icon (✅, ▶, ○, ❌)
   - Items processed count
   - Average execution time
   - Success rate percentage
   - Last run timestamp
   - [View Logs] button

4. **ExecutionTimeline** (D3.js Gantt Chart)
   - X-axis: Time (minutes)
   - Y-axis: Execution runs (latest at top)
   - Bars: Colored segments for each step
   - Tooltips: Step duration, errors
   - Click bar: View execution details

5. **RealTimeLogViewer**
   - Auto-scrolling log feed
   - Color-coded log levels
   - Filter by log level
   - Search logs
   - Download logs button

## Workflow Stepper States

**Step Visual States**:
```typescript
enum StepStatus {
  COMPLETED = 'completed',  // ✅ Green checkmark
  RUNNING = 'running',      // ▶ Blue play icon, pulse
  PENDING = 'pending',      // ○ Gray circle
  ERROR = 'error',          // ❌ Red X
  SKIPPED = 'skipped'       // ⏭ Gray forward icon
}

interface StepState {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  status: StepStatus;
  itemsProcessed: number;
  itemsTotal: number;
  avgTime: number; // seconds
  lastRun: Date;
  errorCount: number;
}
```

**Connector Line States**:
- **Completed**: Solid line, step color
- **Active**: Animated dashed line, flowing dots
- **Pending**: Dashed line, gray

## Step Status Card Specifications

**Card Layout**:
```
┌────────────────────────────┐
│ ▶ Step 3: Prompt Landscape │ ← Status icon + Name
│ 120/240 processed (50%)    │ ← Progress
│ 45s elapsed │ ~45s remaining│ ← Time estimate
│                            │
│ [Progress Bar: 50%]        │ ← Visual progress
│                            │
│ [View Logs] [Pause]        │ ← Actions
└────────────────────────────┘
```

**Running Step Features**:
- Animated progress bar
- Real-time percentage update (every 1s)
- Time remaining estimate
- [Pause] and [View Logs] buttons

**Completed Step Features**:
- Checkmark icon
- Total items processed
- Average time per item
- Success rate: 100% or <100% with error count

**Error Step Features**:
- Red X icon
- Error count and percentage
- [View Error Logs] button
- [Retry] button

## Execution Timeline Chart

**D3.js Gantt Chart**:
```typescript
interface ExecutionRun {
  runId: string;
  startTime: Date;
  endTime: Date;
  totalDuration: number; // milliseconds
  steps: {
    stepNumber: number;
    startTime: Date;
    endTime: Date;
    duration: number;
    status: 'success' | 'error' | 'skipped';
    itemsProcessed: number;
  }[];
}

// Visual: Stacked horizontal bars
const xScale = d3.scaleTime()
  .domain([
    d3.min(runs, d => d.startTime),
    d3.max(runs, d => d.endTime)
  ])
  .range([0, width]);

const yScale = d3.scaleBand()
  .domain(runs.map(d => d.runId))
  .range([0, height])
  .padding(0.2);
```

**Bar Segments**:
- Each step is a colored segment
- Width proportional to step duration
- Error steps have red hatch pattern
- Hover shows: Step name, duration, items processed

**Interactions**:
- Click bar → Open execution detail modal
- Hover segment → Tooltip with step details
- Zoom X-axis: Scroll wheel
- Pan: Click and drag

## Real-Time Log Viewer

**Log Entry Format**:
```
[Timestamp] [Log Level] [Step] Message
[14:32:45]  [INFO]      [Step 3] Processing prompt "Best mattress..."
[14:32:46]  [WARN]      [Step 3] Similarity calculation slow (2.5s)
[14:32:47]  [ERROR]     [Step 3] Neo4j connection timeout, retrying...
```

**Features**:
1. **Auto-Scroll**: Automatically scrolls to latest log
2. **Color Coding**: INFO (gray), WARN (yellow), ERROR (red)
3. **Filter Dropdown**: All, INFO, WARN, ERROR
4. **Search Bar**: Search log text
5. **Download Logs**: Export as .txt file

**Performance**:
- Max 1000 logs in view (older logs trimmed)
- WebSocket connection for real-time updates
- Virtualized scrolling for large logs

## Interactions

**Trigger Manual Run**:
1. Click "Trigger Run" button
2. Confirmation modal: "Start workflow execution?"
3. Options:
   - Run all steps
   - Run from specific step
   - Dry run (simulation mode)
4. Click "Start" → Workflow begins
5. Stepper updates in real-time

**Step Card Click**:
1. Click step status card
2. Drill-down panel opens
3. Shows:
   - Detailed metrics
   - Historical execution times chart
   - Recent logs for that step
   - Configuration settings

**View Logs Button**:
1. Click "View Logs" on running step
2. Log viewer scrolls to that step's logs
3. Filter automatically applied to show only that step

**Pause/Resume**:
1. Click "Pause" on running step
2. Workflow pauses after current item
3. Button changes to "Resume"
4. Click "Resume" → Workflow continues

**Execution Timeline Bar Click**:
1. Click timeline bar
2. Modal opens with full execution report:
   - Duration breakdown per step
   - Items processed summary
   - Error logs (if any)
   - Performance metrics
   - [Re-run] button

## Error Handling Display

**Error Step Card**:
```
┌────────────────────────────┐
│ ❌ Step 4: Content Ingest  │
│ FAILED (12 errors)         │
│                            │
│ Error Summary:             │
│ • Neo4j timeout: 5         │
│ • Invalid data: 4          │
│ • API rate limit: 3        │
│                            │
│ [View Error Details] [Retry]│
└────────────────────────────┘
```

**Error Detail Modal**:
- List of all errors with timestamps
- Stack traces (collapsible)
- Affected items (prompt IDs, content IDs)
- Retry options: All failed items, Specific item

## Performance Metrics Display

**Bottom Stats Bar**:
```
Overall Performance:
Avg Run Time: 5.1 minutes │ Success Rate: 94.2% │ Throughput: 47 items/min
Last 24h: 12 runs │ 2 failed │ 2,880 items processed
```

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Full horizontal stepper
- Side-by-side status cards and timeline (30/70 split)
- Full log viewer

**Tablet (640px - 1024px)**:
- Compact stepper (icons only)
- Stacked status cards and timeline
- Simplified log viewer

**Mobile (< 640px)**:
- Vertical stepper
- Single column layout
- Minimal log viewer (last 10 logs)

## Accessibility

- **Keyboard Navigation**: Tab through steps, cards, logs
- **Screen Reader**: Step status announced ("Step 3 running, 50% complete")
- **Focus States**: Blue ring on focused elements
- **ARIA Live Regions**: Log viewer and progress updates

## Magic UI Integration

**Used Components**:
- `animated-list` - Step status cards with entrance animation
- `number-ticker` - Animated item counts and percentages
- `animated-circular-progress-bar` - Step progress indicators
- `shimmer-button` - "Trigger Run" CTA
- `border-beam` - Running step border animation

**Implementation Example**:
```tsx
<WorkflowStepper
  steps={workflowSteps}
  currentStep={3}
  completedSteps={[1, 2]}
  errorSteps={[]}
/>

<AnimatedList>
  {stepStates.map(step => (
    <StepStatusCard
      key={step.stepNumber}
      {...step}
      onClick={() => openStepDetails(step)}
    />
  ))}
</AnimatedList>

<ExecutionTimeline
  runs={executionRuns}
  onBarClick={openExecutionDetail}
/>

<RealTimeLogViewer
  logs={logs}
  autoScroll={true}
  filterLevel={selectedLogLevel}
/>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-workflow.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Chart Library: D3.js + recharts

**Status**: ✅ Design Complete, Ready for Implementation
