import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const ChallengesPage = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    challenged_user: '',
    court_id: '',
    scheduled_date: '',
    wager_amount: 0
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await api.getChallenges();
      setChallenges(response.data);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      await api.createChallenge(newChallenge);
      setMessage('Challenge created successfully!');
      setShowCreateForm(false);
      setNewChallenge({
        title: '',
        description: '',
        challenged_user: '',
        court_id: '',
        scheduled_date: '',
        wager_amount: 0
      });
      fetchChallenges();
    } catch (error) {
      setMessage('Failed to create challenge');
    }
  };

  const handleAcceptChallenge = async (challengeId) => {
    try {
      await api.acceptChallenge(challengeId);
      setMessage('Challenge accepted! Good luck!');
      fetchChallenges();
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to accept challenge');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterChallenges = (status) => {
    return challenges.filter(challenge => {
      if (status === 'open') return challenge.status === 'open' && challenge.created_by !== user?.id;
      if (status === 'my_challenges') return challenge.created_by === user?.id;
      if (status === 'received') return challenge.challenged_user === user?.id;
      return challenge.status === status;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <div className="text-xl text-gray-600">Loading challenges...</div>
        </div>
      </div>
    );
  }

  const openChallenges = filterChallenges('open');
  const myChallenges = filterChallenges('my_challenges');
  const receivedChallenges = filterChallenges('received');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Basketball Challenges</h1>
              <p className="mt-2 text-orange-100">
                Challenge other players and prove your skills on the court
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium"
            >
              Create Challenge
            </button>
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

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('open')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'open'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Open Challenges ({openChallenges.length})
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Challenges Received ({receivedChallenges.length})
              </button>
              <button
                onClick={() => setActiveTab('my_challenges')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my_challenges'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Challenges ({myChallenges.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Create Challenge Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Challenge</h3>
              <form onSubmit={handleCreateChallenge} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Challenge Title</label>
                  <input
                    type="text"
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., 1v1 Basketball Challenge"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Describe your challenge..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opponent (Optional)</label>
                  <input
                    type="text"
                    value={newChallenge.challenged_user}
                    onChange={(e) => setNewChallenge({...newChallenge, challenged_user: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Username or leave empty for open challenge"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Scheduled Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newChallenge.scheduled_date}
                    onChange={(e) => setNewChallenge({...newChallenge, scheduled_date: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wager Amount (Optional)</label>
                  <input
                    type="number"
                    value={newChallenge.wager_amount}
                    onChange={(e) => setNewChallenge({...newChallenge, wager_amount: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                  >
                    Create Challenge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Challenge Lists */}
        <div>
          {/* Open Challenges Tab */}
          {activeTab === 'open' && (
            <div>
              {openChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚔️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No open challenges</h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to create a challenge and invite others to compete!
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Create Challenge
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {openChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">{challenge.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(challenge.status)}`}>
                            {challenge.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        {challenge.description && (
                          <p className="text-gray-600 mb-4">{challenge.description}</p>
                        )}

                        <div className="space-y-2 mb-4">
                          {challenge.scheduled_date && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Scheduled:</span>
                              <span className="font-medium">
                                {new Date(challenge.scheduled_date).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {challenge.wager_amount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Wager:</span>
                              <span className="font-bold text-green-600">${challenge.wager_amount}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Created by:</span>
                            <span className="font-medium">Player#{challenge.created_by.slice(-4)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAcceptChallenge(challenge.id)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          Accept Challenge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Received Challenges Tab */}
          {activeTab === 'received' && (
            <div>
              {receivedChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📨</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges received</h3>
                  <p className="text-gray-600">
                    When someone challenges you directly, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                          <p className="text-gray-600 mb-2">
                            From: Player#{challenge.created_by.slice(-4)}
                          </p>
                          {challenge.description && (
                            <p className="text-gray-700">{challenge.description}</p>
                          )}
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <button
                            onClick={() => handleAcceptChallenge(challenge.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                          >
                            Accept
                          </button>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium">
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Challenges Tab */}
          {activeTab === 'my_challenges' && (
            <div>
              {myChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't created any challenges yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first challenge and invite others to compete!
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Create Challenge
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="bg-white rounded-lg shadow-md p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(challenge.status)}`}>
                              {challenge.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          {challenge.description && (
                            <p className="text-gray-600">{challenge.description}</p>
                          )}
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium">
                            Edit
                          </button>
                          <button className="border border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium">
                            Cancel
                          </button>
                        </div>
                      </div>
                      
                      {challenge.challenged_user && (
                        <div className="text-sm text-gray-600">
                          Challenged: Player#{challenge.challenged_user.slice(-4)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Challenge Statistics */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Challenge Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{challenges.length}</div>
              <div className="text-sm text-gray-600">Total Challenges</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {challenges.filter(c => c.status === 'open').length}
              </div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {challenges.filter(c => c.status === 'accepted').length}
              </div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {challenges.filter(c => c.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;