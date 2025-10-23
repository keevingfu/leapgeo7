# System Settings Page - Design Specification

**Page**: System Settings
**Route**: `/settings`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "System Settings"  │  [Save Changes] [Reset]       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Left: Settings Navigation (25% width)                     │
│  ┌────────────────────────┐                                 │
│  │ ● General              │                                 │
│  │ ○ Priority Calculation │                                 │
│  │ ○ Workflow Automation  │                                 │
│  │ ○ Integrations         │                                 │
│  │ ○ API Keys             │                                 │
│  │ ○ Notifications        │                                 │
│  │ ○ Appearance           │                                 │
│  │ ○ Advanced             │                                 │
│  └────────────────────────┘                                 │
│                                                              │
│  Right: Settings Panel (75% width)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ General Settings                                     │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Organization Name                                     │  │
│  │ [SweetNight]                                          │  │
│  │                                                       │  │
│  │ Time Zone                                             │  │
│  │ [UTC-08:00] Pacific Time (US & Canada)              │  │
│  │                                                       │  │
│  │ Default Language                                      │  │
│  │ [English (US)] ▼                                      │  │
│  │                                                       │  │
│  │ Date Format                                           │  │
│  │ [YYYY-MM-DD] ▼                                        │  │
│  │                                                       │  │
│  │ Currency                                              │  │
│  │ [USD ($)] ▼                                           │  │
│  │                                                       │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Data Retention                                        │  │
│  │ Keep logs for: [90] days                             │  │
│  │ Archive reports after: [1] year(s)                   │  │
│  │                                                       │  │
│  │ [Save Changes]                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Active Nav Item: #EBF5FF (Blue-50) background
- Inactive Nav Item: Transparent
- Section Divider: #E5E7EB
- Input Border: #D1D5DB
- Input Focus: #3B82F6 (Blue-500)

**Spacing**:
- Nav Item Height: 40px
- Nav Padding: 12px 20px
- Settings Panel Padding: 32px
- Input Group Margin: 24px

**Typography**:
- Section Title: 24px, Bold, #111827
- Input Label: 14px, Medium, #374151
- Helper Text: 13px, Regular, #6B7280
- Nav Item: 15px, Medium, #1F2937

## Components Used

1. **PageHeader**
   - Title: "System Settings"
   - Subtitle: "Configure system behavior and integrations"
   - Actions: [Save Changes, Reset to Defaults]

2. **SettingsNavigation**
   - Vertical menu
   - 8 sections
   - Active state highlighting
   - Icon + label per item

3. **SettingsPanel**
   - Dynamic content area
   - Form inputs (text, select, toggle, slider)
   - Section dividers
   - Save button at bottom

4. **FormInput** Components
   - Text input
   - Select dropdown
   - Toggle switch
   - Slider
   - Number input with +/- buttons
   - Multi-select tags

5. **ValidationMessage**
   - Success: Green checkmark + message
   - Error: Red X + error text
   - Warning: Yellow triangle + warning

## Settings Sections

### 1. General Settings

**Fields**:
```typescript
interface GeneralSettings {
  organizationName: string;
  timeZone: string;
  defaultLanguage: string;
  dateFormat: string;
  currency: string;
  dataRetentionDays: number;
  archiveAfterYears: number;
}
```

**UI Elements**:
- Organization Name: Text input
- Time Zone: Searchable dropdown (all timezones)
- Language: Dropdown (EN, CN)
- Date Format: Dropdown (YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY)
- Currency: Dropdown (USD, CNY, EUR, GBP)
- Data Retention: Number input (7-365 days)

### 2. Priority Calculation

**Fields**:
```typescript
interface PrioritySettings {
  geoScoreWeight: number;      // 0-1, default 0.7
  quickWinWeight: number;       // 0-1, default 0.3
  p0Threshold: number;          // 0-150, default 100
  p1Threshold: number;          // 0-150, default 75
  p2Threshold: number;          // 0-150, default 50
  autoRecalculate: boolean;
  recalculateFrequency: string; // daily, weekly, monthly
}
```

**UI Elements**:
- GEO Score Weight: Slider (0-100%, default 70%)
- Quick Win Weight: Slider (0-100%, default 30%)
  - Note: Sum must equal 100%
- P0 Threshold: Number input with slider (0-150)
- P1 Threshold: Number input with slider (0-150)
- P2 Threshold: Number input with slider (0-150)
- Auto Recalculate: Toggle switch
- Recalculate Frequency: Dropdown (if auto enabled)

**Visual Feedback**:
- Show real-time priority distribution chart
- Preview: "With current settings, 24 prompts will be P0"

### 3. Workflow Automation

**Fields**:
```typescript
interface WorkflowSettings {
  autoTrigger: boolean;
  triggerSchedule: string;      // cron expression
  maxConcurrentSteps: number;   // 1-10
  retryFailedSteps: boolean;
  maxRetries: number;           // 1-5
  notifyOnError: boolean;
  notifyOnSuccess: boolean;
  parallelProcessing: boolean;
}
```

**UI Elements**:
- Auto Trigger: Toggle switch
- Trigger Schedule: Cron expression builder (visual)
  - Presets: Daily, Weekly, Monthly, Custom
- Max Concurrent Steps: Slider (1-10)
- Retry Failed Steps: Toggle
- Max Retries: Number input (1-5, only if retry enabled)
- Notify on Error: Checkbox
- Notify on Success: Checkbox
- Parallel Processing: Toggle

**Cron Expression Builder**:
```
Run workflow:
[Every] [1] [day(s)] at [14:00]
                or
[Every] [Monday, Friday] at [09:00]
                or
[On day] [1] [of every month] at [00:00]

Preview: 0 14 * * * (Runs daily at 2:00 PM)
```

### 4. Integrations

**Sections**:
1. **Firecrawl**
   - API URL: Text input
   - API Key: Password input
   - Test Connection: Button
   - Status: ●Connected / ●Disconnected

2. **InfraNodus**
   - API Key: Password input
   - API Endpoint: Text input
   - Test Connection: Button

3. **Neo4j**
   - URI: Text input
   - Username: Text input
   - Password: Password input
   - Database: Text input
   - Test Connection: Button

4. **Redis**
   - Host: Text input
   - Port: Number input
   - Password: Password input
   - Database: Number input (0-15)
   - Test Connection: Button

5. **MinIO**
   - Endpoint: Text input
   - Access Key: Text input
   - Secret Key: Password input
   - Bucket: Text input
   - Test Connection: Button

**Test Connection Button**:
- Click → Tests connection
- Shows spinner during test
- Success: Green checkmark + "Connected"
- Error: Red X + error message

### 5. API Keys

**Table Layout**:
```
┌───────────────┬──────────────────┬────────────┬─────────┐
│ Name          │ Key (masked)     │ Created    │ Actions │
├───────────────┼──────────────────┼────────────┼─────────┤
│ Production    │ pk_live_•••••••  │ 2025-01-15 │ [Revoke]│
│ Development   │ pk_test_•••••••  │ 2025-02-20 │ [Revoke]│
│ CI/CD         │ pk_cicd_•••••••  │ 2025-03-10 │ [Revoke]│
└───────────────┴──────────────────┴────────────┴─────────┘

[Generate New API Key]
```

**Generate New Key Flow**:
1. Click "Generate New API Key"
2. Modal opens:
   - Name: Text input
   - Permissions: Checkboxes (Read, Write, Delete)
   - Expiration: Dropdown (Never, 30 days, 90 days, 1 year)
3. Click "Generate"
4. Key displayed once (copy to clipboard)
5. Warning: "Save this key, it won't be shown again"

### 6. Notifications

**Email Notifications**:
- Workflow errors: Checkbox
- Workflow success: Checkbox
- New citations detected: Checkbox
- KPI alerts: Checkbox
- Weekly summary report: Checkbox

**Notification Channels**:
- Email: Text input (comma-separated emails)
- Slack: Webhook URL input
- SMS: Phone number input (optional)

**Notification Frequency**:
- Immediate: For errors and critical alerts
- Batched: For non-critical updates
- Daily summary: Checkbox
- Weekly summary: Checkbox

**Test Notification**:
- [Send Test Email] button
- [Send Test Slack] button

