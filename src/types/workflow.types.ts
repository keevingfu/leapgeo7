// Workflow engine data models

export type WorkflowStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type WorkflowStepStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';

export type WorkflowExecutionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused';

export interface WorkflowStep {
  id: string;
  stepNumber: WorkflowStepNumber;
  stepName: string;
  status: WorkflowStepStatus;
  startedAt: Date | null;
  completedAt: Date | null;
  duration: number | null; // in seconds
  error: string | null;
  metadata: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  executionId: string;
  status: WorkflowExecutionStatus;
  currentStep: WorkflowStepNumber | null;
  steps: WorkflowStep[];
  startedAt: Date;
  completedAt: Date | null;
  totalDuration: number | null; // in seconds
  triggeredBy: string;
  metadata: Record<string, any>;
}

export interface WorkflowStepConfig {
  stepNumber: WorkflowStepNumber;
  stepName: string;
  description: string;
  estimatedDuration: number; // in seconds
  dependencies: WorkflowStepNumber[];
  color: string;
  icon: string;
}

export const WORKFLOW_STEPS: WorkflowStepConfig[] = [
  {
    stepNumber: 1,
    stepName: 'Roadmap Ingestor',
    description: 'Monthly GEO roadmap intake',
    estimatedDuration: 300,
    dependencies: [],
    color: '#8B5CF6',
    icon: '📥',
  },
  {
    stepNumber: 2,
    stepName: 'Content Registry',
    description: 'Content inventory management',
    estimatedDuration: 180,
    dependencies: [1],
    color: '#06B6D4',
    icon: '📋',
  },
  {
    stepNumber: 3,
    stepName: 'Prompt Landscape Builder',
    description: 'P0-P3 priority hierarchy',
    estimatedDuration: 240,
    dependencies: [1, 2],
    color: '#F59E0B',
    icon: '🗺️',
  },
  {
    stepNumber: 4,
    stepName: 'Content Ingestor',
    description: 'Multi-format content processing',
    estimatedDuration: 360,
    dependencies: [2],
    color: '#3B82F6',
    icon: '📝',
  },
  {
    stepNumber: 5,
    stepName: 'Content Generator',
    description: 'Multi-channel content distribution',
    estimatedDuration: 600,
    dependencies: [3, 4],
    color: '#10B981',
    icon: '⚡',
  },
  {
    stepNumber: 6,
    stepName: 'Citation Tracker',
    description: '7-platform monitoring',
    estimatedDuration: 900,
    dependencies: [5],
    color: '#EC4899',
    icon: '🔍',
  },
  {
    stepNumber: 7,
    stepName: 'Feedback Analyzer',
    description: 'KPI analysis and optimization',
    estimatedDuration: 420,
    dependencies: [6],
    color: '#6366F1',
    icon: '📊',
  },
];
