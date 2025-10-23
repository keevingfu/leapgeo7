# Citation Tracker Page - Design Specification

**Page**: Citation Tracker (Step 6 of Workflow)
**Route**: `/citations`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Citation Tracker"  │  [Scan All] [Add Manual]    │
├─────────────────────────────────────────────────────────────┤
│  Platform Tabs:                                              │
│  [ChatGPT] [Perplexity] [Claude] [Gemini] [You.com] [...] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Citation Summary Cards (4 columns)                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ [...] │
│  │ ChatGPT      │ │ Perplexity   │ │ Claude       │       │
│  │ 156 cites    │ │ 89 cites     │ │ 42 cites     │       │
│  │ +12 (7d)     │ │ +5 (7d)      │ │ +2 (7d)      │       │
│  │ 67% strength │ │ 54% strength │ │ 39% strength │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Citation Timeline (7-day trend, Line Chart)                │
│  Citations ↑                                                │
│  200 │           ●─────●                                    │
│  150 │       ●───         ───●                              │
│  100 │   ●───                   ───●                        │
│   50 │●───                           ───●                   │
│    0 └────────────────────────────────────► Time           │
│      Mon  Tue  Wed  Thu  Fri  Sat  Sun                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Citations Table (Selected Platform: ChatGPT)              │
│  ┌───────────────┬──────────┬─────────┬──────────────┐    │
│  │ Content       │ Prompt   │ Strength│ Last Seen    │    │
│  ├───────────────┼──────────┼─────────┼──────────────┤    │
│  │ YouTube: Best │ P0: Best │ ⭐⭐⭐   │ 2 hours ago  │    │
│  │ Medium: Guide │ P1: Foam │ ⭐⭐     │ 5 hours ago  │    │
│  │ Reddit: Disc  │ P2: Size │ ⭐       │ 1 day ago    │    │
│  └───────────────┴──────────┴─────────┴──────────────┘    │
│                                                              │
│  Citation Strength Legend:                                  │
│  ⭐⭐⭐ Direct (Primary source)                              │
│  ⭐⭐   Referenced (Secondary source)                        │
│  ⭐     Mentioned (Tertiary reference)                      │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Platform Colors:
  - ChatGPT: #10A37F (Green)
  - Perplexity: #6B46C1 (Purple)
  - Claude: #C77B4A (Copper)
  - Gemini: #4285F4 (Blue)
  - You.com: #FF6B35 (Orange)
  - SearchGPT: #00D4FF (Cyan)
  - Bing Chat: #008373 (Teal)
- Strength Stars: #F59E0B (Amber-500)
- Trend Up: #22C55E (Green-500)
- Trend Down: #EF4444 (Red-500)

**Spacing**:
- Card Gap: 20px
- Card Padding: 24px
- Table Row Height: 72px

**Typography**:
- Platform Name: 18px, Bold
- Citation Count: 32px, Bold, #111827
- Trend Indicator: 14px, Medium
- Table Cell: 15px, Regular

## Components Used

1. **PageHeader**
   - Title: "Citation Tracker"
   - Subtitle: "Monitor AI search engine citations across 7 platforms"
   - Actions: [Scan All Platforms, Add Manual Citation]

2. **PlatformTabs**
   - Horizontal scrollable tabs
   - Platform icon + name
   - Badge with citation count
   - Active tab highlighted with platform color

3. **CitationSummaryCard**
   - Platform name and icon
   - Total citation count (large number ticker)
   - 7-day trend (up/down indicator)
   - Average citation strength (percentage)
   - Click to filter table

4. **CitationTimeline** (recharts Line Chart)
   - Multi-line chart (one line per platform)
   - 7-day or 30-day view toggle
   - Interactive hover tooltip
   - Zoom and pan enabled

5. **CitationsTable**
   - Columns: Content, Prompt, Strength, Last Seen, Actions
   - Sortable by date, strength
   - Filterable by platform, strength
   - Row click opens citation detail modal

6. **CitationStrengthBadge**
   - 3-star rating system
   - Color: Gold stars
   - Tooltip with definition

## Platform Configuration

**7 Monitored Platforms**:
```typescript
interface Platform {
  id: string;
  name: string;
  color: string;
  icon: string;
  scanEnabled: boolean;
  apiKey?: string;
}

const platforms = [
  { id: 'chatgpt', name: 'ChatGPT', color: '#10A37F', icon: '🤖', scanEnabled: true },
  { id: 'perplexity', name: 'Perplexity', color: '#6B46C1', icon: '🔮', scanEnabled: true },
  { id: 'claude', name: 'Claude', color: '#C77B4A', icon: '🧠', scanEnabled: true },
  { id: 'gemini', name: 'Gemini', color: '#4285F4', icon: '✨', scanEnabled: true },
  { id: 'you', name: 'You.com', color: '#FF6B35', icon: '🌐', scanEnabled: true },
  { id: 'searchgpt', name: 'SearchGPT', color: '#00D4FF', icon: '🔍', scanEnabled: false },
  { id: 'bing', name: 'Bing Chat', color: '#008373', icon: '💬', scanEnabled: true }
];
```