### 7. Appearance

**Theme**:
- Light Mode: Radio button
- Dark Mode: Radio button
- Auto (System): Radio button (default)

**Accent Color**:
- Color picker (default: #1976D2)
- Preview: Shows buttons and links with selected color

**Compact Mode**:
- Toggle switch
- Reduces padding and font sizes by 10%

**Chart Colors**:
- Priority Colors: 4 color pickers (P0-P3)
- Workflow Step Colors: 7 color pickers

**Font Size**:
- Slider: Small, Medium (default), Large

### 8. Advanced

**Danger Zone** (Red border):
- Reset All Settings: Button (confirmation required)
- Clear All Data: Button (confirmation + password required)
- Export Configuration: Button (downloads JSON)
- Import Configuration: File upload

**Performance Settings**:
- Cache TTL: Number input (seconds)
- Database Query Timeout: Number input (ms)
- API Request Timeout: Number input (ms)

**Developer Options**:
- Enable Debug Logs: Toggle
- Show SQL Queries: Toggle
- API Playground: Link to API docs

## Interactions

**Save Changes**:
1. User modifies settings
2. "Save Changes" button becomes enabled (blue)
3. Click "Save Changes"
4. Validation runs
5. If valid:
   - Settings saved to database
   - Success toast: "Settings saved successfully"
   - Button returns to disabled state
6. If invalid:
   - Error message below invalid field
   - Field border turns red
   - Save button remains enabled

**Reset to Defaults**:
1. Click "Reset" button
2. Confirmation modal: "Reset all settings to defaults?"
3. Click "Reset" → All settings reset
4. Success toast: "Settings reset to defaults"

**Navigation Between Sections**:
1. Click section in left nav
2. Current section fades out (200ms)
3. New section fades in (200ms)
4. URL updates (e.g., /settings#integrations)
5. Active nav item highlighted

**Unsaved Changes Warning**:
- If user navigates away with unsaved changes
- Modal: "You have unsaved changes. Discard?"
- [Cancel] [Discard] buttons

## Validation Rules

**Priority Calculation**:
- GEO Score Weight + Quick Win Weight = 100%
- P0 Threshold > P1 Threshold > P2 Threshold
- All thresholds between 0 and 150

**Workflow Automation**:
- Cron expression must be valid
- Max Concurrent Steps: 1-10
- Max Retries: 1-5 (only if retry enabled)

**Integrations**:
- All URLs must start with http:// or https://
- API keys must not be empty
- Ports must be 1-65535

**API Keys**:
- Name must be unique
- At least one permission must be selected

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Side-by-side navigation and panel (25/75)
- Full form layout with 2 columns for some fields

**Tablet (640px - 1024px)**:
- Collapsible left navigation
- Single column form layout
- Hamburger menu for nav

**Mobile (< 640px)**:
- Stacked layout
- Nav as dropdown select
- Simplified forms with vertical stacking

## Accessibility

- **Keyboard Navigation**: Tab through all inputs
- **Screen Reader**: All labels read aloud, section headings announced
- **Focus States**: Blue ring on focused inputs
- **Error Announcements**: Error messages read by screen reader

## Magic UI Integration

**Used Components**:
- `badge` - Integration status badges
- `tooltip` - Help text on form labels
- `shimmer-button` - "Save Changes" CTA
- `animated-list` - API keys table

**Implementation Example**:
```tsx
<SettingsLayout>
  <SettingsNavigation
    sections={settingsSections}
    activeSection={activeSection}
    onSectionChange={setActiveSection}
  />

  <SettingsPanel>
    {activeSection === 'general' && (
      <GeneralSettings
        values={generalSettings}
        onChange={handleGeneralChange}
      />
    )}
    {activeSection === 'priority' && (
      <PrioritySettings
        values={prioritySettings}
        onChange={handlePriorityChange}
      />
    )}
    {/* More sections... */}
  </SettingsPanel>

  <SaveButton
    disabled={!hasUnsavedChanges}
    onClick={handleSave}
  >
    Save Changes
  </SaveButton>
</SettingsLayout>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-settings.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`

**Status**: ✅ Design Complete, Ready for Implementation
