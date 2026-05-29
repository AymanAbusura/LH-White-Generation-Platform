import { formatDistanceToNow } from 'date-fns';
import { Download, Trash2, Eye } from 'lucide-react';
import { useMutation, useQueryClient, MutationFunction } from 'react-query';
import toast from 'react-hot-toast';
import { tasksApi } from '../services/api';
import type { Task } from '../types';

interface Props {
  task: Task;
  onSelect: (task: Task) => void;
}

export default function TaskCard({ task, onSelect }: Props) {
  const queryClient = useQueryClient();

  const mutFn: MutationFunction<void, void> = () => tasksApi.delete(task.id);
  const deleteMutation = useMutation<void, unknown, void>(mutFn, {
    onSuccess: () => { toast.success('Task deleted'); },
    onError: () => { toast.error('Failed to delete task'); },
    onSettled: () => {
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries('queueStats');
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this task?')) deleteMutation.mutate();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(tasksApi.getDownloadUrl(task.id), '_blank');
  };

  const getProgress = () => {
    switch (task.status) {
      case 'pending': return 0;
      case 'processing': return 65;
      case 'completed': return 100;
      default: return 100;
    }
  };

  return (
    <div className="task-card" onClick={() => onSelect(task)}>
      <div className="task-card-header">
        <div>
          <div className="task-card-title">{task.title}</div>
          <div className="task-card-niche">
            <span className="niche-tag">{task.niche}</span>
          </div>
        </div>
        <span className={`status-badge status-${task.status}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-muted" style={{ marginTop: 'var(--space-2)' }}>
          {task.description.length > 80 ? task.description.slice(0, 80) + '...' : task.description}
        </p>
      )}

      {(task.status === 'processing' || task.status === 'completed') && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }} />
        </div>
      )}

      <div className="task-card-meta">
        <span className="task-card-time">
          {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
        </span>
        <div className="task-card-actions">
          {task.status === 'completed' && (
            <>
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={(e) => { e.stopPropagation(); onSelect(task); }}
                title="Preview"
              >
                <Eye size={14} />
              </button>
              <button
                className="btn btn-secondary btn-icon btn-sm"
                onClick={handleDownload}
                title="Download ZIP"
              >
                <Download size={14} />
              </button>
            </>
          )}
          <button
            className="btn btn-danger btn-icon btn-sm"
            onClick={handleDelete}
            title="Delete"
            disabled={deleteMutation.isLoading}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
