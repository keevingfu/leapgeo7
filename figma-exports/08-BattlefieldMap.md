# Battlefield Map Page - Design Specification

**Page**: Battlefield Map (Prompt Network Visualization)
**Route**: `/battlefield`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Battlefield Map"  │  [Analyze] [Export SVG]       │
├─────────────────────────────────────────────────────────────┤
│  Control Panel (Top)                                         │
│  Layout: [Force] [Radial] [Tree]  │  Filter: [P0-P3] [All] │
│  Physics: Gravity [●────] Charge [──●──] Link [───●]       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  D3.js Force-Directed Graph (Full Width)                   │
│                                                              │
│           ●──────●                                          │
│          ╱│╲    ╱│╲                                         │
│         ● │ ●──● │ ●                                        │
│        ╱  │  ╲╱  │  ╲                                       │
│       ●   ●   ●  ●   ●                                      │
│      P0 (Red) P1 (Orange) P2 (Yellow)                      │
│                                                              │
│  Node Size = Content Hours │ Edge Width = Relationship     │
│  Hover Node → Show Details │ Click → Open Panel            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Right Panel: Node Details (Slide-in, 30% width)           │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Prompt: "Best mattress for back pain"             │    │
│  │ Priority: P0                                       │    │
│  │ GEO Score: 95                                      │    │
│  │ Quick Win Index: 85                                │    │
│  │                                                    │    │
│  │ Related Prompts (5):                               │    │
│  │ • Memory foam mattress (P1, 0.8 similarity)       │    │
│  │ • Orthopedic mattress (P1, 0.75 similarity)       │    │
│  │ • Mattress for back support (P2, 0.7 similarity)  │    │
│  │ • Best mattress brands (P2, 0.65 similarity)      │    │
│  │ • Firm vs soft mattress (P3, 0.6 similarity)      │    │
│  │                                                    │    │
│  │ Content Coverage:                                  │    │
│  │ ✅ YouTube Video                                   │    │
│  │ ✅ Reddit Discussion                               │    │
│  │ ❌ Medium Article (Gap)                            │    │
│  │ ❌ Blog Post (Gap)                                 │    │
│  │                                                    │    │
│  │ [Create Content] [View Analysis]                   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Background: #0F172A (Dark mode optimized)
- Node Colors: Priority colors (P0-P3)
- Edge Colors:
  - Strong relationship (>0.7): #10B981 (Green, 3px)
  - Medium relationship (0.5-0.7): #F59E0B (Yellow, 2px)
  - Weak relationship (<0.5): #6B7280 (Gray, 1px)
- Hover State: #60A5FA (Blue-400) glow
- Selected State: #FBBF24 (Amber-400) border

**Spacing**:
- Canvas Padding: 40px
- Control Panel Height: 80px
- Detail Panel Width: 30% (400px max)

**Typography**:
- Node Label: 12px, Medium (on hover: 14px, Bold)
- Panel Title: 18px, Semibold
- Related Prompts: 14px, Regular

## Components Used

1. **PageHeader**
   - Title: "Battlefield Map"
   - Subtitle: "Prompt relationship network and content gap visualization"
   - Actions: [Analyze Clusters, Export SVG]

2. **ControlPanel**
   - Layout selector: Force, Radial, Tree
   - Physics sliders: Gravity, Charge, Link distance
   - Filter toggles: Priority, Coverage status
   - Search box: Find node by prompt text

3. **D3ForceGraph**
   - Force-directed layout
   - Nodes: Prompts (sized by content_hours_est)
   - Edges: Relationships (weighted by similarity)
   - Zoom: Mouse wheel, pinch gesture
   - Pan: Click and drag
   - Node drag: Reposition nodes

4. **NodeDetailPanel**
   - Slide-in from right
   - Prompt details
   - Related prompts list
   - Content coverage checklist
   - Actions: Create Content, View Analysis

5. **ClusterHighlight**
   - Convex hull around node clusters
   - Semi-transparent fill
   - Cluster label at centroid
   - Color-coded by dominant priority

## D3.js Force Simulation Configuration

