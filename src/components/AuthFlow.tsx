import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Shield, CheckCircle } from 'lucide-react';

interface AuthFlowProps {
  onAuthComplete: (userData: { name: string; phone: string }) => void;
  onBack: () => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<'phone' | 'otp' | 'complete'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [detectedNumbers, setDetectedNumbers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Simulate detecting phone numbers from device
  useEffect(() => {
    // In a real app, this would use device APIs to get phone numbers
    const simulatedNumbers = [
      '+91 9452624111',

    ];
    setDetectedNumbers(simulatedNumbers);
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length < 10) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentStep('otp');
    setCountdown(30);
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Check if OTP is correct (for demo, accept 111111)
    if (otp === '111111') {
      onAuthComplete({
        name: 'User', // In real app, this would come from API
        phone: phoneNumber
      });
    } else {
      // Show error for wrong OTP
      alert('Invalid OTP. Please enter 111111 for demo.');
      setIsLoading(false);
      return;
    }
  };

  const formatPhoneNumber = (number: string) => {
    return number.replace(/(\+91\s?)(\d{5})(\d{5})/, '+91 $2 $3');
  };

  const PhoneStep = () => (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 bg-purple-700 hover:bg-purple-800 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Login / Register</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Hero Image */}
        <div className="flex justify-center bg-gradient-to-b from-purple-50 to-white">
          <img 
            src="/image.png" 
            alt="DoonConnect Bus App" 
            className="w-56 h-46"
          />
        </div>

        <div className="flex-1 px-6 ">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DoonConnect</h2>
              <p className="text-gray-600">Enter your phone number to continue</p>
            </div>

            {/* Detected Phone Numbers */}
            {detectedNumbers.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Choose from your device:</p>
                <div className="space-y-2">
                  {detectedNumbers.map((number, index) => (
                    <button
                      key={index}
                      onClick={() => setPhoneNumber(number.replace(/\D/g, '').slice(-10))}
                      className="w-full p-3 text-left border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors flex items-center space-x-3"
                    >
                      <Phone className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">{formatPhoneNumber(number)}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-3 text-sm text-gray-500">or enter manually</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>
              </div>
            )}

            {/* Manual Phone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-gray-600">🇮🇳</span>
                  <span className="text-gray-600">+91</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-20 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-lg"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                />
              </div>
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={phoneNumber.length !== 10 || isLoading}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-purple-700 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send OTP</span>
                  <Shield className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
              By continuing, you agree to our{' '}
              <span className="text-purple-600 underline">Terms of Service</span> and{' '}
              <span className="text-purple-600 underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const OtpStep = () => (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={() => setCurrentStep('phone')} className="p-2 bg-purple-700 hover:bg-purple-800 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Verify Phone Number</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
            <p className="text-gray-600">
              We've sent a 6-digit code to{' '}
              <span className="font-medium">+91 {phoneNumber}</span>
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-center space-x-3 mb-4">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={otp[index] || ''}
                  ref={(el) => {
                    if (el) {
                      // Store reference to each input
                      el.dataset.index = index.toString();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                    const newOtp = otp.split('');
                    newOtp[index] = value;
                    setOtp(newOtp.join(''));
                    
                    // Auto-focus next input
                    if (value && index < 5) {
                      // Use setTimeout to ensure the state update completes first
                      setTimeout(() => {
                        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
                        if (nextInput) {
                          nextInput.focus();
                        }
                      }, 10);
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle backspace
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      setTimeout(() => {
                        const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
                        if (prevInput) {
                          prevInput.focus();
                        }
                      }, 10);
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                    if (pastedData) {
                      setOtp(pastedData.padEnd(6, ''));
                      // Focus the last filled input or the next empty one
                      setTimeout(() => {
                        const nextIndex = Math.min(pastedData.length, 5);
                        const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`) as HTMLInputElement;
                        if (nextInput) {
                          nextInput.focus();
                        }
                      }, 10);
                    }
                  }}
                  onFocus={(e) => {
                    // Select all text when focusing (better UX)
                    e.target.select();
                  }}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              ))}
            </div>
            
            {/* Demo hint */}
            <div className="text-center mb-4">
              <p className="text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                Demo OTP: <span className="font-mono font-bold">111111</span>
              </p>
            </div>
            
            {countdown > 0 ? (
              <p className="text-center text-sm text-gray-500">
                Resend code in {countdown}s
              </p>
            ) : (
              <button
                onClick={() => {
                  setCountdown(30);
                  // Simulate resend OTP
                }}
                className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            onClick={handleOtpSubmit}
            disabled={otp.length !== 6 || isLoading}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-purple-700 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Verify & Continue</span>
                <CheckCircle className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  switch (currentStep) {
    case 'phone':
      return <PhoneStep />;
    case 'otp':
      return <OtpStep />;
    default:
      return <PhoneStep />;
  }
};

export default AuthFlow;