import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SystemSettings() {
  const [currentTab, setCurrentTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Settings
  const [systemName, setSystemName] = useState('SweetNight GEO System');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  // API Integrations
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [redditApiKey, setRedditApiKey] = useState('');
  const [quoraApiKey, setQuoraApiKey] = useState('');

  // Workflow Configuration
  const [autoExecuteWorkflow, setAutoExecuteWorkflow] = useState(true);
  const [workflowTimeout, setWorkflowTimeout] = useState(3600);
  const [retryAttempts, setRetryAttempts] = useState(3);

  // Priority Rules
  const [geoScoreWeight, setGeoScoreWeight] = useState(0.7);
  const [quickWinWeight, setQuickWinWeight] = useState(0.3);
  const [p0Threshold, setP0Threshold] = useState(100);
  const [p1Threshold, setP1Threshold] = useState(75);

  // Content Templates
  const [defaultTemplate, setDefaultTemplate] = useState('youtube');
  const [enableTemplateVariables, setEnableTemplateVariables] = useState(true);

  // Citation Tracking
  const [trackingInterval, setTrackingInterval] = useState(24);
  const [enableAiIndexing, setEnableAiIndexing] = useState(true);
  const [citationStrengthThreshold, setCitationStrengthThreshold] = useState('referenced');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [notifyOnCitation, setNotifyOnCitation] = useState(true);

  // Advanced Settings
  const [loggingLevel, setLoggingLevel] = useState('info');
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [cacheTtl, setCacheTtl] = useState(3600);
  const [debugMode, setDebugMode] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSave = () => {
    // Simulate save operation
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    // Reset to defaults
    if (currentTab === 0) {
      setSystemName('SweetNight GEO System');
      setLanguage('en');
      setTimezone('UTC');
    } else if (currentTab === 3) {
      setGeoScoreWeight(0.7);
      setQuickWinWeight(0.3);
      setP0Threshold(100);
      setP1Threshold(75);
    }
    // Add reset logic for other tabs as needed
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#6b728015',
              color: '#6b7280',
            }}
          >
            <SettingsIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              System Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              8 configuration sections for system customization and preferences
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Success Alert */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {/* Settings Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="settings tabs"
          >
            <Tab label="General" />
            <Tab label="API Integrations" />
            <Tab label="Workflow" />
            <Tab label="Priority Rules" />
            <Tab label="Templates" />
            <Tab label="Citation Tracking" />
            <Tab label="Notifications" />
            <Tab label="Advanced" />
          </Tabs>
        </Box>

        {/* Tab 1: General Settings */}
        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            General Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure basic system preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="System Name"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select value={language} onChange={(e) => setLanguage(e.target.value)} label="Language">
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="zh">中文</MenuItem>
                  <MenuItem value="ja">日本語</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select value={timezone} onChange={(e) => setTimezone(e.target.value)} label="Timezone">
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="America/New_York">America/New York</MenuItem>
                  <MenuItem value="Asia/Shanghai">Asia/Shanghai</MenuItem>
                  <MenuItem value="Europe/London">Europe/London</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: API Integrations */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            API Integrations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure API keys for external platforms
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info">
                API keys are encrypted and stored securely. Never share your API keys.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="YouTube API Key"
                type="password"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="Enter YouTube Data API v3 key"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reddit API Key"
                type="password"
                value={redditApiKey}
                onChange={(e) => setRedditApiKey(e.target.value)}
                placeholder="Enter Reddit API key"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quora API Key"
                type="password"
                value={quoraApiKey}
                onChange={(e) => setQuoraApiKey(e.target.value)}
                placeholder="Enter Quora API key"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Workflow Configuration */}
        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Workflow Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure 7-step workflow execution settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoExecuteWorkflow}
                    onChange={(e) => setAutoExecuteWorkflow(e.target.checked)}
                  />
                }
                label="Auto-execute workflow steps"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Workflow Timeout (seconds)"
                type="number"
                value={workflowTimeout}
                onChange={(e) => setWorkflowTimeout(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Retry Attempts"
                type="number"
                value={retryAttempts}
                onChange={(e) => setRetryAttempts(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Step 1: Roadmap Ingestor" variant="outlined" />
                <Chip label="Step 2: Content Registry" variant="outlined" />
                <Chip label="Step 3: Prompt Landscape" variant="outlined" />
                <Chip label="Step 4: Content Ingestor" variant="outlined" />
                <Chip label="Step 5: Content Generator" variant="outlined" />
                <Chip label="Step 6: Citation Tracker" variant="outlined" />
                <Chip label="Step 7: Feedback Analyzer" variant="outlined" />
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 4: Priority Rules */}
        <TabPanel value={currentTab} index={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Priority Rules (P0-P3)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure priority scoring weights and thresholds
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={600}>
                Scoring Weights
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Score = (GEO Score × {geoScoreWeight}) + (Quick Win Index × {quickWinWeight})
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GEO Score Weight"
                type="number"
                value={geoScoreWeight}
                onChange={(e) => setGeoScoreWeight(Number(e.target.value))}
                inputProps={{ step: 0.1, min: 0, max: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quick Win Weight"
                type="number"
                value={quickWinWeight}
                onChange={(e) => setQuickWinWeight(Number(e.target.value))}
                inputProps={{ step: 0.1, min: 0, max: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight={600} gutterBottom>
                P-Level Thresholds
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="P0 Threshold (Total Score ≥)"
                type="number"
                value={p0Threshold}
                onChange={(e) => setP0Threshold(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="P1 Threshold (Total Score ≥)"
                type="number"
                value={p1Threshold}
                onChange={(e) => setP1Threshold(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="P0: Core (≥100)" sx={{ bgcolor: '#10B981', color: 'white' }} />
                <Chip label="P1: Important (75-100)" sx={{ bgcolor: '#3B82F6', color: 'white' }} />
                <Chip label="P2: Opportunity (50-75)" sx={{ bgcolor: '#F59E0B', color: 'white' }} />
                <Chip label="P3: Reserve (<50)" sx={{ bgcolor: '#94A3B8', color: 'white' }} />
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 5: Content Templates */}
        <TabPanel value={currentTab} index={4}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Content Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure content template preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Default Template</InputLabel>
                <Select
                  value={defaultTemplate}
                  onChange={(e) => setDefaultTemplate(e.target.value)}
                  label="Default Template"
                >
                  <MenuItem value="youtube">YouTube Video Script</MenuItem>
                  <MenuItem value="reddit">Reddit Post</MenuItem>
                  <MenuItem value="quora">Quora Answer</MenuItem>
                  <MenuItem value="medium">Medium Article</MenuItem>
                  <MenuItem value="blog">Blog Post</MenuItem>
                  <MenuItem value="amazon">Amazon Review</MenuItem>
                  <MenuItem value="linkedin">LinkedIn Post</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableTemplateVariables}
                    onChange={(e) => setEnableTemplateVariables(e.target.checked)}
                  />
                }
                label="Enable template variable substitution"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Available Templates
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="YouTube" color="error" />
                <Chip label="Reddit" sx={{ bgcolor: '#FF4500', color: 'white' }} />
                <Chip label="Quora" sx={{ bgcolor: '#B92B27', color: 'white' }} />
                <Chip label="Medium" sx={{ bgcolor: '#00AB6C', color: 'white' }} />
                <Chip label="Blog" color="primary" />
                <Chip label="Amazon" sx={{ bgcolor: '#FF9900', color: 'white' }} />
                <Chip label="LinkedIn" sx={{ bgcolor: '#0A66C2', color: 'white' }} />
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 6: Citation Tracking */}
        <TabPanel value={currentTab} index={5}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Citation Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure citation tracking and monitoring
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tracking Interval (hours)"
                type="number"
                value={trackingInterval}
                onChange={(e) => setTrackingInterval(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Minimum Citation Strength</InputLabel>
                <Select
                  value={citationStrengthThreshold}
                  onChange={(e) => setCitationStrengthThreshold(e.target.value)}
                  label="Minimum Citation Strength"
                >
                  <MenuItem value="direct">Direct ⭐⭐⭐</MenuItem>
                  <MenuItem value="referenced">Referenced ⭐⭐</MenuItem>
                  <MenuItem value="mentioned">Mentioned ⭐</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableAiIndexing}
                    onChange={(e) => setEnableAiIndexing(e.target.checked)}
                  />
                }
                label="Enable AI indexing verification"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 7: Notification Settings */}
        <TabPanel value={currentTab} index={6}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Notification Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure notification preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                }
                label="Enable email notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch checked={notifyOnCitation} onChange={(e) => setNotifyOnCitation(e.target.checked)} />
                }
                label="Notify on new citation discovery"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch checked={webhookEnabled} onChange={(e) => setWebhookEnabled(e.target.checked)} />
                }
                label="Enable webhook notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Webhook URL"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                disabled={!webhookEnabled}
                placeholder="https://your-webhook-url.com/notifications"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 8: Advanced Settings */}
        <TabPanel value={currentTab} index={7}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Advanced Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure advanced system settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning">
                Warning: Changing these settings may affect system performance and stability.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Logging Level</InputLabel>
                <Select
                  value={loggingLevel}
                  onChange={(e) => setLoggingLevel(e.target.value)}
                  label="Logging Level"
                >
                  <MenuItem value="error">Error</MenuItem>
                  <MenuItem value="warn">Warning</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="debug">Debug</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cache TTL (seconds)"
                type="number"
                value={cacheTtl}
                onChange={(e) => setCacheTtl(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={cacheEnabled} onChange={(e) => setCacheEnabled(e.target.checked)} />}
                label="Enable caching"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} />}
                label="Debug mode"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Action Buttons */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" startIcon={<ResetIcon />} onClick={handleReset}>
            Reset to Default
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
