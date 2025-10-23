import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  WorkflowExecution,
  WorkflowStep,
  WorkflowStepStatus,
} from '@/types/workflow.types';

interface WorkflowState {
  executions: WorkflowExecution[];
  currentExecution: WorkflowExecution | null;
  activeStep: number | null;
  stepHistory: WorkflowStep[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  executions: [],
  currentExecution: null,
  activeStep: null,
  stepHistory: [],
  loading: false,
  error: null,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setExecutions: (state, action: PayloadAction<WorkflowExecution[]>) => {
      state.executions = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentExecution: (state, action: PayloadAction<WorkflowExecution | null>) => {
      state.currentExecution = action.payload;
    },
    setActiveStep: (state, action: PayloadAction<number | null>) => {
      state.activeStep = action.payload;
    },
    addStepToHistory: (state, action: PayloadAction<WorkflowStep>) => {
      state.stepHistory.push(action.payload);
    },
    setStepHistory: (state, action: PayloadAction<WorkflowStep[]>) => {
      state.stepHistory = action.payload;
    },
    updateStepStatus: (
      state,
      action: PayloadAction<{ stepId: string; status: WorkflowStepStatus }>
    ) => {
      const step = state.stepHistory.find((s) => s.id === action.payload.stepId);
      if (step) {
        step.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearWorkflow: (state) => {
      state.currentExecution = null;
      state.activeStep = null;
      state.stepHistory = [];
      state.error = null;
    },
  },
});

export const {
  setExecutions,
  setCurrentExecution,
  setActiveStep,
  addStepToHistory,
  setStepHistory,
  updateStepStatus,
  setLoading,
  setError,
  clearWorkflow,
} = workflowSlice.actions;

export default workflowSlice.reducer;
