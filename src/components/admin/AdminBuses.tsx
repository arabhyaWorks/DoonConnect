import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Bus, 
  User, 
  Phone,
  MapPin,
  Activity,
  Save,
  X,
  Search,
  Filter
} from 'lucide-react';
import AdminLayout from './AdminLayout';

interface AdminBusesProps {
  onLogout: () => void;
}

interface BusData {
  id: string;
  number: string;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  conductorPhone: string;
  routeId: string;
  status: 'active' | 'maintenance' | 'inactive';
  capacity: number;
  model: string;
  registrationDate: string;
}

const AdminBuses: React.FC<AdminBusesProps> = ({ onLogout }) => {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<BusData[]>([]);
  const [showAddBus, setShowAddBus] = useState(false);
  const [editingBus, setEditingBus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [busForm, setBusForm] = useState<BusData>({
    id: '',
    number: '',
    driverName: '',
    driverPhone: '',
    conductorName: '',
    conductorPhone: '',
    routeId: '',
    status: 'active',
    capacity: 40,
    model: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });

  // Mock routes for dropdown
  const routes = [
    { id: 'R2A', name: 'Doon Electric Bus Route 2A' },
    { id: 'R1', name: 'Clock Tower - ISBT - Railway Station' },
    { id: 'R2', name: 'Rajpur Road - IT Park' },
    { id: 'R3', name: 'ISBT - Sahastradhara - IT Park' },
  ];

  // Initialize with mock data
  useEffect(() => {
    const mockBuses: BusData[] = [
      {
        id: 'B001',
        number: 'UK05 AB 3265',
        driverName: 'Rajesh Kumar',
        driverPhone: '9876543210',
        conductorName: 'Suresh Singh',
        conductorPhone: '9876543211',
        routeId: 'R2A',
        status: 'active',
        capacity: 40,
        model: 'Tata Starbus',
        registrationDate: '2023-01-15'
      },
      {
        id: 'B002',
        number: 'UK05 AB 3266',
        driverName: 'Amit Sharma',
        driverPhone: '9876543212',
        conductorName: 'Vikash Yadav',
        conductorPhone: '9876543213',
        routeId: 'R1',
        status: 'active',
        capacity: 35,
        model: 'Ashok Leyland',
        registrationDate: '2023-02-20'
      },
      {
        id: 'B003',
        number: 'UK05 AB 3267',
        driverName: 'Deepak Verma',
        driverPhone: '9876543214',
        conductorName: 'Ravi Kumar',
        conductorPhone: '9876543215',
        routeId: 'R2',
        status: 'maintenance',
        capacity: 42,
        model: 'Tata Starbus',
        registrationDate: '2023-03-10'
      }
    ];
    setBuses(mockBuses);
    setFilteredBuses(mockBuses);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = buses;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(bus => 
        bus.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.conductorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bus => bus.status === statusFilter);
    }

    setFilteredBuses(filtered);
  }, [buses, searchQuery, statusFilter]);

  const resetForm = () => {
    setBusForm({
      id: '',
      number: '',
      driverName: '',
      driverPhone: '',
      conductorName: '',
      conductorPhone: '',
      routeId: '',
      status: 'active',
      capacity: 40,
      model: '',
      registrationDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddBus = () => {
    setShowAddBus(true);
    setEditingBus(null);
    resetForm();
  };

  const handleEditBus = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    if (bus) {
      setBusForm(bus);
      setEditingBus(busId);
      setShowAddBus(true);
    }
  };

  const handleSaveBus = () => {
    if (!busForm.number || !busForm.driverName || !busForm.conductorName) {
      alert('Please fill all required fields');
      return;
    }

    const newBus = {
      ...busForm,
      id: busForm.id || `B${Date.now()}`
    };

    if (editingBus) {
      setBuses(buses.map(b => b.id === editingBus ? newBus : b));
    } else {
      setBuses([...buses, newBus]);
    }

    setShowAddBus(false);
    setEditingBus(null);
    resetForm();
  };

  const handleDeleteBus = (busId: string) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      setBuses(buses.filter(b => b.id !== busId));
    }
  };

  const getRouteName = (routeId: string) => {
    return routes.find(route => route.id === routeId)?.name || routeId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-600" />;
      case 'maintenance': return <Edit className="h-4 w-4 text-yellow-600" />;
      case 'inactive': return <X className="h-4 w-4 text-red-600" />;
      default: return <Bus className="h-4 w-4 text-gray-600" />;
    }
  };

  const BusCard: React.FC<{ bus: BusData }> = ({ bus }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Bus className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">{bus.number}</h3>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bus.status)}`}>
              {getStatusIcon(bus.status)}
              <span className="ml-1">{bus.status}</span>
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <strong>Model:</strong> {bus.model} | <strong>Capacity:</strong> {bus.capacity} seats
          </div>
          <div className="text-sm text-gray-600 mb-3">
            <strong>Route:</strong> {getRouteName(bus.routeId)}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditBus(bus.id)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Edit Bus"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteBus(bus.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Bus"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <User className="h-4 w-4" />
            <span>Driver</span>
          </div>
          <div className="font-medium text-gray-900">{bus.driverName}</div>
          <div className="text-sm text-gray-500">+91 {bus.driverPhone}</div>
        </div>
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <User className="h-4 w-4" />
            <span>Conductor</span>
          </div>
          <div className="font-medium text-gray-900">{bus.conductorName}</div>
          <div className="text-sm text-gray-500">+91 {bus.conductorPhone}</div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Buses Management" onLogout={onLogout}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Buses</p>
                <p className="text-2xl font-bold text-gray-900">{buses.length}</p>
              </div>
              <Bus className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Buses</p>
                <p className="text-2xl font-bold text-green-600">
                  {buses.filter(b => b.status === 'active').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {buses.filter(b => b.status === 'maintenance').length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Capacity</p>
                <p className="text-2xl font-bold text-blue-600">
                  {buses.reduce((sum, b) => sum + b.capacity, 0)}
                </p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Header and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Buses ({filteredBuses.length})</h2>
              <p className="text-gray-600">Manage your bus fleet</p>
            </div>
            <button
              onClick={handleAddBus}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Bus</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by bus number, driver, or conductor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.map(bus => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </div>

        {filteredBuses.length === 0 && (
          <div className="text-center py-12">
            <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Add/Edit Bus Modal */}
        {showAddBus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingBus ? 'Edit Bus' : 'Add New Bus'}
                  </h3>
                  <button
                    onClick={() => setShowAddBus(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Bus Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bus Number *
                      </label>
                      <input
                        type="text"
                        value={busForm.number}
                        onChange={(e) => setBusForm(prev => ({ ...prev, number: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="UK05 AB 3265"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bus Model
                      </label>
                      <input
                        type="text"
                        value={busForm.model}
                        onChange={(e) => setBusForm(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="Tata Starbus"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity
                      </label>
                      <input
                        type="number"
                        value={busForm.capacity}
                        onChange={(e) => setBusForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={busForm.status}
                        onChange={(e) => setBusForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Date
                      </label>
                      <input
                        type="date"
                        value={busForm.registrationDate}
                        onChange={(e) => setBusForm(prev => ({ ...prev, registrationDate: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Route
                    </label>
                    <select
                      value={busForm.routeId}
                      onChange={(e) => setBusForm(prev => ({ ...prev, routeId: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    >
                      <option value="">Select a route</option>
                      {routes.map(route => (
                        <option key={route.id} value={route.id}>{route.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Driver Details */}
                  <div className="border-t pt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Driver Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driver Name *
                        </label>
                        <input
                          type="text"
                          value={busForm.driverName}
                          onChange={(e) => setBusForm(prev => ({ ...prev, driverName: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          placeholder="Enter driver name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driver Phone *
                        </label>
                        <input
                          type="tel"
                          value={busForm.driverPhone}
                          onChange={(e) => setBusForm(prev => ({ ...prev, driverPhone: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Conductor Details */}
                  <div className="border-t pt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Conductor Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conductor Name *
                        </label>
                        <input
                          type="text"
                          value={busForm.conductorName}
                          onChange={(e) => setBusForm(prev => ({ ...prev, conductorName: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          placeholder="Enter conductor name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conductor Phone *
                        </label>
                        <input
                          type="tel"
                          value={busForm.conductorPhone}
                          onChange={(e) => setBusForm(prev => ({ ...prev, conductorPhone: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t">
                    <button
                      onClick={() => setShowAddBus(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBus}
                      disabled={!busForm.number || !busForm.driverName || !busForm.conductorName}
                      className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingBus ? 'Update Bus' : 'Add Bus'}</span>
                    </button>
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

export default AdminBuses;