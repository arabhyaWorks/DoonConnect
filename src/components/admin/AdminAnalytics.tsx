import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Bus,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  CreditCard
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';

interface AdminAnalyticsProps {
  onLogout: () => void;
}

interface AnalyticsData {
  totalRidership: number;
  totalRevenue: number;
  totalTrips: number;
  averageOccupancy: number;
  peakHours: string[];
  popularRoutes: { routeId: string; trips: number; revenue: number }[];
  dailyStats: { date: string; ridership: number; revenue: number; trips: number }[];
  busWiseRevenue: { busId: string; revenue: number; trips: number; route: string }[];
  paymentModeBreakdown: { mode: string; amount: number; percentage: number; transactions: number }[];
  todayCollection: {
    total: number;
    byPaymentMode: { mode: string; amount: number }[];
    byBus: { busId: string; amount: number; route: string }[];
  };
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ onLogout }) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    to: new Date().toISOString().split('T')[0] // today
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock route names
  const routeNames: { [key: string]: string } = {
    'R2A': 'Doon Electric Bus Route 2A',
    'R1': 'Clock Tower - ISBT - Railway Station',
    'R2': 'Rajpur Road - IT Park',
    'R3': 'ISBT - Sahastradhara - IT Park'
  };

  const generateAnalyticsData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Generate mock daily stats
      const dailyStats = [];
      for (let i = 0; i < daysDiff; i++) {
        const date = new Date(fromDate);
        date.setDate(date.getDate() + i);
        
        const baseRidership = Math.floor(Math.random() * 500) + 200;
        const baseRevenue = baseRidership * (Math.floor(Math.random() * 20) + 15);
        const trips = Math.floor(baseRidership / (Math.floor(Math.random() * 15) + 20));
        
        dailyStats.push({
          date: date.toISOString().split('T')[0],
          ridership: baseRidership,
          revenue: baseRevenue,
          trips: trips
        });
      }

      const mockData: AnalyticsData = {
        totalRidership: dailyStats.reduce((sum, day) => sum + day.ridership, 0),
        totalRevenue: dailyStats.reduce((sum, day) => sum + day.revenue, 0),
        totalTrips: dailyStats.reduce((sum, day) => sum + day.trips, 0),
        averageOccupancy: Math.floor(Math.random() * 30) + 60, // 60-90%
        peakHours: ['8:00 AM - 10:00 AM', '5:00 PM - 7:00 PM'],
        popularRoutes: [
          { routeId: 'R2A', trips: Math.floor(Math.random() * 100) + 150, revenue: Math.floor(Math.random() * 5000) + 8000 },
          { routeId: 'R1', trips: Math.floor(Math.random() * 80) + 120, revenue: Math.floor(Math.random() * 4000) + 6000 },
          { routeId: 'R2', trips: Math.floor(Math.random() * 70) + 100, revenue: Math.floor(Math.random() * 3500) + 5000 },
          { routeId: 'R3', trips: Math.floor(Math.random() * 60) + 80, revenue: Math.floor(Math.random() * 3000) + 4000 }
        ],
        dailyStats,
        busWiseRevenue: [
          { busId: 'UK05-AB-3265', revenue: Math.floor(Math.random() * 2000) + 3000, trips: Math.floor(Math.random() * 20) + 25, route: 'R2A' },
          { busId: 'UK05-AB-3266', revenue: Math.floor(Math.random() * 1800) + 2500, trips: Math.floor(Math.random() * 18) + 22, route: 'R1' },
          { busId: 'UK05-AB-3267', revenue: Math.floor(Math.random() * 1600) + 2200, trips: Math.floor(Math.random() * 16) + 20, route: 'R2' },
          { busId: 'UK05-AB-3268', revenue: Math.floor(Math.random() * 1500) + 2000, trips: Math.floor(Math.random() * 15) + 18, route: 'R3' },
          { busId: 'UK05-AB-3269', revenue: Math.floor(Math.random() * 1400) + 1800, trips: Math.floor(Math.random() * 14) + 16, route: 'R2A' },
          { busId: 'UK05-AB-3270', revenue: Math.floor(Math.random() * 1300) + 1600, trips: Math.floor(Math.random() * 13) + 15, route: 'R1' }
        ],
        paymentModeBreakdown: [
          { mode: 'UPI', amount: Math.floor(Math.random() * 15000) + 25000, percentage: 45, transactions: Math.floor(Math.random() * 200) + 350 },
          { mode: 'Cash', amount: Math.floor(Math.random() * 12000) + 18000, percentage: 30, transactions: Math.floor(Math.random() * 150) + 250 },
          { mode: 'Card', amount: Math.floor(Math.random() * 8000) + 12000, percentage: 15, transactions: Math.floor(Math.random() * 100) + 150 },
          { mode: 'Net Banking', amount: Math.floor(Math.random() * 5000) + 8000, percentage: 10, transactions: Math.floor(Math.random() * 80) + 120 }
        ],
        todayCollection: {
          total: Math.floor(Math.random() * 5000) + 8000,
          byPaymentMode: [
            { mode: 'UPI', amount: Math.floor(Math.random() * 2000) + 3500 },
            { mode: 'Cash', amount: Math.floor(Math.random() * 1500) + 2500 },
            { mode: 'Card', amount: Math.floor(Math.random() * 1000) + 1500 },
            { mode: 'Net Banking', amount: Math.floor(Math.random() * 500) + 800 }
          ],
          byBus: [
            { busId: 'UK05-AB-3265', amount: Math.floor(Math.random() * 800) + 1200, route: 'R2A' },
            { busId: 'UK05-AB-3266', amount: Math.floor(Math.random() * 700) + 1000, route: 'R1' },
            { busId: 'UK05-AB-3267', amount: Math.floor(Math.random() * 600) + 900, route: 'R2' },
            { busId: 'UK05-AB-3268', amount: Math.floor(Math.random() * 500) + 800, route: 'R3' },
            { busId: 'UK05-AB-3269', amount: Math.floor(Math.random() * 400) + 700, route: 'R2A' },
            { busId: 'UK05-AB-3270', amount: Math.floor(Math.random() * 300) + 600, route: 'R1' }
          ]
        }
      };

      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateAnalyticsData();
  }, [dateRange]);

  const exportReport = () => {
    if (!analyticsData) return;

    const reportData = {
      dateRange: `${dateRange.from} to ${dateRange.to}`,
      summary: {
        totalRidership: analyticsData.totalRidership,
        totalRevenue: analyticsData.totalRevenue,
        totalTrips: analyticsData.totalTrips,
        averageOccupancy: `${analyticsData.averageOccupancy}%`
      },
      dailyBreakdown: analyticsData.dailyStats,
      popularRoutes: analyticsData.popularRoutes.map(route => ({
        route: routeNames[route.routeId] || route.routeId,
        trips: route.trips,
        revenue: route.revenue
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doonconnect-analytics-${dateRange.from}-to-${dateRange.to}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    change?: string;
  }> = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );

  return (
    <AdminLayout title="Analytics & Reports" onLogout={onLogout}>
      <div className="space-y-6">
        {/* Date Range Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600">View detailed insights and generate reports</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
              
              <button
                onClick={exportReport}
                disabled={!analyticsData}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading analytics...</span>
          </div>
        ) : analyticsData ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Ridership"
                value={analyticsData.totalRidership.toLocaleString()}
                icon={<Users className="h-6 w-6 text-blue-600" />}
                color="bg-blue-100"
                change="+12%"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${analyticsData.totalRevenue.toLocaleString()}`}
                icon={<IndianRupee className="h-6 w-6 text-green-600" />}
                color="bg-green-100"
                change="+8%"
              />
              <StatCard
                title="Total Bus Trips"
                value={analyticsData.totalTrips.toLocaleString()}
                icon={<Bus className="h-6 w-6 text-purple-600" />}
                color="bg-purple-100"
                change="+5%"
              />
              <StatCard
                title="Avg. Occupancy"
                value={`${analyticsData.averageOccupancy}%`}
                icon={<Activity className="h-6 w-6 text-orange-600" />}
                color="bg-orange-100"
                change="+3%"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Ridership Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Daily Ridership</h3>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                <BarChart
                  data={analyticsData.dailyStats.map(day => ({
                    label: new Date(day.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                    value: day.ridership
                  }))}
                  height={200}
                />
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Daily Revenue</h3>
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <BarChart
                  data={analyticsData.dailyStats.map(day => ({
                    label: new Date(day.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                    value: day.revenue
                  }))}
                  height={200}
                />
              </div>
            </div>

            {/* Popular Routes and Peak Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Routes */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Popular Routes</h3>
                  <PieChartIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex justify-center">
                  <PieChart
                    data={analyticsData.popularRoutes
                      .sort((a, b) => b.trips - a.trips)
                      .map((route, index) => ({
                        label: routeNames[route.routeId] || route.routeId,
                        value: route.trips,
                        color: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE'][index] || '#E5E7EB'
                      }))}
                    size={200}
                    showLabels={false}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {analyticsData.popularRoutes
                    .sort((a, b) => b.trips - a.trips)
                    .map((route, index) => (
                      <div key={route.routeId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE'][index] || '#E5E7EB' }}
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {routeNames[route.routeId] || route.routeId}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {route.trips} trips • ₹{route.revenue.toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Peak Hours and Additional Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Peak Hours & Insights</h3>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Peak Travel Times</h4>
                    <div className="space-y-2">
                      {analyticsData.peakHours.map((hour, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
                          <Clock className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-orange-900">{hour}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                        <span className="text-blue-800">Average Daily Ridership</span>
                        <span className="font-bold text-blue-900">
                          {Math.round(analyticsData.totalRidership / analyticsData.dailyStats.length)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                        <span className="text-green-800">Average Daily Revenue</span>
                        <span className="font-bold text-green-900">
                          ₹{Math.round(analyticsData.totalRevenue / analyticsData.dailyStats.length).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                        <span className="text-purple-800">Revenue per Trip</span>
                        <span className="font-bold text-purple-900">
                          ₹{Math.round(analyticsData.totalRevenue / analyticsData.totalTrips)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Daily Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ridership</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per Trip</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.dailyStats.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.ridership.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{day.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.trips}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{Math.round(day.revenue / day.trips)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Mode and Source Analytics */}
            {/* Revenue Mode Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Booking Mode Distribution */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue by Booking Mode</h3>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="flex justify-center mb-6">
                  <PieChart
                    data={[
                      { 
                        label: 'Pre-booking', 
                        value: Math.round(analyticsData.totalRevenue * 0.65), 
                        color: '#8B5CF6' 
                      },
                      { 
                        label: 'On-spot Booking', 
                        value: Math.round(analyticsData.totalRevenue * 0.35), 
                        color: '#06B6D4' 
                      }
                    ]}
                    size={200}
                    showLabels={false}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                      <div>
                        <div className="font-medium text-purple-900">Pre-booking</div>
                        <div className="text-sm text-purple-700">Online advance bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-900">
                        ₹{Math.round(analyticsData.totalRevenue * 0.65).toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-700">65%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-cyan-600 rounded-full"></div>
                      <div>
                        <div className="font-medium text-cyan-900">On-spot Booking</div>
                        <div className="text-sm text-cyan-700">Direct bus bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-900">
                        ₹{Math.round(analyticsData.totalRevenue * 0.35).toLocaleString()}
                      </div>
                      <div className="text-sm text-cyan-700">35%</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 text-center">
                    <strong>Insight:</strong> Pre-booking accounts for majority of revenue, 
                    indicating strong digital adoption
                  </div>
                </div>
              </div>

              {/* Payment Method Distribution */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue by Payment Method</h3>
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="flex justify-center mb-6">
                  <PieChart
                    data={[
                      { 
                        label: 'UPI', 
                        value: Math.round(analyticsData.totalRevenue * 0.45), 
                        color: '#10B981' 
                      },
                      { 
                        label: 'Cash', 
                        value: Math.round(analyticsData.totalRevenue * 0.30), 
                        color: '#F59E0B' 
                      },
                      { 
                        label: 'Card', 
                        value: Math.round(analyticsData.totalRevenue * 0.15), 
                        color: '#3B82F6' 
                      },
                      { 
                        label: 'Net Banking', 
                        value: Math.round(analyticsData.totalRevenue * 0.10), 
                        color: '#8B5CF6' 
                      }
                    ]}
                    size={200}
                    showLabels={false}
                  />
                </div>
                
                <div className="space-y-2">
                  {[
                    { name: 'UPI', percentage: 45, color: 'bg-green-600', bgColor: 'bg-green-50', textColor: 'text-green-900' },
                    { name: 'Cash', percentage: 30, color: 'bg-yellow-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-900' },
                    { name: 'Card', percentage: 15, color: 'bg-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-900' },
                    { name: 'Net Banking', percentage: 10, color: 'bg-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-900' }
                  ].map((method, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 ${method.bgColor} rounded-lg`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${method.color} rounded-full`}></div>
                        <span className={`font-medium ${method.textColor}`}>{method.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${method.textColor}`}>
                          ₹{Math.round(analyticsData.totalRevenue * (method.percentage / 100)).toLocaleString()}
                        </span>
                        <span className={`text-sm ${method.textColor} opacity-75`}>
                          {method.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 text-center">
                    <strong>Insight:</strong> UPI dominates digital payments, 
                    while cash still represents significant portion
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Trends Comparison */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trends by Mode & Method</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Mode Trend */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Weekly Booking Mode Trends</h4>
                  <BarChart
                    data={[
                      { label: 'Mon', value: 8500, color: '#8B5CF6' },
                      { label: 'Tue', value: 6200, color: '#06B6D4' },
                      { label: 'Wed', value: 10800, color: '#8B5CF6' },
                      { label: 'Thu', value: 7100, color: '#06B6D4' },
                      { label: 'Fri', value: 13200, color: '#8B5CF6' },
                      { label: 'Sat', value: 9300, color: '#06B6D4' },
                      { label: 'Sun', value: 6000, color: '#8B5CF6' }
                    ]}
                    height={180}
                    showValues={false}
                  />
                  <div className="flex items-center justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pre-booking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">On-spot</span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Method Trend */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Payment Method Growth</h4>
                  <LineChart
                    data={[
                      { label: 'Jan', value: 35 },
                      { label: 'Feb', value: 38 },
                      { label: 'Mar', value: 42 },
                      { label: 'Apr', value: 45 },
                      { label: 'May', value: 47 },
                      { label: 'Jun', value: 45 }
                    ]}
                    height={180}
                    color="#10B981"
                    showArea={true}
                  />
                  <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">UPI adoption rate (%)</span>
                  </div>
                </div>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+23%</div>
                  <div className="text-sm text-gray-500">UPI Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">+18%</div>
                  <div className="text-sm text-gray-500">Pre-booking</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">-8%</div>
                  <div className="text-sm text-gray-500">Cash Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">+12%</div>
                  <div className="text-sm text-gray-500">Digital Adoption</div>
                </div>
              </div>
            </div>

            {/* Bus-wise Revenue Analytics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Bus-wise Revenue Analysis</h3>
                <Bus className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bus Revenue Chart */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Revenue by Bus</h4>
                  <BarChart
                    data={analyticsData.busWiseRevenue
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 6)
                      .map(bus => ({
                        label: bus.busId.split('-')[2], // Show only last part of bus number
                        value: bus.revenue,
                        color: '#3B82F6'
                      }))}
                    height={200}
                  />
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-600">Top performing buses (Revenue in ₹)</span>
                  </div>
                </div>
                
                {/* Bus Performance Table */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Detailed Bus Performance</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analyticsData.busWiseRevenue
                          .sort((a, b) => b.revenue - a.revenue)
                          .map((bus, index) => (
                            <tr key={bus.busId} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium text-gray-900">{bus.busId}</td>
                              <td className="px-3 py-2 text-gray-600">
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                  {bus.route}
                                </span>
                              </td>
                              <td className="px-3 py-2 font-semibold text-green-600">₹{bus.revenue.toLocaleString()}</td>
                              <td className="px-3 py-2 text-gray-600">{bus.trips}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Bus Performance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    ₹{Math.round(analyticsData.busWiseRevenue.reduce((sum, bus) => sum + bus.revenue, 0) / analyticsData.busWiseRevenue.length).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Avg Revenue/Bus</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {Math.round(analyticsData.busWiseRevenue.reduce((sum, bus) => sum + bus.trips, 0) / analyticsData.busWiseRevenue.length)}
                  </div>
                  <div className="text-sm text-gray-500">Avg Trips/Bus</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {analyticsData.busWiseRevenue[0]?.busId.split('-')[2] || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Top Performer</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">
                    ₹{Math.round(analyticsData.busWiseRevenue.reduce((sum, bus) => sum + bus.revenue, 0) / analyticsData.busWiseRevenue.reduce((sum, bus) => sum + bus.trips, 0))}
                  </div>
                  <div className="text-sm text-gray-500">Revenue/Trip</div>
                </div>
              </div>
            </div>

            {/* Today's Collection Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Today's Collection Breakdown</h3>
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Payment Mode Breakdown */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Collection by Payment Mode</h4>
                  <div className="space-y-3">
                    {analyticsData.todayCollection.byPaymentMode.map((mode, index) => {
                      const percentage = Math.round((mode.amount / analyticsData.todayCollection.total) * 100);
                      const colors = ['bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500'];
                      return (
                        <div key={mode.mode} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 ${colors[index]} rounded-full`}></div>
                            <div>
                              <div className="font-medium text-gray-900">{mode.mode}</div>
                              <div className="text-sm text-gray-500">{percentage}% of total</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">₹{mode.amount.toLocaleString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-800">Total Today's Collection</span>
                      <span className="text-2xl font-bold text-green-900">₹{analyticsData.todayCollection.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Today's Bus-wise Collection */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Collection by Bus</h4>
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {analyticsData.todayCollection.byBus
                      .sort((a, b) => b.amount - a.amount)
                      .map((bus, index) => (
                        <div key={bus.busId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{bus.busId}</div>
                              <div className="text-sm text-gray-500">Route {bus.route}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">₹{bus.amount.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              {Math.round((bus.amount / analyticsData.todayCollection.total) * 100)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Mode Analytics Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Mode Analytics Summary</h3>
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsData.paymentModeBreakdown.map((mode, index) => {
                  const colors = [
                    { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' },
                    { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' },
                    { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-600' },
                    { bg: 'bg-purple-100', text: 'text-purple-800', icon: 'text-purple-600' }
                  ];
                  const color = colors[index] || colors[0];
                  
                  return (
                    <div key={mode.mode} className={`${color.bg} rounded-2xl p-6 border border-gray-100`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center`}>
                          <CreditCard className={`h-6 w-6 ${color.icon}`} />
                        </div>
                        <div className={`text-2xl font-bold ${color.text}`}>
                          {mode.percentage}%
                        </div>
                      </div>
                      <div className={`font-semibold ${color.text} mb-2`}>{mode.mode}</div>
                      <div className={`text-sm ${color.text} opacity-80 mb-1`}>
                        Revenue: ₹{mode.amount.toLocaleString()}
                      </div>
                      <div className={`text-sm ${color.text} opacity-80`}>
                        Transactions: {mode.transactions}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{analyticsData.paymentModeBreakdown.reduce((sum, mode) => sum + mode.amount, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {analyticsData.paymentModeBreakdown.reduce((sum, mode) => sum + mode.transactions, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{Math.round(analyticsData.paymentModeBreakdown.reduce((sum, mode) => sum + mode.amount, 0) / analyticsData.paymentModeBreakdown.reduce((sum, mode) => sum + mode.transactions, 0))}
                    </div>
                    <div className="text-sm text-gray-500">Avg Transaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.paymentModeBreakdown.find(mode => mode.mode === 'UPI')?.percentage || 0}%
                    </div>
                    <div className="text-sm text-gray-500">Digital Adoption</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">Select a date range to view analytics</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminAnalytics;