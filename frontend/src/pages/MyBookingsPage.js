import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return isUpcoming(booking.start_time);
    if (filter === 'past') return !isUpcoming(booking.start_time);
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏀</div>
          <div className="text-xl text-gray-600">Loading your bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="mt-2 text-orange-100">
            Manage your court reservations and access codes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'upcoming'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'past'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'confirmed'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Confirmed
            </button>
          </div>

          {/* Book New Court Button */}
          <Link
            to="/courts"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Book New Court
          </Link>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-600 mb-6">
              Start by booking your first basketball court!
            </p>
            <Link
              to="/courts"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Browse Courts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const { date, time } = formatDateTime(booking.start_time);
              const endTime = formatDateTime(booking.end_time).time;
              
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            Court Booking #{booking.id.slice(-8)}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium">{date}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Time:</span>
                            <p className="font-medium">{time} - {endTime}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <p className="font-medium">{booking.duration_hours} hour(s)</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Cost:</span>
                            <p className="font-bold text-orange-600">${booking.total_cost}</p>
                          </div>
                        </div>

                        {booking.special_requests && (
                          <div className="mt-3">
                            <span className="text-gray-500 text-sm">Special Requests:</span>
                            <p className="text-sm text-gray-700">{booking.special_requests}</p>
                          </div>
                        )}
                      </div>

                      {/* RFID Code Section */}
                      {booking.status === 'confirmed' && isUpcoming(booking.start_time) && (
                        <div className="mt-4 lg:mt-0 lg:ml-6 bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <div className="text-center">
                            <div className="text-2xl mb-2">🔑</div>
                            <p className="text-sm text-gray-600 mb-1">Court Access Code</p>
                            <div className="text-2xl font-bold text-orange-600 font-mono">
                              {booking.rfid_code}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Use this code to access the court
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {booking.status === 'confirmed' && isUpcoming(booking.start_time) && (
                        <>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium">
                            Cancel Booking
                          </button>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
                            Reschedule
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'completed' && (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                          Rate Experience
                        </button>
                      )}
                      
                      <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${bookings.reduce((sum, b) => sum + b.total_cost, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;