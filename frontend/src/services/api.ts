import axios from 'axios';
import type { Task, Template, QueueStats, CreateTaskPayload, ApiResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Tasks
export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const res = await api.get<ApiResponse<Task[]>>('/tasks');
    return res.data.data;
  },

  getById: async (id: string): Promise<Task> => {
    const res = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const res = await api.post<ApiResponse<Task>>('/tasks', payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  getDownloadUrl: (id: string) => `/api/tasks/${id}/download`,

  getPreviewUrl: (id: string, file: 'index.html' | 'privacy.html' | 'terms.html') =>
    `/api/tasks/${id}/preview/${file}`,
};

// Templates
export const templatesApi = {
  getAll: async (): Promise<Template[]> => {
    const res = await api.get<ApiResponse<Template[]>>('/templates');
    return res.data.data;
  },

  saveFromTask: async (taskId: string, name: string, tags?: string[]): Promise<Template> => {
    const res = await api.post<ApiResponse<Template>>(`/templates/from-task/${taskId}`, {
      name,
      tags,
    });
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/templates/${id}`);
  },
};

// Queue
export const queueApi = {
  getStats: async (): Promise<QueueStats> => {
    const res = await api.get<ApiResponse<QueueStats>>('/queue/stats');
    return res.data.data;
  },
};

export default api;
