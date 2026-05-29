import { useState } from 'react';
import { useQuery } from 'react-query';
import { Plus, Search } from 'lucide-react';
import { tasksApi } from '../services/api';
import type { Task } from '../types';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskCard from '../components/TaskCard';
import TaskDetailPanel from '../components/TaskDetailPanel';

type FilterStatus = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

export default function TasksPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  const { data: tasks, isLoading } = useQuery('tasks', tasksApi.getAll, {
    refetchInterval: 3000,
  });

  const filtered = tasks?.filter((t) => {
    const matchesStatus = filter === 'all' || t.status === filter;
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.niche.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const FILTERS: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
  ];

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Tasks</span>
        </div>
        <div className="topbar-right">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            New Task
          </button>
        </div>
      </div>

      <div className="page-wrapper">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`btn btn-sm ${filter === f.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
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
            {isLoading && (
              <div className="empty-state">
                <div className="spinner" />
              </div>
            )}

            {!isLoading && filtered?.length === 0 && (
              <div className="empty-state card card-padding">
                <div className="empty-state-title">No tasks found</div>
                <div className="empty-state-desc">Try adjusting your filters</div>
              </div>
            )}

            {filtered && filtered.length > 0 && (
              <div className="tasks-grid">
                {filtered.map((task) => (
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
                task={tasks?.find((t) => t.id === selectedTask.id) || selectedTask}
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
