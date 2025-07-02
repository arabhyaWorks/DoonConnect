import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LocationModal from './components/LocationModal';
import HomePage from './components/HomePage';
import BusRoutes from './components/BusRoutes';
import RoutesPage from './components/RoutesPage';
import TicketManager from './components/TicketManager';
import BottomNavigation from './components/BottomNavigation';
import ProfilePage from './components/ProfilePage';
import AdminPortal from './components/admin/AdminPortal';
import { UserLocation } from './types';
import { busStops, busRoutes, liveBuses, sampleTickets } from './data/busData';

function App() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoutesPage, setShowRoutesPage] = useState(false);
  const [isBookingFlowActive, setIsBookingFlowActive] = useState(false);

  // Check if current path is admin
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  // If admin route, show admin portal
  if (isAdminRoute) {
    return <AdminPortal />;
  }

  useEffect(() => {
    // Simulate real-time bus updates
    const interval = setInterval(() => {
      // In a real app, this would fetch live data from an API
      liveBuses.forEach(bus => {
        bus.estimatedArrival = Math.max(0, bus.estimatedArrival - 1);
        if (bus.estimatedArrival === 0) {
          bus.estimatedArrival = Math.floor(Math.random() * 15) + 5;
        }
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleLocationSelect = (location: UserLocation) => {
    setUserLocation(location);
    setIsLocationModalOpen(false);
  };

  const renderContent = () => {
    if (showRoutesPage) {
      return (
        <RoutesPage
          routes={busRoutes}
          stops={busStops}
          onBack={() => {
            setShowRoutesPage(false);
            setActiveTab('home');
            setIsBookingFlowActive(false);
          }}
          onBookingStart={() => setIsBookingFlowActive(true)}
          onBookingEnd={() => setIsBookingFlowActive(false)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            userLocation={userLocation}
            onLocationModalOpen={() => setIsLocationModalOpen(true)}
            stops={busStops}
            liveBuses={liveBuses}
            routes={busRoutes}
            onSeeAllRoutes={() => setShowRoutesPage(true)}
            onBookingStart={() => setIsBookingFlowActive(true)}
            onBookingEnd={() => setIsBookingFlowActive(false)}
          />
        );
      case 'routes':
        return <BusRoutes routes={busRoutes} stops={busStops} liveBuses={liveBuses} />;
      case 'tickets':
        return (
          <TicketManager 
            routes={busRoutes} 
            stops={busStops} 
          />
        );
      case 'profile':
        return <ProfilePage />;
      case 'help':
        return (
          <div className="bg-gray-50 min-h-screen p-4">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h1>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">How to use DoonConnect</h2>
                <div className="space-y-4 text-gray-600">
                  <p>1. Select your location to find nearby bus stops</p>
                  <p>2. View real-time bus arrivals and occupancy</p>
                  <p>3. Browse all available routes and their schedules</p>
                  <p>4. Purchase and manage your bus tickets</p>
                  <p>5. Get live updates on bus delays and route changes</p>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-2">Need more help?</h3>
                  <p className="text-gray-600">Contact us at support@doonconnect.in or call 1800-DOON-BUS</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'routes') {
      setShowRoutesPage(true);
    } else {
      setShowRoutesPage(false);
    }
  };

  const shouldShowHeader = !isBookingFlowActive && activeTab !== 'profile' && !showRoutesPage && activeTab !== 'tickets';

  return (
    <div className={`min-h-screen bg-gray-50 ${shouldShowHeader ? 'pt-16' : ''} overflow-x-hidden`}>
      {shouldShowHeader && (
        <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      )}
      
      {/* Desktop Sidebar */}
      {shouldShowHeader && (
        <div className="hidden md:flex">
        <nav className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)] fixed left-0 top-16 pt-6 z-30 transform-none">
          <div className="px-4 space-y-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'routes', label: 'Routes' },
              { id: 'tickets', label: 'Tickets' },
              { id: 'help', label: 'Help' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => handleTabChange('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'profile'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Profile
            </button>
          </div>
        </nav>
        <main className="ml-64 w-full min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
        </div>
      )}

      {/* Mobile Content */}
      <div className={shouldShowHeader ? 'md:hidden' : ''}>
        {renderContent()}
      </div>

      {/* Mobile Bottom Navigation */}
      {!isBookingFlowActive && activeTab !== 'profile' && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Profile Page Bottom Navigation */}
      {activeTab === 'profile' && !isBookingFlowActive && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}

export default App;