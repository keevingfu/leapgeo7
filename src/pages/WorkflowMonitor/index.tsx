import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  AccountTree as WorkflowIcon,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
  Schedule,
  ExpandMore,
} from '@mui/icons-material';
import DataTable, { type DataTableColumn } from '@/components/DataTable';
import type {
  WorkflowExecution,
  WorkflowStepStatus,
  WorkflowExecutionStatus,
} from '@/types/workflow.types';
import { WORKFLOW_STEPS as stepConfigs } from '@/types/workflow.types';

// Mock workflow executions
const mockExecutions: WorkflowExecution[] = [
  {
    id: '1',
    executionId: 'EXEC-2025-001',
    status: 'running',
    currentStep: 3,
    steps: [
      {
        id: 's1',
        stepNumber: 1,
        stepName: 'Roadmap Ingestor',
        status: 'completed',
        startedAt: new Date('2025-09-07T10:00:00'),
        completedAt: new Date('2025-09-07T10:05:00'),
        duration: 300,
        error: null,
        metadata: { rowsProcessed: 38 },
      },
      {
        id: 's2',
        stepNumber: 2,
        stepName: 'Content Registry',
        status: 'completed',
        startedAt: new Date('2025-09-07T10:05:00'),
        completedAt: new Date('2025-09-07T10:08:00'),
        duration: 180,
        error: null,
        metadata: { contentItemsIndexed: 127 },
      },
      {
        id: 's3',
        stepNumber: 3,
        stepName: 'Prompt Landscape Builder',
        status: 'running',
        startedAt: new Date('2025-09-07T10:08:00'),
        completedAt: null,
        duration: null,
        error: null,
        metadata: { promptsAnalyzed: 245 },
      },
      {
        id: 's4',
        stepNumber: 4,
        stepName: 'Content Ingestor',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        duration: null,
        error: null,
        metadata: {},
      },
      {
        id: 's5',
        stepNumber: 5,
        stepName: 'Content Generator',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        duration: null,
        error: null,
        metadata: {},
      },
      {
        id: 's6',
        stepNumber: 6,
        stepName: 'Citation Tracker',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        duration: null,
        error: null,
        metadata: {},
      },
      {
        id: 's7',
        stepNumber: 7,
        stepName: 'Feedback Analyzer',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        duration: null,
        error: null,
        metadata: {},
      },
    ],
    startedAt: new Date('2025-09-07T10:00:00'),
    completedAt: null,
    totalDuration: null,
    triggeredBy: 'admin@sweetnight.com',
    metadata: { month: '2025-09' },
  },
  {
    id: '2',
    executionId: 'EXEC-2025-002',
    status: 'completed',
    currentStep: null,
    steps: stepConfigs.map((config, index) => ({
      id: `s${index + 1}`,
      stepNumber: config.stepNumber,
      stepName: config.stepName,
      status: 'completed' as WorkflowStepStatus,
      startedAt: new Date(`2025-09-06T09:${String(index * 10).padStart(2, '0')}:00`),
      completedAt: new Date(`2025-09-06T09:${String((index + 1) * 10).padStart(2, '0')}:00`),
      duration: config.estimatedDuration,
      error: null,
      metadata: {},
    })),
    startedAt: new Date('2025-09-06T09:00:00'),
    completedAt: new Date('2025-09-06T10:10:00'),
    totalDuration: 4200,
    triggeredBy: 'admin@sweetnight.com',
    metadata: { month: '2024-12' },
  },
  {
    id: '3',
    executionId: 'EXEC-2024-003',
    status: 'failed',
    currentStep: 5,
    steps: stepConfigs.map((config, index) => ({
      id: `s${index + 1}`,
      stepNumber: config.stepNumber,
      stepName: config.stepName,
      status: index < 4 ? 'completed' : index === 4 ? 'failed' : ('skipped' as WorkflowStepStatus),
      startedAt: index <= 4 ? new Date(`2025-09-05T08:${String(index * 10).padStart(2, '0')}:00`) : null,
      completedAt: index < 4 ? new Date(`2025-09-05T08:${String((index + 1) * 10).padStart(2, '0')}:00`) : null,
      duration: index < 4 ? config.estimatedDuration : null,
      error: index === 4 ? 'Template rendering error: Missing variable productName' : null,
      metadata: {},
    })),
    startedAt: new Date('2025-09-05T08:00:00'),
    completedAt: new Date('2025-09-05T08:50:00'),
    totalDuration: 3000,
    triggeredBy: 'system@sweetnight.com',
    metadata: { month: '2024-11' },
  },
];

const statusColors: Record<WorkflowStepStatus, string> = {
  pending: '#94A3B8',
  running: '#3B82F6',
  completed: '#10B981',
  failed: '#EF4444',
  skipped: '#F59E0B',
};

const executionStatusColors: Record<WorkflowExecutionStatus, string> = {
  pending: '#94A3B8',
  running: '#3B82F6',
  completed: '#10B981',
  failed: '#EF4444',
  paused: '#F59E0B',
};

