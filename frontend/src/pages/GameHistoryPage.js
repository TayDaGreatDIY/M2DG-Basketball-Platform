import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const GameHistoryPage = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock game history data (in real app, this would come from API)
  const mockGames = [
    {
      id: 1,
      date: '2024-06-23',
      time: '14:30',
      opponent: 'CourtMaster',
      gameType: '1v1',
      court: 'Downtown Basketball Court',
      result: 'win',
      myScore: 21,
      opponentScore: 18,
      duration: '32 min',
      highlights: ['Made 5 three-pointers', 'Perfect free throws (8/8)', 'Clutch final shot'],
      stats: {
        points: 21,
        rebounds: 7,
        assists: 3,
        steals: 2,
        fieldGoals: '8/14',
        threePointers: '5/9',
        freeThrows: '8/8'
      }
    },
    {
      id: 2,
      date: '2024-06-22',
      time: '16:00',
      opponent: 'ShotCaller',
      gameType: '1v1',
      court: 'Riverside Outdoor Court',
      result: 'loss',
      myScore: 15,
      opponentScore: 21,
      duration: '28 min',
      highlights: ['Good defensive plays', 'Strong first half'],
      stats: {
        points: 15,
        rebounds: 5,
        assists: 2,
        steals: 3,
        fieldGoals: '6/15',
        threePointers: '3/8',
        freeThrows: '4/6'
      }
    },
    {
      id: 3,
      date: '2024-06-21',
      time: '10:00',
      opponent: 'Team Thunder',
      gameType: '5v5',
      court: 'Downtown Basketball Court',
      result: 'win',
      myScore: 18,
      opponentScore: 14,
      duration: '45 min',
      highlights: ['Team captain performance', 'Great ball movement', 'Solid defense'],
      stats: {
        points: 18,
        rebounds: 6,
        assists: 8,
        steals: 1,
        fieldGoals: '7/12',
        threePointers: '2/4',
        freeThrows: '2/2'
      }
    },
    {
      id: 4,
      date: '2024-06-20',
      time: '18:30',
      opponent: 'DunkLegend',
      gameType: '1v1',
      court: 'Community Center Court',
      result: 'win',
      myScore: 25,
      opponentScore: 22,
      duration: '35 min',
      highlights: ['Career-high scoring', 'Dominated in paint', 'Amazing comeback'],
      stats: {
        points: 25,
        rebounds: 9,
        assists: 2,
        steals: 4,
        fieldGoals: '10/18',
        threePointers: '1/5',
        freeThrows: '4/6'
      }
    },
    {
      id: 5,
      date: '2024-06-19',
      time: '15:15',
      opponent: 'FastBreak',
      gameType: '2v2',
      court: 'Riverside Outdoor Court',
      result: 'loss',
      myScore: 16,
      opponentScore: 19,
      duration: '30 min',
      highlights: ['Good teamwork', 'Close game throughout'],
      stats: {
        points: 16,
        rebounds: 4,
        assists: 5,
        steals: 2,
        fieldGoals: '6/11',
        threePointers: '4/7',
        freeThrows: '0/1'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGames(mockGames);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredGames = games.filter(game => {
    if (filter === 'all') return true;
    if (filter === 'wins') return game.result === 'win';
    if (filter === 'losses') return game.result === 'loss';
    if (filter === '1v1') return game.gameType === '1v1';
    if (filter === 'team') return game.gameType !== '1v1';
    return true;
  });

  const getResultColor = (result) => {
    return result === 'win' ? 'text-green-600' : 'text-red-600';
  };

  const getResultBg = (result) => {
    return result === 'win' ? 'bg-green-50' : 'bg-red-50';
  };

  const getGameTypeIcon = (gameType) => {
    switch (gameType) {
      case '1v1': return '🎯';
      case '2v2': return '👥';
      case '3v3': return '👨‍👩‍👦';
      case '5v5': return '🏀';
      default: return '🏀';
    }
  };

  const calculateStats = () => {
    const totalGames = games.length;
    const wins = games.filter(g => g.result === 'win').length;
    const losses = games.filter(g => g.result === 'loss').length;
    const winPercentage = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;
    const avgPoints = totalGames > 0 ? (games.reduce((sum, g) => sum + g.myScore, 0) / totalGames).toFixed(1) : 0;
    
    return { totalGames, wins, losses, winPercentage, avgPoints };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl text-gray-600">Loading game history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">📊 Game History</h1>
          <p className="text-orange-100">
            Track your basketball journey and improve your game
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalGames}</div>
            <div className="text-sm text-gray-600">Total Games</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.wins}</div>
            <div className="text-sm text-gray-600">Wins</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
            <div className="text-sm text-gray-600">Losses</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.winPercentage}%</div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.avgPoints}</div>
            <div className="text-sm text-gray-600">Avg Points</div>
          </div>
        </div>

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
              All Games
            </button>
            <button
              onClick={() => setFilter('wins')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'wins'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Wins
            </button>
            <button
              onClick={() => setFilter('losses')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'losses'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Losses
            </button>
            <button
              onClick={() => setFilter('1v1')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === '1v1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              1v1 Games
            </button>
            <button
              onClick={() => setFilter('team')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'team'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Team Games
            </button>
          </div>
        </div>

        {/* Game History List */}
        <div className="space-y-4">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ${getResultBg(game.result)} border-l-4 ${
                game.result === 'win' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getGameTypeIcon(game.gameType)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          vs {game.opponent}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          game.result === 'win' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {game.result.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {game.date} at {game.time} • {game.court}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {game.myScore} - {game.opponentScore}
                    </div>
                    <div className="text-sm text-gray-600">
                      {game.gameType} • {game.duration}
                    </div>
                  </div>
                </div>

                {/* Game Highlights */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Game Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {game.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-500">Points</div>
                    <div className="font-semibold">{game.stats.points}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Rebounds</div>
                    <div className="font-semibold">{game.stats.rebounds}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Assists</div>
                    <div className="font-semibold">{game.stats.assists}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Steals</div>
                    <div className="font-semibold">{game.stats.steals}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">FG%</div>
                    <div className="font-semibold">{game.stats.fieldGoals}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">3PT%</div>
                    <div className="font-semibold">{game.stats.threePointers}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setSelectedGame(game);
                      setShowDetails(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    View Full Stats
                  </button>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                    Share Game
                  </button>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                    Request Rematch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏀</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Start playing to build your game history!'
                : `No ${filter} games in your history yet.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Game Details Modal */}
      {showDetails && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Game Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Game Info */}
              <div>
                <h4 className="font-semibold mb-2">Game Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Date:</span> {selectedGame.date}
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span> {selectedGame.time}
                  </div>
                  <div>
                    <span className="text-gray-500">Court:</span> {selectedGame.court}
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span> {selectedGame.duration}
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div>
                <h4 className="font-semibold mb-2">Your Performance</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Points:</span> {selectedGame.stats.points}
                  </div>
                  <div>
                    <span className="text-gray-500">Rebounds:</span> {selectedGame.stats.rebounds}
                  </div>
                  <div>
                    <span className="text-gray-500">Assists:</span> {selectedGame.stats.assists}
                  </div>
                  <div>
                    <span className="text-gray-500">Steals:</span> {selectedGame.stats.steals}
                  </div>
                  <div>
                    <span className="text-gray-500">Field Goals:</span> {selectedGame.stats.fieldGoals}
                  </div>
                  <div>
                    <span className="text-gray-500">Three Pointers:</span> {selectedGame.stats.threePointers}
                  </div>
                  <div>
                    <span className="text-gray-500">Free Throws:</span> {selectedGame.stats.freeThrows}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="font-semibold mb-2">Game Highlights</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {selectedGame.highlights.map((highlight, index) => (
                    <li key={index} className="text-gray-700">{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHistoryPage;