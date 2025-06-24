import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const PaymentForm = ({ amount, description, onSuccess, onError, courtId, bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage('');

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent on backend
      const { data } = await api.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        description,
        court_id: courtId,
        booking_data: bookingData
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Basketball Player',
          },
        },
      });

      if (error) {
        setMessage(error.message);
        onError && onError(error);
      } else if (paymentIntent.status === 'succeeded') {
        setMessage('Payment successful! 🎉');
        onSuccess && onSuccess(paymentIntent);
      }
    } catch (err) {
      setMessage('Payment failed. Please try again.');
      onError && onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Payment Details</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">{description}</span>
          <span className="text-2xl font-bold text-orange-400">${amount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-white/10 rounded-xl border border-white/20">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        {message && (
          <div className={`p-4 rounded-xl ${
            message.includes('successful') 
              ? 'bg-green-500/20 border border-green-500/50 text-green-300'
              : 'bg-red-500/20 border border-red-500/50 text-red-300'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
            isProcessing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transform hover:scale-105'
          } text-white shadow-lg`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" color="white" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay $${amount} 💳`
          )}
        </button>

        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <span>🔒</span>
            <span>Secure payment by Stripe</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;