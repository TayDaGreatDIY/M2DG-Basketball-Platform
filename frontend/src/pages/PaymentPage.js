import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import StripeProvider from '../components/StripeProvider';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Get payment data from navigation state
    if (location.state) {
      setPaymentData(location.state);
    } else {
      // Redirect if no payment data
      navigate('/courts');
    }
  }, [location.state, navigate]);

  const handlePaymentSuccess = (paymentIntent) => {
    // Navigate to success page with booking confirmation
    navigate('/booking-confirmed', {
      state: {
        paymentIntent,
        bookingData: paymentData?.bookingData,
        courtData: paymentData?.courtData
      }
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🏀</div>
          <h2 className="text-2xl font-bold mb-2">Loading Payment...</h2>
          <p className="text-gray-300">Please wait while we prepare your booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🏀 Complete Your Booking</h1>
          <p className="text-gray-300">Secure payment for your basketball court reservation</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Booking Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Court:</span>
              <span className="text-white font-medium">{paymentData.courtData?.name || 'Basketball Court'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Date:</span>
              <span className="text-white font-medium">{paymentData.bookingData?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Time:</span>
              <span className="text-white font-medium">{paymentData.bookingData?.time_slot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Duration:</span>
              <span className="text-white font-medium">{paymentData.bookingData?.duration || '2 hours'}</span>
            </div>
            <div className="border-t border-white/20 pt-3 flex justify-between">
              <span className="text-gray-300 text-lg">Total:</span>
              <span className="text-orange-400 font-bold text-2xl">${paymentData.amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <StripeProvider>
          <PaymentForm
            amount={paymentData.amount}
            description={`Court booking - ${paymentData.courtData?.name || 'Basketball Court'}`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            courtId={paymentData.courtData?.id}
            bookingData={paymentData.bookingData}
          />
        </StripeProvider>

        {/* Security Info */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-6 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <span>🔒</span>
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💳</span>
              <span>PCI DSS compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🛡️</span>
              <span>Powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;