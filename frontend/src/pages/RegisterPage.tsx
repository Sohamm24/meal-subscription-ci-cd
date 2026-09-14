import { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { registerUser, UserRole } from '../services/auth';

export default function RegisterPage() {
  const [form, setForm] = useState<{ name: string; email: string; password: string; role: UserRole }>({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const set = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((current) => ({ ...current, [key]: event.target.value } as typeof form));
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; } setLoading(true);
    try { const { user } = await registerUser(form.name, form.email, form.password, form.role); window.location.href = user.role === 'admin' ? '/admin/dashboard' : '/'; }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Registration failed'); } finally { setLoading(false); }
  };
  return <div className="auth-page"><div className="auth-card"><div className="auth-logo">🍽️ MealSub</div><p className="auth-tagline">Premium Meal Subscription Platform</p><h1 className="auth-title">Create your account</h1><p className="auth-subtitle">Join thousands enjoying curated meal plans</p>
    {error && <div className="alert alert-error" role="alert">{error}</div>}<form onSubmit={handleSubmit} noValidate>
      <div className="form-group"><label className="form-label" htmlFor="reg-name">Full name</label><input id="reg-name" type="text" className="form-input" placeholder="Jane Smith" value={form.name} onChange={set('name')} required autoComplete="name" /></div>
      <div className="form-group"><label className="form-label" htmlFor="reg-email">Email address</label><input id="reg-email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" /></div>
      <div className="form-group"><label className="form-label" htmlFor="reg-password">Password</label><input id="reg-password" type="password" className="form-input" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required autoComplete="new-password" /></div>
      <div className="form-group"><label className="form-label" htmlFor="reg-role">Account type</label><select id="reg-role" className="form-input" value={form.role} onChange={set('role')}><option value="customer">🛍️ Customer — Browse &amp; Subscribe</option><option value="admin">⚙️ Admin — Manage Meal Plans</option></select></div>
      <button id="reg-submit" type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>{loading ? <><span className="spinner" /> Creating account…</> : 'Create Account'}</button>
    </form><p className="auth-footer">Already have an account? <Link to="/login" className="link">Sign in</Link></p>
  </div></div>;
}