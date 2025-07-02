import React, { useState, useEffect } from 'react';
import { User, Edit3, MapPin, Heart, FileText, Shield, LogOut, Save, X, ChevronRight, Bus, Ticket, Star } from 'lucide-react';
import AuthFlow from './AuthFlow';

interface UserData {
  name: string;
  phone: string;
  email?: string;
}

interface ProfilePageProps {
  onBack?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('doonconnect_user');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setIsAuthenticated(true);
        setEditForm({
          name: parsedData.name || '',
          email: parsedData.email || ''
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('doonconnect_user');
      }
    }
  }, []);

  const handleAuthComplete = (authUserData: UserData) => {
    setUserData(authUserData);
    setIsAuthenticated(true);
    localStorage.setItem('doonconnect_user', JSON.stringify(authUserData));
    setEditForm({
      name: authUserData.name || '',
      email: authUserData.email || ''
    });
  };

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      alert('Please enter your name');
      return;
    }

    const updatedUserData = {
      ...userData!,
      name: editForm.name.trim(),
      email: editForm.email.trim()
    };

    setUserData(updatedUserData);
    localStorage.setItem('doonconnect_user', JSON.stringify(updatedUserData));
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('doonconnect_user');
    localStorage.removeItem('doonconnect_tickets');
    setUserData(null);
    setIsAuthenticated(false);
    setShowLogoutConfirm(false);
  };

  const isProfileComplete = userData?.name && userData?.name !== 'User';

  // If not authenticated, show auth flow
  if (!isAuthenticated) {
    return (
      <AuthFlow
        onAuthComplete={handleAuthComplete}
        onBack={onBack || (() => {})}
      />
    );
  }

  // Profile completion prompt
  if (!isProfileComplete && !isEditingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-purple-600 text-white p-4 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-center">Complete Your Profile</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DoonConnect!</h2>
              <p className="text-gray-600">
                Please complete your profile to get personalized experience
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Why do we need this?</p>
                      <p>Your name helps us personalize your tickets and provide better customer service.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={!editForm.name.trim()}
              className="w-full bg-purple-600 text-white py-4 mb-4 rounded-2xl font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-purple-700"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main profile page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">My Profile</h1>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{userData?.name}</h2>
              <p className="text-purple-200">+91 {userData?.phone}</p>
              {userData?.email && (
                <p className="text-purple-200 text-sm">{userData.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {JSON.parse(localStorage.getItem('doonconnect_tickets') || '[]').length}
            </div>
            <div className="text-sm text-gray-500">Total Trips</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {JSON.parse(localStorage.getItem('doonconnect_tickets') || '[]').filter((t: any) => t.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500">Active Tickets</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-500">Saved Routes</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {/* My Trips */}
          <div className="bg-white rounded-2xl shadow-sm">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bus className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">My Trips</div>
                  <div className="text-sm text-gray-500">View your travel history</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Favorite Stops */}
          <div className="bg-white rounded-2xl shadow-sm">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Favorite Stops</div>
                  <div className="text-sm text-gray-500">Quick access to frequent stops</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Saved Routes */}
          <div className="bg-white rounded-2xl shadow-sm">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Saved Routes</div>
                  <div className="text-sm text-gray-500">Your bookmarked routes</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Rate App */}
          <div className="bg-white rounded-2xl shadow-sm">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Rate DoonConnect</div>
                  <div className="text-sm text-gray-500">Help us improve our service</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          {/* Terms and Conditions */}
          <div className="bg-white rounded-2xl shadow-sm">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Terms & Conditions</div>
                  <div className="text-sm text-gray-500">Read our terms of service</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Privacy Policy */}
          <div className="bg-white rounded-2xl shadow-sm">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Privacy Policy</div>
                  <div className="text-sm text-gray-500">How we protect your data</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Logout */}
          <div className="bg-white rounded-2xl shadow-sm">
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-red-600">Logout</div>
                  <div className="text-sm text-red-400">Sign out of your account</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">DoonConnect v1.0.0</p>
          <p className="text-xs text-gray-400">Smart City Bus Service for Dehradun</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={`+91 ${userData?.phone}`}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={!editForm.name.trim()}
                  className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? This will clear all your local data including tickets.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;