import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, CreditCard, Wallet, Banknote, AlertTriangle, CheckCircle, QrCode } from 'lucide-react';
import { BusRoute, BusStop } from '../types';

interface PaymentSummaryProps {
  route: BusRoute;
  stops: BusStop[];
  bookingData: {
    fromStop: string;
    toStop: string;
    selectedDate: string;
    selectedTime: string;
    selectedSeats: string[];
  };
  userData: {
    name: string;
    phone: string;
  };
  onBack: () => void;
  onPaymentComplete: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  route, 
  stops, 
  bookingData, 
  userData, 
  onBack, 
  onPaymentComplete 
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showCashWarning, setShowCashWarning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStopName = (stopId: string) => {
    return stops.find(stop => stop.id === stopId)?.name || stopId;
  };

  const calculateFare = () => {
    const fromIndex = route.stops.indexOf(bookingData.fromStop);
    const toIndex = route.stops.indexOf(bookingData.toStop);
    const distance = Math.abs(toIndex - fromIndex);
    return Math.max(10, Math.floor(route.fare * (distance / route.stops.length))) * bookingData.selectedSeats.length;
  };

  const baseFare = calculateFare();
  const convenienceFee = selectedPaymentMethod === 'cash' ? 0 : 5;
  const gst = Math.round((baseFare + convenienceFee) * 0.05); // 5% GST
  const totalAmount = baseFare + convenienceFee + gst;

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <QrCode className="h-6 w-6" />,
      description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      iconColor: 'text-blue-600'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Visa, Mastercard, RuPay cards accepted',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      iconColor: 'text-purple-600'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet className="h-6 w-6" />,
      description: 'Paytm, Amazon Pay, PhonePe Wallet',
      color: 'bg-green-50 border-green-200 text-green-900',
      iconColor: 'text-green-600'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Banknote className="h-6 w-6" />,
      description: 'All major banks supported',
      color: 'bg-orange-50 border-orange-200 text-orange-900',
      iconColor: 'text-orange-600'
    },
    {
      id: 'cash',
      name: 'Pay by Cash',
      icon: <Banknote className="h-6 w-6" />,
      description: 'Pay cash to conductor on board',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      iconColor: 'text-yellow-600'
    }
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    if (methodId === 'cash') {
      setShowCashWarning(true);
    } else {
      setShowCashWarning(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onBack}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Payment Summary</h1>
          </div>
        </div>
      </div>

      <div className="p-4 pb-32">
        {/* Trip Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-purple-600" />
            Trip Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }}></div>
              <span className="font-medium text-gray-900">{route.name}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">From</div>
                <div className="font-medium text-gray-900">{getStopName(bookingData.fromStop)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">To</div>
                <div className="font-medium text-gray-900">{getStopName(bookingData.toStop)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="font-medium text-gray-900">
                  {new Date(bookingData.selectedDate).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Time</div>
                <div className="font-medium text-gray-900">
                  {new Date(`2000-01-01T${bookingData.selectedTime}`).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Seats</div>
              <div className="flex flex-wrap gap-2">
                {bookingData.selectedSeats.map(seat => (
                  <span key={seat} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Passenger</div>
              <div className="font-medium text-gray-900">{userData.name}</div>
              <div className="text-sm text-gray-600">+91 {userData.phone}</div>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ticket Price ({bookingData.selectedSeats.length} seat{bookingData.selectedSeats.length > 1 ? 's' : ''})</span>
              <span className="font-medium">₹{baseFare}</span>
            </div>
            
            {convenienceFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Convenience Fee</span>
                <span className="font-medium">₹{convenienceFee}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GST (5%)</span>
              <span className="font-medium">₹{gst}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-purple-600">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h2>
          
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedPaymentMethod === method.id
                    ? `${method.color} border-current shadow-md`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`${selectedPaymentMethod === method.id ? method.iconColor : 'text-gray-400'}`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${selectedPaymentMethod === method.id ? 'text-current' : 'text-gray-900'}`}>
                      {method.name}
                    </div>
                    <div className={`text-sm ${selectedPaymentMethod === method.id ? 'text-current opacity-80' : 'text-gray-500'}`}>
                      {method.description}
                    </div>
                  </div>
                  {selectedPaymentMethod === method.id && (
                    <CheckCircle className="h-5 w-5 text-current" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cash Payment Warning */}
        {showCashWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900 mb-2">Important Notice</h3>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p>• Seat availability is subject to rush at the time of boarding</p>
                  <p>• Please carry exact change as conductors may not have change</p>
                  <p>• Your seat reservation is valid for 15 minutes after bus arrival</p>
                  <p>• No convenience fee for cash payments</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handlePayment}
          disabled={!selectedPaymentMethod || isProcessing}
          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:bg-purple-700 flex items-center justify-center space-x-2 shadow-lg"
        >
          {isProcessing ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              {selectedPaymentMethod === 'cash' ? (
                <>
                  <Banknote className="h-6 w-6" />
                  <span>Reserve Seats - Pay Cash</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-6 w-6" />
                  <span>Pay ₹{totalAmount}</span>
                </>
              )}
            </>
          )}
        </button>
        
        {selectedPaymentMethod && (
          <p className="text-center text-xs text-gray-500 mt-2">
            {selectedPaymentMethod === 'cash' 
              ? 'Your seats will be reserved. Pay cash to the conductor.'
              : 'Secure payment powered by industry-standard encryption'
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;