import { useState, ReactNode } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  LinearProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Send as SendIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Article as ArticleIcon,
  Description as DescriptionIcon,
  Chat as SlackIcon,
  Notes as NotionIcon,
  GitHub as GitHubIcon,
  Code as GitLabIcon,
  YouTube as YouTubeIcon,
  Reddit as RedditIcon,
  BookOutlined as MediumIcon,
  Language as WebIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Link as LinkIcon,
  CloudUpload as UploadIcon,
  CloudDone as CloudDoneIcon,
} from '@mui/icons-material';

interface PublishingChannel {
  id: string;
  name: string;
  icon: ReactNode;
  color: string;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  publishCount: number;
  config: {
    autoPublish: boolean;
    format: string;
    workspace?: string;
    channel?: string;
  };
}

interface PublishJob {
  id: string;
  contentId: string;
  contentTitle: string;
  channels: string[];
  status: 'queued' | 'processing' | 'published' | 'failed' | 'scheduled';
  progress: number;
  scheduledTime?: string;
  publishedTime?: string;
  urls?: Record<string, string>;
  errors?: string[];
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  score: number;
  lastModified: string;
  channels: string[];
  status: 'draft' | 'ready' | 'published' | 'scheduled';
}

export default function MultiChannelPublisher() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [publishDialog, setPublishDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');

  const [channels, setChannels] = useState<PublishingChannel[]>([
    {
      id: 'feishu',
      name: 'Feishu',
      icon: <DescriptionIcon />,
      color: '#00D6B9',
      enabled: true,
      status: 'connected',
      lastSync: '2 minutes ago',
      publishCount: 156,
      config: {
        autoPublish: true,
        format: 'markdown',
        workspace: 'LeapGEO7',
      },
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: <SlackIcon />,
      color: '#4A154B',
      enabled: true,
      status: 'connected',
      lastSync: '5 minutes ago',
      publishCount: 203,
      config: {
        autoPublish: false,
        format: 'markdown',
        channel: '#content-updates',
      },
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: <NotionIcon />,
      color: '#000000',
      enabled: true,
      status: 'connected',
      lastSync: '10 minutes ago',
      publishCount: 89,
      config: {
        autoPublish: true,
        format: 'markdown',
        workspace: 'Knowledge Base',
      },
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <GitHubIcon />,
      color: '#181717',
      enabled: true,
      status: 'connected',
      lastSync: '1 hour ago',
      publishCount: 45,
      config: {
        autoPublish: false,
        format: 'markdown',
        workspace: 'leapgeo7-docs',
      },
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      icon: <GitLabIcon />,
      color: '#FC6D26',
      enabled: false,
      status: 'disconnected',
      lastSync: 'Never',
      publishCount: 0,
      config: {
        autoPublish: false,
        format: 'markdown',
      },
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <YouTubeIcon />,
      color: '#FF0000',
      enabled: true,
      status: 'connected',
      lastSync: '3 hours ago',
      publishCount: 12,
      config: {
        autoPublish: false,
        format: 'script',
      },
    },
    {
      id: 'medium',
      name: 'Medium',
      icon: <MediumIcon />,
      color: '#000000',
      enabled: true,
      status: 'connected',
      lastSync: '1 day ago',
      publishCount: 34,
      config: {
        autoPublish: false,
        format: 'markdown',
      },
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: <RedditIcon />,
      color: '#FF4500',
      enabled: false,
      status: 'error',
      lastSync: 'Failed',
      publishCount: 8,
      config: {
        autoPublish: false,
        format: 'markdown',
      },
    },
  ]);

  const [publishJobs, setPublishJobs] = useState<PublishJob[]>([
    {
      id: 'job-001',
      contentId: 'content-001',
      contentTitle: 'Complete Guide to MCP Integration',
      channels: ['feishu', 'slack', 'notion'],
      status: 'published',
      progress: 100,
      publishedTime: '10 minutes ago',
      urls: {
        feishu: 'https://feishu.cn/docs/abc123',
        slack: 'https://slack.com/archives/xyz789',
        notion: 'https://notion.so/page456',
      },
    },
    {
      id: 'job-002',
      contentId: 'content-002',
      contentTitle: 'AI Content Generation Best Practices',
      channels: ['github', 'medium'],
      status: 'processing',
      progress: 65,
    },
    {
      id: 'job-003',
      contentId: 'content-003',
      contentTitle: 'Weekly Analytics Report',
      channels: ['feishu', 'slack'],
      status: 'scheduled',
      progress: 0,
      scheduledTime: '2024-10-27 09:00 AM',
    },
    {
      id: 'job-004',
      contentId: 'content-004',
      contentTitle: 'Product Update Announcement',
      channels: ['youtube'],
      status: 'failed',
      progress: 30,
      errors: ['Video format conversion failed', 'Thumbnail upload error'],
    },
  ]);

  const [contentItems] = useState<ContentItem[]>([
    {
      id: 'content-001',
      title: 'Complete Guide to MCP Integration',
      type: 'Blog Article',
      score: 94,
      lastModified: '2 hours ago',
      channels: ['feishu', 'slack', 'notion'],
      status: 'published',
    },
    {
      id: 'content-002',
      title: 'AI Content Generation Best Practices',
      type: 'Technical Guide',
      score: 88,
      lastModified: '5 hours ago',
      channels: [],
      status: 'ready',
    },
    {
      id: 'content-003',
      title: 'Weekly Analytics Report',
      type: 'Report',
      score: 92,
      lastModified: '1 day ago',
      channels: ['feishu', 'slack'],
      status: 'scheduled',
    },
    {
      id: 'content-004',
      title: 'Product Update Announcement',
      type: 'Announcement',
      score: 85,
      lastModified: '2 days ago',
      channels: [],
      status: 'draft',
    },
  ]);

  const handlePublish = () => {
    if (!selectedContent || selectedChannels.length === 0) return;

    const newJob: PublishJob = {
      id: `job-${Date.now()}`,
      contentId: selectedContent.id,
      contentTitle: selectedContent.title,
      channels: selectedChannels,
      status: 'queued',
      progress: 0,
    };

    setPublishJobs((prev) => [newJob, ...prev]);
    setPublishDialog(false);
    setSelectedChannels([]);

    // Simulate publishing progress
    simulatePublishing(newJob.id);
  };

  const simulatePublishing = (jobId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setPublishJobs((prev) =>
          prev.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status: 'published',
                  progress: 100,
                  publishedTime: 'Just now',
                  urls: job.channels.reduce((acc, channel) => {
                    acc[channel] = `https://${channel}.com/content/${job.contentId}`;
                    return acc;
                  }, {} as Record<string, string>),
                }
              : job
          )
        );
      } else {
        setPublishJobs((prev) =>
          prev.map((job) =>
            job.id === jobId
              ? { ...job, status: 'processing', progress }
              : job
          )
        );
      }
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckIcon sx={{ color: '#10B981' }} />;
      case 'processing':
        return <SendIcon sx={{ color: '#F59E0B' }} />;
      case 'scheduled':
        return <ScheduleIcon sx={{ color: '#6366F1' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: '#EF4444' }} />;
      default:
        return <PendingIcon />;
    }
  };

  const getChannelStatus = (status: string) => {
    switch (status) {
      case 'connected':
        return { color: '#10B981', text: 'Connected' };
      case 'disconnected':
        return { color: '#6B7280', text: 'Disconnected' };
      case 'error':
        return { color: '#EF4444', text: 'Error' };
      default:
        return { color: '#6B7280', text: 'Unknown' };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Multi-Channel Publisher
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Distribute content across platforms with MCP integration
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<RefreshIcon />} variant="outlined">
            Sync All
          </Button>
          <Button startIcon={<SettingsIcon />} variant="outlined">
            Channel Settings
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Active Channels
                </Typography>
                <CloudDoneIcon sx={{ color: '#10B981' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                6/8
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Connected and ready
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Published Today
                </Typography>
                <SendIcon sx={{ color: '#6366F1' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                24
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Across all channels
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Scheduled
                </Typography>
                <ScheduleIcon sx={{ color: '#8B5CF6' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                8
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Upcoming publications
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Total Reach
                </Typography>
                <WebIcon sx={{ color: '#EC4899' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                15.2K
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Combined audience
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Publishing Channels */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Publishing Channels
            </Typography>
            <List>
              {channels.map((channel) => {
                const status = getChannelStatus(channel.status);
                return (
                  <ListItem
                    key={channel.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      opacity: channel.enabled ? 1 : 0.5,
                    }}
                  >
                    <ListItemIcon sx={{ color: channel.color }}>
                      {channel.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">{channel.name}</Typography>
                          <Chip
                            label={status.text}
                            size="small"
                            sx={{
                              bgcolor: `${status.color}20`,
                              color: status.color,
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" display="block">
                            {channel.publishCount} publications
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last sync: {channel.lastSync}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={channel.enabled}
                        onChange={(e) => {
                          setChannels((prev) =>
                            prev.map((ch) =>
                              ch.id === channel.id
                                ? { ...ch, enabled: e.target.checked }
                                : ch
                            )
                          );
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Content Queue */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Content Queue
            </Typography>
            <List>
              {contentItems.map((content) => (
                <ListItem
                  key={content.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => {
                    setSelectedContent(content);
                    setPublishDialog(true);
                  }}
                >
                  <ListItemIcon>
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ flex: 1 }}>
                          {content.title}
                        </Typography>
                        <Chip
                          label={`Score: ${content.score}`}
                          size="small"
                          color={content.score >= 90 ? 'success' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" display="block">
                          {content.type} • Modified {content.lastModified}
                        </Typography>
                        {content.channels.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            {content.channels.map((ch) => {
                              const channel = channels.find((c) => c.id === ch);
                              return (
                                <Chip
                                  key={ch}
                                  label={channel?.name}
                                  size="small"
                                  sx={{ height: 18, fontSize: '0.7rem' }}
                                />
                              );
                            })}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ mt: 2 }}
            >
              Load More Content
            </Button>
          </Paper>
        </Grid>

        {/* Publishing Jobs */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Publishing Jobs</Typography>
              <IconButton size="small">
                <HistoryIcon />
              </IconButton>
            </Box>
            <List>
              {publishJobs.map((job) => (
                <ListItem
                  key={job.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>{getStatusIcon(job.status)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2">
                        {job.contentTitle}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, mb: 1 }}>
                          {job.channels.map((ch) => {
                            const channel = channels.find((c) => c.id === ch);
                            return (
                              <Box
                                key={ch}
                                sx={{
                                  color: channel?.color,
                                  fontSize: 20,
                                }}
                              >
                                {channel?.icon}
                              </Box>
                            );
                          })}
                        </Box>
                        {job.status === 'processing' && (
                          <LinearProgress
                            variant="determinate"
                            value={job.progress}
                            sx={{ mb: 0.5 }}
                          />
                        )}
                        <Typography variant="caption" display="block">
                          {job.status === 'published' && `Published ${job.publishedTime}`}
                          {job.status === 'scheduled' && `Scheduled for ${job.scheduledTime}`}
                          {job.status === 'processing' && `Publishing... ${Math.round(job.progress)}%`}
                          {job.status === 'failed' && job.errors?.[0]}
                        </Typography>
                        {job.urls && (
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            {Object.entries(job.urls).map(([channel, url]) => (
                              <IconButton
                                key={channel}
                                size="small"
                                onClick={() => window.open(url, '_blank')}
                              >
                                <LinkIcon fontSize="small" />
                              </IconButton>
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Publish Dialog */}
      <Dialog open={publishDialog} onClose={() => setPublishDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Publish Content</DialogTitle>
        <DialogContent>
          {selectedContent && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {selectedContent.title}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Select Channels:
              </Typography>
              <Box>
                {channels
                  .filter((ch) => ch.enabled && ch.status === 'connected')
                  .map((channel) => (
                    <FormControlLabel
                      key={channel.id}
                      control={
                        <Checkbox
                          checked={selectedChannels.includes(channel.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChannels((prev) => [...prev, channel.id]);
                            } else {
                              setSelectedChannels((prev) =>
                                prev.filter((id) => id !== channel.id)
                              );
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: channel.color }}>{channel.icon}</Box>
                          <Typography>{channel.name}</Typography>
                        </Box>
                      }
                    />
                  ))}
              </Box>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={() => {
                    setScheduleDialog(true);
                    setPublishDialog(false);
                  }}
                >
                  Schedule
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handlePublish}
            disabled={selectedChannels.length === 0}
          >
            Publish Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialog} onClose={() => setScheduleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Publication</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="datetime-local"
            label="Schedule Time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<ScheduleIcon />}
            disabled={!scheduleTime}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}