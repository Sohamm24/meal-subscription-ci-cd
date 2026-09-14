import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrowseMealPlansPage from './pages/BrowseMealPlansPage';
import SubscriptionDashboardPage from './pages/SubscriptionDashboardPage';
import AdminMealPlansPage from './pages/AdminMealPlansPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { getCurrentUser } from './services/auth';

function App() {
  const user = getCurrentUser();
  return <BrowserRouter><Navbar /><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<ProtectedRoute role="customer"><BrowseMealPlansPage /></ProtectedRoute>} />
    <Route path="/subscriptions" element={<ProtectedRoute role="customer"><SubscriptionDashboardPage /></ProtectedRoute>} />
    <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
    <Route path="/admin/meal-plans" element={<ProtectedRoute role="admin"><AdminMealPlansPage /></ProtectedRoute>} />
    <Route path="*" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} replace /> : <Navigate to="/login" replace />} />
  </Routes></BrowserRouter>;
}

export default App;