import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  AutoAwesome as GeneratorIcon,
  Send as GenerateIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import type { ContentChannel, ContentTemplate } from '@/types/content.types';

// Mock templates for 7 channels
const mockTemplates: ContentTemplate[] = [
  {
    id: 'youtube-1',
    name: 'Product Review Video Script',
    channel: 'YouTube',
    description: 'Comprehensive product review with pros/cons and user experience',
    template: `
🎥 Video Title: {{productName}} Review - {{keyBenefit}}

📝 Script Outline:
[00:00] Hook: {{hook}}
[00:15] Introduction: {{productIntro}}
[01:00] Key Features: {{features}}
[03:00] Pros & Cons: {{prosAndCons}}
[05:00] User Experience: {{userExperience}}
[07:00] Conclusion & Call-to-Action: {{conclusion}}

🎯 Description:
{{description}}

#Tags: {{tags}}
    `.trim(),
    variables: ['productName', 'keyBenefit', 'hook', 'productIntro', 'features', 'prosAndCons', 'userExperience', 'conclusion', 'description', 'tags'],
  },
  {
    id: 'reddit-1',
    name: 'Community Discussion Post',
    channel: 'Reddit',
    description: 'Engaging discussion starter with personal experience',
    template: `
**{{title}}**

Hey {{subreddit}} community!

{{personalStory}}

**Key Points:**
{{keyPoints}}

**My Experience:**
{{experience}}

**Questions for the Community:**
{{questions}}

---
*TL;DR: {{tldr}}*
    `.trim(),
    variables: ['title', 'subreddit', 'personalStory', 'keyPoints', 'experience', 'questions', 'tldr'],
  },
  {
    id: 'quora-1',
    name: 'Expert Answer',
    channel: 'Quora',
    description: 'Authoritative answer with data and personal insights',
    template: `
{{question}}

**Short Answer:**
{{shortAnswer}}

**Detailed Explanation:**

{{context}}

**Key Factors to Consider:**
{{factors}}

**Real-World Example:**
{{example}}

**Bottom Line:**
{{conclusion}}

---
*Background: {{credentials}}*
    `.trim(),
    variables: ['question', 'shortAnswer', 'context', 'factors', 'example', 'conclusion', 'credentials'],
  },
  {
    id: 'medium-1',
    name: 'In-Depth Article',
    channel: 'Medium',
    description: 'Long-form article with research and storytelling',
    template: `
# {{title}}

## {{subtitle}}

{{openingHook}}

### The Problem

{{problemStatement}}

### Research & Insights

{{research}}

### Solution Analysis

{{solution}}

### Real-World Application

{{application}}

### Conclusion

{{conclusion}}

---
**About the Author:** {{authorBio}}
    `.trim(),
    variables: ['title', 'subtitle', 'openingHook', 'problemStatement', 'research', 'solution', 'application', 'conclusion', 'authorBio'],
  },
  {
    id: 'blog-1',
    name: 'SEO-Optimized Blog Post',
    channel: 'Blog',
    description: 'Search-friendly blog post with headers and CTAs',
    template: `
# {{h1Title}}

{{metaDescription}}

## Introduction

{{introduction}}

## {{h2Section1}}

{{section1Content}}

## {{h2Section2}}

{{section2Content}}

## {{h2Section3}}

{{section3Content}}

## Key Takeaways

{{keyTakeaways}}

## Conclusion

{{conclusion}}

**{{ctaHeadline}}**
{{ctaText}}
    `.trim(),
    variables: ['h1Title', 'metaDescription', 'introduction', 'h2Section1', 'section1Content', 'h2Section2', 'section2Content', 'h2Section3', 'section3Content', 'keyTakeaways', 'conclusion', 'ctaHeadline', 'ctaText'],
  },
  {
    id: 'amazon-1',
    name: 'Product Listing Optimization',
    channel: 'Amazon',
    description: 'Amazon product title, bullets, and A+ content',
    template: `
**Product Title:**
{{title}}

**Bullet Points:**
• {{bullet1}}
• {{bullet2}}
• {{bullet3}}
• {{bullet4}}
• {{bullet5}}

**Product Description:**
{{description}}

**A+ Content Section:**
{{aplusContent}}

**Search Terms:**
{{searchTerms}}
    `.trim(),
    variables: ['title', 'bullet1', 'bullet2', 'bullet3', 'bullet4', 'bullet5', 'description', 'aplusContent', 'searchTerms'],
  },
  {
    id: 'linkedin-1',
    name: 'Professional Thought Leadership',
    channel: 'LinkedIn',
    description: 'Professional insight post with business value',
    template: `
{{hook}}

{{context}}

Here's what I've learned:

{{insight1}}

{{insight2}}

{{insight3}}

💡 Key Takeaway:
{{keyTakeaway}}

What's your experience with {{topic}}? Drop a comment below! 👇

#{{hashtag1}} #{{hashtag2}} #{{hashtag3}}
    `.trim(),
    variables: ['hook', 'context', 'insight1', 'insight2', 'insight3', 'keyTakeaway', 'topic', 'hashtag1', 'hashtag2', 'hashtag3'],
  },
];

// Mock target prompts
const mockTargetPrompts = [
  { id: '1', text: 'Best mattress for back pain relief', pLevel: 'P0' },
  { id: '2', text: 'Memory foam vs latex mattress comparison', pLevel: 'P0' },
  { id: '3', text: 'How to choose the right mattress firmness', pLevel: 'P1' },
  { id: '4', text: 'Best cooling mattress for hot sleepers', pLevel: 'P1' },
  { id: '5', text: 'Mattress buying guide 2025', pLevel: 'P2' },
  { id: '6', text: 'Best budget mattress under $500', pLevel: 'P2' },
];