```typescript
interface GraphNode {
  id: string;
  prompt: string;
  p_level: 'P0' | 'P1' | 'P2' | 'P3';
  geo_score: number;
  quickwin_index: number;
  content_hours_est: number;
  covered: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number; // 0-1 similarity score
  type: 'semantic' | 'co-occurrence' | 'hierarchical';
}

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(edges)
    .id(d => d.id)
    .distance(d => 100 / d.weight) // Closer for higher similarity
  )
  .force("charge", d3.forceManyBody()
    .strength(-300) // Repulsion between nodes
  )
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collision", d3.forceCollide()
    .radius(d => radiusScale(d.content_hours_est) + 5)
  );
```

## Node Specifications

**Size Calculation**:
```typescript
const radiusScale = d3.scaleSqrt()
  .domain([0, d3.max(nodes, d => d.content_hours_est)])
  .range([10, 40]); // Min 10px, max 40px radius
```

**Visual Properties**:
- **Fill**: Priority color (P0: Red, P1: Orange, P2: Yellow, P3: Green)
- **Stroke**: White (2px)
- **Opacity**:
  - Covered: 1.0 (solid)
  - Uncovered: 0.6 (semi-transparent)
- **Label**: Appears on hover (white text with dark shadow)

**Node States**:
1. **Default**: Priority color, subtle shadow
2. **Hover**: Enlarge 120%, glow effect, label visible
3. **Selected**: Amber border, detail panel opens
4. **Dimmed**: Opacity 0.2 (when filtering)

## Edge Specifications

**Edge Types**:
1. **Semantic Similarity**: Curved lines connecting semantically related prompts
2. **Co-occurrence**: Dashed lines for prompts often searched together
3. **Hierarchical**: Thick lines for parent-child relationships

**Edge Width**:
```typescript
const edgeWidthScale = d3.scaleLinear()
  .domain([0, 1])
  .range([1, 5]); // 1-5px based on similarity weight
```

