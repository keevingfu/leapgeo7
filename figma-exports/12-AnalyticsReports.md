# Analytics Reports Page - Design Specification

**Page**: Analytics Reports
**Route**: `/analytics`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Analytics Reports"  │  [Generate Report] [Export] │
├─────────────────────────────────────────────────────────────┤
│  Report Templates:                                           │
│  [Monthly Summary] [Citation Analysis] [ROI Report] [Custom]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Report Builder (Left 40%)                                  │
│  ┌────────────────────────────┐                            │
│  │ Report Configuration       │                            │
│  │                            │                            │
│  │ Template: [Monthly Summary]│                            │
│  │                            │                            │
│  │ Date Range:                │                            │
│  │ [2025-09-01] to [2025-09-30]│                           │
│  │                            │                            │
│  │ Metrics to Include:        │                            │
│  │ ☑ Citations                │                            │
│  │ ☑ Content Performance      │                            │
│  │ ☑ Platform Distribution    │                            │
│  │ ☑ ROI Analysis             │                            │
│  │ ☑ Workflow Efficiency      │                            │
│  │ ☐ User Activity            │                            │
│  │                            │                            │
│  │ Filters:                   │                            │
│  │ Priority: [All ▼]          │                            │
│  │ Channel: [All ▼]           │                            │
│  │                            │                            │
│  │ Format:                    │                            │
│  │ ● PDF ○ Excel ○ PowerPoint│                            │
│  │                            │                            │
│  │ [Generate Report]          │                            │
│  └────────────────────────────┘                            │
│                                                              │
│  Report Preview (Right 60%)                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ SweetNight GEO - Monthly Summary Report              │  │
│  │ September 2025                                        │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Executive Summary                                     │  │
│  │ • 1,234 total citations (+12.5% MoM)                 │  │
│  │ • 89 new content pieces published                    │  │
│  │ • 67% citation rate (target: 75%)                    │  │
│  │ • $45.2K estimated ROI                               │  │
│  │                                                       │  │
│  │ [Citation Performance Chart]                          │  │
│  │ [Platform Distribution Chart]                         │  │
│  │ [Top Performing Content Table]                        │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Report Card Background: #FFFFFF
- Section Divider: #E5E7EB
- Chart Colors: Priority colors + Platform colors
- Template Active: #EBF5FF

**Spacing**:
- Builder Panel Padding: 24px
- Preview Padding: 32px
- Section Margin: 32px

**Typography**:
- Report Title: 28px, Bold, #111827
- Section Heading: 20px, Semibold, #374151
- Body Text: 15px, Regular, #1F2937
- Metric Value: 32px, Bold, #111827

## Components Used

1. **PageHeader**
   - Title: "Analytics Reports"
   - Subtitle: "Generate custom reports and export analytics"
   - Actions: [Generate Report, Export]

2. **ReportTemplates**
   - Horizontal tab bar
   - Pre-defined templates: Monthly Summary, Citation Analysis, ROI Report
   - Custom template option

3. **ReportBuilder**
   - Template selector
   - Date range picker
   - Metrics checklist
   - Filter controls
   - Format selector (PDF, Excel, PowerPoint)
   - Generate button

4. **ReportPreview**
   - Live preview of report
   - Scrollable content
   - Matches final export layout

5. **ExportModal**
   - Shows export progress
   - Download link when ready

## Report Templates

### 1. Monthly Summary Report

**Sections**:
1. **Executive Summary**
   - Total citations (with MoM change)
   - Content published
   - Citation rate
   - Estimated ROI

2. **Citation Performance**
   - Line chart: Citations over time (daily)
   - Platform distribution (pie chart)
   - Citation strength breakdown (bar chart)

3. **Content Performance**
   - Top 10 performing content (table)
   - Channel distribution (bar chart)
   - Content velocity trend (line chart)

4. **Priority Analysis**
   - Content by priority (donut chart)
   - P0 coverage percentage
   - Gap analysis

