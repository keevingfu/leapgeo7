import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  LinearProgress,
  Chip,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  SmartToyOutlined as AIIcon,
  Psychology as ThinkingIcon,
  Article as BlogIcon,
  Web as LandingIcon,
  ShoppingCart as PDPIcon,
  Share as SocialIcon,
  Forum as RedditIcon,
  QuestionAnswer as QuoraIcon,
  BookOutlined as MediumIcon,
  YouTube as YouTubeIcon,
  AutoAwesome as GenerateIcon,
  Timeline as ChainIcon,
  Science as TestIcon,
  Insights as AnalysisIcon,
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon,
  PlayCircleOutline as PlayIcon,
  StopCircle as StopIcon,
  RestartAlt as ResetIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

interface ContentTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  tokens: number;
  structure: string[];
}

interface GenerationTask {
  id: string;
  type: string;
  prompt: string;
  template: string;
  status: 'pending' | 'thinking' | 'generating' | 'analyzing' | 'completed' | 'error';
  progress: number;
  output?: string;
  evidenceChain?: string[];
  topicAnalysis?: {
    mainTopics: string[];
    keywords: string[];
    sentiment: string;
  };
  reasoning?: string[];
  timestamp: string;
}

interface MCPToolStatus {
  tool: string;
  status: 'idle' | 'active' | 'completed';
  calls: number;
  avgTime: number;
}