**Edge Color & Opacity**:
- Strong (>0.7): Green (#10B981), opacity 0.8
- Medium (0.5-0.7): Yellow (#F59E0B), opacity 0.6
- Weak (<0.5): Gray (#6B7280), opacity 0.4

## Layout Modes

### 1. Force-Directed Layout (Default)
- Physics-based simulation
- Nodes repel each other
- Related nodes cluster together
- Best for exploring relationships

### 2. Radial Layout
- Central node: Highest priority or most connected
- Concentric circles by priority (P0 inner, P3 outer)
- Best for hierarchy visualization

### 3. Tree Layout
- Hierarchical tree structure
- Root: Campaign-level prompt
- Branches: Related sub-prompts
- Best for content planning

## Cluster Detection

**Algorithm**: Community Detection (Louvain method)
```typescript
interface Cluster {
  id: number;
  nodes: string[];
  dominantPriority: string;
  avgGeoScore: number;
  contentGapCount: number;
  centroid: { x: number; y: number };
}

// Visualize clusters with convex hulls
const hull = d3.polygonHull(clusterNodes.map(d => [d.x, d.y]));
svg.append("path")
  .attr("d", `M${hull.join("L")}Z`)
  .attr("fill", clusterColor)
  .attr("fill-opacity", 0.1)
  .attr("stroke", clusterColor)
  .attr("stroke-width", 2)
  .attr("stroke-dasharray", "5,5");
```

## Interactions

**Node Hover**:
1. Node enlarges to 120% size
2. Label fades in (300ms)
3. Connected nodes highlight
4. Connected edges brighten
5. All other nodes dim to 30% opacity

**Node Click**:
1. Node selected (amber border)
2. Detail panel slides in from right (400ms)
3. Camera pans to center selected node
4. Related nodes remain highlighted

**Node Drag**:
1. Click and hold node
2. Cursor changes to grab
3. Node follows cursor
4. Connected edges stretch
5. Physics simulation pauses
6. On release, simulation resumes

**Edge Hover**:
1. Edge thickens by 150%
2. Tooltip shows: Source → Target, Weight, Type
3. Both connected nodes highlight

**Zoom & Pan**:
- Scroll wheel: Zoom in/out (0.5x to 10x)
- Click and drag background: Pan canvas
- Double-click: Reset view to fit all nodes
- Pinch gesture (mobile/trackpad): Zoom

**Filter Application**:
1. Toggle priority filters (P0, P1, P2, P3)
2. Nodes fade out if not matching (200ms)
3. Edges connected to hidden nodes also hide
4. Layout recalculates for visible nodes

## Detail Panel Content

**Sections**:
1. **Prompt Info**
   - Full prompt text
   - Priority badge
   - GEO Score bar chart
   - Quick Win Index progress circle

2. **Related Prompts** (Top 5)
   - Sorted by similarity weight
   - Click to navigate to that node
   - Priority badge for each
   - Similarity percentage

3. **Content Coverage**
   - 7 channels with checkmarks
   - Gaps highlighted in red
   - Links to existing content
   - "Create Content" button for gaps

4. **Actions**
   - [Create Content] → Opens ContentGenerator
   - [View Analysis] → Opens PromptLandscape filtered to this prompt
   - [Edit Priority] → Opens priority editor modal
   - [Close Panel] → Closes detail panel

## Cluster Analysis Panel

**Trigger**: Click "Analyze Clusters" in header

**Content**:
```
Cluster Analysis Results:

Cluster 1: "Back Pain & Support" (15 prompts)
- Dominant Priority: P0
- Avg GEO Score: 87
- Content Gaps: 8
- Recommended Action: High-priority content sprint

Cluster 2: "Mattress Types" (24 prompts)
- Dominant Priority: P1
- Avg GEO Score: 72
- Content Gaps: 12
- Recommended Action: Gradual coverage expansion

Cluster 3: "Accessories & Care" (18 prompts)
- Dominant Priority: P2
- Avg GEO Score: 58
- Content Gaps: 14
- Recommended Action: Lower priority, strategic reserve

[Export Cluster Report] [Close]
```

## Performance Optimization

**Canvas vs SVG**:
- Use Canvas for >500 nodes (WebGL acceleration)
- Use SVG for <500 nodes (better interactivity)

**Data Optimization**:
- Load only nodes with relationships (filter isolated)
- Lazy load edge details on hover
- Debounce physics simulation (16ms)
- Use quadtree for collision detection

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Full canvas: 100% width, 80vh height
- Detail panel: 400px width
- Control panel: Top bar

**Tablet (640px - 1024px)**:
- Canvas: 100% width, 60vh height
- Detail panel: 50% width overlay
- Simplified control panel

**Mobile (< 640px)**:
- Not recommended (link to desktop view)
- Alternative: List view with search

## Accessibility

**Keyboard Navigation**:
- Tab: Navigate between nodes
- Enter: Select node, open detail panel
- Escape: Close detail panel
- Arrow keys: Pan canvas
- +/-: Zoom in/out

**Screen Reader**:
```html
<g role="button" aria-label="Prompt: Best mattress for back pain. Priority: P0. GEO Score: 95. Connected to 8 related prompts.">
  <circle ... />
  <text>Best mattress...</text>
</g>
```

**Alternative View**:
- "Switch to List View" button for accessibility
- Same data presented as hierarchical list

## Magic UI Integration

**Used Components**:
- `animated-gradient-text` - Cluster labels
- `border-beam` - Selected node border animation
- `tooltip` - Node and edge hover tooltips
- `shimmer-button` - "Analyze Clusters" CTA

**Implementation Example**:
```tsx
<D3ForceGraph
  nodes={graphNodes}
  edges={graphEdges}
  width={width}
  height={height}
  onNodeClick={handleNodeClick}
  onNodeHover={handleNodeHover}
  layout="force"
  clusterDetection={true}
/>

<NodeDetailPanel
  isOpen={detailPanelOpen}
  node={selectedNode}
  onClose={closeDetailPanel}
  onCreateContent={openContentGenerator}
/>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-battlefield.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Graph Library: D3.js v7 + force-graph

**Status**: ✅ Design Complete, Ready for Implementation
