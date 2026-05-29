import { useState } from 'react';
import { useQuery } from 'react-query';
import { Plus, Sparkles } from 'lucide-react';
import { tasksApi, queueApi } from '../services/api';
import type { Task } from '../types';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskCard from '../components/TaskCard';
import TaskDetailPanel from '../components/TaskDetailPanel';

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: tasks, isLoading } = useQuery('tasks', tasksApi.getAll, {
    refetchInterval: 3000,
  });

  const { } = useQuery('queueStats', queueApi.getStats, {
    refetchInterval: 5000,
  });

  const counts = {
    total: tasks?.length || 0,
    completed: tasks?.filter((t) => t.status === 'completed').length || 0,
    processing: tasks?.filter((t) => t.status === 'processing' || t.status === 'pending').length || 0,
    failed: tasks?.filter((t) => t.status === 'failed').length || 0,
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Dashboard</span>
        </div>
        <div className="topbar-right">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            New White Page
          </button>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value accent">{counts.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value success">{counts.completed}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In Queue</div>
            <div className="stat-value warning">{counts.processing}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <div className="stat-value error">{counts.failed}</div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: selectedTask ? '1fr 380px' : '1fr',
            gap: 'var(--space-6)',
            alignItems: 'start',
          }}
        >
          <div>
            <div className="page-header">
              <h1 className="page-title">Recent Tasks</h1>
              <p className="page-subtitle">AI-generated white pages from your queue</p>
            </div>

            {isLoading && (
              <div className="empty-state">
                <div className="spinner" />
              </div>
            )}

            {!isLoading && (!tasks || tasks.length === 0) && (
              <div className="empty-state card card-padding">
                <div className="empty-state-icon">
                  <Sparkles size={28} />
                </div>
                <div className="empty-state-title">No tasks yet</div>
                <div className="empty-state-desc">
                  Create your first white page to get started
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <Plus size={14} />
                  Generate First Page
                </button>
              </div>
            )}

            {tasks && tasks.length > 0 && (
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={(t) => setSelectedTask(selectedTask?.id === t.id ? null : t)}
                  />
                ))}
              </div>
            )}
          </div>

          {selectedTask && (
            <div style={{ position: 'sticky', top: 'calc(var(--header-height) + 24px)' }}>
              <TaskDetailPanel
                task={
                  tasks?.find((t) => t.id === selectedTask.id) || selectedTask
                }
                onClose={() => setSelectedTask(null)}
              />
            </div>
          )}
        </div>
      </div>

      {showModal && <CreateTaskModal onClose={() => setShowModal(false)} />}
    </>
  );
}
