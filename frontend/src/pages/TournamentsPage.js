import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import TournamentBracket from '../components/TournamentBracket';
import LoadingSpinner from '../components/LoadingSpinner';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'bracket'
  const [newTournament, setNewTournament] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    entry_fee: 0,
    max_participants: 16,
    prize_pool: 0,
    rules: []
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await api.getTournaments();
      setTournaments(response.data);
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createTournament(newTournament);
      setTournaments([...tournaments, response.data]);
      setNewTournament({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        entry_fee: 0,
        max_participants: 16,
        prize_pool: 0,
        rules: []
      });
      setShowCreateForm(false);
      setMessage('Tournament created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to create tournament:', error);
      setMessage('Failed to create tournament. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRegister = async (tournamentId) => {
    try {
      await api.registerForTournament(tournamentId);
      setMessage('Successfully registered for tournament!');
      setTimeout(() => setMessage(''), 3000);
      fetchTournaments();
    } catch (error) {
      console.error('Failed to register:', error);
      setMessage('Failed to register. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" color="orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🏆 Tournaments</h1>
            <p className="text-gray-300">Compete in basketball tournaments and win prizes</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Create Tournament
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'list'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Tournament List
            </button>
            <button
              onClick={() => setActiveTab('bracket')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'bracket'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Tournament Brackets
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl">
            {message}
          </div>
        )}

        {/* Content */}
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tournament.status === 'upcoming' ? 'bg-blue-500/30 text-blue-300' :
                    tournament.status === 'active' ? 'bg-green-500/30 text-green-300' :
                    'bg-gray-500/30 text-gray-300'
                  }`}>
                    {tournament.status}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4">{tournament.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Entry Fee:</span>
                    <span className="text-orange-400 font-bold">${tournament.entry_fee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Prize Pool:</span>
                    <span className="text-green-400 font-bold">${tournament.prize_pool}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Participants:</span>
                    <span className="text-white">{tournament.participants?.length || 0}/{tournament.max_participants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Start Date:</span>
                    <span className="text-white">{new Date(tournament.start_date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRegister(tournament.id)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTournament(tournament);
                      setActiveTab('bracket');
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                  >
                    View Bracket
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {selectedTournament ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedTournament.name}</h2>
                  <p className="text-gray-300">Tournament bracket and match results</p>
                </div>
                <TournamentBracket tournament={selectedTournament} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">Select a Tournament</h3>
                <p className="text-gray-300 mb-6">Choose a tournament from the list to view its bracket</p>
                <button
                  onClick={() => setActiveTab('list')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  View Tournaments
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Tournament Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowCreateForm(false)}></div>
              <div className="relative bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-orange-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">Create Tournament</h2>
                <form onSubmit={handleCreateTournament} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Name</label>
                    <input
                      type="text"
                      value={newTournament.name}
                      onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter tournament name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newTournament.description}
                      onChange={(e) => setNewTournament({...newTournament, description: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Tournament description"
                      rows="3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={newTournament.start_date}
                        onChange={(e) => setNewTournament({...newTournament, start_date: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                      <input
                        type="date"
                        value={newTournament.end_date}
                        onChange={(e) => setNewTournament({...newTournament, end_date: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Entry Fee ($)</label>
                      <input
                        type="number"
                        value={newTournament.entry_fee}
                        onChange={(e) => setNewTournament({...newTournament, entry_fee: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants</label>
                      <input
                        type="number"
                        value={newTournament.max_participants}
                        onChange={(e) => setNewTournament({...newTournament, max_participants: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        min="4"
                        max="64"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prize Pool ($)</label>
                    <input
                      type="number"
                      value={newTournament.prize_pool}
                      onChange={(e) => setNewTournament({...newTournament, prize_pool: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="0"
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentsPage;