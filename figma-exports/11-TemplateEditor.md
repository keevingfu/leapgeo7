# Template Editor Page - Design Specification

**Page**: Template Editor
**Route**: `/templates`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Template Editor"  │  [New Template] [Import]      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Left: Template List (30% width)                           │
│  ┌────────────────────────────┐                            │
│  │ ● YouTube Video Script     │                            │
│  │   7 sections │ 8 variables │                            │
│  │   Last edited: 2 days ago  │                            │
│  │                            │                            │
│  │ ○ Reddit Discussion Post   │                            │
│  │   5 sections │ 4 variables │                            │
│  │                            │                            │
│  │ ○ Medium Article           │                            │
│  │ ○ LinkedIn Post            │                            │
│  │ ○ Blog Post                │                            │
│  │ ○ Amazon Q&A Response      │                            │
│  │ ○ Quora Answer             │                            │
│  │                            │                            │
│  │ [+ New Template]           │                            │
│  └────────────────────────────┘                            │
│                                                              │
│  Right: Template Editor (70% width)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Template: YouTube Video Script               [Save]  │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Metadata:                                             │  │
│  │ Name: [YouTube Video Script___________________]      │  │
│  │ Channel: [YouTube ▼]                                  │  │
│  │ Est. Time: [45] minutes                               │  │
│  │ Word Count: [800] - [1200]                            │  │
│  │                                                       │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Sections: (Drag to reorder)                           │  │
│  │ ┌──────────────────────────────────────────────┐    │  │
│  │ │ ≡ Section 1: Hook                      [×]   │    │  │
│  │ │ Purpose: Grab attention in first 10 seconds  │    │  │
│  │ │ Word Count: 50-100                           │    │  │
│  │ │                                              │    │  │
│  │ │ Template:                                    │    │  │
│  │ │ "Suffering from {problem}? In this video..." │    │  │
│  │ │                                              │    │  │
│  │ │ Variables: {problem}, {value_prop}           │    │  │
│  │ └──────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │ ┌──────────────────────────────────────────────┐    │  │
│  │ │ ≡ Section 2: Problem                   [×]   │    │  │
│  │ │ Purpose: Establish pain point                │    │  │
│  │ │ ...                                          │    │  │
│  │ └──────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │ [+ Add Section]                                       │  │
│  │                                                       │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Variables: (Used across all sections)                │  │
│  │ • {prompt} - Selected prompt text                    │  │
│  │ • {brand} - Brand name (SweetNight)                  │  │
│  │ • {value_prop} - Unique value proposition            │  │
│  │ • {problem} - Pain point being addressed             │  │
│  │ • {cta_link} - Call-to-action URL                    │  │
│  │                                                       │  │
│  │ [+ Add Variable]                                      │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Active Template: #EBF5FF (Blue-50) background
- Section Card: #FFFFFF, border #E5E7EB
- Variable Highlight: #FEF3C7 (Yellow-50)
- Drag Handle: #9CA3AF

**Spacing**:
- Template List Item: 16px padding
- Section Card: 20px padding, 16px gap
- Input Field: 12px padding

**Typography**:
- Template Name: 16px, Semibold, #111827
- Section Title: 15px, Medium, #374151
- Variable Syntax: 14px, Monospace, #B45309
- Helper Text: 13px, Regular, #6B7280

## Components Used

1. **PageHeader**
   - Title: "Template Editor"
   - Subtitle: "Manage content generation templates"
   - Actions: [New Template, Import Template]

2. **TemplateList**
   - Vertical scrollable list
   - Template cards with metadata
   - Active state highlighting
   - Search/filter templates

3. **TemplateEditor**
   - Metadata form (name, channel, time, word count)
   - Section list (draggable)
   - Variable management panel
   - Save/Discard buttons

4. **SectionCard**
   - Collapsible card
   - Drag handle (≡) for reordering
   - Section editor (title, purpose, word count, template text)
   - Delete button
   - Variable insertion helper

5. **VariablePanel**
   - List of all variables
   - Variable type (auto, brand, custom)
   - Add new variable button
   - Variable usage indicator

## Template Data Structure

```typescript
interface ContentTemplate {
  id: string;
  name: string;
  channel: Channel;
  estimatedMinutes: number;
  wordCount: { min: number; max: number };
  sections: Section[];
  variables: Variable[];
  createdAt: Date;
  updatedAt: Date;
}

interface Section {
  id: string;
  order: number;
  title: string;
  purpose: string;
  wordCount: { min: number; max: number };
  template: string; // Template text with {variable} placeholders
  requiredVariables: string[];
  optional: boolean;
}

interface Variable {
  name: string;
  type: 'auto' | 'brand' | 'custom';
  description: string;
  defaultValue?: string;
  required: boolean;
  validation?: {
    regex?: string;
    minLength?: number;
    maxLength?: number;
  };
}
```

