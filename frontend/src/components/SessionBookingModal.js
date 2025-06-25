import React, { useState } from 'react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const SessionBookingModal = ({ isOpen, onClose, therapist, onBookingComplete }) => {
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    sessionType: 'individual',
    duration: 50,
    insurance: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const sessionTypes = [
    { value: 'individual', label: 'Individual Session (50 min)', price: therapist?.rate || 150 },
    { value: 'couple', label: 'Couple Session (60 min)', price: (therapist?.rate || 150) * 1.2 },
    { value: 'group', label: 'Group Session (90 min)', price: (therapist?.rate || 150) * 0.7 }
  ];

  const getAvailableTimes = () => {
    if (!bookingData.date || !therapist) return [];
    
    const date = new Date(bookingData.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return therapist.availability?.[dayName] || ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'];
  };

  const getSessionPrice = () => {
    const selectedType = sessionTypes.find(type => type.value === bookingData.sessionType);
    return selectedType?.price || therapist?.rate || 150;
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionData = {
        therapist_id: therapist.id,
        ...bookingData,
        price: getSessionPrice(),
        status: 'pending_payment'
      };

      // Call parent callback with booking data
      if (onBookingComplete) {
        onBookingComplete(sessionData);
      }

      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = bookingData.date && bookingData.time && bookingData.sessionType;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Therapy Session" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Therapist Info */}
        {therapist && (
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center space-x-3">
              <img 
                src={therapist.image} 
                alt={therapist.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="text-white font-bold">{therapist.name}</h3>
                <p className="text-purple-300 text-sm">{therapist.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Session Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Session Type</label>
          <select
            value={bookingData.sessionType}
            onChange={(e) => handleInputChange('sessionType', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            {sessionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} - ${type.price}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Date</label>
          <input
            type="date"
            value={bookingData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Time Selection */}
        {bookingData.date && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Available Times</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {getAvailableTimes().map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleInputChange('time', time)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    bookingData.time === time
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Insurance */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Insurance Provider (Optional)</label>
          <select
            value={bookingData.insurance}
            onChange={(e) => handleInputChange('insurance', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Insurance Provider</option>
            {therapist?.insuranceAccepted?.map((provider) => (
              <option key={provider} value={provider}>{provider}</option>
            )) || (
              <>
                <option value="aetna">Aetna</option>
                <option value="bluecross">Blue Cross Blue Shield</option>
                <option value="cigna">Cigna</option>
                <option value="unitedhealth">UnitedHealth</option>
              </>
            )}
            <option value="self-pay">Self Pay</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Additional Notes (Optional)</label>
          <textarea
            value={bookingData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="3"
            placeholder="Any specific concerns or topics you'd like to discuss..."
          />
        </div>

        {/* Pricing Summary */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Session Cost:</span>
            <span className="text-green-400 font-bold text-xl">${getSessionPrice()}</span>
          </div>
          {bookingData.insurance && bookingData.insurance !== 'self-pay' && (
            <p className="text-green-300 text-sm mt-2">
              ✓ Insurance coverage will be verified before payment
            </p>
          )}
          <p className="text-gray-400 text-xs mt-2">
            Payment will be processed after session confirmation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Booking...</span>
              </div>
            ) : (
              `Book Session - $${getSessionPrice()}`
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SessionBookingModal;