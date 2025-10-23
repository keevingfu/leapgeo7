import { api } from './api/client';
import type {
  WorkflowExecution,
  WorkflowStep,
  WorkflowStepNumber,
} from '@/types/workflow.types';

interface TriggerWorkflowRequest {
  month?: string;
  file?: File;
  options?: Record<string, any>;
}

interface TriggerWorkflowResponse {
  executionId: string;
  status: string;
  message: string;
}

export const workflowService = {
  // Get all workflow executions
  getExecutions: async (page = 1, pageSize = 20): Promise<{
    data: WorkflowExecution[];
    total: number;
  }> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    return api.get<{ data: WorkflowExecution[]; total: number }>(`/workflow?${params.toString()}`);
  },

  // Get a single workflow execution by ID
  getExecutionById: async (executionId: string): Promise<WorkflowExecution> => {
    return api.get<WorkflowExecution>(`/workflow/${executionId}`);
  },

  // Get workflow execution status
  getExecutionStatus: async (executionId: string): Promise<{
    status: string;
    currentStep: WorkflowStepNumber | null;
    progress: number;
  }> => {
    return api.get<{
      status: string;
      currentStep: WorkflowStepNumber | null;
      progress: number;
    }>(`/workflow/${executionId}/status`);
  },

  // Get steps for a workflow execution
  getExecutionSteps: async (executionId: string): Promise<WorkflowStep[]> => {
    return api.get<WorkflowStep[]>(`/workflow/${executionId}/steps`);
  },

  // Trigger a new workflow execution
  triggerWorkflow: async (request: TriggerWorkflowRequest): Promise<TriggerWorkflowResponse> => {
    const formData = new FormData();
    if (request.month) formData.append('month', request.month);
    if (request.file) formData.append('file', request.file);
    if (request.options) formData.append('options', JSON.stringify(request.options));

    return api.post<TriggerWorkflowResponse>('/workflow/trigger', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Pause a running workflow
  pauseWorkflow: async (executionId: string): Promise<void> => {
    return api.post<void>(`/workflow/${executionId}/pause`);
  },

  // Resume a paused workflow
  resumeWorkflow: async (executionId: string): Promise<void> => {
    return api.post<void>(`/workflow/${executionId}/resume`);
  },

  // Cancel a running workflow
  cancelWorkflow: async (executionId: string): Promise<void> => {
    return api.post<void>(`/workflow/${executionId}/cancel`);
  },

  // Retry a failed workflow step
  retryStep: async (executionId: string, stepNumber: WorkflowStepNumber): Promise<void> => {
    return api.post<void>(`/workflow/${executionId}/steps/${stepNumber}/retry`);
  },
};
