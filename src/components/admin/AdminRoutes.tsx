import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Route as RouteIcon, 
  Clock,
  IndianRupee,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { busRoutes, busStops } from '../../data/busData';

interface AdminRoutesProps {
  onLogout: () => void;
}

interface RouteFormData {
  id: string;
  name: string;
  color: string;
  fare: number;
  frequency: number;
  stops: string[];
}

interface StopFormData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timing: string;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ onLogout }) => {
  const [routes, setRoutes] = useState(busRoutes);
  const [stops, setStops] = useState(busStops);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [routeForm, setRouteForm] = useState<RouteFormData>({
    id: '',
    name: '',
    color: '#8B5CF6',
    fare: 0,
    frequency: 15,
    stops: []
  });
  const [newStop, setNewStop] = useState<StopFormData>({
    id: '',
    name: '',
    lat: 0,
    lng: 0,
    timing: ''
  });
  const [showAddStop, setShowAddStop] = useState(false);

  const resetForm = () => {
    setRouteForm({
      id: '',
      name: '',
      color: '#8B5CF6',
      fare: 0,
      frequency: 15,
      stops: []
    });
    setNewStop({
      id: '',
      name: '',
      lat: 0,
      lng: 0,
      timing: ''
    });
  };

  const handleAddRoute = () => {
    setShowAddRoute(true);
    setEditingRoute(null);
    resetForm();
  };

