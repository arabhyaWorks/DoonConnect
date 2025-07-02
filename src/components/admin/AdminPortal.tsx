import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminTickets from './AdminTickets';
import AdminRoutes from './AdminRoutes';
import AdminBuses from './AdminBuses';
import AdminAnalytics from './AdminAnalytics';

const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem('doonconnect_admin_auth');
    if (adminAuth) {
      try {
        const authData = JSON.parse(adminAuth);
        const now = new Date().getTime();
        // Check if session is still valid (24 hours)
        if (authData.expires > now) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('doonconnect_admin_auth');
        }
      } catch (error) {
        localStorage.removeItem('doonconnect_admin_auth');
      }
    }

    // Listen for route changes
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Simple authentication check
    if (email === 'admin@gmail.com' && password === 'user@123') {
      const authData = {
        email,
        loginTime: new Date().getTime(),
        expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem('doonconnect_admin_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('doonconnect_admin_auth');
    setIsAuthenticated(false);
    window.history.pushState({}, '', '/admin');
    setCurrentPath('/admin');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Route handling based on current path
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/admin/tickets':
        return <AdminTickets onLogout={handleLogout} />;
      case '/admin/routes':
        return <AdminRoutes onLogout={handleLogout} />;
      case '/admin/buses':
        return <AdminBuses onLogout={handleLogout} />;
      case '/admin/analytics':
        return <AdminAnalytics onLogout={handleLogout} />;
      default:
        return <AdminDashboard onLogout={handleLogout} />;
    }
  };

  return renderCurrentPage();
};

export default AdminPortal;