5. **ROI Analysis**
   - Revenue vs Cost
   - ROI by priority level
   - ROI trend over time

6. **Recommendations**
   - AI-generated recommendations based on data
   - Action items for next month

### 2. Citation Analysis Report

**Sections**:
1. **Citation Overview**
   - Total citations by platform
   - Citation rate trend
   - New vs returning citations

2. **Platform Deep Dive**
   - Per-platform analysis (7 platforms)
   - Citation strength distribution
   - Time to citation (avg days)

3. **Content Citation Map**
   - Which content got cited
   - Citation frequency per content
   - Cross-platform citations

4. **Competitive Analysis**
   - Citation share vs competitors (if data available)
   - Emerging topics

5. **Recommendations**
   - Platforms to focus on
   - Content types with highest citation rate

### 3. ROI Report

**Sections**:
1. **Financial Summary**
   - Total revenue
   - Total cost
   - Net profit
   - ROI percentage

2. **Cost Breakdown**
   - Content production costs
   - Tools and services
   - Labor costs

3. **Revenue Attribution**
   - Revenue by channel
   - Revenue by priority level
   - Revenue by content type

4. **ROI by Priority**
   - P0 ROI vs investment
   - P1, P2, P3 analysis
   - Priority optimization recommendations

5. **Projections**
   - Next quarter forecast
   - ROI targets

### 4. Custom Report

**User-configurable**:
- Select any combination of metrics
- Choose chart types
- Define custom date ranges
- Add custom text sections
- Include/exclude specific data

## Report Builder Specifications

**Template Selector**:
- Dropdown with 4 options
- Selecting template pre-fills metrics checkboxes
- User can still customize after selection

**Date Range Picker**:
- Start date and end date inputs
- Quick selects: Last 7 Days, Last 30 Days, This Month, Last Month, This Quarter, Custom
- Validation: Start date must be before end date

**Metrics Checklist**:
```typescript
interface ReportMetric {
  id: string;
  label: string;
  description: string;
  chartType: 'line' | 'bar' | 'pie' | 'table';
  enabled: boolean;
}

const availableMetrics = [
  {
    id: 'citations',
    label: 'Citations',
    description: 'Total citations and trends',
    chartType: 'line',
    enabled: true
  },
  {
    id: 'content_performance',
    label: 'Content Performance',
    description: 'Top performing content and metrics',
    chartType: 'table',
    enabled: true
  },
  // ... more metrics
];
```

**Filters**:
- Priority: Dropdown (All, P0, P1, P2, P3)
- Channel: Multi-select dropdown (All, YouTube, Medium, Reddit, etc.)
- Content Type: Dropdown (All, Video, Article, Post)

**Format Selector**:
- Radio buttons: PDF, Excel, PowerPoint
- PDF: Formatted report with charts as images
- Excel: Data tables with embedded charts
- PowerPoint: Presentation-ready slides

## Report Preview Specifications

**Layout**:
- Matches final export layout
- Page breaks indicated for PDF export
- Charts rendered in preview
- Tables with actual data

**Preview Update**:
- Real-time update as user changes configuration
- Debounced 500ms to avoid excessive re-renders

**Sections Rendered**:
1. **Cover Page**
   - Report title
   - Date range
   - Generated date
   - Company logo (SweetNight)

2. **Executive Summary**
   - Key metrics in large cards
   - Brief narrative summary (AI-generated)

3. **Charts and Tables**
   - Each selected metric rendered
   - Section headings
   - Explanatory text

4. **Recommendations**
   - Bullet list of recommendations
   - Next steps

5. **Appendix** (optional)
   - Methodology
   - Data sources
   - Glossary

## Chart Rendering

**Chart Types Used**:
- **Line Chart**: Time-series data (citations, content velocity)
- **Bar Chart**: Comparisons (channel performance, priority distribution)
- **Pie/Donut Chart**: Proportions (platform distribution, citation strength)
- **Table**: Detailed data (top content, metrics breakdown)
- **Heatmap**: Time-based patterns (citations by day of week)

