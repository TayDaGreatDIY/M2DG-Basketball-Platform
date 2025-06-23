import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const ScoringPage = () => {
  const { user } = useAuth();
  const [activeGame, setActiveGame] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newGame, setNewGame] = useState({
    player2_id: '',
    court_id: '',
    game_type: '1v1',
    scheduled_date: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      const response = await api.getMyGames();
      const games = response.data;
      setGameHistory(games);
      
      // Find any active game
      const active = games.find(game => game.status === 'in_progress');
      setActiveGame(active);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      const gameData = {
        ...newGame,
        player1_id: user.id,
        scheduled_date: new Date().toISOString(),
        status: 'in_progress',
        score: { player1: 0, player2: 0 }
      };
      
      const response = await api.createGame(gameData);
      setActiveGame(response.data);
      setShowCreateGame(false);
      setMessage('Game started! Start scoring.');
      fetchGameData();
    } catch (error) {
      setMessage('Failed to create game');
    }
  };

  const updateScore = async (player, points) => {
    if (!activeGame) return;
    
    const newScore = { ...activeGame.score };
    newScore[player] = Math.max(0, newScore[player] + points);
    
    try {
      await api.updateGameScore(activeGame.id, {
        score: newScore,
        status: 'in_progress'
      });
      
      setActiveGame({ ...activeGame, score: newScore });
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  };

  const endGame = async () => {
    if (!activeGame) return;
    
    const { player1, player2 } = activeGame.score;
    const winner = player1 > player2 ? 'player1' : player2 > player1 ? 'player2' : null;
    
    try {
      await api.updateGameScore(activeGame.id, {
        score: activeGame.score,
        status: 'completed',
        winner: winner,
        stats: {
          duration: new Date() - new Date(activeGame.created_at),
          total_points: player1 + player2
        }
      });
      
      setActiveGame(null);
      setMessage('Game completed!');
      fetchGameData();
    } catch (error) {
      console.error('Failed to end game:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl text-gray-600">Loading scoring interface...</div>
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
              <h1 className="text-3xl font-bold">Live Scoring</h1>
              <p className="mt-2 text-orange-100">
                Track your game scores in real-time
              </p>
            </div>
            {!activeGame && (
              <button
                onClick={() => setShowCreateGame(true)}
                className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium"
              >
                Start New Game
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('completed') || message.includes('started')
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Create Game Modal */}
        {showCreateGame && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Start New Game</h3>
              <form onSubmit={handleCreateGame} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Game Type</label>
                  <select
                    value={newGame.game_type}
                    onChange={(e) => setNewGame({...newGame, game_type: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="1v1">1v1</option>
                    <option value="2v2">2v2</option>
                    <option value="3v3">3v3</option>
                    <option value="5v5">5v5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opponent (Optional)</label>
                  <input
                    type="text"
                    value={newGame.player2_id}
                    onChange={(e) => setNewGame({...newGame, player2_id: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter opponent's username"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateGame(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                  >
                    Start Game
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Active Game Scoreboard */}
        {activeGame ? (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Game</h2>
              <p className="text-gray-600">{activeGame.game_type.toUpperCase()} Basketball</p>
            </div>

            {/* Scoreboard */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Player 1 */}
              <div className="text-center">
                <div className="bg-orange-100 rounded-lg p-6 mb-4">
                  <div className="text-6xl font-bold text-orange-600 mb-2">
                    {activeGame.score?.player1 || 0}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Player 1</div>
                  <div className="text-sm text-gray-600">You</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateScore('player1', 1)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateScore('player1', 2)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => updateScore('player1', 3)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium"
                  >
                    +3
                  </button>
                </div>
                <button
                  onClick={() => updateScore('player1', -1)}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                >
                  -1
                </button>
              </div>

              {/* Player 2 */}
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-6 mb-4">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {activeGame.score?.player2 || 0}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Player 2</div>
                  <div className="text-sm text-gray-600">
                    {activeGame.player2_id ? `Player #${activeGame.player2_id.slice(-4)}` : 'Unknown'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateScore('player2', 1)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateScore('player2', 2)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => updateScore('player2', 3)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium"
                  >
                    +3
                  </button>
                </div>
                <button
                  onClick={() => updateScore('player2', -1)}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                >
                  -1
                </button>
              </div>
            </div>

            {/* Game Controls */}
            <div className="text-center">
              <button
                onClick={endGame}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium text-lg"
              >
                End Game
              </button>
            </div>
          </div>
        ) : (
          /* No Active Game */
          <div className="text-center py-12 bg-white rounded-lg shadow-md mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active game</h3>
            <p className="text-gray-600 mb-6">
              Start a new game to begin live scoring
            </p>
            <button
              onClick={() => setShowCreateGame(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Start New Game
            </button>
          </div>
        )}

        {/* Game History */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Game History</h3>
          </div>
          
          {gameHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏀</div>
              <p className="text-gray-600">No games played yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {gameHistory.slice(0, 10).map((game) => (
                <div key={game.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">You</div>
                        <div className="text-lg font-bold">{game.score?.player1 || 0}</div>
                      </div>
                      <div className="text-gray-400">vs</div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Opponent</div>
                        <div className="text-lg font-bold">{game.score?.player2 || 0}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(game.created_at).toLocaleDateString()}
                      </div>
                      <div className={`text-sm font-medium ${
                        game.winner === 'player1' ? 'text-green-600' : 
                        game.winner === 'player2' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {game.winner === 'player1' ? 'Won' : 
                         game.winner === 'player2' ? 'Lost' : 
                         game.status === 'completed' ? 'Tie' : 'In Progress'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{gameHistory.length}</div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {gameHistory.filter(g => g.winner === 'player1').length}
            </div>
            <div className="text-sm text-gray-600">Wins</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {gameHistory.filter(g => g.winner === 'player2').length}
            </div>
            <div className="text-sm text-gray-600">Losses</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {gameHistory.length > 0 
                ? Math.round((gameHistory.filter(g => g.winner === 'player1').length / gameHistory.length) * 100)
                : 0}%
            </div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringPage;