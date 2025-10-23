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
  Chip,
  Alert,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';

type Channel = 'youtube' | 'reddit' | 'quora' | 'medium' | 'blog' | 'amazon' | 'linkedin';

interface TemplateData {
  channel: Channel;
  name: string;
  content: string;
  variables: string[];
}

// Mock template data
const initialTemplates: Record<Channel, TemplateData> = {
  youtube: {
    channel: 'youtube',
    name: 'YouTube Video Script',
    content: `**Title**: {{prompt}} - Complete Guide 2025

**Introduction** (0:00-0:30)
Hey everyone! Today we're diving deep into {{prompt}}. If you're looking for {{primary_benefit}}, you're in the right place!

**Main Content** (0:30-8:00)
Let me share everything you need to know about {{brand}} {{product}}:

1. **Key Features**
{{features}}

2. **Benefits**
{{benefits}}

3. **Real User Experience**
{{testimonials}}

**Call to Action** (8:00-8:30)
👉 Check the link in description for {{offer}}
💬 Drop your questions in the comments below!
🔔 Subscribe for more {{category}} content!

#{{hashtags}}`,
    variables: ['prompt', 'brand', 'product', 'primary_benefit', 'features', 'benefits', 'testimonials', 'offer', 'category', 'hashtags'],
  },
  reddit: {
    channel: 'reddit',
    name: 'Reddit Post',
    content: `**{{prompt}} - My honest experience after {{duration}}**

TL;DR: {{summary}}

---

**Background**
I've been researching {{prompt}} for a while now, and here's what I discovered about {{brand}} {{product}}.

**What I Found**
{{findings}}

**Pros:**
{{pros}}

**Cons:**
{{cons}}

**Bottom Line**
{{conclusion}}

---

*Edit: Thanks for all the questions! Happy to answer more.*

*Disclaimer: {{disclaimer}}*`,
    variables: ['prompt', 'brand', 'product', 'duration', 'summary', 'findings', 'pros', 'cons', 'conclusion', 'disclaimer'],
  },
  quora: {
    channel: 'quora',
    name: 'Quora Answer',
    content: `**{{prompt}}**

Great question! As someone who has {{credentials}}, I can provide some insights.

**Short Answer:**
{{short_answer}}

**Detailed Explanation:**
{{detailed_explanation}}

**Key Factors to Consider:**
1. {{factor_1}}
2. {{factor_2}}
3. {{factor_3}}

**My Recommendation:**
Based on {{evaluation_criteria}}, I'd suggest {{recommendation}}.

**Real Example:**
{{case_study}}

Hope this helps! Feel free to ask follow-up questions.

---
*Updated: {{date}}*`,
    variables: ['prompt', 'credentials', 'short_answer', 'detailed_explanation', 'factor_1', 'factor_2', 'factor_3', 'evaluation_criteria', 'recommendation', 'case_study', 'date'],
  },
  medium: {
    channel: 'medium',
    name: 'Medium Article',
    content: `# {{prompt}}: {{subtitle}}

![Cover Image]({{cover_image_url}})

*{{reading_time}} min read · {{publish_date}}*

---

## Introduction

{{introduction}}

## The Problem

{{problem_statement}}

## The Solution

{{solution_overview}}

### Key Insights

{{insights}}

## Deep Dive

### 1. {{section_1_title}}

{{section_1_content}}

### 2. {{section_2_title}}

{{section_2_content}}

### 3. {{section_3_title}}

{{section_3_content}}

## Conclusion

{{conclusion}}

---

**Key Takeaways:**
- {{takeaway_1}}
- {{takeaway_2}}
- {{takeaway_3}}

---

*Thanks for reading! If you found this helpful, please 👏 and share.*

**Resources:**
{{resources}}`,
    variables: ['prompt', 'subtitle', 'cover_image_url', 'reading_time', 'publish_date', 'introduction', 'problem_statement', 'solution_overview', 'insights', 'section_1_title', 'section_1_content', 'section_2_title', 'section_2_content', 'section_3_title', 'section_3_content', 'conclusion', 'takeaway_1', 'takeaway_2', 'takeaway_3', 'resources'],
  },
  blog: {
    channel: 'blog',
    name: 'Blog Post',
    content: `---
title: "{{prompt}}"
description: "{{meta_description}}"
date: {{publish_date}}
author: {{author}}
tags: [{{tags}}]
---

# {{prompt}}

{{hero_image}}

## Introduction

{{introduction}}

## {{heading_1}}

{{content_1}}

> **Pro Tip:** {{tip_1}}

## {{heading_2}}

{{content_2}}

![Illustration]({{image_2_url}})
*{{image_2_caption}}*

## {{heading_3}}

{{content_3}}

### Quick Comparison

{{comparison_table}}

## Final Thoughts

{{conclusion}}

---

**Related Articles:**
- {{related_1}}
- {{related_2}}
- {{related_3}}

**Share this post:**
[Twitter]({{twitter_share}}) | [LinkedIn]({{linkedin_share}}) | [Facebook]({{facebook_share}})`,
    variables: ['prompt', 'meta_description', 'publish_date', 'author', 'tags', 'hero_image', 'introduction', 'heading_1', 'content_1', 'tip_1', 'heading_2', 'content_2', 'image_2_url', 'image_2_caption', 'heading_3', 'content_3', 'comparison_table', 'conclusion', 'related_1', 'related_2', 'related_3', 'twitter_share', 'linkedin_share', 'facebook_share'],
  },
  amazon: {
    channel: 'amazon',
    name: 'Amazon Review',
    content: `**{{rating}}/5 Stars - {{review_title}}**

**Verified Purchase** ✓

**What I liked:**
✅ {{pro_1}}
✅ {{pro_2}}
✅ {{pro_3}}

**What could be better:**
⚠️ {{con_1}}
⚠️ {{con_2}}

**My Experience:**
{{detailed_review}}

**Use Case:**
Perfect for {{use_case}}. I've been using it for {{usage_duration}} and {{performance_summary}}.

**Quality:**
{{quality_assessment}}

**Value for Money:**
{{value_assessment}}

**Bottom Line:**
{{recommendation}}

**Helpful?** 👍 Yes | 👎 No

---
*Images: {{image_count}} photos uploaded*
*Purchased on: {{purchase_date}}*`,
    variables: ['rating', 'review_title', 'pro_1', 'pro_2', 'pro_3', 'con_1', 'con_2', 'detailed_review', 'use_case', 'usage_duration', 'performance_summary', 'quality_assessment', 'value_assessment', 'recommendation', 'image_count', 'purchase_date'],
  },
  linkedin: {
    channel: 'linkedin',
    name: 'LinkedIn Post',
    content: `{{prompt}} 💡

{{hook}}

Here's what I learned:

1️⃣ {{insight_1}}

2️⃣ {{insight_2}}

3️⃣ {{insight_3}}

{{main_content}}

Key Takeaways:
→ {{takeaway_1}}
→ {{takeaway_2}}
→ {{takeaway_3}}

{{call_to_action}}

---

What's your experience with {{topic}}? Share your thoughts in the comments! 👇

#{{hashtag_1}} #{{hashtag_2}} #{{hashtag_3}}

---
*Image: {{image_description}}*`,
    variables: ['prompt', 'hook', 'insight_1', 'insight_2', 'insight_3', 'main_content', 'takeaway_1', 'takeaway_2', 'takeaway_3', 'call_to_action', 'topic', 'hashtag_1', 'hashtag_2', 'hashtag_3', 'image_description'],
  },
};

