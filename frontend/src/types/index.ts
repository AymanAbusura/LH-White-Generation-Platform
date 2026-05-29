export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Task {
  id: string;
  title: string;
  niche: string;
  description?: string;
  status: TaskStatus;
  job_id?: string;
  result_path?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  niche: string;
  description?: string;
  tags: string;
  created_at: string;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateTaskPayload {
  title: string;
  niche: string;
  description?: string;
  templateId?: string;
}
