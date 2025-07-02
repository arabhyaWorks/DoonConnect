import React, { useState } from 'react';
import { ArrowLeft, Maximize2, Search, Route, MapPin, Clock, IndianRupee } from 'lucide-react';
import { BusRoute, BusStop } from '../types';
import BookingFlow from './BookingFlow';

interface RoutesPageProps {
  routes: BusRoute[];
  stops: BusStop[];
  onBack: () => void;
  onBookingStart?: () => void;
  onBookingEnd?: () => void;
}

const RoutesPage: React.FC<RoutesPageProps> = ({ routes, stops, onBack, onBookingStart, onBookingEnd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
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

  const openFullMap = () => {
    setIsMapExpanded(true);
  };

  const closeFullMap = () => {
    setIsMapExpanded(false);
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
      <div className="flex items-center justify-between">
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
              <span>{route.fare}</span>
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
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 md:top-16 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">{route.name}</h1>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-purple-50 p-3 md:p-4 rounded-xl text-center">
                <div className="text-lg md:text-xl font-bold text-purple-900">₹{route.fare}</div>
                <div className="text-xs md:text-sm text-purple-600">Full Route</div>
              </div>
              <div className="bg-blue-50 p-3 md:p-4 rounded-xl text-center">
                <div className="text-lg md:text-xl font-bold text-blue-900">{route.frequency} min</div>
                <div className="text-xs md:text-sm text-blue-600">Frequency</div>
              </div>
              <div className="bg-green-50 p-3 md:p-4 rounded-xl text-center">
                <div className="text-lg md:text-xl font-bold text-green-900">{route.stops.length}</div>
                <div className="text-xs md:text-sm text-green-600">Total Stops</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-6">
          {/* Route Stops with Timings */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Route className="h-5 w-5 mr-2 text-purple-500" />
              Route Stops & Timings
            </h2>
            
            <div className="space-y-3 md:space-y-4 max-h-[60vh] md:max-h-96 overflow-y-auto">
              {route.stops.map((stopId, index) => {
                const timings = getStopTiming(index, route.frequency);
                
                return (
                  <div key={stopId} className="flex items-start space-x-3 md:space-x-4 px-3 md:px-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 || index === route.stops.length - 1 
                          ? 'bg-purple-600' 
                          : 'bg-gray-300'
                      }`} />
                      {index < route.stops.length - 1 && (
                        <div className="w-0.5 h-16 md:h-12 bg-gray-200" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm md:text-base">
                            {getStopName(stopId)}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500">Stop {index + 1} of {route.stops.length}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm md:text-base font-medium text-gray-900">
                            Next: {timings[0]}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500">
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
        </div>

        {/* Book Ticket Button */}
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-20">
          <div className="max-w-6xl mx-auto">
            <button 
              onClick={() => setShowBookingFlow(true)}
              className="w-full bg-purple-600 text-white py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
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

  // If a route is selected, show the detailed route view directly
  if (selectedRoute) {
    return <RouteDetail route={selectedRoute} />;
  }

  if (isMapExpanded) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="h-full flex flex-col">
          <div className="bg-purple-600 text-white p-4 flex items-center ">
            <button
              onClick={closeFullMap}
              className="flex  space-x-2 hover:bg-purple-700 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />

            </button>
            <h1 className="text-lg font-semibold">Route Map</h1>
            <div className="w-20"></div>
          </div>
          <div className="flex-1 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55945.16225505631!2d77.99373!3d30.32!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888af%3A0x4c3562c032518799!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dehradun Bus Routes Map"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      {/* Map Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-3 mb-6">
          <Route className="h-6 w-6 text-purple-600" />
          <h1 className="text-xl font-bold text-gray-900">All Routes</h1>
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
        
        {!searchQuery && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Route Map</h2>
              <button
                onClick={openFullMap}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Maximize2 className="h-4 w-4" />
                <span className="text-sm font-medium">Full Screen</span>
              </button>
            </div>
            <div className="relative h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55945.16225505631!2d77.99373!3d30.32!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888af%3A0x4c3562c032518799!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dehradun Bus Routes Map"
              />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Routes ({filteredRoutes.length})
          </h2>
          {filteredRoutes.length > 0 ? (
            <div className="space-y-4 pb-20 md:pb-6">
              {filteredRoutes.map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
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
  );
};

export default RoutesPage;

