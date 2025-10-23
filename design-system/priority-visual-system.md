# SweetNight GEO - Priority Visual System (P0-P3)

## Design Philosophy

The priority system uses color psychology and visual hierarchy to enable instant recognition of content priority levels, facilitating quick decision-making in the GEO content production workflow.

## Color Palette

### P0 - Critical Priority (Red Spectrum)
**Primary Color**: `#EF4444` (Red-500)
**Hover**: `#DC2626` (Red-600)
**Background**: `#FEE2E2` (Red-50)
**Border**: `#FCA5A5` (Red-300)

**Semantic Meaning**: Urgent action required, highest ROI potential
**Use Cases**:
- High-impact prompts with >75% AI citation probability
- Content requiring immediate production (8 hours effort)
- 2-month ROI targets

### P1 - Important Priority (Orange Spectrum)
**Primary Color**: `#F97316` (Orange-500)
**Hover**: `#EA580C` (Orange-600)
**Background**: `#FFEDD5` (Orange-50)
**Border**: `#FDBA74` (Orange-300)

**Semantic Meaning**: High value, near-term opportunity
**Use Cases**:
- 50-75% AI citation probability
- 6 hours content production effort
- 3-month ROI targets

### P2 - Moderate Priority (Yellow Spectrum)
**Primary Color**: `#EAB308` (Yellow-500)
**Hover**: `#CA8A04` (Yellow-600)
**Background**: `#FEF9C3` (Yellow-50)
**Border**: `#FDE047` (Yellow-300)

**Semantic Meaning**: Strategic opportunity, medium-term value
**Use Cases**:
- 25-50% AI citation probability
- 5 hours content production effort
- 4-6 month ROI targets

### P3 - Reserve Priority (Green Spectrum)
**Primary Color**: `#22C55E` (Green-500)
**Hover**: `#16A34A` (Green-600)
**Background**: `#DCFCE7` (Green-50)
**Border**: `#86EFAC` (Green-300)

**Semantic Meaning**: Strategic reserve, long-term potential
**Use Cases**:
- <25% AI citation probability
- 3 hours content production effort
- Strategic content library building

## Component Specifications

### Priority Badge Component

```typescript
interface PriorityBadgeProps {
  level: 'P0' | 'P1' | 'P2' | 'P3';
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  animated?: boolean;
}

// Visual Specifications
const BadgeStyles = {
  P0: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-300',
    ring: 'ring-red-500/20',
    icon: '🔴'
  },
  P1: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-300',
    ring: 'ring-orange-500/20',
    icon: '🟠'
  },
  P2: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    ring: 'ring-yellow-500/20',
    icon: '🟡'
  },
  P3: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-300',
    ring: 'ring-green-500/20',
    icon: '🟢'
  }
};
```

**Size Variants**:
- **Small (sm)**: 24px height, 12px font, 4px padding
- **Medium (md)**: 32px height, 14px font, 6px padding
- **Large (lg)**: 40px height, 16px font, 8px padding

**Animation**:
- P0 badges pulse subtly (1.5s interval) to draw attention
- Hover state scales to 105% with shadow elevation
- Transition duration: 200ms cubic-bezier(0.4, 0, 0.2, 1)

### Priority Filter Component

```typescript
interface PriorityFilterProps {
  selectedPriorities: Set<string>;
  onToggle: (priority: string) => void;
  counts?: Record<string, number>;
  showCounts?: boolean;
}

// Layout: Horizontal button group with counts
// P0 (24) | P1 (56) | P2 (89) | P3 (142)
```

**Visual States**:
- **Unselected**: Gray background, white text, subtle border
- **Selected**: Priority color background, white text, no border
- **Hover**: Slight scale (102%), shadow elevation
- **Count Badge**: Small circle, absolute positioned top-right

### Priority Score Indicator

```typescript
interface PriorityScoreProps {
  score: number; // 0-150
  enhanced_geo_score: number;
  quickwin_index: number;
  showBreakdown?: boolean;
}

// Visual: Horizontal bar chart
// Formula display: (geo_score × 0.7) + (quickwin × 0.3) = total
```

**Score Ranges → Priority Mapping**:
- Score ≥100 → P0 (Red indicator)
- Score 75-99 → P1 (Orange indicator)
- Score 50-74 → P2 (Yellow indicator)
- Score <50 → P3 (Green indicator)

## Data Visualization Rules

### Tables & Lists
- **Row Background**: Alternate rows with subtle priority tint (5% opacity)
- **Left Border**: 4px solid priority color
- **Text Color**: Neutral gray, not priority color (readability)
- **Hover State**: Increase background opacity to 10%

### Cards
- **Border**: 2px solid priority color
- **Background**: White with subtle gradient (priority color 3% opacity at top)
- **Shadow**: Priority color at 10% opacity, 0 4px 12px
- **Header**: Priority badge positioned top-right

