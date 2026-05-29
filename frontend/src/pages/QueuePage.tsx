import { useQuery } from 'react-query';
import { queueApi } from '../services/api';
import { Activity, ExternalLink } from 'lucide-react';

export default function QueuePage() {
  const { data: stats, isLoading } = useQuery('queueStats', queueApi.getStats, {
    refetchInterval: 2000,
  });

  const items = stats
    ? [
        { label: 'Waiting', value: stats.waiting, color: 'var(--color-warning)', desc: 'Jobs waiting to be processed' },
        { label: 'Active', value: stats.active, color: 'var(--color-processing)', desc: 'Currently being processed' },
        { label: 'Completed', value: stats.completed, color: 'var(--color-success)', desc: 'Successfully finished' },
        { label: 'Failed', value: stats.failed, color: 'var(--color-error)', desc: 'Encountered errors' },
        { label: 'Delayed', value: stats.delayed, color: 'var(--color-text-muted)', desc: 'Scheduled for later' },
      ]
    : [];

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Queue Monitor</span>
        </div>
        <div className="topbar-right">
          <a
            href="http://localhost:3001/admin/queues"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={13} />
            Bull Board UI
          </a>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="page-header">
          <h1 className="page-title">Queue Status</h1>
          <p className="page-subtitle">Live BullMQ queue metrics — refreshes every 2 seconds</p>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-8)',
              }}
            >
              {items.map((item) => (
                <div key={item.label} className="stat-card">
                  <div className="stat-label">{item.label}</div>
                  <div className="stat-value" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div
                    className="text-sm text-muted"
                    style={{ marginTop: 'var(--space-2)' }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="card card-padding">
              <div
                className="flex items-center gap-3"
                style={{ marginBottom: 'var(--space-5)' }}
              >
                <Activity size={16} style={{ color: 'var(--color-accent)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  Queue: white-gen
                </span>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background:
                      stats && stats.active > 0
                        ? 'var(--color-success)'
                        : 'var(--color-text-muted)',
                    marginLeft: 'auto',
                  }}
                />
                <span className="text-sm text-muted">
                  {stats && stats.active > 0 ? 'Processing' : 'Idle'}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Redis Connection</span>
                  <span style={{ color: 'var(--color-success)' }}>Connected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Worker Concurrency</span>
                  <span>2 jobs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Retry Attempts</span>
                  <span>3 with exponential backoff</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Bull Board Admin</span>
                  <a
                    href="http://localhost:3001/admin/queues"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Open Dashboard ↗
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