  const handleEditRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      setRouteForm({
        id: route.id,
        name: route.name,
        color: route.color,
        fare: route.fare,
        frequency: route.frequency,
        stops: [...route.stops]
      });
      setEditingRoute(routeId);
      setShowAddRoute(true);
    }
  };

  const handleSaveRoute = () => {
    if (!routeForm.name || routeForm.stops.length < 2) {
      alert('Please fill all required fields and add at least 2 stops');
      return;
    }

    const newRoute = {
      id: routeForm.id || `R${Date.now()}`,
      name: routeForm.name,
      color: routeForm.color,
      fare: routeForm.fare,
      frequency: routeForm.frequency,
      stops: routeForm.stops
    };

    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute ? newRoute : r));
    } else {
      setRoutes([...routes, newRoute]);
    }

    setShowAddRoute(false);
    setEditingRoute(null);
    resetForm();
  };

  const handleDeleteRoute = (routeId: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(r => r.id !== routeId));
    }
  };

  const handleAddStopToRoute = () => {
    if (!newStop.name || !newStop.id) {
      alert('Please fill all stop details');
      return;
    }

    // Add stop to global stops if it doesn't exist
    const existingStop = stops.find(s => s.id === newStop.id);
    if (!existingStop) {
      const stopToAdd = {
        id: newStop.id,
        name: newStop.name,
        location: { lat: newStop.lat, lng: newStop.lng },
        routes: [routeForm.id],
        amenities: ['shelter']
      };
      setStops([...stops, stopToAdd]);
    }

    // Add stop to route
    setRouteForm(prev => ({
      ...prev,
      stops: [...prev.stops, newStop.id]
    }));

    setNewStop({
      id: '',
      name: '',
      lat: 0,
      lng: 0,
      timing: ''
    });
    setShowAddStop(false);
  };

  const handleRemoveStopFromRoute = (stopId: string) => {
    setRouteForm(prev => ({
      ...prev,
      stops: prev.stops.filter(s => s !== stopId)
    }));
  };

  const getStopName = (stopId: string) => {
    return stops.find(stop => stop.id === stopId)?.name || stopId;
  };

  const RouteCard: React.FC<{ route: any }> = ({ route }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: route.color }}
            />
            <h3 className="text-lg font-bold text-gray-900">{route.name}</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <IndianRupee className="h-4 w-4" />
              <span>₹{route.fare}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Every {route.frequency} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{route.stops.length} stops</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedRoute(route.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <RouteIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditRoute(route.id)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Edit Route"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteRoute(route.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Route"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        {getStopName(route.stops[0])} → {getStopName(route.stops[route.stops.length - 1])}
      </div>
    </div>
  );

  // Route Detail View
  if (selectedRoute) {
    const route = routes.find(r => r.id === selectedRoute);
    if (!route) return null;

    return (
      <AdminLayout title={`Route Details - ${route.name}`} onLogout={onLogout}>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedRoute(null)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Route Details</h2>
          </div>

          {/* Route Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">₹{route.fare}</div>
                <div className="text-sm text-gray-500">Fare</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{route.frequency} min</div>
                <div className="text-sm text-gray-500">Frequency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{route.stops.length}</div>
                <div className="text-sm text-gray-500">Total Stops</div>
              </div>
              <div className="text-center">
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: route.color }}
                />
                <div className="text-sm text-gray-500">Route Color</div>
              </div>
            </div>
          </div>

          {/* Stops List */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Stops</h3>
            <div className="space-y-4">
              {route.stops.map((stopId, index) => (
                <div key={stopId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 || index === route.stops.length - 1 
                        ? 'bg-purple-600' 
                        : 'bg-gray-300'
                    }`} />
                    {index < route.stops.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{getStopName(stopId)}</div>
                    <div className="text-sm text-gray-500">Stop {index + 1} of {route.stops.length}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => handleEditRoute(route.id)}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Route</span>
            </button>
            <button
              onClick={() => handleDeleteRoute(route.id)}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Route</span>
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Routes Management" onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Routes ({routes.length})</h2>
            <p className="text-gray-600">Manage bus routes and stops</p>
          </div>
          <button
            onClick={handleAddRoute}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Route</span>
          </button>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map(route => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>

        {/* Add/Edit Route Modal */}
        {showAddRoute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingRoute ? 'Edit Route' : 'Add New Route'}
                  </h3>
                  <button
                    onClick={() => setShowAddRoute(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Route Name *
                      </label>
                      <input
                        type="text"
                        value={routeForm.name}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="Enter route name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Route Color
                      </label>
                      <input
                        type="color"
                        value={routeForm.color}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fare (₹) *
                      </label>
                      <input
                        type="number"
                        value={routeForm.fare}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, fare: Number(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="Enter fare amount"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency (minutes) *
                      </label>
                      <input
                        type="number"
                        value={routeForm.frequency}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, frequency: Number(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="Enter frequency"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Stops Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-gray-900">
                        Route Stops ({routeForm.stops.length})
                      </h4>
                      <button
                        onClick={() => setShowAddStop(true)}
                        className="hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Stop</span>
                      </button>
                    </div>

                    {routeForm.stops.length < 2 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                        <p className="text-yellow-800 text-sm">
                          ⚠️ Minimum 2 stops are required for a route
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {routeForm.stops.map((stopId, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium text-gray-500">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {getStopName(stopId)}
                              </div>
                              <div className="text-sm text-gray-500">Stop ID: {stopId}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveStopFromRoute(stopId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t">
                    <button
                      onClick={() => setShowAddRoute(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveRoute}
                      disabled={!routeForm.name || routeForm.stops.length < 2}
                      className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingRoute ? 'Update Route' : 'Create Route'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Stop Modal */}
        {showAddStop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add Stop</h3>
                  <button
                    onClick={() => setShowAddStop(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stop ID *
                    </label>
                    <input
                      type="text"
                      value={newStop.id}
                      onChange={(e) => setNewStop(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="e.g., new-stop-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stop Name *
                    </label>
                    <input
                      type="text"
                      value={newStop.name}
                      onChange={(e) => setNewStop(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="Enter stop name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newStop.lat}
                        onChange={(e) => setNewStop(prev => ({ ...prev, lat: Number(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="30.3165"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newStop.lng}
                        onChange={(e) => setNewStop(prev => ({ ...prev, lng: Number(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="78.0322"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => setShowAddStop(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddStopToRoute}
                      disabled={!newStop.name || !newStop.id}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Stop
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

export default AdminRoutes;