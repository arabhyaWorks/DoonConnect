import React, { useState } from 'react';
import { MapPin, Clock, Users, Wifi, Coffee, Home } from 'lucide-react';
import { BusStop as BusStopType, LiveBus, BusRoute } from '../types';

interface BusStopProps {
  stop: BusStopType;
  distance?: string;
  liveBuses: LiveBus[];
  routes: BusRoute[];
  onBookingStart?: () => void;
  onBookingEnd?: () => void;
}

const BusStop: React.FC<BusStopProps> = ({ stop, distance, liveBuses, routes, onBookingStart, onBookingEnd }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'cafe': return <Coffee className="h-4 w-4" />;
      case 'shelter': return <Home className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const upcomingBuses = liveBuses
    .filter(bus => bus.nextStop === stop.id)
    .sort((a, b) => a.estimatedArrival - b.estimatedArrival);

  const stopRoutes = routes.filter(route => stop.routes.includes(route.id));

  const handleRouteSelect = (route: BusRoute, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card expansion
    
    // Store route data for the booking flow
    sessionStorage.setItem('selectedRoute', JSON.stringify(route));
    sessionStorage.setItem('selectedStop', JSON.stringify(stop));
    
    onBookingStart?.();
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-200"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-bold text-gray-900">{stop.name}</h3>
          </div>
          {distance && (
            <p className="text-sm text-gray-500 mb-2">{distance} away</p>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            {stopRoutes.map(route => (
              <button
                key={route.id}
                onClick={(e) => handleRouteSelect(route, e)}
                className="px-3 py-1 text-xs font-medium text-white rounded-full hover:opacity-80 transition-opacity"
                style={{ backgroundColor: route.color }}
              >
                {route.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-32'} overflow-hidden`}>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-purple-500" />
          Upcoming Buses
        </h4>
        {upcomingBuses.length > 0 ? (
          <div className="space-y-3">
            {upcomingBuses.slice(0, 3).map(bus => {
              const route = routes.find(r => r.id === bus.routeId);
              return (
                <div key={bus.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: route?.color || '#8B5CF6' }}
                    />
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {route?.name || 'Unknown Route'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Bus #{bus.id} • {bus.distance} km away
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">
                      {bus.estimatedArrival} min
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getOccupancyColor(bus.occupancy)}`}>
                      <Users className="h-3 w-3" />
                      <span>{bus.occupancy}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Book Ticket Button */}
            {upcomingBuses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Click on any route above to book your ticket
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm mb-3">No buses currently tracked</p>
            {stopRoutes.length > 0 && (
              <p className="text-sm text-purple-600">
                Click on any route above to book your ticket
              </p>
            )}
          </div>
        )}
        
        {isExpanded && upcomingBuses.length > 3 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h5 className="font-medium text-gray-700 mb-2">More Buses</h5>
            <div className="space-y-2">
              {upcomingBuses.slice(3).map(bus => {
                const route = routes.find(r => r.id === bus.routeId);
                return (
                  <div key={bus.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: route?.color || '#8B5CF6' }}
                      />
                      <span className="text-sm text-gray-700">{route?.name || 'Unknown Route'}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">
                        {bus.estimatedArrival} min
                      </div>
                      <div className={`text-xs px-1 py-0.5 rounded ${getOccupancyColor(bus.occupancy)}`}>
                        {bus.occupancy}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Expand/Collapse Indicator */}
      <div className="flex justify-center mt-4">
        <div className={`w-8 h-1 bg-gray-300 rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <div className="w-full h-full bg-purple-500 rounded-full transform transition-all duration-200" 
               style={{ width: isExpanded ? '100%' : '50%' }} />
        </div>
      </div>
    </div>
  );
};

export default BusStop;