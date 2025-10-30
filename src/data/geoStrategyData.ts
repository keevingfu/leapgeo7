// GEO Strategy Platform Data Structure
// Based on reference implementation with English content

export interface OptimizationStrategy {
  focus: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface PromptData {
  id: string;
  text: string;
  category: string;
  searchVolume: number;
  difficulty: number;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  geoScore: number;
}

export interface ContentData {
  id: string;
  title: string;
  type: string;
  url?: string;
  citationStrength: number;
  platforms: string[];
}

export interface CitationData {
  id: string;
  platform: string;
  url: string;
  strength: 'Strong' | 'Medium' | 'Weak';
  date: string;
}

export interface PlatformData {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  citationRate: number;
  strengths: string[];
  optimization: OptimizationStrategy[];
  prompts: PromptData[];
  contents: ContentData[];
  citations: CitationData[];
  metrics: {
    contentQuality: number;
    citationRate: number;
    platformCoverage: number;
    keywordMatch: number;
    userEngagement: number;
    technicalSEO: number;
  };
}

export const platformsData: Record<string, PlatformData> = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI conversational AI with comprehensive knowledge base',
    color: '#4CAF50',
    icon: '🤖',
    citationRate: 45,
    strengths: [
      'In-depth answers',
      'Strong context understanding',
      'Multi-turn conversations',
      'Code generation capability'
    ],
    optimization: [
      {
        focus: 'FAQ Schema Markup',
        priority: 'HIGH',
        description: 'Implement structured FAQ data to improve visibility'
      },
      {
        focus: 'Long-form Content',
        priority: 'HIGH',
        description: 'Create comprehensive guides that ChatGPT prefers to cite'
      },
      {
        focus: 'Technical Documentation',
        priority: 'MEDIUM',
        description: 'Detailed technical specs for product features'
      }
    ],
    prompts: [
      {
        id: 'cgpt-p1',
        text: 'best mattress for back pain relief',
        category: 'Problem Solution',
        searchVolume: 12000,
        difficulty: 85,
        priority: 'P0',
        geoScore: 95.5
      },
      {
        id: 'cgpt-p2',
        text: 'SweetNight CoolNest technology explained',
        category: 'Product Feature',
        searchVolume: 3500,
        difficulty: 45,
        priority: 'P1',
        geoScore: 88.2
      },
      {
        id: 'cgpt-p3',
        text: 'memory foam vs hybrid mattress comparison',
        category: 'Comparison',
        searchVolume: 8900,
        difficulty: 72,
        priority: 'P0',
        geoScore: 91.3
      },
      {
        id: 'cgpt-p4',
        text: 'how to choose mattress firmness level',
        category: 'Tutorial',
        searchVolume: 6700,
        difficulty: 58,
        priority: 'P1',
        geoScore: 82.7
      },
      {
        id: 'cgpt-p5',
        text: 'SweetNight warranty and trial policy',
        category: 'Information',
        searchVolume: 2200,
        difficulty: 25,
        priority: 'P2',
        geoScore: 71.5
      }
    ],
    contents: [
      {
        id: 'cgpt-c1',
        title: 'Ultimate Guide to Back Pain Relief Mattresses',
        type: 'Comprehensive Guide',
        url: 'https://sweetnight.com/guides/back-pain-relief',
        citationStrength: 92,
        platforms: ['chatgpt', 'perplexity']
      },
      {
        id: 'cgpt-c2',
        title: 'CoolNest Technology Deep Dive',
        type: 'Technical Documentation',
        url: 'https://sweetnight.com/technology/coolnest',
        citationStrength: 88,
        platforms: ['chatgpt']
      },
      {
        id: 'cgpt-c3',
        title: 'Mattress Comparison Tool 2025',
        type: 'Interactive Tool',
        url: 'https://sweetnight.com/compare',
        citationStrength: 85,
        platforms: ['chatgpt', 'googleAio']
      }
    ],
    citations: [
      {
        id: 'cgpt-cite1',
        platform: 'ChatGPT',
        url: 'https://chat.openai.com/share/example1',
        strength: 'Strong',
        date: '2025-10-28'
      },
      {
        id: 'cgpt-cite2',
        platform: 'ChatGPT',
        url: 'https://chat.openai.com/share/example2',
        strength: 'Medium',
        date: '2025-10-27'
      }
    ],
    metrics: {
      contentQuality: 85,
      citationRate: 78,
      platformCoverage: 90,
      keywordMatch: 82,
      userEngagement: 75,
      technicalSEO: 88
    }
  },
  googleAio: {
    id: 'googleAio',
    name: 'Google AI Overview',
    description: 'Google\'s AI-powered search summaries at the top of search results',
    color: '#2196F3',
    icon: '🔍',
    citationRate: 38,
    strengths: [
      'Featured snippets',
      'Direct answer boxes',
      'Knowledge panels',
      'Rich results'
    ],
    optimization: [
      {
        focus: 'Structured Data Markup',
        priority: 'HIGH',
        description: 'Implement Product, Review, FAQ schema for rich results'
      },
      {
        focus: 'Featured Snippet Optimization',
        priority: 'HIGH',
        description: 'Format content with clear headers and lists for snippet selection'
      },
      {
        focus: 'E-E-A-T Signals',
        priority: 'MEDIUM',
        description: 'Build expertise, experience, authority, and trust signals'
      }
    ],
    prompts: [
      {
        id: 'gaio-p1',
        text: 'SweetNight vs Casper mattress',
        category: 'Comparison',
        searchVolume: 9800,
        difficulty: 78,
        priority: 'P0',
        geoScore: 93.2
      },
      {
        id: 'gaio-p2',
        text: 'cooling mattress technology 2025',
        category: 'Technology',
        searchVolume: 5600,
        difficulty: 65,
        priority: 'P1',
        geoScore: 86.4
      },
      {
        id: 'gaio-p3',
        text: 'mattress buying guide',
        category: 'Tutorial',
        searchVolume: 11200,
        difficulty: 70,
        priority: 'P0',
        geoScore: 90.8
      },
      {
        id: 'gaio-p4',
        text: 'SweetNight customer reviews',
        category: 'Reviews',
        searchVolume: 4300,
        difficulty: 42,
        priority: 'P1',
        geoScore: 79.5
      },
      {
        id: 'gaio-p5',
        text: 'best mattress deals 2025',
        category: 'Commercial',
        searchVolume: 15600,
        difficulty: 88,
        priority: 'P0',
        geoScore: 94.7
      }
    ],
    contents: [
      {
        id: 'gaio-c1',
        title: 'SweetNight vs Competitors: Complete Comparison',
        type: 'Comparison Article',
        url: 'https://sweetnight.com/compare/vs-competitors',
        citationStrength: 90,
        platforms: ['googleAio', 'bingChat']
      },
      {
        id: 'gaio-c2',
        title: 'Cooling Technology Explained',
        type: 'Educational Content',
        url: 'https://sweetnight.com/education/cooling',
        citationStrength: 86,
        platforms: ['googleAio']
      },
      {
        id: 'gaio-c3',
        title: 'Customer Success Stories',
        type: 'Testimonials',
        url: 'https://sweetnight.com/reviews',
        citationStrength: 82,
        platforms: ['googleAio', 'amazonRufus']
      }
    ],
    citations: [
      {
        id: 'gaio-cite1',
        platform: 'Google AIO',
        url: 'https://google.com/search?q=example',
        strength: 'Strong',
        date: '2025-10-29'
      },
      {
        id: 'gaio-cite2',
        platform: 'Google AIO',
        url: 'https://google.com/search?q=example2',
        strength: 'Medium',
        date: '2025-10-28'
      }
    ],
    metrics: {
      contentQuality: 80,
      citationRate: 85,
      platformCoverage: 75,
      keywordMatch: 88,
      userEngagement: 82,
      technicalSEO: 85
    }
  },
  amazonRufus: {
    id: 'amazonRufus',
    name: 'Amazon Rufus',
    description: 'Amazon\'s AI shopping assistant for product recommendations',
    color: '#FF9800',
    icon: '🛒',
    citationRate: 28,
    strengths: [
      'Product comparisons',
      'Shopping recommendations',
      'Price tracking',
      'Customer review analysis'
    ],
    optimization: [
      {
        focus: 'Amazon A+ Content',
        priority: 'HIGH',
        description: 'Enhanced brand content with rich media and comparison charts'
      },
      {
        focus: 'Product Q&A Section',
        priority: 'HIGH',
        description: 'Comprehensive answers to common customer questions'
      },
      {
        focus: 'Review Management',
        priority: 'MEDIUM',
        description: 'Active response to reviews and high rating maintenance'
      }
    ],
    prompts: [
      {
        id: 'ar-p1',
        text: 'best selling mattress on Amazon',
        category: 'Commercial',
        searchVolume: 18900,
        difficulty: 92,
        priority: 'P0',
        geoScore: 96.3
      },
      {
        id: 'ar-p2',
        text: 'SweetNight mattress Amazon reviews',
        category: 'Reviews',
        searchVolume: 6700,
        difficulty: 48,
        priority: 'P1',
        geoScore: 83.7
      },
      {
        id: 'ar-p3',
        text: 'mattress deals Prime Day',
        category: 'Promotional',
        searchVolume: 22300,
        difficulty: 95,
        priority: 'P0',
        geoScore: 97.8
      },
      {
        id: 'ar-p4',
        text: 'queen size memory foam mattress',
        category: 'Product Specific',
        searchVolume: 14200,
        difficulty: 76,
        priority: 'P0',
        geoScore: 89.5
      },
      {
        id: 'ar-p5',
        text: 'mattress return policy Amazon',
        category: 'Information',
        searchVolume: 3400,
        difficulty: 35,
        priority: 'P2',
        geoScore: 68.2
      }
    ],
    contents: [
      {
        id: 'ar-c1',
        title: 'Amazon A+ Brand Story',
        type: 'Enhanced Content',
        url: 'https://amazon.com/sweetnight',
        citationStrength: 95,
        platforms: ['amazonRufus']
      },
      {
        id: 'ar-c2',
        title: 'Product Comparison Chart',
        type: 'A+ Content Module',
        url: 'https://amazon.com/sweetnight/compare',
        citationStrength: 89,
        platforms: ['amazonRufus']
      },
      {
        id: 'ar-c3',
        title: 'Video Product Demo',
        type: 'Rich Media',
        url: 'https://amazon.com/sweetnight/video',
        citationStrength: 84,
        platforms: ['amazonRufus']
      }
    ],
    citations: [
      {
        id: 'ar-cite1',
        platform: 'Amazon Rufus',
        url: 'https://amazon.com/rufus/example',
        strength: 'Strong',
        date: '2025-10-29'
      },
      {
        id: 'ar-cite2',
        platform: 'Amazon Rufus',
        url: 'https://amazon.com/rufus/example2',
        strength: 'Weak',
        date: '2025-10-27'
      }
    ],
    metrics: {
      contentQuality: 75,
      citationRate: 70,
      platformCoverage: 82,
      keywordMatch: 78,
      userEngagement: 85,
      technicalSEO: 72
    }
  }
};

