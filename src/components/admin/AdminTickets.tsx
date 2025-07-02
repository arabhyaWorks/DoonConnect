import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  MapPin,
  User,
  Phone,
  IndianRupee,
  Clock,
  Ticket as TicketIcon
} from 'lucide-react';
import AdminLayout from './AdminLayout';

interface AdminTicketsProps {
  onLogout: () => void;
}

interface TicketData {
  id: string;
  routeId: string;
  fromStop: string;
  toStop: string;
  fare: number;
  purchaseTime: Date;
  validUntil: Date;
  status: 'active' | 'used' | 'expired';
  seats?: string[];
  passengerName?: string;
  passengerPhone?: string;
}

const AdminTickets: React.FC<AdminTicketsProps> = ({ onLogout }) => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  // Mock route data
  const routes = [
    { id: 'R2A', name: 'Doon Electric Bus Route 2A' },
    { id: 'R1', name: 'Clock Tower - ISBT - Railway Station' },
    { id: 'R2', name: 'Rajpur Road - IT Park' },
    { id: 'R3', name: 'ISBT - Sahastradhara - IT Park' },
  ];

  // Mock stop data
  const stops = [
    { id: 'clocktower', name: 'Clock Tower' },
    { id: 'isbt', name: 'ISBT' },
    { id: 'rajpur', name: 'Rajpur' },
    { id: 'it-park', name: 'IT Park Sahastradhara Road' },
  ];

  useEffect(() => {
    // Load tickets from localStorage
    const storedTickets = JSON.parse(localStorage.getItem('doonconnect_tickets') || '[]');
    const parsedTickets = storedTickets.map((ticket: any) => ({
      ...ticket,
      purchaseTime: new Date(ticket.purchaseTime),
      validUntil: new Date(ticket.validUntil)
    }));
    setTickets(parsedTickets);
    setFilteredTickets(parsedTickets);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = tickets;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.passengerPhone?.includes(searchQuery) ||
        ticket.passengerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Route filter
    if (routeFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.routeId === routeFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.purchaseTime);
        switch (dateFilter) {
          case 'today':
            return ticketDate.toDateString() === today.toDateString();
          case 'yesterday':
            return ticketDate.toDateString() === yesterday.toDateString();
          case 'week':
            return ticketDate >= weekAgo;
          default:
            return true;
        }
      });
    }

    setFilteredTickets(filtered);
  }, [tickets, searchQuery, statusFilter, routeFilter, dateFilter]);

  const getRouteName = (routeId: string) => {
    return routes.find(route => route.id === routeId)?.name || routeId;
  };

  const getStopName = (stopId: string) => {
    return stops.find(stop => stop.id === stopId)?.name || stopId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['Ticket ID', 'Passenger Name', 'Phone', 'Route', 'From', 'To', 'Seats', 'Fare', 'Status', 'Purchase Time'];
    const csvData = filteredTickets.map(ticket => [
      ticket.id,
      ticket.passengerName || 'N/A',
      ticket.passengerPhone || 'N/A',
      getRouteName(ticket.routeId),
      getStopName(ticket.fromStop),
      getStopName(ticket.toStop),
      ticket.seats?.join(', ') || 'N/A',
      ticket.fare,
      ticket.status,
      ticket.purchaseTime.toLocaleString('en-IN')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doonconnect-tickets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="Tickets Management" onLogout={onLogout}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
              <TicketIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Tickets</p>
                <p className="text-2xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'active').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{tickets
                    .filter(t => new Date(t.purchaseTime).toDateString() === new Date().toDateString())
                    .reduce((sum, t) => sum + t.fare, 0)
                  }
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{tickets.reduce((sum, t) => sum + t.fare, 0)}
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by ticket ID, phone, or passenger name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="used">Used</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="all">All Routes</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>{route.name}</option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
              </select>

              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Journey
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{ticket.id}</div>
                        <div className="text-sm text-gray-500">
                          {ticket.purchaseTime.toLocaleDateString('en-IN')} at{' '}
                          {ticket.purchaseTime.toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {ticket.seats && (
                          <div className="text-xs text-purple-600">
                            Seats: {ticket.seats.join(', ')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.passengerName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          +91 {ticket.passengerPhone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getRouteName(ticket.routeId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {getStopName(ticket.fromStop)} → {getStopName(ticket.toStop)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{ticket.fare}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-purple-600 hover:text-purple-900 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-900">#{selectedTicket.id}</div>
                      <div className="text-sm text-purple-600">Ticket ID</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Passenger Name</div>
                      <div className="font-medium">{selectedTicket.passengerName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone Number</div>
                      <div className="font-medium">+91 {selectedTicket.passengerPhone || 'N/A'}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Route</div>
                    <div className="font-medium">{getRouteName(selectedTicket.routeId)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">From</div>
                      <div className="font-medium">{getStopName(selectedTicket.fromStop)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">To</div>
                      <div className="font-medium">{getStopName(selectedTicket.toStop)}</div>
                    </div>
                  </div>

                  {selectedTicket.seats && (
                    <div>
                      <div className="text-sm text-gray-500">Seats</div>
                      <div className="font-medium">{selectedTicket.seats.join(', ')}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Purchase Time</div>
                      <div className="font-medium">
                        {selectedTicket.purchaseTime.toLocaleDateString('en-IN')}
                        <br />
                        {selectedTicket.purchaseTime.toLocaleTimeString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Valid Until</div>
                      <div className="font-medium">
                        {selectedTicket.validUntil.toLocaleDateString('en-IN')}
                        <br />
                        {selectedTicket.validUntil.toLocaleTimeString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Amount</div>
                      <div className="text-xl font-bold text-purple-600">₹{selectedTicket.fare}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTickets;