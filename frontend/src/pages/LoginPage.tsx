import { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/auth';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { const { user } = await loginUser(form.email, form.password); window.location.href = user.role === 'admin' ? '/admin/dashboard' : '/'; }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Login failed'); }
    finally { setLoading(false); }
  };
  return <div className="auth-page"><div className="auth-card">
    <div className="auth-logo">🍽️ MealSub</div><p className="auth-tagline">Premium Meal Subscription Platform</p>
    <h1 className="auth-title">Welcome back</h1><p className="auth-subtitle">Sign in to your account to continue</p>
    {error && <div className="alert alert-error" role="alert">{error}</div>}
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group"><label className="form-label" htmlFor="login-email">Email address</label><input id="login-email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" /></div>
      <div className="form-group"><label className="form-label" htmlFor="login-password">Password</label><input id="login-password" type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={set('password')} required autoComplete="current-password" /></div>
      <button id="login-submit" type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>{loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}</button>
    </form><p className="auth-footer">Don't have an account? <Link to="/register" className="link">Create one free</Link></p>
  </div></div>;
}