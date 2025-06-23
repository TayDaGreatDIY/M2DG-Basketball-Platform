import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const TeamsPage = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    max_members: 15
  });
  const [joinCode, setJoinCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getTeams();
      const allTeams = response.data;
      setTeams(allTeams);
      
      // Filter teams where user is a member
      const userTeams = allTeams.filter(team => 
        team.members.includes(user?.id)
      );
      setMyTeams(userTeams);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.createTeam(newTeam);
      setMessage('Team created successfully!');
      setShowCreateForm(false);
      setNewTeam({ name: '', description: '', max_members: 15 });
      fetchData();
    } catch (error) {
      setMessage('Failed to create team');
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await api.joinTeam(teamId);
      setMessage('Successfully joined team!');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to join team');
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    try {
      const response = await api.joinTeamByCode(joinCode);
      setMessage(`Successfully joined ${response.data.team_name}!`);
      setShowJoinForm(false);
      setJoinCode('');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Invalid referral code');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <div className="text-xl text-gray-600">Loading teams...</div>
        </div>
      </div>
    );
  }

  const availableTeams = teams.filter(team => 
    !team.members.includes(user?.id) && 
    team.members.length < team.max_members
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Basketball Teams</h1>
              <p className="mt-2 text-orange-100">
                Create teams, find teammates, and dominate the court together
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowJoinForm(true)}
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-4 py-2 rounded-lg font-medium"
              >
                Join by Code
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium"
              >
                Create Team
              </button>
            </div>
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
                onClick={() => setActiveTab('browse')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'browse'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Browse Teams ({availableTeams.length})
              </button>
              <button
                onClick={() => setActiveTab('myteams')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'myteams'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Teams ({myTeams.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Create Team Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Name</label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Members</label>
                  <input
                    type="number"
                    value={newTeam.max_members}
                    onChange={(e) => setNewTeam({...newTeam, max_members: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="5"
                    max="20"
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
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Join by Code Modal */}
        {showJoinForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Join Team by Referral Code</h3>
              <form onSubmit={handleJoinByCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Referral Code</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-center text-lg tracking-wider"
                    placeholder="Enter 6-character code"
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ask your team captain for the referral code
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                  >
                    Join Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Browse Teams Tab */}
        {activeTab === 'browse' && (
          <div>
            {availableTeams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teams available to join</h3>
                <p className="text-gray-600 mb-6">
                  Create your own team or check back later for new teams!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Create Team
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableTeams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-lg">
                            {team.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-500">
                            {team.members.length}/{team.max_members} members
                          </p>
                        </div>
                      </div>

                      {team.description && (
                        <p className="text-gray-600 mb-4">{team.description}</p>
                      )}

                      <div className="mb-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{
                              width: `${(team.members.length / team.max_members) * 100}%`
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {team.max_members - team.members.length} spots remaining
                        </p>
                      </div>

                      <button
                        onClick={() => handleJoinTeam(team.id)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Join Team
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Teams Tab */}
        {activeTab === 'myteams' && (
          <div>
            {myTeams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">You're not on any teams yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your own team or join an existing one to get started!
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Create Team
                  </button>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-lg font-medium"
                  >
                    Browse Teams
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {myTeams.map((team) => {
                  const isCaptain = team.captain_id === user?.id;
                  
                  return (
                    <div
                      key={team.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-bold text-xl">
                                {team.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
                              <p className="text-sm text-gray-500">
                                {team.members.length}/{team.max_members} members
                              </p>
                              {isCaptain && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Captain
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {isCaptain && (
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <p className="text-sm text-gray-600 mb-1">Referral Code</p>
                              <div className="text-xl font-bold text-orange-600 font-mono">
                                {team.referral_code}
                              </div>
                              <p className="text-xs text-gray-500">
                                Share this code to invite players
                              </p>
                            </div>
                          )}
                        </div>

                        {team.description && (
                          <p className="text-gray-600 mb-4">{team.description}</p>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4">
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                              View Details
                            </button>
                            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                              Team Chat
                            </button>
                            {isCaptain && (
                              <button className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg text-sm font-medium">
                                Manage Team
                              </button>
                            )}
                          </div>
                          
                          {!isCaptain && (
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Leave Team
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;