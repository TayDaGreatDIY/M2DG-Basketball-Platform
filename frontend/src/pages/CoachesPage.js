import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const CoachesPage = () => {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newCoachProfile, setNewCoachProfile] = useState({
    specialties: [],
    experience_years: 0,
    certifications: [],
    hourly_rate: 0,
    bio: '',
    availability: {}
  });
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await api.getCoaches();
      setCoaches(response.data);
    } catch (error) {
      console.error('Failed to fetch coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoachProfile = async (e) => {
    e.preventDefault();
    try {
      await api.createCoachProfile(newCoachProfile);
      setMessage('Coach profile created successfully!');
      setShowCreateProfile(false);
      fetchCoaches();
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to create coach profile');
    }
  };

  const addSpecialty = (specialty) => {
    if (specialty && !newCoachProfile.specialties.includes(specialty)) {
      setNewCoachProfile({
        ...newCoachProfile,
        specialties: [...newCoachProfile.specialties, specialty]
      });
    }
  };

  const removeSpecialty = (index) => {
    const newSpecialties = newCoachProfile.specialties.filter((_, i) => i !== index);
    setNewCoachProfile({
      ...newCoachProfile,
      specialties: newSpecialties
    });
  };

  const addCertification = (cert) => {
    if (cert && !newCoachProfile.certifications.includes(cert)) {
      setNewCoachProfile({
        ...newCoachProfile,
        certifications: [...newCoachProfile.certifications, cert]
      });
    }
  };

  const removeCertification = (index) => {
    const newCerts = newCoachProfile.certifications.filter((_, i) => i !== index);
    setNewCoachProfile({
      ...newCoachProfile,
      certifications: newCerts
    });
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  const filteredCoaches = coaches.filter(coach => {
    if (filter === 'all') return true;
    if (filter === 'available') return coach.is_available;
    if (filter === 'top_rated') return coach.rating >= 4.5;
    return true;
  });

  const isUserACoach = user?.is_coach;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <div className="text-xl text-gray-600">Loading coaches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Basketball Coaches</h1>
              <p className="mt-2 text-orange-100">
                Find professional coaches to improve your game
              </p>
            </div>
            {!isUserACoach && (
              <button
                onClick={() => setShowCreateProfile(true)}
                className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium"
              >
                Become a Coach
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('success') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

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
              All Coaches
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'available'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setFilter('top_rated')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'top_rated'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Create Coach Profile Modal */}
        {showCreateProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Create Coach Profile</h3>
              <form onSubmit={handleCreateCoachProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                    <input
                      type="number"
                      value={newCoachProfile.experience_years}
                      onChange={(e) => setNewCoachProfile({...newCoachProfile, experience_years: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={newCoachProfile.hourly_rate}
                      onChange={(e) => setNewCoachProfile({...newCoachProfile, hourly_rate: parseFloat(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newCoachProfile.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(index)}
                          className="ml-1 text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addSpecialty(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Add a specialty...</option>
                    <option value="Shooting">Shooting</option>
                    <option value="Defense">Defense</option>
                    <option value="Ball Handling">Ball Handling</option>
                    <option value="Conditioning">Conditioning</option>
                    <option value="Youth Development">Youth Development</option>
                    <option value="Team Strategy">Team Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newCoachProfile.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addCertification(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Add a certification...</option>
                    <option value="USA Basketball License">USA Basketball License</option>
                    <option value="NFHS Certification">NFHS Certification</option>
                    <option value="ACSM Certified Personal Trainer">ACSM Certified Personal Trainer</option>
                    <option value="NSCA-CPT">NSCA-CPT</option>
                    <option value="Sports Performance Coach">Sports Performance Coach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={newCoachProfile.bio}
                    onChange={(e) => setNewCoachProfile({...newCoachProfile, bio: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                    placeholder="Tell potential clients about your coaching philosophy and experience..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateProfile(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coaches Grid */}
        {filteredCoaches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches available</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Be the first to become a coach on our platform!'
                : `No coaches match the ${filter} filter.`
              }
            </p>
            {!isUserACoach && (
              <button
                onClick={() => setShowCreateProfile(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Become a Coach
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <div
                key={coach.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="p-6">
                  {/* Coach Header */}
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-xl">
                        🎯
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Coach #{coach.user_id.slice(-4)}
                      </h3>
                      <div className="flex items-center">
                        {getRatingStars(Math.floor(coach.rating))}
                        <span className="ml-1 text-sm text-gray-600">
                          ({coach.total_reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Experience and Rate */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Experience:</span>
                      <span className="font-medium">{coach.experience_years} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rate:</span>
                      <span className="font-bold text-orange-600">${coach.hourly_rate}/hour</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  {coach.specialties && coach.specialties.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {coach.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
                          >
                            {specialty}
                          </span>
                        ))}
                        {coach.specialties.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{coach.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {coach.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {coach.bio}
                    </p>
                  )}

                  {/* Availability Status */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      coach.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {coach.is_available ? 'Available' : 'Busy'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      disabled={!coach.is_available}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                        coach.is_available
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Book Session
                    </button>
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coaching Benefits Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose Professional Coaching?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Personalized Training</h4>
              <p className="text-gray-600">Get customized training plans tailored to your specific needs and goals.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Faster Improvement</h4>
              <p className="text-gray-600">Professional guidance helps you improve faster and avoid common mistakes.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Expert Knowledge</h4>
              <p className="text-gray-600">Learn from experienced coaches with proven track records and certifications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachesPage;