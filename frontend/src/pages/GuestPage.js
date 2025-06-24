import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const GuestPage = () => {
  const [courts, setCourts] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuestData();
  }, []);

  const fetchGuestData = async () => {
    try {
      // Mock data for guest users since API requires authentication
      const mockCourts = [
        {
          id: '1',
          name: 'Downtown Basketball Court',
          location: 'Downtown Sports Complex',
          price: 25,
          amenities: ['Indoor', 'Air Conditioning', 'Scoreboard'],
          rating: 4.8,
          available_slots: 8
        },
        {
          id: '2', 
          name: 'Riverside Outdoor Court',
          location: 'Riverside Park',
          price: 15,
          amenities: ['Outdoor', 'Parking', 'Lighting'],
          rating: 4.5,
          available_slots: 12
        },
        {
          id: '3',
          name: 'Elite Training Center',
          location: 'Elite Sports Academy',
          price: 40,
          amenities: ['Premium', 'Professional Grade', 'Video Recording'],
          rating: 4.9,
          available_slots: 6
        }
      ];

      const mockTournaments = [
        {
          id: '1',
          name: 'Summer Basketball Championship',
          start_date: '2024-02-15',
          entry_fee: 50,
          prize_pool: 1000,
          participants: 24,
          max_participants: 32,
          status: 'upcoming'
        },
        {
          id: '2',
          name: 'Weekend Warriors League',
          start_date: '2024-02-20',
          entry_fee: 25,
          prize_pool: 500,
          participants: 16,
          max_participants: 16,
          status: 'active'
        },
        {
          id: '3',
          name: 'Youth Basketball Tournament',
          start_date: '2024-03-01',
          entry_fee: 20,
          prize_pool: 300,
          participants: 8,
          max_participants: 16,
          status: 'upcoming'
        }
      ];

      setCourts(mockCourts);
      setTournaments(mockTournaments);
    } catch (error) {
      console.error('Failed to fetch guest data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Explore M2DG Basketball Platform 🏀
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Discover our courts, tournaments, and basketball community
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Join Now
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-orange-600 transition duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Courts Preview */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Available Courts</h2>
            <Link
              to="/register"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Sign up to book →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courts.map((court) => (
                <div key={court.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{court.name}</h3>
                    <p className="text-gray-600 mb-2">{court.location}</p>
                    <p className="text-sm text-gray-500 mb-4">{court.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-orange-600">
                        ${court.hourly_rate}/hour
                      </span>
                      <span className="text-sm text-gray-500">
                        {court.court_type} • {court.surface_type}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3">
                    <p className="text-sm text-gray-600">
                      Sign up to view availability and book
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tournaments Preview */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Tournaments</h2>
            <Link
              to="/register"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Sign up to join →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{tournament.name}</h3>
                      <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                        {tournament.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{tournament.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Entry Fee:</span>
                        <span className="font-medium">${tournament.entry_fee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Prize Pool:</span>
                        <span className="font-medium text-green-600">${tournament.prize_pool}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Participants:</span>
                        <span className="font-medium">
                          {tournament.current_participants}/{tournament.max_participants}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3">
                    <p className="text-sm text-gray-600">
                      Create an account to register
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            What You Get with M2DG
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🏀</div>
              <h3 className="text-lg font-semibold mb-2">Court Booking</h3>
              <p className="text-gray-600">Easy online court reservations with instant confirmation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2">Tournaments</h3>
              <p className="text-gray-600">Competitive tournaments with prizes and rankings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">Create teams, invite players, and organize games</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-lg font-semibold mb-2">Challenges</h3>
              <p className="text-gray-600">Challenge other players and settle scores on the court</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Create your account and start managing your basketball life today
          </p>
          <Link
            to="/register"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </section>
      </div>
    </div>
  );
};

export default GuestPage;