## Citation Strength Scoring

**Scoring Algorithm**:
```typescript
enum CitationStrength {
  DIRECT = 3,      // ⭐⭐⭐ Primary source, directly cited
  REFERENCED = 2,  // ⭐⭐   Referenced as source
  MENTIONED = 1    // ⭐     Mentioned in context
}

function calculateStrength(citation: Citation): CitationStrength {
  const factors = {
    position: citation.position < 3 ? 2 : (citation.position < 10 ? 1 : 0),
    linkPresent: citation.hasLink ? 1 : 0,
    directQuote: citation.hasQuote ? 1 : 0
  };

  const score = factors.position + factors.linkPresent + factors.directQuote;

  if (score >= 3) return CitationStrength.DIRECT;
  if (score >= 2) return CitationStrength.REFERENCED;
  return CitationStrength.MENTIONED;
}
```

## Interactions

**Scan All Platforms**:
1. Click "Scan All" button
2. Progress modal shows per-platform status
3. Background worker queries each platform API
4. New citations detected and added to table
5. Summary cards update with new counts
6. Notification shows scan results

**Platform Tab Click**:
1. Click platform tab
2. Table filters to show citations from that platform
3. Timeline highlights that platform's line
4. URL updates with platform param

**Citation Row Click**:
1. Click table row
2. Modal opens with full citation details:
   - Screenshot of AI response
   - Full text of citation
   - Position in response
   - Link to original content
   - Citation strength factors
3. Actions: Verify, Edit, Archive

**Add Manual Citation**:
1. Click "Add Manual Citation"
2. Form opens:
   - Select platform
   - Select content
   - Enter citation URL
   - Paste AI response text
   - Set strength rating
3. Submit → Citation added to table

## Citation Detail Modal

**Layout**:
```
┌─────────────────────────────────────────────┐
│  Citation Details                     [×]   │
├─────────────────────────────────────────────┤
│                                             │
│  Platform: ChatGPT 🤖                       │
│  Content: YouTube - Best Mattress Guide    │
│  Prompt: P0 - Best mattress for back pain  │
│  Strength: ⭐⭐⭐ Direct                      │
│  First Seen: 2025-10-15 14:32              │
│  Last Verified: 2 hours ago                │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  AI Response Screenshot:                    │
│  [Image: ChatGPT response with highlight]  │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Citation Text:                             │
│  "According to SweetNight's comprehensive   │
│   guide on YouTube, the best mattress for  │
│   back pain combines memory foam with..."   │
│                                             │
│  Original Link:                             │
│  https://youtube.com/watch?v=...            │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Actions:                                   │
│  [✓ Verify] [Edit] [Archive] [Report Issue]│
└─────────────────────────────────────────────┘
```

## Timeline Chart Specifications

**recharts Configuration**:
```tsx
<LineChart width={800} height={300} data={timelineData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  {platforms.map(platform => (
    <Line
      key={platform.id}
      type="monotone"
      dataKey={platform.id}
      stroke={platform.color}
      strokeWidth={2}
      dot={{ r: 4 }}
      activeDot={{ r: 6 }}
    />
  ))}
</LineChart>
```

**Data Structure**:
```typescript
interface TimelineData {
  date: string;
  chatgpt: number;
  perplexity: number;
  claude: number;
  gemini: number;
  you: number;
  searchgpt: number;
  bing: number;
}
```

## Responsive Breakpoints

**Desktop (> 1024px)**:
- 4-column summary cards
- Full timeline chart
- Wide table with all columns

**Tablet (640px - 1024px)**:
- 2-column summary cards
- Compact timeline
- Hide "Actions" column in table

**Mobile (< 640px)**:
- Single column cards
- Simplified timeline (last 7 days only)
- Card-based table view

## Accessibility

- **Keyboard Navigation**: Tab through platforms, citations
- **Screen Reader**: Citation strength announced as "3 stars, direct citation"
- **Color Independence**: Strength shown with stars (not just color)
- **Focus States**: Platform tabs and table rows show focus ring

## Magic UI Integration

**Used Components**:
- `number-ticker` - Animated citation counts
- `animated-list` - Table rows with stagger animation
- `badge` - Platform badges with counts
- `shimmer-button` - "Scan All Platforms" CTA

**Implementation Example**:
```tsx
<PlatformTabs>
  {platforms.map(platform => (
    <Tab
      key={platform.id}
      active={selectedPlatform === platform.id}
      onClick={() => selectPlatform(platform.id)}
    >
      <span>{platform.icon} {platform.name}</span>
      <Badge color={platform.color}>
        <NumberTicker value={citationCounts[platform.id]} />
      </Badge>
    </Tab>
  ))}
</PlatformTabs>

<CitationTimeline
  data={timelineData}
  platforms={platforms}
  period={period}
/>

<AnimatedList>
  {citations.map(citation => (
    <CitationRow
      key={citation.id}
      {...citation}
      onClick={() => openDetail(citation)}
    />
  ))}
</AnimatedList>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-citations.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Chart Library: recharts

**Status**: ✅ Design Complete, Ready for Implementation