// Helper functions for data processing
export const getAllPrompts = (): PromptData[] => {
  return Object.values(platformsData).flatMap(platform => platform.prompts);
};

export const getAllContents = (): ContentData[] => {
  return Object.values(platformsData).flatMap(platform => platform.contents);
};

export const getAllCitations = (): CitationData[] => {
  return Object.values(platformsData).flatMap(platform => platform.citations);
};

export const getPromptsByPriority = (priority: string): PromptData[] => {
  return getAllPrompts().filter(prompt => prompt.priority === priority);
};

export const getContentsByPlatform = (platformId: string): ContentData[] => {
  return platformsData[platformId]?.contents || [];
};

export const getCitationsByStrength = (strength: string): CitationData[] => {
  return getAllCitations().filter(citation => citation.strength === strength);
};

// Calculate overall metrics
export const calculateOverallMetrics = () => {
  const platforms = Object.values(platformsData);
  const totalPrompts = getAllPrompts().length;
  const totalContents = getAllContents().length;
  const totalCitations = getAllCitations().length;

  const avgCitationRate = platforms.reduce((acc, p) => acc + p.citationRate, 0) / platforms.length;

  const p0Prompts = getPromptsByPriority('P0').length;
  const p1Prompts = getPromptsByPriority('P1').length;

  const coverageRate = (totalContents / totalPrompts) * 100;

  return {
    totalPrompts,
    totalContents,
    totalCitations,
    avgCitationRate,
    p0Prompts,
    p1Prompts,
    coverageRate,
    platforms: platforms.length
  };
};