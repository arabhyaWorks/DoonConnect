import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, CreditCard, CheckCircle, Ticket as TicketIcon, ChevronDown, QrCode } from 'lucide-react';
import { BusRoute, BusStop, Ticket } from '../types';
import AuthFlow from './AuthFlow';
import PaymentSummary from './PaymentSummary';
import { generateTicketPDF } from '../utils/ticketGenerator';
import QRCode from 'qrcode';

interface BookingFlowProps {
  route: BusRoute;
  stops: BusStop[];
  onBack: () => void;
}

interface UserData {
  name: string;
  phone: string;
}

interface BookingData {
  fromStop: string;
  toStop: string;
  selectedDate: string;
  selectedTime: string;
  selectedSeats: string[];
}

const BookingFlow: React.FC<BookingFlowProps> = ({ route, stops, onBack }) => {
  const [currentStep, setCurrentStep] = useState<'auth' | 'stops' | 'seats' | 'payment' | 'confirmation'>('auth');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<Ticket | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    fromStop: '',
    toStop: '',
    selectedDate: new Date().toISOString().split('T')[0], // Today's date
    selectedTime: '',
    selectedSeats: [],
  });

  // Check if user is logged in on component mount
  React.useEffect(() => {
    const storedUserData = localStorage.getItem('doonconnect_user');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setCurrentStep('stops');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('doonconnect_user');
      }
    }
  }, []);

  const handleAuthComplete = (authUserData: UserData) => {
    setUserData(authUserData);
    localStorage.setItem('doonconnect_user', JSON.stringify(authUserData));
    setCurrentStep('stops');
  };

  const saveTicketToStorage = (ticket: Ticket) => {
    try {
      const existingTickets = JSON.parse(localStorage.getItem('doonconnect_tickets') || '[]');
      const updatedTickets = [ticket, ...existingTickets];
      localStorage.setItem('doonconnect_tickets', JSON.stringify(updatedTickets));
    } catch (error) {
      console.error('Error saving ticket to storage:', error);
    }
  };

  const generateTicketData = () => {
    const ticketId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const qrCodeData = JSON.stringify({
      ticketId,
      route: route.id,
      from: bookingData.fromStop,
      to: bookingData.toStop,
      seats: bookingData.selectedSeats,
      date: bookingData.selectedDate,
      time: bookingData.selectedTime,
      passenger: userData?.phone
    });

    const ticket: Ticket = {
      id: ticketId,
      routeId: route.id,
      fromStop: bookingData.fromStop,
      toStop: bookingData.toStop,
      fare: calculateFare(),
      purchaseTime: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
      status: 'active',
      qrCode: qrCodeData,
      seats: bookingData.selectedSeats,
      passengerName: userData?.name || 'User',
      passengerPhone: userData?.phone || ''
    };

    return { ticket, qrCodeData };
  };

  const getStopName = (stopId: string) => {
    return stops.find(stop => stop.id === stopId)?.name || stopId;
  };

  const routeStops = route.stops.map(stopId => ({
    id: stopId,
    name: getStopName(stopId)
  }));

  const calculateFare = () => {
    const fromIndex = route.stops.indexOf(bookingData.fromStop);
    const toIndex = route.stops.indexOf(bookingData.toStop);
    const distance = Math.abs(toIndex - fromIndex);
    return Math.max(10, Math.floor(route.fare * (distance / route.stops.length))) * bookingData.selectedSeats.length;
  };

  const handleDownloadTicket = async () => {
    if (!generatedTicket) return;

    const ticketData = {
      ticketId: generatedTicket.id,
      routeName: route.name,
      routeColor: route.color,
      fromStop: getStopName(bookingData.fromStop),
      toStop: getStopName(bookingData.toStop),
      seats: bookingData.selectedSeats,
      passengerName: userData?.name || 'Passenger',
      passengerPhone: userData?.phone || '',
      date: new Date(bookingData.selectedDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: new Date(`2000-01-01T${bookingData.selectedTime}`).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      totalAmount: calculateFare(),
      qrCodeData: generatedTicket.qrCode
    };

    try {
      await generateTicketPDF(ticketData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating ticket PDF. Please try again.');
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const selectedDate = new Date(bookingData.selectedDate);
    const isToday = selectedDate.toDateString() === now.toDateString();
    
    // Bus operates from 6:00 AM to 9:00 PM
    const startHour = 6;
    const endHour = 21;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += route.frequency) {
        const timeSlot = new Date();
        timeSlot.setHours(hour, minute, 0, 0);
        
        // If it's today, only show future times
        if (isToday && timeSlot <= now) {
          continue;
        }
        
        const timeString = timeSlot.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        slots.push({
          value: timeSlot.toTimeString().slice(0, 5), // HH:MM format
          label: timeString
        });
      }
    }
    
    return slots;
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  // Auth Step
  const AuthStep = () => (
    <AuthFlow
      onAuthComplete={handleAuthComplete}
      onBack={onBack}
    />
  );

  // Step 1: Stop Selection
  const StopSelection = () => (
    <div className="bg-white min-h-screen">
      <div className="bg-purple-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 bg-purple-700 hover:bg-purple-800 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Select Stops</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }} />
            <h2 className="text-xl font-bold text-gray-900">{route.name}</h2>
          </div>
          <p className="text-gray-600">Select your boarding and destination stops</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">From Stop</label>
            <div className="relative">
              <select
                value={bookingData.fromStop}
                onChange={(e) => setBookingData(prev => ({ ...prev, fromStop: e.target.value, toStop: '' }))}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white pr-12"
              >
                <option value="">Select boarding stop</option>
                {routeStops.map((stop, index) => (
                  <option key={stop.id} value={stop.id}>
                    Stop {index + 1}: {stop.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">To Stop</label>
            <div className="relative">
              <select
                value={bookingData.toStop}
                onChange={(e) => setBookingData(prev => ({ ...prev, toStop: e.target.value }))}
                disabled={!bookingData.fromStop}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white pr-12 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select destination stop</option>
                {routeStops.map((stop, index) => {
                  const fromIndex = route.stops.indexOf(bookingData.fromStop);
                  const isDisabled = !bookingData.fromStop || index <= fromIndex;
                  
                  return (
                    <option key={stop.id} value={stop.id} disabled={isDisabled}>
                      Stop {index + 1}: {stop.name}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Travel Date</label>
            <input
              type="date"
              value={bookingData.selectedDate}
              onChange={(e) => setBookingData(prev => ({ ...prev, selectedDate: e.target.value, selectedTime: '' }))}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Departure Time</label>
            <div className="relative">
              <select
                value={bookingData.selectedTime}
                onChange={(e) => setBookingData(prev => ({ ...prev, selectedTime: e.target.value }))}
                disabled={!bookingData.selectedDate}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white pr-12 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select departure time</option>
                {generateTimeSlots().map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {bookingData.selectedDate && generateTimeSlots().length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                No more buses available for today. Please select a future date.
              </p>
            )}
          </div>

          {bookingData.selectedTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Journey Details</span>
              </div>
              <div className="text-sm text-blue-800">
                <p>Date: {new Date(bookingData.selectedDate).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p>Departure: {new Date(`2000-01-01T${bookingData.selectedTime}`).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}</p>
                <p>Route: {getStopName(bookingData.fromStop)} → {getStopName(bookingData.toStop)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={() => setCurrentStep('seats')}
          disabled={!bookingData.fromStop || !bookingData.toStop || !bookingData.selectedDate || !bookingData.selectedTime}
          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Seat Selection
        </button>
      </div>
    </div>
  );

  // Step 2: Seat Selection
  const SeatSelection = () => {
    const seatLayout = [
      ['1A', '1B', '', '1C', '1D'],
      ['2A', '2B', '', '2C', '2D'],
      ['3A', '3B', '', '3C', '3D'],
      ['4A', '4B', '', '4C', '4D'],
      ['5A', '5B', '', '5C', '5D'],
      ['6A', '6B', '', '6C', '6D'],
      ['7A', '7B', '', '7C', '7D'],
      ['8A', '8B', '', '8C', '8D'],
      ['9A', '9B', '', '9C', '9D'],
      ['10A', '10B', '', '10C', '10D']
    ];

    const occupiedSeats = ['1A', '2C', '3B', '5D', '7A', '8C'];
    const reservedSeats = ['1C', '4A'];

    const toggleSeat = (seatId: string) => {
      if (occupiedSeats.includes(seatId) || reservedSeats.includes(seatId)) return;
      
      setBookingData(prev => ({
        ...prev,
        selectedSeats: prev.selectedSeats.includes(seatId)
          ? prev.selectedSeats.filter(id => id !== seatId)
          : [...prev.selectedSeats, seatId]
      }));
    };

    const getSeatColor = (seatId: string) => {
      if (occupiedSeats.includes(seatId)) return 'bg-red-500 text-white cursor-not-allowed';
      if (reservedSeats.includes(seatId)) return 'bg-yellow-500 text-white cursor-not-allowed';
      if (bookingData.selectedSeats.includes(seatId)) return 'bg-purple-600 text-white';
      return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
    };

    return (
      <div className="bg-white min-h-screen flex flex-col">
        <div className="bg-purple-600 text-white p-4 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentStep('stops')} className="p-2 bg-purple-700 hover:bg-purple-800 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Select Seats</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Seats</h2>
            <div className="text-sm text-gray-600">
              <p>{getStopName(bookingData.fromStop)} → {getStopName(bookingData.toStop)}</p>
              <p>{new Date(bookingData.selectedDate).toLocaleDateString('en-IN')} at {new Date(`2000-01-01T${bookingData.selectedTime}`).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-200 rounded-md border"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-purple-600 rounded-md"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-md"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-yellow-500 rounded-md"></div>
              <span className="text-sm">Reserved</span>
            </div>
          </div>

          {/* Bus Layout */}
          <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 mb-6 shadow-inner">
            {/* Driver Section */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-400 rounded-xl px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-white">Driver</span>
              </div>
            </div>
            
            {/* Seat Layout */}
            <div className="space-y-4 max-w-xs mx-auto">
              {seatLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center items-center space-x-3">
                  {row.map((seat, seatIndex) => (
                    seat ? (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        className={`w-12 h-12 rounded-lg text-xs font-bold transition-all duration-200 transform hover:scale-105 shadow-md border-2 ${getSeatColor(seat)} ${
                          bookingData.selectedSeats.includes(seat) ? 'border-purple-300 shadow-purple-200' : 
                          occupiedSeats.includes(seat) ? 'border-red-300' :
                          reservedSeats.includes(seat) ? 'border-yellow-300' :
                          'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {seat}
                      </button>
                    ) : (
                      <div key={seatIndex} className="w-12 h-12 flex items-center justify-center">
                        <div className="w-8 border-t-2 border-dashed border-gray-400"></div>
                      </div>
                    )
                  ))}
                </div>
              ))}
            </div>
            
            {/* Bus Rear */}
            <div className="mt-6 flex justify-center">
              <div className="w-32 h-3 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {bookingData.selectedSeats.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 mb-6 shadow-sm">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Selected Seats ({bookingData.selectedSeats.length})
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {bookingData.selectedSeats.map(seat => (
                  <span key={seat} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    {seat}
                  </span>
                ))}
              </div>
              <div className="border-t border-purple-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-800 font-medium">Total Amount:</span>
                  <span className="text-xl font-bold text-purple-900">₹{calculateFare()}</span>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <button
            onClick={() => setCurrentStep('payment')}
            disabled={bookingData.selectedSeats.length === 0}
            className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:bg-purple-700 hover:shadow-xl disabled:hover:bg-gray-300 disabled:hover:shadow-none"
          >
            {bookingData.selectedSeats.length > 0 
              ? `Continue with ${bookingData.selectedSeats.length} seat${bookingData.selectedSeats.length !== 1 ? 's' : ''} - ₹${calculateFare()}`
              : 'Select seats to continue'
            }
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Payment Summary
  const PaymentStep = () => (
    <PaymentSummary
      route={route}
      stops={stops}
      bookingData={bookingData}
      userData={userData!}
      onBack={() => setCurrentStep('seats')}
      onPaymentComplete={() => setCurrentStep('confirmation')}
    />
  );

  // Step 4: Confirmation
  const Confirmation = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

    React.useEffect(() => {
      if (!generatedTicket) {
        const { ticket } = generateTicketData();
        setGeneratedTicket(ticket);
        saveTicketToStorage(ticket);
      }
    }, []);

    React.useEffect(() => {
      if (generatedTicket) {
        QRCode.toDataURL(generatedTicket.qrCode, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }).then(setQrCodeUrl).catch(console.error);
      }
    }, [generatedTicket]);

    if (!generatedTicket) return null;

    return (
    <div className="bg-white min-h-screen">
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-semibold">Booking Confirmed</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
          <p className="text-gray-600">Your ticket has been booked successfully</p>
        </div>

        {/* Ticket Details */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-8 text-white mb-6 relative overflow-hidden shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 translate-y-16"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full transform -translate-x-12 -translate-y-12"></div>
          </div>
          
          {/* Decorative border */}
          <div className="absolute inset-4 border-2 border-white/20 rounded-2xl"></div>
          
          <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TicketIcon className="h-6 w-6" />
              <span className="font-bold text-lg">E-Ticket</span>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-75">Ticket ID</div>
              <div className="font-mono font-bold text-sm">#{generatedTicket.id}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-xs opacity-75 mb-1">Route</div>
              <div className="font-bold text-lg">{route.name}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xs opacity-75 mb-1">From</div>
                <div className="font-semibold">{getStopName(bookingData.fromStop)}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xs opacity-75 mb-1">To</div>
                <div className="font-semibold">{getStopName(bookingData.toStop)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xs opacity-75 mb-1">Date & Time</div>
                <div className="font-semibold text-sm">
                  {new Date(bookingData.selectedDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short'
                  })} at {new Date(`2000-01-01T${bookingData.selectedTime}`).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xs opacity-75 mb-1">Seats</div>
                <div className="font-semibold">{generatedTicket.seats?.join(', ')}</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-xs opacity-75 mb-1">Passenger</div>
              <div className="font-semibold">{generatedTicket.passengerName}</div>
              <div className="text-sm opacity-90">+91 {generatedTicket.passengerPhone}</div>
            </div>
            
            <div className="border-t border-white/30 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg opacity-90">Total Paid</span>
                <span className="font-bold text-2xl">₹{generatedTicket.fare}</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* QR Code Section */}
        {qrCodeUrl && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center">
              <QrCode className="h-5 w-5 mr-2 text-purple-600" />
              Show QR Code to Conductor
            </h3>
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-inner border-2 border-gray-200">
                <img src={qrCodeUrl} alt="Ticket QR Code" className="w-56 h-56 rounded-lg" />
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-purple-800 font-medium">
                📱 This QR code contains your ticket information
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Keep it ready for verification during your journey
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4 pb-8">
          <button 
            onClick={handleDownloadTicket}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Ticket PDF</span>
          </button>
          <button 
            onClick={onBack}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'auth': return <AuthStep />;
      case 'stops': return <StopSelection />;
      case 'seats': return <SeatSelection />;
      case 'payment': return <PaymentStep />;
      case 'confirmation': return <Confirmation />;
      default: return <AuthStep />;
    }
  };

  return renderStep();
};

export default BookingFlow;