export default function ContentGenerator() {
  const [selectedChannel, setSelectedChannel] = useState<ContentChannel>('YouTube');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const channels: ContentChannel[] = ['YouTube', 'Reddit', 'Quora', 'Medium', 'Blog', 'Amazon', 'LinkedIn'];

  const channelColors: Record<ContentChannel, string> = {
    YouTube: '#FF0000',
    Reddit: '#FF4500',
    Quora: '#B92B27',
    Medium: '#000000',
    Blog: '#06B6D4',
    Amazon: '#FF9900',
    LinkedIn: '#0A66C2',
  };

  const templatesForChannel = mockTemplates.filter((t) => t.channel === selectedChannel);

  const handleChannelChange = (channel: ContentChannel) => {
    setSelectedChannel(channel);
    setSelectedTemplate(null);
    setVariables({});
    setGeneratedContent('');
    setShowPreview(false);
  };

  const handleTemplateChange = (templateId: string) => {
    const template = mockTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Initialize variables with empty strings
      const initialVars: Record<string, string> = {};
      template.variables.forEach((v) => {
        initialVars[v] = '';
      });
      setVariables(initialVars);
      setGeneratedContent('');
      setShowPreview(false);
    }
  };

  const handleVariableChange = (varName: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [varName]: value,
    }));
  };

  const handlePromptToggle = (promptId: string) => {
    setSelectedPrompts((prev) =>
      prev.includes(promptId)
        ? prev.filter((id) => id !== promptId)
        : [...prev, promptId]
    );
  };

  const handleGenerate = () => {
    if (!selectedTemplate) return;

    let content = selectedTemplate.template;

    // Replace all variables with their values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value || `[${key}]`);
    });

    setGeneratedContent(content);
    setShowPreview(true);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const isGenerateDisabled = !selectedTemplate || Object.values(variables).every((v) => !v);

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
              bgcolor: '#10B98115',
              color: '#10B981',
            }}
          >
            <GeneratorIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Content Generator
            </Typography>
            <Typography variant="body1" color="text.secondary">
              AI-powered content generation for 7 distribution channels
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Panel: Configuration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Configuration
            </Typography>

            {/* Channel Selection */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Select Channel
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {channels.map((channel) => (
                  <Chip
                    key={channel}
                    label={channel}
                    onClick={() => handleChannelChange(channel)}
                    sx={{
                      bgcolor: selectedChannel === channel ? channelColors[channel] : 'transparent',
                      color: selectedChannel === channel ? 'white' : channelColors[channel],
                      borderColor: channelColors[channel],
                      borderWidth: 2,
                      borderStyle: 'solid',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: `${channelColors[channel]}20`,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Template Selection */}
            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Select Template</InputLabel>
                <Select
                  value={selectedTemplate?.id || ''}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  label="Select Template"
                >
                  {templatesForChannel.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedTemplate && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {selectedTemplate.description}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Variable Inputs */}
            {selectedTemplate && (
              <Box>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Template Variables ({selectedTemplate.variables.length})
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedTemplate.variables.map((varName) => (
                    <TextField
                      key={varName}
                      label={varName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      value={variables[varName] || ''}
                      onChange={(e) => handleVariableChange(varName, e.target.value)}
                      multiline={varName.includes('content') || varName.includes('description') || varName.includes('story')}
                      rows={varName.includes('content') || varName.includes('description') || varName.includes('story') ? 3 : 1}
                      size="small"
                      fullWidth
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Target Prompts Selection */}
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Target Prompts (Optional)
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block', mb: 2 }}>
                Select prompts this content will address
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {mockTargetPrompts.map((prompt) => (
                  <Chip
                    key={prompt.id}
                    label={`${prompt.pLevel}: ${prompt.text}`}
                    onClick={() => handlePromptToggle(prompt.id)}
                    color={selectedPrompts.includes(prompt.id) ? 'primary' : 'default'}
                    variant={selectedPrompts.includes(prompt.id) ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Generate Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<GenerateIcon />}
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              sx={{ mt: 3 }}
            >
              Generate Content
            </Button>
          </Paper>
        </Grid>

        {/* Right Panel: Preview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, minHeight: 600 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Content Preview
              </Typography>
              {showPreview && (
                <Button
                  size="small"
                  startIcon={<CopyIcon />}
                  onClick={handleCopyContent}
                  variant="outlined"
                >
                  Copy
                </Button>
              )}
            </Box>

            {!showPreview ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 500,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <GeneratorIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Fill in variables and click Generate
                </Typography>
              </Box>
            ) : (
              <Box>
                {/* Channel Badge */}
                <Chip
                  label={selectedChannel}
                  size="small"
                  sx={{
                    bgcolor: channelColors[selectedChannel],
                    color: 'white',
                    fontWeight: 600,
                    mb: 2,
                  }}
                />

                {/* Template Name */}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedTemplate?.name}
                </Typography>

                {/* Generated Content */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: 'grey.50',
                    maxHeight: 500,
                    overflow: 'auto',
                  }}
                >
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {generatedContent}
                  </Typography>
                </Paper>

                {/* Target Prompts Info */}
                {selectedPrompts.length > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    This content will address {selectedPrompts.length} target prompt{selectedPrompts.length > 1 ? 's' : ''}
                  </Alert>
                )}
              </Box>
            )}
          </Paper>

          {/* Stats Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Generation Stats
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Channel
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedChannel}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Variables
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedTemplate?.variables.length || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Target Prompts
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedPrompts.length}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
