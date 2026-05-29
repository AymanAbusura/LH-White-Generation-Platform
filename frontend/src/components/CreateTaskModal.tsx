import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { tasksApi, templatesApi } from '../services/api';
import type { CreateTaskPayload } from '../types';

const NICHES = [
  'Restaurant & Food',
  'Fitness & Health',
  'Travel & Tourism',
  'E-commerce & Retail',
  'Finance & Investment',
  'Technology & SaaS',
  'Real Estate',
  'Beauty & Wellness',
  'Education & Courses',
  'Legal Services',
  'Healthcare',
  'Entertainment',
  'Other',
];

interface Props {
  onClose: () => void;
}

export default function CreateTaskModal({ onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateTaskPayload>({
    title: '',
    niche: '',
    description: '',
    templateId: '',
  });

  const { data: templates } = useQuery('templates', templatesApi.getAll);

  const mutation = useMutation(tasksApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries('queueStats');
      toast.success('Task created and added to queue!');
      onClose();
    },
    onError: () => {
      toast.error('Failed to create task. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.niche) {
      toast.error('Title and niche are required');
      return;
    }
    mutation.mutate(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Generate White Page</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Page Title *</label>
            <input
              className="form-input"
              placeholder="e.g. Best Italian Restaurant in NYC"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Niche / Category *</label>
            <select
              className="form-select"
              value={form.niche}
              onChange={(e) => setForm({ ...form, niche: e.target.value })}
            >
              <option value="">Select a niche...</option>
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the page content, target audience, key messages..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {templates && templates.length > 0 && (
            <div className="form-group">
              <label className="form-label">Base Template (optional)</label>
              <select
                className="form-select"
                value={form.templateId}
                onChange={(e) => setForm({ ...form, templateId: e.target.value })}
              >
                <option value="">No template (generate fresh)</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.niche}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={mutation.isLoading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? (
              <>
                <div className="spinner" style={{ width: 14, height: 14 }} />
                Creating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
