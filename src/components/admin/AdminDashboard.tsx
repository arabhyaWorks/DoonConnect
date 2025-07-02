import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Route, 
  MapPin, 
  Ticket, 
  Users, 
  TrendingUp, 
  Calendar,
  IndianRupee,
  Activity,
  Clock,
  BarChart3,
  LogOut
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    totalRoutes: 0,
    totalStops: 0,
    totalBookings: 0,
    todayBookings: 0,
    todayCollection: 0,
    activeTickets: 0
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    // Calculate stats from localStorage data
    const tickets = JSON.parse(localStorage.getItem('doonconnect_tickets') || '[]');
    const today = new Date().toDateString();
    
    const todayTickets = tickets.filter((ticket: any) => 
      new Date(ticket.purchaseTime).toDateString() === today
    );
    
    const activeTickets = tickets.filter((ticket: any) => ticket.status === 'active');
    
    const todayRevenue = todayTickets.reduce((sum: number, ticket: any) => sum + ticket.fare, 0);

    setStats({
      totalBuses: 25, // Mock data
      activeBuses: 18, // Mock data
      totalRoutes: 9,
      totalStops: 35,
      totalBookings: tickets.length,
      todayBookings: todayTickets.length,
      todayCollection: todayRevenue,
      activeTickets: activeTickets.length
    });

    // Set recent bookings (last 5)
    const sortedTickets = tickets
      .sort((a: any, b: any) => new Date(b.purchaseTime).getTime() - new Date(a.purchaseTime).getTime())
      .slice(0, 5);
    
    setRecentBookings(sortedTickets);
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className={`w-8 h-8 md:w-12 md:h-12 ${color} rounded-lg md:rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-600 hidden md:flex">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className="text-lg md:text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs md:text-sm text-gray-500 leading-tight">{title}</div>
      {/* Mobile trend indicator */}
      {trend && (
        <div className="flex items-center space-x-1 text-green-600 mt-1 md:hidden">
          <TrendingUp className="h-3 w-3" />
          <span className="text-xs font-medium">{trend}</span>
        </div>
      )}
    </div>
  );

  const handleQuickAction = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <AdminLayout title="Dashboard" onLogout={onLogout}>
      <div className="space-y-6">
        {/* Mobile Stats Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <StatCard
            title="Total Buses"
            value={stats.totalBuses}
            icon={<Bus className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100"
            trend="+2"
          />
          <StatCard
            title="Active Buses"
            value={stats.activeBuses}
            icon={<Activity className="h-6 w-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Total Routes"
            value={stats.totalRoutes}
            icon={<Route className="h-6 w-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <StatCard
            title="Total Stops"
            value={stats.totalStops}
            icon={<MapPin className="h-6 w-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        {/* Mobile Today's Stats - 2x2 */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<Ticket className="h-6 w-6 text-indigo-600" />}
            color="bg-indigo-100"
          />
          <StatCard
            title="Today's Bookings"
            value={stats.todayBookings}
            icon={<Calendar className="h-6 w-6 text-pink-600" />}
            color="bg-pink-100"
            trend="+5"
          />
          <StatCard
            title="Today's Collection"
            value={`₹${stats.todayCollection}`}
            icon={<IndianRupee className="h-6 w-6 text-emerald-600" />}
            color="bg-emerald-100"
            trend="+12%"
          />
          <StatCard
            title="Active Tickets"
            value={stats.activeTickets}
            icon={<Users className="h-6 w-6 text-red-600" />}
            color="bg-red-100"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <BarChart
              data={[
                { label: 'Mon', value: 12500 },
                { label: 'Tue', value: 8900 },
                { label: 'Wed', value: 15600 },
                { label: 'Thu', value: 10200 },
                { label: 'Fri', value: 18900 },
                { label: 'Sat', value: 13400 },
                { label: 'Sun', value: 8600 }
              ]}
              height={200}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Weekly Total: ₹88,100</span>
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% vs last week
              </span>
            </div>
          </div>

          {/* Ridership Trends */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Daily Ridership</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <LineChart
              data={[
                { label: 'Mon', value: 450 },
                { label: 'Tue', value: 680 },
                { label: 'Wed', value: 520 },
                { label: 'Thu', value: 780 },
                { label: 'Fri', value: 590 },
                { label: 'Sat', value: 720 },
                { label: 'Sun', value: 630 }
              ]}
              height={200}
              color="#3B82F6"
            />
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Average: 608 passengers/day</span>
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8% vs last week
              </span>
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route Performance Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Route Performance</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <PieChart
              data={[
                { label: 'Route 2A', value: 1701, color: '#8B5CF6' },
                { label: 'Route 1', value: 1215, color: '#A855F7' },
                { label: 'Route 2', value: 1069, color: '#C084FC' },
                { label: 'Others', value: 875, color: '#DDD6FE' }
              ]}
              size={240}
            />
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Ticket className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {booking.passengerName || 'User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.purchaseTime).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-600">₹{booking.fare}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'active' ? 'bg-green-100 text-green-800' :
                        booking.status === 'used' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent bookings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => handleQuickAction('/admin/routes')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center"
            >
              <Route className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-purple-900">Manage Routes</div>
            </button>
            <button 
              onClick={() => handleQuickAction('/admin/buses')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
            >
              <Bus className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-blue-900">Manage Buses</div>
            </button>
            <button 
              onClick={() => handleQuickAction('/admin/tickets')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center"
            >
              <Ticket className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-green-900">View Tickets</div>
            </button>
            <button 
              onClick={() => handleQuickAction('/admin/analytics')}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center"
            >
              <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="font-medium text-orange-900">Analytics</div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;