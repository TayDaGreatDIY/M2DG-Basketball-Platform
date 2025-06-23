import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const CourtsPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await api.getCourts();
      setCourts(response.data);
    } catch (error) {
      console.error('Failed to fetch courts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourts = courts.filter(court => {
    if (filter === 'all') return true;
    if (filter === 'indoor') return court.court_type === 'indoor';
    if (filter === 'outdoor') return court.court_type === 'outdoor';
    if (filter === 'available') return court.is_available;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏀</div>
          <div className="text-xl text-gray-600">Loading courts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Basketball Courts</h1>
          <p className="mt-2 text-orange-100">
            Find and book the perfect court for your game
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Courts
            </button>
            <button
              onClick={() => setFilter('indoor')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'indoor'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Indoor
            </button>
            <button
              onClick={() => setFilter('outdoor')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'outdoor'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Outdoor
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'available'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Available Now
            </button>
          </div>
        </div>

        {/* Courts Grid */}
        {filteredCourts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏀</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courts found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No courts are available at the moment.'
                : `No ${filter} courts match your criteria.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <div
                key={court.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                {/* Court Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <div className="text-white text-6xl">🏀</div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{court.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        court.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {court.is_available ? 'Available' : 'Busy'}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-2">{court.location}</p>
                  <p className="text-sm text-gray-500 mb-4">{court.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="capitalize font-medium">{court.court_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Surface:</span>
                      <span className="capitalize font-medium">{court.surface_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="font-medium">{court.capacity} players</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  {court.amenities && court.amenities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {court.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                        {court.amenities.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{court.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-orange-600">
                        ${court.hourly_rate}
                      </span>
                      <span className="text-gray-500">/hour</span>
                    </div>
                    <Link
                      to={`/courts/${court.id}/book`}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtsPage;