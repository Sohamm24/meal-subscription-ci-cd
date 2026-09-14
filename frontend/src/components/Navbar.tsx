import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';

export default function Navbar() {
  const user = getCurrentUser();
  const { pathname } = useLocation();
  const handleLogout = () => { logout(); window.location.href = '/login'; };
  const isActive = (path: string) => pathname === path ? 'nav-link active' : 'nav-link';
  return <nav className="navbar" role="navigation" aria-label="Main navigation">
    <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="navbar-logo">🍽️ MealSub</Link>
    <ul className="navbar-links">
      {!user && <><li><Link to="/login" className={isActive('/login')}>Sign In</Link></li><li><Link to="/register" className="btn btn-primary btn-sm" style={{ marginLeft: '0.5rem' }}>Get Started</Link></li></>}
      {user?.role === 'customer' && <><li><Link to="/" className={isActive('/')}>Browse Plans</Link></li><li><Link to="/subscriptions" className={isActive('/subscriptions')}>My Subscriptions</Link></li><li><button onClick={handleLogout} className="nav-link nav-link-logout">Sign Out</button></li></>}
      {user?.role === 'admin' && <><li><Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link></li><li><Link to="/admin/meal-plans" className={isActive('/admin/meal-plans')}>Meal Plans</Link></li><li><button onClick={handleLogout} className="nav-link nav-link-logout">Sign Out</button></li></>}
    </ul>
  </nav>;
}