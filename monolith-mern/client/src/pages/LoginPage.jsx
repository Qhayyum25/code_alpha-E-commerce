import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useApp();
  const navigate  = useNavigate();
  const location  = useLocation();
  const redirect  = location.state?.from || '/';

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  const fillDemo = () => setForm({ email: 'demo@monolith.com', password: 'demo1234' });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">MONOLITH</Link>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to your account to continue.</p>

        {error && <div className="error-msg">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn-outline auth-btn demo-btn" onClick={fillDemo}>
          Fill Demo Credentials
        </button>

        <div className="demo-creds">
          <p><strong>Demo User:</strong> demo@monolith.com / demo1234</p>
          <p><strong>Admin:</strong> admin@monolith.com / admin123</p>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one →</Link>
        </p>
      </div>
    </div>
  );
}
