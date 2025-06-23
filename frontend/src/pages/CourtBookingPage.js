import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CourtBookingPage = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    date: '',
    start_time: '',
    duration_hours: 1,
    special_requests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourt();
  }, [courtId]);

  const fetchCourt = async () => {
    try {
      const response = await api.getCourt(courtId);
      setCourt(response.data);
    } catch (error) {
      console.error('Failed to fetch court:', error);
      setMessage('Court not found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setMessage('');

    try {
      const bookingData = {
        ...booking,
        court_id: courtId,
        duration_hours: parseInt(booking.duration_hours)
      };
      
      await api.createBooking(bookingData);
      setMessage('Booking created successfully! Redirecting to your bookings...');
      
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateCost = () => {
    if (!court || !booking.duration_hours) return 0;
    return court.hourly_rate * parseInt(booking.duration_hours);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏀</div>
          <div className="text-xl text-gray-600">Loading court details...</div>
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-xl text-gray-600">Court not found</div>
          <button
            onClick={() => navigate('/courts')}
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Courts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Book Court</h1>
          <p className="mt-2 text-orange-100">
            Reserve your time at {court.name}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Court Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <div className="text-white text-6xl">🏀</div>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{court.name}</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{court.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{court.court_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Surface:</span>
                  <span className="font-medium capitalize">{court.surface_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{court.capacity} players</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-bold text-orange-600">${court.hourly_rate}</span>
                </div>
              </div>

              {court.amenities && court.amenities.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities:</h3>
                  <div className="flex flex-wrap gap-2">
                    {court.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {court.description && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description:</h3>
                  <p className="text-gray-600 text-sm">{court.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Reservation</h2>
            
            {message && (
              <div className={`mb-4 p-4 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={booking.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={booking.start_time}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <select
                  name="duration_hours"
                  value={booking.duration_hours}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                  <option value={4}>4 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="special_requests"
                  value={booking.special_requests}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any special requirements or requests..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Cost Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{booking.duration_hours} hour(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate per hour:</span>
                    <span>${court.hourly_rate}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total Cost:</span>
                    <span className="text-orange-600">${calculateCost()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/courts')}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {bookingLoading ? 'Booking...' : `Book for $${calculateCost()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtBookingPage;