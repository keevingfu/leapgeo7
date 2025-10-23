# Content Generator Page - Design Specification

**Page**: Content Generator (Step 5 of Workflow)
**Route**: `/generate`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Content Generator"  │  [Save Draft] [Publish]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Left Panel: Template Selector (30% width)                 │
│  ┌──────────────────────────────┐                           │
│  │ Content Templates            │                           │
│  │ ● YouTube Video Script       │                           │
│  │ ○ Reddit Discussion Post     │                           │
│  │ ○ Medium Article             │                           │
│  │ ○ Blog Post                  │                           │
│  │ ○ LinkedIn Post              │                           │
│  │ ○ Amazon Q&A Response        │                           │
│  │ ○ Quora Answer               │                           │
│  │                              │                           │
│  │ Prompt Selection:            │                           │
│  │ [Dropdown: 542 prompts]      │                           │
│  │ "Best mattress for..."       │                           │
│  │                              │                           │
│  │ Priority: P0                 │                           │
│  │ GEO Score: 95                │                           │
│  │ Est. Time: 8 hours           │                           │
│  └──────────────────────────────┘                           │
│                                                              │
│  Right Panel: Content Editor (70% width)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ YouTube Video Script Template                        │  │
│  │ ─────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Variables:                                            │  │
│  │ {prompt}: Best mattress for back pain                │  │
│  │ {brand}: SweetNight                                   │  │
│  │ {value_prop}: Pressure relief & spinal alignment     │  │
│  │                                                       │  │
│  │ ─────────────────────────────────────────────────── │  │
│  │ [Preview] [Edit Raw] [AI Enhance]                    │  │
│  │                                                       │  │
│  │ Generated Content:                                    │  │
│  │                                                       │  │
│  │ [Hook] "Suffering from back pain? Here's what..."   │  │
│  │ [Problem] "Back pain affects 80% of adults..."      │  │
│  │ [Solution] "SweetNight mattresses provide..."       │  │
│  │ [Social Proof] "Over 50K+ 5-star reviews..."       │  │
│  │ [CTA] "Try SweetNight risk-free for 100 nights"    │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Bottom Panel: Multi-Channel Distribution                   │
│  [✓] YouTube [✓] Reddit [✓] Medium [ ] LinkedIn [ ] Blog   │
│  [Generate All Channels] button                             │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Panel Background: #F9FAFB (Light), #1E293B (Dark)
- Template Active: #EBF5FF
- Template Hover: #F3F4F6
- Editor Background: #FFFFFF
- Variable Highlight: #FEF3C7 (Yellow-50)

**Spacing**:
- Panel Padding: 24px
- Template Item Height: 48px
- Editor Padding: 32px

**Typography**:
- Template Label: 15px, Medium, #374151
- Editor Section: 16px, Semibold, #111827
- Generated Content: 15px, Regular, #1F2937
- Variables: 14px, Monospace, #B45309

## Components Used

1. **PageHeader**
   - Title: "Content Generator"
   - Subtitle: "Multi-channel content creation from templates"
   - Actions: [Save Draft, Publish All]

2. **TemplateSidebar**
   - Template list with radio select
   - Template icons and labels
   - Active state highlighting
   - Template metadata (est. time, word count)

3. **PromptSelector**
   - Searchable dropdown (542 prompts)
   - Shows priority badge
   - Displays GEO score and QW index
   - Filters: By priority, coverage status

4. **ContentEditor**
   - Variable substitution panel (top)
   - Content editing area (middle)
   - Rich text editor with formatting
   - AI enhancement button

5. **MultiChannelToggle**
   - Checkbox grid for 7 channels
   - Shows status per channel
   - Bulk generate button

6. **VariablePanel**
   - Lists all template variables
   - Input fields for custom values
   - Auto-population from roadmap data
   - Preview live updates

## Template Structure

**7 Content Templates**:
```typescript
interface ContentTemplate {
  id: string;
  name: string;
  channel: Channel;
  sections: Section[];
  variables: Variable[];
  estimatedMinutes: number;
  wordCount: { min: number; max: number };
}

const templates = [
  {
    id: 'youtube-script',
    name: 'YouTube Video Script',
    sections: ['Hook', 'Problem', 'Solution', 'Social Proof', 'CTA'],
    variables: ['prompt', 'brand', 'value_prop', 'stats', 'cta_link'],
    estimatedMinutes: 45,
    wordCount: { min: 800, max: 1200 }
  },
  {
    id: 'reddit-discussion',
    name: 'Reddit Discussion Post',
    sections: ['Title', 'Context', 'Personal Experience', 'Recommendation', 'Q&A'],
    variables: ['prompt', 'brand', 'experience', 'price_point'],
    estimatedMinutes: 30,
    wordCount: { min: 400, max: 600 }
  },
  // ... 5 more templates
];
```

## Variable System

**Variable Types**:
1. **Auto-populated**: From roadmap data
   - `{prompt}` - Selected prompt text
   - `{p_level}` - Priority level
   - `{geo_score}` - Enhanced GEO Score

2. **Brand Variables**: From system config
   - `{brand}` - SweetNight
   - `{website}` - sweetnight.com
   - `{support_email}` - support@sweetnight.com

3. **Custom Variables**: User input
   - `{value_prop}` - Unique value proposition
   - `{stats}` - Supporting statistics
   - `{cta_link}` - Call-to-action URL

**Variable Syntax**:
```
Template: "Looking for the best {prompt}? {brand} offers..."
Output:  "Looking for the best mattress for back pain? SweetNight offers..."
```

## Content Editor Features

**Rich Text Formatting**:
- Bold, Italic, Underline
- Headings (H1-H3)
- Bullet lists, Numbered lists
- Blockquotes
- Inline code
- Links

**AI Enhancement**:
- Click "AI Enhance" button
- Options:
  - Improve readability
  - Add SEO keywords
  - Expand section
  - Shorten section
  - Change tone (Professional, Casual, Conversational)

**Preview Mode**:
- Toggle between Edit and Preview
- Shows rendered content
- Channel-specific formatting applied

## Interactions

**Template Selection**:
1. Click template in sidebar
2. Template loads with sections
3. Variables panel updates
4. Editor shows template structure
5. Previous content auto-saved to draft

**Prompt Selection**:
1. Open dropdown (shows 542 prompts)
2. Search/filter prompts
3. Select prompt
4. Auto-populates relevant variables
5. Shows prompt metadata (priority, scores)

**Content Generation Flow**:
1. Select template
2. Choose prompt
3. Fill in custom variables
4. Click section to edit
5. Use AI enhance if needed
6. Preview content
7. Select target channels
8. Save draft or publish

**Multi-Channel Generation**:
1. Check desired channels (YouTube, Reddit, etc.)
2. Click "Generate All Channels"
3. System creates variations per channel
4. Queue shows generation progress
5. Each channel opens in new tab for review

## Channel-Specific Adaptations

**YouTube**:
- Structure: Hook → Problem → Solution → Social Proof → CTA
- Length: 800-1200 words (8-12 min video)
- Tone: Conversational, engaging

**Reddit**:
- Structure: Title → Context → Personal Experience → Recommendation
- Length: 400-600 words
- Tone: Authentic, community-focused

**Medium**:
- Structure: Intro → Body → Conclusion
- Length: 1200-1800 words
- Tone: Educational, authoritative

**LinkedIn**:
- Structure: Hook → Insight → Value → CTA
- Length: 200-400 words
- Tone: Professional, concise

**Blog Post**:
- Structure: Intro → H2 Sections → Conclusion
- Length: 1500-2500 words
- Tone: SEO-optimized, informative

**Amazon Q&A**:
- Structure: Question Restatement → Answer → Product Link
- Length: 100-200 words
- Tone: Helpful, direct

**Quora**:
- Structure: Direct Answer → Detailed Explanation → Sources
- Length: 300-600 words
- Tone: Expert, credible

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Two-panel layout (30/70 split)
- Full editor with all features
- Multi-channel toggle visible

**Tablet (640px - 1024px)**:
- Collapsible sidebar
- Simplified editor
- Channel selection as dropdown

**Mobile (< 640px)**:
- Stacked layout
- Single template at a time
- Mobile-optimized editor
- Swipe between sections

## Accessibility

- **Keyboard Shortcuts**:
  - Ctrl+S: Save draft
  - Ctrl+Enter: Publish
  - Ctrl+E: Toggle AI enhance
  - Ctrl+P: Toggle preview

- **Screen Reader**: Section headings announced, variable labels read aloud
- **Focus Management**: Editor maintains focus state
- **Color Contrast**: All text meets WCAG AA

## Magic UI Integration

**Used Components**:
- `shimmer-button` - "AI Enhance" and "Generate All Channels" buttons
- `animated-gradient-text` - Section headings in editor
- `badge` - Channel status badges
- `tooltip` - Variable help text

**Implementation Example**:
```tsx
<ContentEditor>
  <VariablePanel>
    {variables.map(v => (
      <Input
        key={v.name}
        label={v.name}
        value={v.value}
        onChange={(val) => updateVariable(v.name, val)}
        helperText={v.description}
      />
    ))}
  </VariablePanel>

  <EditorArea
    template={selectedTemplate}
    content={editorContent}
    onChange={handleContentChange}
    onSectionClick={focusSection}
  />

  <ShimmerButton onClick={handleAIEnhance}>
    ✨ AI Enhance
  </ShimmerButton>
</ContentEditor>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-generator.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Editor: TipTap or Lexical

**Status**: ✅ Design Complete, Ready for Implementation