## Template List Specifications

**Template Card Layout**:
```
┌────────────────────────────┐
│ ● YouTube Video Script     │ ← Active indicator + Name
│ 📺 YouTube                  │ ← Channel icon + name
│ 7 sections │ 8 variables   │ ← Metadata
│ 800-1200 words │ 45 min    │
│ Last edited: 2 days ago    │
│                            │
│ [Edit] [Duplicate] [Delete]│ ← Actions
└────────────────────────────┘
```

**Template Card States**:
- **Active**: Blue border, blue background tint
- **Hover**: Shadow elevation, scale 102%
- **Inactive**: White background, gray border

**Actions**:
- **Edit**: Opens template in editor
- **Duplicate**: Creates copy with "(Copy)" suffix
- **Delete**: Confirmation modal → Deletes template

## Template Editor Specifications

### Metadata Form

**Fields**:
1. **Name**: Text input, required
2. **Channel**: Dropdown (YouTube, Reddit, Medium, LinkedIn, Blog, Amazon, Quora)
3. **Estimated Time**: Number input (minutes)
4. **Word Count Range**: Two number inputs (min - max)
5. **Description**: Textarea (optional, for internal notes)

### Section Management

**Section Card Layout**:
```
┌──────────────────────────────────────────────┐
│ ≡ Section 1: Hook                      [×]   │ ← Drag handle + Title + Delete
├──────────────────────────────────────────────┤
│ Purpose: [Grab attention in first 10 secs]  │ ← Purpose input
│ Word Count: [50] - [100]                     │ ← Word count range
│                                              │
│ Template Text:                                │
│ ┌──────────────────────────────────────────┐│
│ │ "Suffering from {problem}? In this       ││ ← Template textarea
│ │  video, we'll show you how {brand}       ││   with syntax highlighting
│ │  solves this with {value_prop}..."       ││
│ └──────────────────────────────────────────┘│
│                                              │
│ Variables Used: {problem}, {brand}, {value_prop}│ ← Auto-detected
│ [Insert Variable ▼]                          │ ← Variable insertion dropdown
└──────────────────────────────────────────────┘
```

**Drag and Drop**:
- Click and hold drag handle (≡)
- Section card lifts up with shadow
- Drag to new position
- Drop indicator shows insertion point
- Release to reorder
- Section numbers auto-update

**Add Section**:
1. Click "+ Add Section" button
2. New section card appears at bottom
3. Default values filled in
4. Focus on section title input

**Delete Section**:
1. Click [×] button
2. Confirmation: "Delete this section?"
3. Click "Delete" → Section removed
4. Section numbers re-calculated

### Variable Management

**Variable Types**:

1. **Auto Variables** (System-provided):
   - `{prompt}` - Selected prompt text
   - `{p_level}` - Priority level (P0-P3)
   - `{geo_score}` - Enhanced GEO Score
   - `{quickwin_index}` - Quick Win Index
   - `{month}` - Current month

2. **Brand Variables** (Pre-configured):
   - `{brand}` - SweetNight
   - `{website}` - sweetnight.com
   - `{support_email}` - support@sweetnight.com

3. **Custom Variables** (User-defined):
   - `{value_prop}` - Value proposition
   - `{problem}` - Pain point
   - `{stats}` - Supporting statistics
   - `{cta_link}` - Call-to-action URL
   - Any custom variable created by user

**Variable Panel Layout**:
```
Variables (8):

Auto Variables:
• {prompt} - Selected prompt text
• {geo_score} - Enhanced GEO Score

Brand Variables:
• {brand} - Brand name (SweetNight)
• {website} - Website URL

Custom Variables:
• {value_prop} - Unique value proposition
  Required: Yes │ Validation: 10-100 chars
• {problem} - Pain point being addressed
  Required: Yes │ Validation: 5-50 chars
• {stats} - Supporting statistics
  Required: No │ Validation: None

[+ Add Custom Variable]
```

**Add Custom Variable**:
1. Click "+ Add Custom Variable"
2. Modal opens:
   - Variable Name: Text input (must be lowercase, no spaces)
   - Description: Text input
   - Required: Checkbox
   - Validation:
     - Min Length: Number input
     - Max Length: Number input
     - Regex Pattern: Text input (advanced)
3. Click "Add" → Variable added to panel

**Variable Usage Indicator**:
- Shows which sections use each variable
- Example: `{value_prop}` used in: Hook, Solution, CTA
- Click usage → Jumps to that section

### Template Text Editor

**Features**:
1. **Syntax Highlighting**: Variables highlighted in yellow
2. **Auto-Complete**: Type `{` → Dropdown of available variables
3. **Variable Insertion**: Dropdown button inserts variable at cursor
4. **Word Count**: Live word count display
5. **Validation**: Warns if required variables missing

**Example with Highlighting**:
```
Template Text:
"Suffering from {problem}? In this video, we'll show you
 how {brand} solves this with our {value_prop}. With over
 {stats} satisfied customers, you can trust {brand} for..."

Variables Detected: {problem}, {brand}, {value_prop}, {stats}
Missing Required: None ✓
Word Count: 42 / 50-100 ✓
```

## Interactions

**Select Template**:
1. Click template card in list
2. Current template auto-saves (if changes exist)
3. Selected template loads in editor (300ms fade)
4. Scroll to top of editor

**Edit Template Text**:
1. Click in template textarea
2. Type or paste content
3. Variables automatically highlighted
4. Variable dropdown appears when typing `{`

**Insert Variable**:
1. Place cursor in template textarea
2. Click "Insert Variable" dropdown
3. Select variable from list
4. Variable inserted at cursor position: `{variable_name}`

**Reorder Sections**:
1. Click and hold drag handle (≡)
2. Drag section up or down
3. Drop indicator shows insertion point
4. Release → Section reordered
5. Section numbers update automatically

**Save Template**:
1. Make changes to template
2. "Save" button becomes enabled
3. Click "Save"
4. Validation runs:
   - Name not empty
   - At least one section
   - All required variables defined
   - Word count ranges valid (min < max)
5. If valid:
   - Template saved to database
   - Success toast: "Template saved"
   - "Save" button disabled
6. If invalid:
   - Error messages appear
   - Fields with errors highlighted red

**Duplicate Template**:
1. Click "Duplicate" on template card
2. Copy created with name: "{Original Name} (Copy)"
3. Copy becomes active template
4. User can edit name and make changes

**Delete Template**:
1. Click "Delete" on template card
2. Confirmation modal: "Delete {Template Name}?"
3. Warning: "This action cannot be undone"
4. Click "Delete" → Template deleted
5. Next template in list becomes active

**Import Template**:
1. Click "Import Template" in header
2. File picker opens
3. Select JSON template file
4. Template loaded and added to list
5. Success toast: "Template imported"

**Export Template**:
1. Right-click template card → "Export"
2. JSON file downloaded: `{template-name}.json`

## Validation Rules

**Template**:
- Name: Required, 3-50 characters
- Channel: Required, must be valid channel
- Estimated Time: Required, 1-600 minutes
- Word Count: Min < Max, both > 0

**Section**:
- Title: Required, 3-50 characters
- Purpose: Optional, max 200 characters
- Word Count: Min < Max, both > 0
- Template Text: Required, min 10 characters

**Variable**:
- Name: Required, lowercase, no spaces, alphanumeric + underscore
- Name must be unique within template
- Must start with letter
- Max 30 characters

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Side-by-side template list and editor (30/70)
- Full section cards

**Tablet (640px - 1024px)**:
- Collapsible template list
- Simplified section cards

**Mobile (< 640px)**:
- Stacked layout
- Template list as dropdown
- Compact section editor

## Accessibility

- **Keyboard Shortcuts**:
  - Ctrl+S: Save template
  - Ctrl+N: New template
  - Ctrl+D: Duplicate template
- **Screen Reader**: All sections and variables announced
- **Focus States**: Blue ring on focused elements
- **Drag and Drop**: Keyboard alternative (Up/Down arrows + Space)

## Magic UI Integration

**Used Components**:
- `animated-list` - Template list with entrance animation
- `badge` - Channel badges, variable type badges
- `tooltip` - Variable descriptions
- `shimmer-button` - "Save" CTA

**Implementation Example**:
```tsx
<TemplateEditor>
  <TemplateList
    templates={templates}
    activeTemplate={activeTemplate}
    onSelect={setActiveTemplate}
  />

  <EditorPanel>
    <MetadataForm
      values={templateMetadata}
      onChange={handleMetadataChange}
    />

    <SortableSectionList
      sections={sections}
      onReorder={handleSectionReorder}
      onDelete={handleSectionDelete}
    />

    <VariablePanel
      variables={variables}
      onAddVariable={handleAddVariable}
    />

    <ShimmerButton onClick={handleSave} disabled={!hasChanges}>
      Save Template
    </ShimmerButton>
  </EditorPanel>
</TemplateEditor>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-templates.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Editor: Monaco Editor or CodeMirror

**Status**: ✅ Design Complete, Ready for Implementation