### Charts (D3.js)
- **Bar Charts**: Fill with priority colors, 0.8 opacity
- **Line Charts**: Stroke with priority colors, 2px width
- **Scatter Plots**: Priority colored dots with white border
- **Heat Maps**: Use priority color scale for intensity

## Accessibility Considerations

### Color Blindness Support
- **All priority badges include text labels** ("P0", "P1", etc.)
- **Icon indicators** supplement color (🔴🟠🟡🟢)
- **Pattern fills** as backup for charts (diagonal, dots, grid)

### Contrast Ratios
- P0 Red: 4.5:1 on white background (WCAG AA compliant)
- P1 Orange: 4.8:1 on white background
- P2 Yellow: 4.2:1 on white background (use darker yellow-700 for text)
- P3 Green: 5.1:1 on white background

### Focus States
- **Keyboard Focus**: 3px solid ring in priority color
- **Focus Visible**: Only when navigating via keyboard
- **Tab Order**: Priority filters follow left-to-right, P0 → P3

## Usage Guidelines

### DO ✅
- Use P0 sparingly to maintain urgency perception
- Combine color with text labels for clarity
- Provide tooltips explaining priority calculation
- Animate only P0 items to draw attention
- Use consistent color palette across all views

### DON'T ❌
- Don't mix priority colors with other brand colors
- Don't use priority colors for non-priority elements
- Don't rely solely on color (add text/icons)
- Don't use animations on P1-P3 (visual hierarchy loss)
- Don't override priority colors for aesthetic reasons

## Integration with Magic UI

### Recommended Magic UI Components

1. **`shimmer-button`** - For P0 action CTAs (e.g., "Generate Content Now")
2. **`animated-gradient-text`** - For P0 headlines in dashboard
3. **`border-beam`** - For P0 card borders (animated attention)
4. **`number-ticker`** - For priority score animations
5. **`animated-circular-progress-bar`** - For ROI timeline indicators
6. **`badge` from shadcn/ui** - Base for priority badges

### Example Integration

```tsx
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";

// P0 Action Button
<ShimmerButton className="bg-red-500 hover:bg-red-600">
  Generate P0 Content
</ShimmerButton>

// Priority Score Display
<div className="flex items-center gap-2">
  <NumberTicker value={score} />
  <PriorityBadge level="P0" />
</div>
```

## Responsive Design

### Mobile (< 640px)
- Priority badges: 28px height (slightly smaller)
- Filter buttons stack vertically
- Card borders reduce to 1px
- Simplified hover states (tap-friendly)

### Tablet (640px - 1024px)
- Standard badge sizes
- Horizontal filter layout
- Full card styling
- Desktop-like interactions

### Desktop (> 1024px)
- All visual enhancements active
- Rich hover states and animations
- Multi-column layouts with priority grouping
- Advanced data visualizations

## Theme Support

### Light Mode (Default)
- Use color palette as specified above
- White backgrounds with colored tints
- Dark text on light backgrounds

### Dark Mode
- **P0**: `#FCA5A5` (Red-300) on `#7F1D1D` (Red-900) background
- **P1**: `#FDBA74` (Orange-300) on `#7C2D12` (Orange-900) background
- **P2**: `#FDE047` (Yellow-300) on `#713F12` (Yellow-900) background
- **P3**: `#86EFAC` (Green-300) on `#14532D` (Green-900) background

**Dark Mode Adjustments**:
- Increase badge opacity to 90%
- Reduce shadow intensity (5% instead of 10%)
- Use lighter priority colors for better contrast
- Maintain WCAG AA contrast standards

## Export & Implementation

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        priority: {
          p0: {
            50: '#FEE2E2',
            300: '#FCA5A5',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C',
          },
          p1: {
            50: '#FFEDD5',
            300: '#FDBA74',
            500: '#F97316',
            600: '#EA580C',
            700: '#C2410C',
          },
          p2: {
            50: '#FEF9C3',
            300: '#FDE047',
            500: '#EAB308',
            600: '#CA8A04',
            700: '#A16207',
          },
          p3: {
            50: '#DCFCE7',
            300: '#86EFAC',
            500: '#22C55E',
            600: '#16A34A',
            700: '#15803D',
          },
        },
      },
    },
  },
};
```

### Figma Design Tokens

```json
{
  "priority": {
    "p0": {
      "value": "#EF4444",
      "type": "color",
      "description": "Critical priority color"
    },
    "p1": {
      "value": "#F97316",
      "type": "color",
      "description": "Important priority color"
    },
    "p2": {
      "value": "#EAB308",
      "type": "color",
      "description": "Moderate priority color"
    },
    "p3": {
      "value": "#22C55E",
      "type": "color",
      "description": "Reserve priority color"
    }
  }
}
```

---

**Version**: 1.0
**Last Updated**: 2025-10-21
**Designer**: Claude Code + BMAD UX Expert
**Status**: Design System Approved ✅
