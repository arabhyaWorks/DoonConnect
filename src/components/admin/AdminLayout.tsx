import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Route, 
  Bus, 
  Ticket, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  Shield
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const desktopNavigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: window.location.pathname === '/admin' },
    { name: 'Routes', href: '/admin/routes', icon: Route, current: window.location.pathname === '/admin/routes' },
    { name: 'Buses', href: '/admin/buses', icon: Bus, current: window.location.pathname === '/admin/buses' },
    { name: 'Tickets', href: '/admin/tickets', icon: Ticket, current: window.location.pathname === '/admin/tickets' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: window.location.pathname === '/admin/analytics' },
  ];

  const mobileNavigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: window.location.pathname === '/admin' },
    { name: 'Routes', href: '/admin/routes', icon: Route, current: window.location.pathname === '/admin/routes' },
    { name: 'Tickets', href: '/admin/tickets', icon: Ticket, current: window.location.pathname === '/admin/tickets' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: window.location.pathname === '/admin/analytics' },
  ];

  const handleNavigation = (href: string) => {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 hidden lg:flex lg:flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">DoonConnect</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {desktopNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-colors ${
                    item.current
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Desktop Logout button */}
        <div className="p-3 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                {/* Mobile logo and title */}
                <div className="lg:hidden flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">DoonConnect</h1>
                    <p className="text-xs text-gray-500">Admin Portal</p>
                  </div>
                </div>
                
                {/* Desktop title */}
                <h1 className="hidden lg:block text-2xl font-bold text-gray-900">{title}</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="grid grid-cols-5 h-16">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  item.current
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            );
          })}
          
          {/* Mobile Logout Button */}
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center space-y-1 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;