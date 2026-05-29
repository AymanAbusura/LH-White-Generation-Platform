import { NavLink } from 'react-router-dom';
import { LayoutGrid, FileText, BookTemplate, Activity, Zap, LogOut } from 'lucide-react';
import { useQuery } from 'react-query';
import { queueApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const { data: stats } = useQuery('queueStats', queueApi.getStats, {
    refetchInterval: 5000,
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div className="logo-icon">
            <Zap size={18} color="white" />
          </div>
          <span className="logo-text">
            White<span>Gen</span>
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Workspace</span>

        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutGrid size={16} />
          Dashboard
        </NavLink>

        <NavLink to="/tasks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FileText size={16} />
          Tasks
        </NavLink>

        <NavLink to="/templates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BookTemplate size={16} />
          Templates
        </NavLink>

        <span className="nav-section-label">System</span>

        <NavLink to="/queue" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Activity size={16} />
          Queue Monitor
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {stats && (
          <div className="queue-stats-mini" style={{ marginBottom: 'var(--space-3)' }}>
            <div className="queue-stat-item">
              <span className="queue-stat-value" style={{ color: 'var(--color-warning)' }}>
                {stats.waiting}
              </span>
              <span className="queue-stat-label">Wait</span>
            </div>
            <div className="queue-stat-item">
              <span className="queue-stat-value" style={{ color: 'var(--color-processing)' }}>
                {stats.active}
              </span>
              <span className="queue-stat-label">Active</span>
            </div>
            <div className="queue-stat-item">
              <span className="queue-stat-value" style={{ color: 'var(--color-success)' }}>
                {stats.completed}
              </span>
              <span className="queue-stat-label">Done</span>
            </div>
            <div className="queue-stat-item">
              <span className="queue-stat-value" style={{ color: 'var(--color-error)' }}>
                {stats.failed}
              </span>
              <span className="queue-stat-label">Fail</span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="nav-link"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
