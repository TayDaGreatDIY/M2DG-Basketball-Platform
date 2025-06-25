import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TherapistProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [therapist, setTherapist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('individual');
  const [insurance, setInsurance] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    fetchTherapistProfile();
  }, [id]);

  const fetchTherapistProfile = async () => {
    try {
      const [therapistRes, reviewsRes] = await Promise.all([
        api.getTherapistProfile(id),
        api.getTherapistReviews(id)
      ]);

      setTherapist(therapistRes.data || mockTherapist);
      setReviews(reviewsRes.data || mockReviews);
    } catch (error) {
      console.error('Failed to fetch therapist profile:', error);
      setTherapist(mockTherapist);
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  // Mock therapist data
  const mockTherapist = {
    id: id || '1',
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Psychologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600',
    specialties: ['Sports Psychology', 'Performance Anxiety', 'Team Dynamics', 'Goal Setting'],
    license: 'CA PSY 12345',
    verified: true,
    rating: 4.9,
    reviewCount: 127,
    rate: 150,
    bio: 'Dr. Sarah Johnson is a licensed clinical psychologist with over 10 years of experience specializing in sports psychology. She has worked with professional athletes, college teams, and amateur sports enthusiasts to help them overcome mental barriers and achieve peak performance. Her approach combines cognitive-behavioral therapy with mindfulness techniques specifically tailored for athletic performance.',
    education: [
      'Ph.D. in Clinical Psychology - UCLA (2012)',
      'M.A. in Sports Psychology - Stanford University (2009)',
      'B.A. in Psychology - UC Berkeley (2007)'
    ],
    certifications: [
      'Association for Applied Sport Psychology (AASP) Certified',
      'Cognitive Behavioral Therapy Specialist',
      'Mindfulness-Based Stress Reduction (MBSR) Certified'
    ],
    experience: '10+ years',
    sessionTypes: ['Individual Therapy', 'Group Sessions', 'Team Consultations'],
    insuranceAccepted: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealth'],
    languages: ['English', 'Spanish'],
    availability: {
      monday: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
      tuesday: ['9:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'],
      wednesday: ['10:00 AM', '2:00 PM', '3:00 PM'],
      thursday: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'],
      friday: ['9:00 AM', '1:00 PM', '2:00 PM']
    },
    cancellationPolicy: '24 hours notice required for cancellations. Same-day cancellations may incur a fee.',
    approach: 'I use a collaborative, evidence-based approach that combines cognitive-behavioral therapy with sports-specific interventions. My goal is to help athletes develop mental resilience, overcome performance anxiety, and maintain peak psychological fitness both on and off the court.'
  };

  const mockReviews = [
    {
      id: 1,
      user: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 5,
      date: '2024-01-15',
      sport: 'Basketball',
      review: 'Dr. Johnson helped me overcome my free throw anxiety. Her techniques really work and she understands the mental side of basketball. Highly recommend!'
    },
    {
      id: 2,
      user: 'Jessica Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3db?w=100',
      rating: 5,
      date: '2024-01-10',
      sport: 'Basketball',
      review: 'Amazing therapist! She helped our entire team with communication and dealing with pressure during playoffs. Professional and very knowledgeable about sports psychology.'
    },
    {
      id: 3,
      user: 'David Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4,
      date: '2024-01-05',
      sport: 'Basketball',
      review: 'Great sessions focused on goal setting and mental preparation. Dr. Johnson provides practical tools that I use before every game.'
    }
  ];

  const handleBookSession = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const bookingData = {
        therapist_id: therapist.id,
        date: selectedDate,
        time: selectedTime,
        session_type: sessionType,
        insurance_provider: insurance,
        rate: therapist.rate
      };

      // Navigate to payment page with booking data
      navigate('/payment', {
        state: {
          amount: therapist.rate,
          bookingData,
          therapistData: therapist,
          type: 'therapy_session'
        }
      });
    } catch (error) {
      console.error('Failed to book session:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    
    const date = new Date(selectedDate);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return therapist?.availability[dayName] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" color="purple" />
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Therapist Not Found</h2>
          <button 
            onClick={() => navigate('/mental-health')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-xl"
          >
            Back to Mental Health
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/mental-health')}
          className="mb-6 flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Mental Health</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Therapist Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                <img 
                  src={therapist.image} 
                  alt={therapist.name}
                  className="w-32 h-32 rounded-2xl object-cover mx-auto md:mx-0"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{therapist.name}</h1>
                    {therapist.verified && (
                      <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-purple-300 text-lg font-medium mb-3">{therapist.title}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(therapist.rating))}
                      </div>
                      <span className="text-white font-medium">{therapist.rating}</span>
                      <span className="text-gray-400">({therapist.reviewCount} reviews)</span>
                    </div>
                    <div className="text-center md:text-left">
                      <span className="text-green-400 font-bold text-xl">${therapist.rate}/session</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">About Dr. {therapist.name.split(' ')[1]}</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{therapist.bio}</p>
              
              <h3 className="text-xl font-bold text-white mb-4">Therapeutic Approach</h3>
              <p className="text-gray-300 leading-relaxed">{therapist.approach}</p>
            </div>

            {/* Specialties */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Specialties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {therapist.specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span className="text-gray-300">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Education</h3>
                  <ul className="space-y-2">
                    {therapist.education.map((edu, index) => (
                      <li key={index} className="text-gray-300 text-sm">{edu}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Certifications</h3>
                  <ul className="space-y-2">
                    {therapist.certifications.map((cert, index) => (
                      <li key={index} className="text-gray-300 text-sm">{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Client Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white/5 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={review.avatar} 
                        alt={review.user}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-white font-medium">{review.user}</h4>
                            <p className="text-purple-300 text-sm">{review.sport} Player</p>
                          </div>
                          <div className="text-right">
                            <div className="flex text-yellow-400">
                              {'★'.repeat(review.rating)}
                            </div>
                            <p className="text-gray-400 text-sm">{new Date(review.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-gray-300">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6">Book a Session</h3>
              
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Session Type</label>
                    <select
                      value={sessionType}
                      onChange={(e) => setSessionType(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="individual">Individual Session</option>
                      <option value="couple">Couple Session</option>
                      <option value="group">Group Session</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Available Times</label>
                      <div className="grid grid-cols-2 gap-2">
                        {getAvailableTimes().map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 rounded-lg text-sm transition-colors ${
                              selectedTime === time
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Insurance Provider (Optional)</label>
                    <select
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Insurance</option>
                      {therapist.insuranceAccepted.map((provider) => (
                        <option key={provider} value={provider}>{provider}</option>
                      ))}
                      <option value="self-pay">Self Pay</option>
                    </select>
                  </div>

                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Session Cost:</span>
                      <span className="text-green-400 font-bold text-lg">${therapist.rate}</span>
                    </div>
                    {insurance && insurance !== 'self-pay' && (
                      <p className="text-purple-300 text-sm mt-2">
                        Insurance coverage will be verified before session
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleBookSession}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Book Session - ${therapist.rate}
                  </button>
                </div>
              )}
            </div>

            {/* Therapist Info */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Session Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">License:</span>
                  <span className="text-white">{therapist.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">{therapist.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Languages:</span>
                  <span className="text-white">{therapist.languages.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Session Length:</span>
                  <span className="text-white">50 minutes</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="text-white font-medium mb-2">Cancellation Policy</h4>
                <p className="text-gray-300 text-xs">{therapist.cancellationPolicy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfilePage;