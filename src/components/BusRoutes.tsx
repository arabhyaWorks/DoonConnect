import React, { useState } from 'react';
import { Search, Route, MapPin, Clock, IndianRupee, ArrowLeft, Users, Ticket } from 'lucide-react';
import { BusRoute, BusStop, LiveBus } from '../types';
import BookingFlow from './BookingFlow';

interface BusRoutesProps {
  routes: BusRoute[];
  stops: BusStop[];
  liveBuses?: LiveBus[];
  onBookingStart?: () => void;
  onBookingEnd?: () => void;
}

const BusRoutes: React.FC<BusRoutesProps> = ({ routes, stops, liveBuses = [], onBookingStart, onBookingEnd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  const getStopName = (stopId: string) => {
    return stops.find(stop => stop.id === stopId)?.name || stopId;
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.stops.some(stopId => 
      getStopName(stopId).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getCurrentBusLocation = (routeId: string) => {
    const bus = liveBuses.find(bus => bus.routeId === routeId);
    return bus ? getStopName(bus.currentStop) : null;
  };

  const getStopTiming = (stopIndex: number, frequency: number) => {
    // Calculate estimated timing based on stop position and frequency
    const baseTime = new Date();
    baseTime.setHours(6, 0, 0, 0); // Start at 6:00 AM
    
    const timings = [];
    for (let i = 0; i < 12; i++) { // Show 12 timings throughout the day
      const time = new Date(baseTime.getTime() + (i * frequency + stopIndex * 2) * 60000);
      timings.push(time.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }));
    }
    return timings;
  };

  const RouteCard: React.FC<{ route: BusRoute }> = ({ route }) => (
    <div 
      className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
      onClick={() => setSelectedRoute(route)}
    >
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
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <MapPin className="h-4 w-4 flex-shrink-0" />
        <span>{route.stops.length} stops • {getStopName(route.stops[0])} → {getStopName(route.stops[route.stops.length - 1])}</span>
      </div>
    </div>
  );

  const RouteDetail: React.FC<{ route: BusRoute }> = ({ route }) => {
    const currentBusLocation = getCurrentBusLocation(route.id);
    
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-16 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: route.color }}
              />
              <h1 className="text-xl font-bold text-gray-900">{route.name}</h1>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 p-3 rounded-xl text-center">
                <div className="text-lg font-bold text-purple-900">₹{route.fare}</div>
                <div className="text-xs text-purple-600">Full Route</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-center">
                <div className="text-lg font-bold text-blue-900">{route.frequency} min</div>
                <div className="text-xs text-blue-600">Frequency</div>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-center">
                <div className="text-lg font-bold text-green-900">{route.stops.length}</div>
                <div className="text-xs text-green-600">Total Stops</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Current Bus Location */}
          {currentBusLocation && (
            <div className="bg-green-100 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">
                  Bus currently at: {currentBusLocation}
                </span>
              </div>
            </div>
          )}

          {/* Route Stops with Timings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Route className="h-5 w-5 mr-2 text-purple-500" />
              Route Stops & Timings
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {route.stops.map((stopId, index) => {
                const stop = stops.find(s => s.id === stopId);
                const timings = getStopTiming(index, route.frequency);
                const isCurrentLocation = currentBusLocation === getStopName(stopId);
                
                return (
                  <div key={stopId} className={`flex items-start space-x-4 p-3 rounded-xl ${
                    isCurrentLocation ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 || index === route.stops.length - 1 
                          ? 'bg-purple-600' 
                          : isCurrentLocation
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`} />
                      {index < route.stops.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-medium ${isCurrentLocation ? 'text-green-800' : 'text-gray-900'}`}>
                            {getStopName(stopId)}
                            {isCurrentLocation && (
                              <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                Current Location
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">Stop {index + 1} of {route.stops.length}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            Next: {timings[0]}
                          </div>
                          <div className="text-xs text-gray-500">
                            Then: {timings[1]}, {timings[2]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Bus Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Live Bus Information
            </h2>
            
            {liveBuses.filter(bus => bus.routeId === route.id).map(bus => (
              <div key={bus.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl mb-3">
                <div>
                  <div className="font-medium text-gray-900">Bus #{bus.id}</div>
                  <div className="text-sm text-gray-600">
                    Currently at {getStopName(bus.currentStop)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Next stop: {getStopName(bus.nextStop)} in {bus.estimatedArrival} min
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm px-3 py-1 rounded-full ${
                    bus.occupancy === 'low' ? 'bg-green-100 text-green-800' :
                    bus.occupancy === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {bus.occupancy} occupancy
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Ticket Button */}
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-10">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => setShowBookingFlow(true)}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Ticket className="h-6 w-6" />
              <span>Book Ticket - ₹{route.fare}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If booking flow is active, show it
  if (showBookingFlow && selectedRoute) {
    onBookingStart?.();
    return (
      <BookingFlow
        route={selectedRoute}
        stops={stops}
        onBack={() => {
          setShowBookingFlow(false);
          onBookingEnd?.();
        }}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      {!selectedRoute ? (
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <Route className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Bus Routes</h1>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search routes or stops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
              />
            </div>

            <div className="pb-20 md:pb-6">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map(route => (
                  <RouteCard key={route.id} route={route} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Route className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Routes Found</h3>
                  <p className="text-gray-500">Try searching with different keywords</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <RouteDetail route={selectedRoute} />
      )}
    </div>
  );
};

export default BusRoutes;