**Chart Configuration for Export**:
- High DPI for PDF (300 dpi)
- Static images (no interactivity in export)
- Color-blind friendly palette
- Clear axis labels and legends

## Interactions

**Select Report Template**:
1. Click template tab
2. Report configuration auto-fills
3. Preview updates with template structure
4. User can still customize

**Change Date Range**:
1. Click date range picker
2. Select start and end dates (or quick select)
3. Preview updates with data from new range (1-2s delay)

**Toggle Metric**:
1. Click checkbox next to metric
2. If enabling:
   - Metric section appears in preview
   - Chart renders with data
3. If disabling:
   - Metric section removed from preview

**Generate Report**:
1. Click "Generate Report" button
2. Validation:
   - Date range valid
   - At least one metric selected
   - Format selected
3. If valid:
   - Progress modal opens
   - Shows generation steps:
     - Fetching data...
     - Generating charts...
     - Formatting report...
     - Finalizing export...
   - Each step shows progress bar
4. When complete:
   - Download link appears
   - Auto-download starts (if browser allows)
   - Success toast: "Report generated successfully"

**Export Report**:
1. Click "Export" in header (for previously generated reports)
2. Modal shows recent reports list
3. Click report to re-download
4. Or generate new report

## Report Generation Flow

**Backend Process**:
```typescript
async function generateReport(config: ReportConfig): Promise<ReportFile> {
  // 1. Fetch data
  const data = await fetchReportData(config.dateRange, config.filters);

  // 2. Generate charts
  const charts = await generateCharts(data, config.metrics);

  // 3. Format report based on output format
  let reportFile;
  if (config.format === 'pdf') {
    reportFile = await generatePDF(data, charts, config.template);
  } else if (config.format === 'excel') {
    reportFile = await generateExcel(data, charts);
  } else if (config.format === 'powerpoint') {
    reportFile = await generatePowerPoint(data, charts);
  }

  // 4. Store report for future access
  await storeReport(reportFile);

  return reportFile;
}
```

**Progress Tracking**:
- WebSocket connection for real-time progress updates
- Progress bar updates as each step completes
- Estimated time remaining displayed

## Generated Report Metadata

**Each report includes**:
- Report ID (UUID)
- Template used
- Date range
- Filters applied
- Generated date and time
- Generated by (user)
- File size
- Expiration date (auto-delete after 30 days)

**Report History**:
- Last 10 generated reports shown in Export modal
- Sortable by date, template, format
- Re-download or delete

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Side-by-side builder and preview (40/60)
- Full chart rendering

**Tablet (640px - 1024px)**:
- Stacked builder and preview
- Simplified chart views

**Mobile (< 640px)**:
- Builder only (no preview)
- Generate → Download directly
- Simplified interface

## Accessibility

- **Keyboard Navigation**: Tab through all form controls
- **Screen Reader**: All charts have alt text describing data
- **Focus States**: Blue ring on focused elements
- **Color Contrast**: All text meets WCAG AA in generated reports

## Magic UI Integration

**Used Components**:
- `shimmer-button` - "Generate Report" CTA
- `animated-list` - Report history list
- `number-ticker` - Animated metrics in preview
- `badge` - Template badges

**Implementation Example**:
```tsx
<AnalyticsReports>
  <ReportBuilder
    config={reportConfig}
    onChange={setReportConfig}
    onGenerate={handleGenerateReport}
  />

  <ReportPreview
    config={reportConfig}
    data={previewData}
  />

  <ShimmerButton onClick={handleGenerateReport}>
    Generate Report
  </ShimmerButton>
</AnalyticsReports>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-analytics.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Chart Library: recharts + chart.js
- PDF Generation: jsPDF or Puppeteer
- Excel Generation: ExcelJS
- PowerPoint Generation: PptxGenJS

**Status**: ✅ Design Complete, Ready for Implementation