export default function WorkflowMonitor() {
  const currentExecution = mockExecutions.find((e) => e.status === 'running') || mockExecutions[0];
  const completedSteps = currentExecution.steps.filter((s) => s.status === 'completed').length;
  const progressPercentage = (completedSteps / 7) * 100;

  // Calculate stats
  const stats = {
    totalExecutions: mockExecutions.length,
    running: mockExecutions.filter((e) => e.status === 'running').length,
    completed: mockExecutions.filter((e) => e.status === 'completed').length,
    failed: mockExecutions.filter((e) => e.status === 'failed').length,
    avgDuration: mockExecutions
      .filter((e) => e.totalDuration)
      .reduce((sum, e) => sum + (e.totalDuration || 0), 0) / mockExecutions.filter((e) => e.totalDuration).length / 60,
  };

  // DataTable columns for execution history
  const columns: DataTableColumn<WorkflowExecution>[] = [
    {
      id: 'executionId',
      label: 'Execution ID',
      sortable: true,
      width: 140,
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      width: 120,
      render: (row) => (
        <Chip
          label={row.status.toUpperCase()}
          size="small"
          sx={{
            bgcolor: executionStatusColors[row.status],
            color: 'white',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: 'currentStep',
      label: 'Progress',
      sortable: false,
      width: 150,
      render: (row) => {
        const completed = row.steps.filter((s) => s.status === 'completed').length;
        const progress = (completed / 7) * 100;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
            <Typography variant="caption" fontWeight={600}>
              {completed}/7
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'startedAt',
      label: 'Started',
      sortable: true,
      width: 150,
      format: (value) => new Date(value).toLocaleString(),
    },
    {
      id: 'totalDuration',
      label: 'Duration',
      sortable: true,
      width: 100,
      format: (value) => (value ? `${Math.floor(value / 60)}m ${value % 60}s` : '-'),
    },
    {
      id: 'triggeredBy',
      label: 'Triggered By',
      sortable: true,
    },
  ];

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
              bgcolor: '#3B82F615',
              color: '#3B82F6',
            }}
          >
            <WorkflowIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Workflow Monitor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time 7-Step GEO Pipeline Execution Tracking
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" startIcon={<PlayArrow />} color="success">
              Start New
            </Button>
            <Button variant="outlined" startIcon={<Pause />} disabled={currentExecution.status !== 'running'}>
              Pause
            </Button>
            <Button variant="outlined" startIcon={<Stop />} color="error" disabled={currentExecution.status !== 'running'}>
              Stop
            </Button>
            <Button variant="outlined" startIcon={<Refresh />}>
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Executions
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700}>
                {stats.totalExecutions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Running
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ color: executionStatusColors.running }}>
                {stats.running}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ color: executionStatusColors.completed }}>
                {((stats.completed / stats.totalExecutions) * 100).toFixed(0)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Avg Duration
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700}>
                {stats.avgDuration.toFixed(0)}m
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Current Execution */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Current Execution: {currentExecution.executionId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Started {currentExecution.startedAt.toLocaleString()}
            </Typography>
          </Box>
          <Chip
            label={currentExecution.status.toUpperCase()}
            sx={{
              bgcolor: executionStatusColors[currentExecution.status],
              color: 'white',
              fontWeight: 600,
              px: 2,
            }}
          />
        </Box>

        {/* Overall Progress */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Overall Progress
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {completedSteps}/7 Steps Complete ({progressPercentage.toFixed(0)}%)
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 12, borderRadius: 6 }} />
        </Box>

        {/* Step Details Stepper */}
        <Stepper activeStep={currentExecution.currentStep ? currentExecution.currentStep - 1 : 0} orientation="vertical">
          {currentExecution.steps.map((step) => {
            const config = stepConfigs.find((c) => c.stepNumber === step.stepNumber);
            const isActive = currentExecution.currentStep === step.stepNumber;

            return (
              <Step key={step.id} expanded={isActive}>
                <StepLabel
                  error={step.status === 'failed'}
                  icon={
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: statusColors[step.status],
                        color: 'white',
                        fontSize: '1.2rem',
                      }}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle sx={{ fontSize: 24 }} />
                      ) : step.status === 'failed' ? (
                        <ErrorIcon sx={{ fontSize: 24 }} />
                      ) : step.status === 'running' ? (
                        <Schedule sx={{ fontSize: 24 }} />
                      ) : (
                        config?.icon
                      )}
                    </Box>
                  }
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1" fontWeight={600}>
                      Step {step.stepNumber}: {step.stepName}
                    </Typography>
                    <Chip
                      label={step.status}
                      size="small"
                      sx={{
                        bgcolor: statusColors[step.status],
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {config?.description}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {step.error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {step.error}
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Started
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {step.startedAt ? step.startedAt.toLocaleTimeString() : '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {step.completedAt ? step.completedAt.toLocaleTimeString() : '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {step.duration ? `${step.duration}s` : '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Estimated
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {config?.estimatedDuration}s
                        </Typography>
                      </Grid>
                    </Grid>

                    {Object.keys(step.metadata).length > 0 && (
                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="body2" fontWeight={600}>
                            Metadata
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box component="pre" sx={{ fontSize: '0.75rem', overflow: 'auto' }}>
                            {JSON.stringify(step.metadata, null, 2)}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </Paper>

      {/* Execution History */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Execution History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Past workflow executions and their results
        </Typography>
      </Box>
      <DataTable columns={columns} data={mockExecutions} defaultPageSize={10} emptyMessage="No workflow executions found" />
    </Box>
  );
}