const channelConfig: Record<Channel, { label: string; color: string }> = {
  youtube: { label: 'YouTube', color: '#FF0000' },
  reddit: { label: 'Reddit', color: '#FF4500' },
  quora: { label: 'Quora', color: '#B92B27' },
  medium: { label: 'Medium', color: '#00AB6C' },
  blog: { label: 'Blog', color: '#6366F1' },
  amazon: { label: 'Amazon', color: '#FF9900' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
};

export default function TemplateEditor() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>('youtube');
  const [templates, setTemplates] = useState(initialTemplates);
  const [editedContent, setEditedContent] = useState(templates[selectedChannel].content);
  const [showPreview, setShowPreview] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentTemplate = templates[selectedChannel];

  const handleChannelChange = (_event: React.SyntheticEvent, newChannel: Channel) => {
    setSelectedChannel(newChannel);
    setEditedContent(templates[newChannel].content);
    setShowPreview(false);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContent(event.target.value);
  };

  const handleSave = () => {
    setTemplates({
      ...templates,
      [selectedChannel]: {
        ...templates[selectedChannel],
        content: editedContent,
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setEditedContent(initialTemplates[selectedChannel].content);
  };

  const renderPreview = () => {
    let preview = editedContent;
    currentTemplate.variables.forEach((variable) => {
      const placeholder = `[${variable.toUpperCase()}]`;
      preview = preview.replace(new RegExp(`{{${variable}}}`, 'g'), placeholder);
    });
    return preview;
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
              bgcolor: '#F59E0B15',
              color: '#F59E0B',
            }}
          >
            <EditIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Template Editor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage content templates across 7 channels with variable substitution
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Success Alert */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Template saved successfully!
        </Alert>
      )}

      {/* Channel Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedChannel}
          onChange={handleChannelChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {(Object.keys(channelConfig) as Channel[]).map((channel) => (
            <Tab
              key={channel}
              value={channel}
              label={channelConfig[channel].label}
              sx={{
                color: channelConfig[channel].color,
                '&.Mui-selected': {
                  color: channelConfig[channel].color,
                  fontWeight: 600,
                },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {/* Template Editor */}
        <Grid item xs={12} md={showPreview ? 6 : 8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {currentTemplate.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PreviewIcon />}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={20}
              value={editedContent}
              onChange={handleContentChange}
              placeholder="Enter template content with variables like {{prompt}}, {{brand}}, etc."
              sx={{
                fontFamily: 'monospace',
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button variant="outlined" startIcon={<ResetIcon />} onClick={handleReset}>
                Reset to Default
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                Save Template
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Variables & Preview */}
        <Grid item xs={12} md={showPreview ? 6 : 4}>
          <Grid container spacing={3}>
            {/* Available Variables */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Available Variables
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Click to copy variable syntax
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {currentTemplate.variables.map((variable) => (
                      <Chip
                        key={variable}
                        label={`{{${variable}}}`}
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(`{{${variable}}}`);
                        }}
                        sx={{
                          fontFamily: 'monospace',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: channelConfig[selectedChannel].color + '20',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Variable Guidelines */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Template Guidelines
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Variable Syntax"
                        secondary="Use {{variable_name}} for placeholders"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Naming Convention"
                        secondary="Use lowercase with underscores (snake_case)"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Required Variables"
                        secondary="Always include {{prompt}} in templates"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Best Practice"
                        secondary="Keep variable names descriptive and consistent"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Preview Panel */}
            {showPreview && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Preview
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{
                        bgcolor: '#F9FAFB',
                        p: 2,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        maxHeight: 400,
                        overflow: 'auto',
                      }}
                    >
                      {renderPreview()}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Variables are shown as [UPPERCASE_PLACEHOLDERS] in preview
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
