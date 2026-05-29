import { X, Download, FileCode, Save } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { tasksApi, templatesApi } from '../services/api';
import type { Task } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  task: Task;
  onClose: () => void;
}

const FILES = [
  { label: 'Main Page', file: 'index.html' as const },
  { label: 'Privacy Policy', file: 'privacy.html' as const },
  { label: 'Terms & Conditions', file: 'terms.html' as const },
];

export default function TaskDetailPanel({ task, onClose }: Props) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [templateName, setTemplateName] = useState(task.title);

  const saveTemplate = async () => {
    if (!templateName.trim()) return;
    setSaving(true);
    try {
      await templatesApi.saveFromTask(task.id, templateName);
      queryClient.invalidateQueries('templates');
      toast.success('Saved as template!');
    } catch {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div>
          <h3 className="modal-title">{task.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="niche-tag">{task.niche}</span>
            <span className={`status-badge status-${task.status}`}>{task.status}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="detail-body">
        {task.description && (
          <div className="detail-section">
            <div className="detail-section-title">Description</div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {task.description}
            </p>
          </div>
        )}

        <div className="detail-section">
          <div className="detail-section-title">Info</div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Created</span>
              <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Updated</span>
              <span>{formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}</span>
            </div>
            {task.job_id && (
              <div className="flex justify-between text-sm">
                <span className="text-muted">Job ID</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11 }}>
                  {task.job_id.slice(0, 16)}...
                </span>
              </div>
            )}
          </div>
        </div>

        {task.status === 'failed' && task.error && (
          <div className="detail-section">
            <div className="detail-section-title">Error</div>
            <div style={{
              background: 'var(--status-failed-bg)',
              color: 'var(--status-failed-text)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              fontFamily: 'monospace',
            }}>
              {task.error}
            </div>
          </div>
        )}

        {task.status === 'completed' && (
          <>
            <div className="detail-section">
              <div className="detail-section-title">Generated Files</div>
              <div className="file-list">
                {FILES.map(({ label, file }) => (
                  <div key={file} className="file-item">
                    <div className="file-item-name">
                      <FileCode size={14} />
                      {label}
                    </div>
                    <a
                      href={tasksApi.getPreviewUrl(task.id, file)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-sm"
                    >
                      Preview
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-section-title">Save as Template</div>
              <div className="flex gap-2">
                <input
                  className="form-input"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name..."
                />
                <button
                  className="btn btn-secondary"
                  onClick={saveTemplate}
                  disabled={saving}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Save size={14} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => window.open(tasksApi.getDownloadUrl(task.id), '_blank')}
            >
              <Download size={14} />
              Download ZIP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
