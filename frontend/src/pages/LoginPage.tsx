import { useState } from 'react';
import { Zap, User, Lock, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 600));

    const success = login(username.trim(), password);
    if (!success) {
      setError('Invalid username or password');
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="login-root">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Zap size={20} color="white" />
          </div>
          <span className="login-logo-text">
            White<span>Gen</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="login-heading">Welcome back</h1>
        <p className="login-subheading">Sign in to access the dashboard</p>

        {/* Form */}
        <div className="login-form">
          {/* Error */}
          {error && (
            <div className="login-error-msg">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <User size={15} />
              </div>
              <input
                className={`login-input ${error ? 'error' : ''}`}
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <Lock size={15} />
              </div>
              <input
                className={`login-input ${error ? 'error' : ''}`}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'white' }} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </div>

        <div className="login-footer">
          WhiteGen · AI White Page Generator
        </div>
      </div>
    </div>
  );
}