export default function AIGCStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blog');
  const [prompt, setPrompt] = useState<string>('');
  const [tasks, setTasks] = useState<GenerationTask[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTask, setSelectedTask] = useState<GenerationTask | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);

  const templates: ContentTemplate[] = [
    {
      id: 'blog',
      name: 'Blog Article',
      icon: <BlogIcon />,
      color: '#6366F1',
      description: 'Long-form educational content with SEO optimization',
      tokens: 2500,
      structure: ['Title', 'Meta Description', 'Introduction', 'Main Sections', 'Conclusion', 'CTA'],
    },
    {
      id: 'landing',
      name: 'Landing Page',
      icon: <LandingIcon />,
      color: '#EC4899',
      description: 'Conversion-focused page with persuasive copy',
      tokens: 1500,
      structure: ['Hero Section', 'Benefits', 'Features', 'Social Proof', 'FAQ', 'CTA'],
    },
    {
      id: 'pdp',
      name: 'Product Description (PDP)',
      icon: <PDPIcon />,
      color: '#F59E0B',
      description: 'Detailed product information with specifications',
      tokens: 1000,
      structure: ['Title', 'Key Features', 'Specifications', 'Benefits', 'Usage', 'Reviews'],
    },
    {
      id: 'social',
      name: 'Social Media Post',
      icon: <SocialIcon />,
      color: '#10B981',
      description: 'Engaging social media content with hashtags',
      tokens: 300,
      structure: ['Hook', 'Main Content', 'Call to Action', 'Hashtags'],
    },
    {
      id: 'reddit',
      name: 'Reddit Post',
      icon: <RedditIcon />,
      color: '#FF4500',
      description: 'Community-focused discussion post',
      tokens: 800,
      structure: ['Title', 'Context', 'Question/Opinion', 'TLDR'],
    },
    {
      id: 'quora',
      name: 'Quora Answer',
      icon: <QuoraIcon />,
      color: '#B92B27',
      description: 'Authoritative answer with expertise demonstration',
      tokens: 1200,
      structure: ['Direct Answer', 'Detailed Explanation', 'Examples', 'Sources', 'Credentials'],
    },
    {
      id: 'medium',
      name: 'Medium Article',
      icon: <MediumIcon />,
      color: '#000000',
      description: 'Thought leadership content with narrative style',
      tokens: 3000,
      structure: ['Title', 'Subtitle', 'Story Hook', 'Main Narrative', 'Insights', 'Call to Action'],
    },
    {
      id: 'youtube',
      name: 'YouTube Script',
      icon: <YouTubeIcon />,
      color: '#FF0000',
      description: 'Video script with timestamps and visual cues',
      tokens: 2000,
      structure: ['Hook', 'Introduction', 'Main Content', 'Examples', 'Summary', 'Subscribe CTA'],
    },
  ];

  const mcpToolsStatus: MCPToolStatus[] = [
    { tool: 'Sequential Thinking', status: 'idle', calls: 42, avgTime: 3.2 },
    { tool: 'InfraNodus', status: 'idle', calls: 156, avgTime: 1.8 },
    { tool: 'Neo4j Knowledge Graph', status: 'idle', calls: 89, avgTime: 0.9 },
    { tool: 'Memory MCP', status: 'idle', calls: 234, avgTime: 0.5 },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    const newTask: GenerationTask = {
      id: `task-${Date.now()}`,
      type: 'content',
      prompt,
      template: selectedTemplate,
      status: 'thinking',
      progress: 0,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    simulateContentGeneration(newTask.id);
  };

  const simulateContentGeneration = (taskId: string) => {
    // Simulate multi-stage generation process
    const stages = [
      { status: 'thinking' as const, progress: 20, duration: 2000 },
      { status: 'generating' as const, progress: 50, duration: 3000 },
      { status: 'analyzing' as const, progress: 80, duration: 2000 },
      { status: 'completed' as const, progress: 100, duration: 1000 },
    ];

    stages.forEach((stage, index) => {
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: stage.status,
                  progress: stage.progress,
                  ...(stage.status === 'thinking' && {
                    reasoning: [
                      'Analyzing prompt requirements and context...',
                      'Identifying key topics and entities...',
                      'Determining optimal content structure...',
                      'Selecting relevant evidence from knowledge graph...',
                    ],
                  }),
                  ...(stage.status === 'analyzing' && {
                    topicAnalysis: {
                      mainTopics: ['Technology', 'Innovation', 'User Experience'],
                      keywords: ['AI', 'automation', 'efficiency', 'optimization', 'integration'],
                      sentiment: 'positive',
                    },
                  }),
                  ...(stage.status === 'completed' && {
                    output: generateMockContent(task.template),
                    evidenceChain: [
                      'Source: Technical Documentation (Confidence: 95%)',
                      'Source: Industry Report 2024 (Confidence: 88%)',
                      'Source: User Reviews Analysis (Confidence: 92%)',
                      'Source: Knowledge Graph Relations (Confidence: 86%)',
                    ],
                  }),
                }
              : task
          )
        );
      }, stages.slice(0, index + 1).reduce((sum, s) => sum + s.duration, 0));
    });
  };

  const generateMockContent = (templateId: string): string => {
    const contents: Record<string, string> = {
      blog: `# The Future of AI-Powered Content Generation

## Introduction
The landscape of content creation is undergoing a revolutionary transformation through artificial intelligence...

## Key Benefits
- **Efficiency**: Generate high-quality content 10x faster
- **Consistency**: Maintain brand voice across all channels
- **Scalability**: Produce content at unprecedented scale
- **Optimization**: AI-driven SEO and engagement optimization

## Real-World Applications
Organizations worldwide are leveraging AI content generation to streamline their marketing efforts...

## Conclusion
As we move forward, the integration of AI in content creation will become not just beneficial, but essential for competitive advantage.`,

      landing: `<Hero Section>
Headline: Transform Your Content Strategy with AI
Subheadline: Generate engaging, optimized content in minutes, not hours

<Benefits>
✓ 10x Faster Content Creation
✓ SEO-Optimized by Default
✓ Multi-Channel Distribution
✓ Data-Driven Insights

<CTA>
Start Your Free Trial Today →`,

      social: `🚀 Just discovered the power of AI content generation!

Our team reduced content creation time by 85% while improving engagement by 3x.

The secret? Combining Sequential Thinking MCP with knowledge graphs for context-aware content.

What's your experience with AI content tools?

#AIContent #ContentMarketing #Innovation #TechTrends`,
    };

    return contents[templateId] || contents.blog;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'thinking':
        return <ThinkingIcon sx={{ animation: 'spin 2s linear infinite' }} />;
      case 'generating':
        return <GenerateIcon sx={{ color: '#F59E0B' }} />;
      case 'analyzing':
        return <AnalysisIcon sx={{ color: '#6366F1' }} />;
      case 'completed':
        return <CheckIcon sx={{ color: '#10B981' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#EF4444' }} />;
      default:
        return <PlayIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          AIGC Studio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered content generation with MCP integration and multi-round reasoning
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Template Selection */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Content Templates
            </Typography>
            <Grid container spacing={2}>
              {templates.map((template) => (
                <Grid item xs={12} sm={6} md={3} key={template.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: selectedTemplate === template.id ? template.color : 'divider',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
                    }}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent>
                      <Box sx={{ color: template.color, mb: 1 }}>
                        {template.icon}
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {template.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ~{template.tokens} tokens
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Selected Template Details */}
            {selectedTemplate && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {templates.find((t) => t.id === selectedTemplate)?.name} Structure:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {templates
                    .find((t) => t.id === selectedTemplate)
                    ?.structure.map((section) => (
                      <Chip key={section} label={section} size="small" />
                    ))}
                </Box>
              </Box>
            )}

            {/* Prompt Input */}
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content Prompt"
                placeholder="Describe what content you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                size="large"
                startIcon={<GenerateIcon />}
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                sx={{
                  background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
                }}
              >
                Generate Content
              </Button>
            </Box>
          </Paper>

          {/* Generation Tasks */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Generation Queue
            </Typography>

            {tasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <AIIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary">
                  No generation tasks yet. Start by entering a prompt above.
                </Typography>
              </Box>
            ) : (
              <List>
                {tasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      mb: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <ListItemIcon>{getStatusIcon(task.status)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {templates.find((t) => t.id === task.template)?.name}
                          </Typography>
                          <Chip
                            label={task.status}
                            size="small"
                            color={task.status === 'completed' ? 'success' : 'default'}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" display="block">
                            {task.prompt.substring(0, 100)}...
                          </Typography>
                          {task.status !== 'completed' && task.status !== 'error' && (
                            <LinearProgress
                              variant="determinate"
                              value={task.progress}
                              sx={{ mt: 1 }}
                            />
                          )}
                        </>
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      {task.timestamp}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* MCP Tools Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              MCP Tools Status
            </Typography>
            <List>
              {mcpToolsStatus.map((tool) => (
                <ListItem key={tool.tool} sx={{ px: 0 }}>
                  <ListItemText
                    primary={tool.tool}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={tool.status}
                          size="small"
                          color={
                            tool.status === 'active'
                              ? 'warning'
                              : tool.status === 'completed'
                              ? 'success'
                              : 'default'
                          }
                        />
                        <Typography variant="caption">
                          {tool.calls} calls • {tool.avgTime}s avg
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Evidence Chain */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Knowledge Graph Evidence
            </Typography>
            {selectedTask?.evidenceChain ? (
              <List dense>
                {selectedTask.evidenceChain.map((evidence, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <ChainIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption">{evidence}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Evidence chain will appear after generation
              </Typography>
            )}
          </Paper>

          {/* Topic Analysis */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Topic Analysis
            </Typography>
            {selectedTask?.topicAnalysis ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Main Topics
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedTask.topicAnalysis.mainTopics.map((topic) => (
                      <Chip key={topic} label={topic} size="small" color="primary" />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Keywords
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedTask.topicAnalysis.keywords.map((keyword) => (
                      <Chip key={keyword} label={keyword} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Sentiment
                  </Typography>
                  <Chip
                    label={selectedTask.topicAnalysis.sentiment}
                    size="small"
                    color="success"
                  />
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Topic analysis will appear during generation
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Selected Task Output Dialog */}
      <Dialog
        open={Boolean(selectedTask?.output)}
        onClose={() => setSelectedTask(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedTask && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Generated Content</Typography>
                <Box>
                  <IconButton size="small" onClick={() => navigator.clipboard.writeText(selectedTask.output || '')}>
                    <CopyIcon />
                  </IconButton>
                  <IconButton size="small">
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography
                component="pre"
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                }}
              >
                {selectedTask.output}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedTask(null)}>Close</Button>
              <Button variant="contained" startIcon={<TestIcon />}>
                Run Citation Check
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}