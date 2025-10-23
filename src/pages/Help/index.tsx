import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const TOC_WIDTH = 300;

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export default function Help() {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [tocOpen, setTocOpen] = useState(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load markdown content
    fetch('/LEAPGEO7-USER-GUIDE.md')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load user guide');
        }
        return response.text();
      })
      .then((content) => {
        setMarkdownContent(content);
        extractTableOfContents(content);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const extractTableOfContents = (content: string) => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      items.push({ id, title, level });
    }

    setToc(items);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Loading user guide...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Failed to Load Documentation
          </Typography>
          <Typography variant="body2">{error}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please ensure LEAPGEO7-USER-GUIDE.md is accessible in the public folder.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Toggle TOC Button */}
      <IconButton
        onClick={() => setTocOpen(!tocOpen)}
        sx={{
          position: 'fixed',
          top: 80,
          left: tocOpen ? TOC_WIDTH + 10 : 10,
          zIndex: 1200,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': { bgcolor: 'action.hover' },
          transition: 'left 0.3s ease',
        }}
      >
        {tocOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Table of Contents Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={tocOpen}
        sx={{
          width: TOC_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: TOC_WIDTH,
            boxSizing: 'border-box',
            position: 'relative',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <HelpIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              User Guide
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            System Documentation
          </Typography>
        </Box>

        <List sx={{ py: 1, overflow: 'auto' }}>
          {toc.map((item, index) => (
            <ListItem
              key={`${item.id}-${index}`}
              disablePadding
              sx={{ pl: (item.level - 1) * 2 }}
            >
              <ListItemButton
                onClick={() => scrollToSection(item.id)}
                sx={{
                  py: 0.5,
                  px: 2,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: item.level === 1 ? '0.9rem' : '0.85rem',
                    fontWeight: item.level === 1 ? 600 : 400,
                    color: item.level === 1 ? 'text.primary' : 'text.secondary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          maxWidth: '100%',
          ml: tocOpen ? 0 : `-${TOC_WIDTH}px`,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              className="markdown-content"
              sx={{
                '& h1': {
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  mb: 3,
                  mt: 4,
                  pb: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:first-of-type': { mt: 0 },
                },
                '& h2': {
                  fontSize: '2rem',
                  fontWeight: 600,
                  mt: 4,
                  mb: 2,
                  pb: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  color: 'text.primary',
                },
                '& h3': {
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  mt: 3,
                  mb: 2,
                  color: 'text.primary',
                },
                '& h4': {
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  mt: 2.5,
                  mb: 1.5,
                  color: 'text.primary',
                },
                '& p': {
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  mb: 2,
                  color: 'text.secondary',
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2,
                  '& li': {
                    mb: 1,
                    color: 'text.secondary',
                  },
                },
                '& code': {
                  bgcolor: 'grey.100',
                  color: 'error.main',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.9em',
                  fontFamily: 'Consolas, Monaco, monospace',
                },
                '& pre': {
                  bgcolor: 'grey.900',
                  color: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  mb: 2,
                  '& code': {
                    bgcolor: 'transparent',
                    color: 'inherit',
                    p: 0,
                  },
                },
                '& table': {
                  width: '100%',
                  borderCollapse: 'collapse',
                  mb: 3,
                  '& th': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    p: 1.5,
                    textAlign: 'left',
                    fontWeight: 600,
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                  },
                  '& td': {
                    p: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    color: 'text.secondary',
                  },
                  '& tr:hover': {
                    bgcolor: 'action.hover',
                  },
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  my: 2,
                  display: 'block',
                },
                '& blockquote': {
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  ml: 0,
                  py: 1,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  '& p': {
                    mb: 0,
                  },
                },
                '& a': {
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  h1: ({ children }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return <h1 id={id}>{children}</h1>;
                  },
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return <h2 id={id}>{children}</h2>;
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return <h3 id={id}>{children}</h3>;
                  },
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
