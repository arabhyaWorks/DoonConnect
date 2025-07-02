import React, { useState } from 'react';
import { MapPin, Search, X, Navigation } from 'lucide-react';
import { UserLocation } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: UserLocation) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const popularLocations = [
    { name: 'Clock Tower', address: 'Clock Tower, Dehradun', lat: 30.3165, lng: 78.0322 },
    { name: 'ISBT Dehradun', address: 'Inter State Bus Terminal, Dehradun', lat: 30.3398, lng: 78.0664 },
    { name: 'Railway Station', address: 'Dehradun Railway Station', lat: 30.3142, lng: 78.0347 },
    { name: 'Rajpur Road', address: 'Rajpur Road, Dehradun', lat: 30.3293, lng: 78.0428 },
    { name: 'Forest Research Institute', address: 'FRI, Dehradun', lat: 30.3350, lng: 77.9999 },
    { name: 'IT Park', address: 'IT Park Sahastradhara Road', lat: 30.3612, lng: 78.0156 }
  ];

  const handleLocationDetect = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use reverse geocoding to get a readable address
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // For now, we'll use a simple approach to determine location name
          // In a real app, you'd use a geocoding service like Google Maps API
          const getLocationName = (lat: number, lng: number) => {
            // Check if coordinates are near known locations in Dehradun
            const knownLocations = [
              { name: 'Clock Tower Area', lat: 30.3165, lng: 78.0322, radius: 0.5 },
              { name: 'ISBT Area', lat: 30.3398, lng: 78.0664, radius: 0.5 },
              { name: 'Railway Station Area', lat: 30.3142, lng: 78.0347, radius: 0.5 },
              { name: 'Rajpur Road Area', lat: 30.3293, lng: 78.0428, radius: 0.5 },
              { name: 'Sahastradhara Area', lat: 30.3734, lng: 78.0199, radius: 0.5 },
              { name: 'IT Park Area', lat: 30.3612, lng: 78.0156, radius: 0.5 }
            ];
            
            for (const location of knownLocations) {
              const distance = Math.sqrt(
                Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2)
              );
              if (distance <= location.radius / 111) { // Rough conversion to degrees
                return location.name;
              }
            }
            
            // Default to a general Dehradun location
            return 'Your Location, Dehradun';
          };
          
          const location: UserLocation = {
            lat: lat,
            lng: lng,
            address: getLocationName(lat, lng)
          };
          onLocationSelect(location);
          setIsDetecting(false);
          onClose();
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsDetecting(false);
          // Fallback to Clock Tower
          onLocationSelect({
            lat: 30.3165,
            lng: 78.0322,
            address: 'Clock Tower Area (Default)'
          });
          onClose();
        }
      );
    } else {
      setIsDetecting(false);
      onLocationSelect({
        lat: 30.3165,
        lng: 78.0322,
        address: 'Clock Tower Area (Default)'
      });
      onClose();
    }
  };

  const handleLocationSelect = (location: { name: string; address: string; lat: number; lng: number }) => {
    onLocationSelect({
      lat: location.lat,
      lng: location.lng,
      address: location.address
    });
    onClose();
  };

  const filteredLocations = popularLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Select Your Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          
          <button
            onClick={handleLocationDetect}
            disabled={isDetecting}
            className="w-full flex items-center justify-center space-x-3 p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors mb-6 disabled:opacity-50"
          >
            <Navigation className={`h-5 w-5 ${isDetecting ? 'animate-pulse' : ''}`} />
            <span>{isDetecting ? 'Detecting Location...' : 'Use Current Location'}</span>
          </button>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Popular Locations</h3>
            {filteredLocations.map((location) => (
              <button
                key={location.address}
                onClick={() => handleLocationSelect(location)}
                className="w-full text-left p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.address}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;