// Platform types
export interface PlatformPrompt {
  category: string;
  count: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface PlatformContent {
  type: string;
  count: number;
  word_count: string;
  focus: string;
}

export interface PlatformCitation {
  type: string;
  percentage: number;
  examples: string;
}

export interface PlatformStats {
  visibility_target: string;
  priority_prompts: number;
  content_pieces: number;
  citation_density: string;
}

export interface PlatformData {
  name: string;
  icon: string;
  color: string;
  description: string;
  stats: PlatformStats;
  optimization_focus: string[];
  prompts: PlatformPrompt[];
  content: PlatformContent[];
  citations: PlatformCitation[];
}

export interface ComparisonMetric {
  metric: string;
  chatgpt: number;
  google: number;
  rufus: number;
}

// Filter types
export interface ActiveFilters {
  priority: 'all' | 'High' | 'Medium' | 'Low';
  product: 'all' | 'coolnest' | 'dreamy' | 'island';
  search: string;
}

// Platform keys
export type PlatformKey = 'chatgpt' | 'google' | 'rufus';

// Props types for components
export interface LandingPageProps {
  onPlatformSelect: (platform: PlatformKey) => void;
  onCompareClick: () => void;
}

export interface PlatformDetailProps {
  platform: PlatformKey;
  onBack: () => void;
  onCompareClick: () => void;
}

export interface ComparisonPageProps {
  currentPlatform: PlatformKey | null;
  onBack: () => void;
}

export interface StatCardProps {
  value: string | number;
  label: string;
}

export interface ConnectionProps {
  fromElement: HTMLElement | null;
  toElement: HTMLElement | null;
  isActive?: boolean;
}