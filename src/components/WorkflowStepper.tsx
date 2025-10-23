import { Box, Step, StepLabel, Stepper, Typography, Chip } from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as ErrorIcon,
  PlayCircle as RunningIcon,
} from '@mui/icons-material';
import { WORKFLOW_STEPS, WorkflowStepNumber } from '@/types/workflow.types';

interface WorkflowStepperProps {
  currentStep: WorkflowStepNumber | null;
  completedSteps: WorkflowStepNumber[];
  errorSteps: WorkflowStepNumber[];
  onStepClick?: (step: WorkflowStepNumber) => void;
  orientation?: 'horizontal' | 'vertical';
}

export default function WorkflowStepper({
  currentStep,
  completedSteps,
  errorSteps,
  onStepClick,
  orientation = 'horizontal',
}: WorkflowStepperProps) {
  const getStepIcon = (stepNumber: WorkflowStepNumber) => {
    if (errorSteps.includes(stepNumber)) {
      return <ErrorIcon sx={{ color: '#EF4444' }} />;
    }
    if (completedSteps.includes(stepNumber)) {
      return <CompletedIcon sx={{ color: '#10B981' }} />;
    }
    if (currentStep === stepNumber) {
      return <RunningIcon sx={{ color: '#3B82F6' }} />;
    }
    return <PendingIcon sx={{ color: '#9CA3AF' }} />;
  };

  const getStepStatus = (stepNumber: WorkflowStepNumber): 'error' | 'completed' | 'running' | 'pending' => {
    if (errorSteps.includes(stepNumber)) return 'error';
    if (completedSteps.includes(stepNumber)) return 'completed';
    if (currentStep === stepNumber) return 'running';
    return 'pending';
  };

  return (
    <Stepper
      activeStep={currentStep ? currentStep - 1 : -1}
      orientation={orientation}
      sx={{
        ...(orientation === 'horizontal' && {
          overflowX: 'auto',
          pb: 2,
        }),
      }}
    >
      {WORKFLOW_STEPS.map((step) => {
        const status = getStepStatus(step.stepNumber);
        const config = WORKFLOW_STEPS[step.stepNumber - 1];

        return (
          <Step
            key={step.stepNumber}
            completed={completedSteps.includes(step.stepNumber)}
            onClick={() => onStepClick?.(step.stepNumber)}
            sx={{
              cursor: onStepClick ? 'pointer' : 'default',
              '&:hover': onStepClick
                ? {
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                  }
                : {},
            }}
          >
            <StepLabel
              StepIconComponent={() => getStepIcon(step.stepNumber)}
              error={errorSteps.includes(step.stepNumber)}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight={currentStep === step.stepNumber ? 600 : 400}
                    sx={{
                      color:
                        status === 'error'
                          ? 'error.main'
                          : status === 'completed'
                          ? 'success.main'
                          : status === 'running'
                          ? 'primary.main'
                          : 'text.secondary',
                    }}
                  >
                    {config.icon} {config.stepName}
                  </Typography>
                  {status === 'running' && (
                    <Chip
                      label="Running"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: '#3B82F615',
                        color: '#3B82F6',
                      }}
                    />
                  )}
                </Box>
                {orientation === 'vertical' && (
                  <Typography variant="caption" color="text.secondary">
                    {config.description}
                  </Typography>
                )}
              </Box>
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}
