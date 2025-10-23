# Roadmap Manager Page - Design Specification

**Page**: Roadmap Manager
**Route**: `/roadmap`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Roadmap Manager"  │  [Import TSV] [Export]        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Filter Bar: [P0] [P1] [P2] [P3] [All]  │  [Search: 🔍]    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Data Table (50 rows per page)                             │
│  ┌────┬─────────────────┬────┬─────┬────────┬─────────┐   │
│  │ ☐  │ Prompt          │ P  │ GEO │ QW Idx │ Status  │   │
│  ├────┼─────────────────┼────┼─────┼────────┼─────────┤   │
│  │ ☐  │ Best mattress   │ P0 │ 95  │ 85     │ Active  │   │
│  │ ☐  │ Memory foam     │ P1 │ 78  │ 72     │ Pending │   │
│  │ ☐  │ Mattress sizes  │ P2 │ 65  │ 58     │ Draft   │   │
│  └────┴─────────────────┴────┴─────┴────────┴─────────┘   │
│                                                              │
│  Showing 1-50 of 542 prompts  │  [1] [2] [3] ... [11]     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Bulk Actions: [Generate Content] [Update Priority] [...]   │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Table Header: #F3F4F6 (Light), #374151 (Dark)
- Row Hover: #F9FAFB
- Selected Row: #EBF5FF
- Border: #E5E7EB

**Spacing**:
- Table Cell Padding: 16px vertical, 20px horizontal
- Row Height: 64px
- Header Height: 56px

**Typography**:
- Table Header: 14px, Semibold, #6B7280
- Table Cell: 15px, Regular, #111827
- Prompt Text: 15px, Medium, #1F2937

## Components Used

1. **PageHeader**
   - Title: "Roadmap Manager"
   - Subtitle: "Manage GEO content roadmap and priorities"
   - Actions: [Import TSV, Export CSV]

2. **PriorityFilter**
   - Horizontal button group
   - Show counts per priority
   - Multi-select enabled
   - Active state: priority color background

3. **DataTable**
   - Sortable columns: Priority, GEO Score, QW Index
   - Filterable by priority, status
   - Bulk selection with checkboxes
   - Row actions menu (kebab icon)
   - Pagination: 50 items per page

4. **PriorityBadge**
   - Size: medium
   - Show score on hover
   - Animated for P0 items

5. **SearchBar**
   - Debounced search (300ms)
   - Search scope: Prompt text, tags
   - Clear button

## Column Specifications

1. **Checkbox Column**
   - Width: 48px
   - Header: Select all checkbox
   - Body: Individual row checkbox

2. **Prompt Column**
   - Width: 40%
   - Ellipsis overflow
   - Tooltip on hover
   - Click to expand/edit

3. **Priority Column**
   - Width: 80px
   - PriorityBadge component
   - Click to change priority

4. **GEO Score Column**
   - Width: 100px
   - Number with color gradient
   - Sort enabled
   - 90-100: Green, 70-89: Yellow, <70: Red

5. **Quick Win Index Column**
   - Width: 100px
   - Progress bar visualization
   - Sort enabled

6. **Status Column**
   - Width: 120px
   - Status badge: Active, Pending, Draft, Archived
   - Color coded

7. **Actions Column**
   - Width: 60px
   - Kebab menu: Edit, Duplicate, Delete, View Details

## Interactions

**Filter Application**:
1. Click priority filter button
2. Table data filters instantly
3. URL updates with filter params
4. Count updates in filter buttons

**Bulk Actions**:
1. Select rows via checkboxes
2. Bulk action bar appears at bottom
3. Choose action from dropdown
4. Confirmation modal for destructive actions
5. Progress indicator for batch operations

**Row Click**:
- Single click: Select row
- Double click: Open detail modal
- Ctrl+Click: Multi-select

**Sorting**:
- Click column header to sort
- First click: ascending
- Second click: descending
- Third click: remove sort
- Visual indicator: arrow icon

**Search**:
- Type in search bar (debounced 300ms)
- Highlights matching text in results
- Clear button appears when text entered
- Enter key submits search

## Import TSV Flow

1. Click "Import TSV" button
2. File picker dialog opens
3. User selects .tsv file
4. Preview modal shows first 10 rows
5. User confirms column mapping
6. Progress bar shows import status
7. Success message with import summary
8. Table refreshes with new data

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Full table with all 7 columns
- Bulk actions bar at bottom
- Side-by-side filter and search

**Tablet (640px - 1024px)**:
- Hide Quick Win Index column
- Combine GEO Score and Status into single column
- Search bar moves below filters

**Mobile (< 640px)**:
- Card view instead of table
- Each card shows: Prompt, Priority badge, GEO score
- Swipe left for actions
- Filter chips instead of buttons

## Accessibility

- **Keyboard Navigation**: Tab through filters, search, table rows
- **Screen Reader**: Row count announcements, sort direction
- **Focus Trap**: Bulk action bar when active
- **ARIA Labels**: All interactive elements labeled

## Magic UI Integration

**Used Components**:
- `animated-list` - Table rows with stagger animation on load
- `number-ticker` - Animated GEO scores and counts
- `shimmer-button` - "Import TSV" primary action
- `badge` - Priority and status badges

**Implementation Example**:
```tsx
<DataTable
  columns={[
    { key: 'checkbox', width: '48px', sortable: false },
    { key: 'prompt', label: 'Prompt', width: '40%', sortable: true },
    { key: 'p_level', label: 'Priority', width: '80px', sortable: true,
      render: (row) => <PriorityBadge level={row.p_level} score={row.geo_score} />
    },
    { key: 'geo_score', label: 'GEO Score', width: '100px', sortable: true },
    { key: 'quickwin_index', label: 'Quick Win', width: '100px', sortable: true },
    { key: 'status', label: 'Status', width: '120px', sortable: true },
    { key: 'actions', width: '60px', sortable: false }
  ]}
  data={roadmapItems}
  onSelectionChange={handleSelectionChange}
  onSort={handleSort}
/>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-roadmap.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Table Component: Material-UI DataGrid

**Status**: ✅ Design Complete, Ready for Implementation
