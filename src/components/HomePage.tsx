import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, ArrowRight } from 'lucide-react';
import BusStop from './BusStop';
import BookingFlow from './BookingFlow';
import { UserLocation, BusStop as BusStopType, LiveBus, BusRoute } from '../types';

interface HomePageProps {
  userLocation: UserLocation | null;
  onLocationModalOpen: () => void;
  stops: BusStopType[];
  liveBuses: LiveBus[];
  routes: BusRoute[];
  onSeeAllRoutes: () => void;
  onBookingStart?: () => void;
  onBookingEnd?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  userLocation, 
  onLocationModalOpen, 
  stops, 
  liveBuses, 
  routes,
  onSeeAllRoutes,
  onBookingStart,
  onBookingEnd
}) => {
  const [nearbyStops, setNearbyStops] = useState<(BusStopType & { distance: number })[]>([]);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [selectedStop, setSelectedStop] = useState<BusStopType | null>(null);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Math.round(R * c);
  };

  useEffect(() => {
    if (userLocation) {
      const stopsWithDistance = stops
        .map(stop => ({
          ...stop,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            stop.location.lat,
            stop.location.lng
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3); // Show 3 nearest stops

      setNearbyStops(stopsWithDistance);
    }
  }, [userLocation, stops]);

  const handleBookingStart = () => {
    // Get route and stop data from session storage
    const routeData = sessionStorage.getItem('selectedRoute');
    const stopData = sessionStorage.getItem('selectedStop');
    
    if (routeData && stopData) {
      setSelectedRoute(JSON.parse(routeData));
      setSelectedStop(JSON.parse(stopData));
      setShowBookingFlow(true);
      onBookingStart?.();
    }
  };

  const handleBookingEnd = () => {
    setShowBookingFlow(false);
    setSelectedRoute(null);
    setSelectedStop(null);
    sessionStorage.removeItem('selectedRoute');
    sessionStorage.removeItem('selectedStop');
    onBookingEnd?.();
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // If booking flow is active, show it as full screen
  if (showBookingFlow && selectedRoute) {
    return (
      <BookingFlow
        route={selectedRoute}
        stops={stops}
        onBack={handleBookingEnd}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to DoonConnect</h1>
            <p className="text-purple-200">Smart City Bus Service for Dehradoon</p>
          </div>

          {/* Location Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-purple-200" />
                <div>
                  <div className="text-sm text-purple-200">Current Location</div>
                  <div className="font-medium">
                    {userLocation ? userLocation.address : 'Select your location'}
                  </div>
                </div>
              </div>
              <button
                onClick={onLocationModalOpen}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span className="text-sm font-medium">Change</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Nearby Stops */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {userLocation ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Nearby Bus Stops
              </h2>
              <button 
                onClick={onSeeAllRoutes}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <span className="text-sm font-medium">See All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {nearbyStops.length > 0 ? (
              <div className="space-y-4">
                {nearbyStops.map(stop => (
                  <BusStop
                    key={stop.id}
                    stop={stop}
                    distance={formatDistance(stop.distance)}
                    liveBuses={liveBuses}
                    routes={routes}
                    onBookingStart={handleBookingStart}
                    onBookingEnd={handleBookingEnd}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No nearby bus stops found</h3>
                <p className="text-gray-500">Try selecting a different location</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <Navigation className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your Location</h3>
              <p className="text-gray-500 mb-6">
                To find nearby bus stops and real-time arrivals, please select your location first.
              </p>
              <button
                onClick={onLocationModalOpen}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
              >
                Choose Location
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mx-auto px-4 pb-20 md:pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{routes.length}</div>
            <div className="text-sm text-gray-500">Routes</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stops.length}</div>
            <div className="text-sm text-gray-500">Stops</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{liveBuses.length}</div>
            <div className="text-sm text-gray-500">Live Buses</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-500">Service</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;