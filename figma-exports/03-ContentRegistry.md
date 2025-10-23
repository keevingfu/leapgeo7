# Content Registry Page - Design Specification

**Page**: Content Registry
**Route**: `/content`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Content Registry"  │  [Create Content] [Import]   │
├─────────────────────────────────────────────────────────────┤
│  View Switcher: [Grid] [List] [Heatmap]                     │
│  Filter: [All Channels] [Status] [Priority]  │  [Search 🔍] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Grid View (3 columns on desktop)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ YouTube     │  │ Medium      │  │ Reddit      │        │
│  │ Video Title │  │ Article     │  │ Discussion  │        │
│  │             │  │             │  │             │        │
│  │ P0 | 156 👁  │  │ P1 | 89 👁   │  │ P2 | 42 👁   │        │
│  │ ✅ Published │  │ 📝 Draft     │  │ ✅ Published │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ LinkedIn    │  │ Blog        │  │ Amazon QA   │        │
│  │ ...         │  │ ...         │  │ ...         │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                              │
│  Showing 1-18 of 156 content items                          │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Card Background: #FFFFFF (Light), #1F2937 (Dark)
- Channel Badge: Platform-specific colors
  - YouTube: #FF0000
  - Medium: #000000
  - Reddit: #FF4500
  - LinkedIn: #0A66C2
  - Blog: #1976D2
  - Amazon: #FF9900
  - Quora: #B92B27

**Spacing**:
- Card Padding: 20px
- Card Gap: 20px
- Section Margin: 24px

**Typography**:
- Card Title: 16px, Semibold, #111827
- Metadata: 14px, Regular, #6B7280
- Channel Label: 12px, Bold, uppercase

## Components Used

1. **PageHeader**
   - Title: "Content Registry"
   - Subtitle: "Manage multi-channel content library"
   - Actions: [Create Content, Import]

2. **ViewSwitcher**
   - Modes: Grid (default), List, Heatmap
   - Toggle buttons with icons
   - Persists selection in localStorage

3. **ContentCard**
   - Thumbnail/Preview
   - Channel badge (top-left)
   - Priority badge (top-right)
   - Title
   - Metadata row: Views, Status, Date
   - Actions menu (kebab icon)

4. **HeatMap View** (D3.js)
   - X-axis: Channels (7 platforms)
   - Y-axis: Months (12 months)
   - Color intensity: Content count
   - Tooltip: Click to see content list

5. **List View**
   - Compact table layout
   - Same columns as RoadmapManager
   - Thumbnail column (120x68px)

## Grid View Card Specifications

**Card Dimensions**:
- Width: 100% (responsive)
- Height: 280px (fixed)
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.08)

**Card Layout**:
```
┌─────────────────────────────┐
│ [YouTube] 📺          [P0]  │ ← Channel + Priority badges
│                             │
│   [Thumbnail 16:9]          │ ← Video/Image preview
│   or [Icon + Type]          │
│                             │
├─────────────────────────────┤
│ Best Mattress for Back...  │ ← Title (2 lines max, ellipsis)
├─────────────────────────────┤
│ 👁 1.2K  💬 45  📅 2d ago   │ ← Metrics
│ ✅ Published  │  ⚡ P0      │ ← Status + Priority
└─────────────────────────────┘
```

**Card States**:
- **Default**: White background, subtle shadow
- **Hover**: Scale 102%, shadow elevation
- **Selected**: Blue border (2px), background tint
- **Draft**: Dashed border, reduced opacity (80%)

## Heatmap View Specifications

**D3.js Configuration**:
```typescript
interface HeatmapCell {
  channel: string;
  month: string;
  count: number;
  avgPriority: string;
  contents: ContentItem[];
}

const colorScale = d3.scaleSequential()
  .domain([0, maxCount])
  .interpolator(d3.interpolateBlues);
```

**Layout**:
- Cell Size: 80x60px
- Gap: 2px
- Tooltip: Shows count + P0/P1/P2/P3 breakdown
- Click: Opens modal with content list

## Channel Badge Component

```typescript
interface ChannelBadgeProps {
  channel: 'youtube' | 'medium' | 'reddit' | 'linkedin' | 'blog' | 'amazon' | 'quora';
  size?: 'sm' | 'md' | 'lg';
}

const ChannelColors = {
  youtube: { bg: '#FF0000', icon: '📺', label: 'YouTube' },
  medium: { bg: '#000000', icon: '✍️', label: 'Medium' },
  reddit: { bg: '#FF4500', icon: '💬', label: 'Reddit' },
  linkedin: { bg: '#0A66C2', icon: '💼', label: 'LinkedIn' },
  blog: { bg: '#1976D2', icon: '📝', label: 'Blog' },
  amazon: { bg: '#FF9900', icon: '📦', label: 'Amazon Q&A' },
  quora: { bg: '#B92B27', icon: '❓', label: 'Quora' }
};
```

## Interactions

**Create Content Flow**:
1. Click "Create Content" button
2. Modal opens with template selector
3. User chooses channel + template
4. Template editor loads with variables
5. User fills in content
6. Preview → Publish/Save Draft

**Filter Application**:
- Channel filter: Multi-select dropdown
- Status filter: Published, Draft, Scheduled, Archived
- Priority filter: P0, P1, P2, P3, All
- Filters combine with AND logic
- URL updates with filter params

**Search**:
- Search scope: Title, covered prompts, tags
- Debounced 300ms
- Highlights matching text in results

**Card Actions Menu**:
- Edit Content
- Duplicate
- View Details
- Copy Link
- Archive
- Delete

## Responsive Breakpoints

**Desktop (> 1024px)**:
- 3-column grid
- Full heatmap with all channels
- Side-by-side filters

**Tablet (640px - 1024px)**:
- 2-column grid
- Compact heatmap
- Stacked filters

**Mobile (< 640px)**:
- Single column grid
- List view recommended
- Simplified heatmap (vertical scroll)

## Accessibility

- **Keyboard Navigation**: Arrow keys to navigate cards
- **Screen Reader**: Card content announced with priority and status
- **Focus Visible**: Card outline on keyboard focus
- **ARIA Labels**: All badges and icons labeled

## Magic UI Integration

**Used Components**:
- `bento-grid` - Content card grid layout
- `magic-card` - Content card with spotlight effect
- `animated-list` - List view with animations
- `shimmer-button` - "Create Content" CTA

**Implementation Example**:
```tsx
<BentoGrid cols={3} gap={5}>
  {contentItems.map((item) => (
    <MagicCard key={item.id} className="content-card">
      <ChannelBadge channel={item.channel} />
      <PriorityBadge level={item.priority} />
      <Thumbnail src={item.thumbnail} alt={item.title} />
      <CardTitle>{item.title}</CardTitle>
      <CardMetrics views={item.views} comments={item.comments} />
      <StatusBadge status={item.status} />
    </MagicCard>
  ))}
</BentoGrid>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-content.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Heatmap: D3.js + recharts

**Status**: ✅ Design Complete, Ready for Implementation
