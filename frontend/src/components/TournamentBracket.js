import React from 'react';

const TournamentBracket = ({ tournament }) => {
  // Mock tournament data structure
  const mockBracket = {
    rounds: [
      {
        name: "Quarterfinals",
        matches: [
          { id: 1, team1: "Lakers", team2: "Warriors", score1: 98, score2: 92, winner: "Lakers", status: "completed" },
          { id: 2, team1: "Celtics", team2: "Heat", score1: 87, score2: 91, winner: "Heat", status: "completed" },
          { id: 3, team1: "Bulls", team2: "Nets", score1: 0, score2: 0, winner: null, status: "upcoming" },
          { id: 4, team1: "Suns", team2: "Nuggets", score1: 76, score2: 84, winner: "Nuggets", status: "completed" }
        ]
      },
      {
        name: "Semifinals",
        matches: [
          { id: 5, team1: "Lakers", team2: "Heat", score1: 0, score2: 0, winner: null, status: "upcoming" },
          { id: 6, team1: "TBD", team2: "Nuggets", score1: 0, score2: 0, winner: null, status: "pending" }
        ]
      },
      {
        name: "Final",
        matches: [
          { id: 7, team1: "TBD", team2: "TBD", score1: 0, score2: 0, winner: null, status: "pending" }
        ]
      }
    ]
  };

  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'live': return 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse';
      case 'upcoming': return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const MatchCard = ({ match, roundIndex }) => (
    <div className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${getMatchStatusColor(match.status)}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${match.winner === match.team1 ? 'text-yellow-400' : 'text-white'}`}>
            {match.team1}
          </span>
          <span className="font-bold text-lg">{match.score1}</span>
        </div>
        <div className="h-px bg-gray-600"></div>
        <div className="flex items-center justify-between">
          <span className={`font-medium ${match.winner === match.team2 ? 'text-yellow-400' : 'text-white'}`}>
            {match.team2}
          </span>
          <span className="font-bold text-lg">{match.score2}</span>
        </div>
      </div>
      
      {match.status === 'live' && (
        <div className="mt-2 text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-500/30 text-red-300">
            🔴 LIVE
          </span>
        </div>
      )}
      
      {match.winner && (
        <div className="mt-2 text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
            🏆 {match.winner} wins
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Tournament Bracket</h2>
        <p className="text-gray-300">Track match progress and results</p>
      </div>

      <div className="space-y-8">
        {mockBracket.rounds.map((round, roundIndex) => (
          <div key={roundIndex} className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-400 text-center">{round.name}</h3>
            
            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {round.matches.map((match) => (
                  <MatchCard key={match.id} match={match} roundIndex={roundIndex} />
                ))}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-4">
              {round.matches.map((match) => (
                <MatchCard key={match.id} match={match} roundIndex={roundIndex} />
              ))}
            </div>

            {/* Connection Lines for Desktop */}
            {roundIndex < mockBracket.rounds.length - 1 && (
              <div className="hidden lg:flex justify-center my-6">
                <div className="flex items-center space-x-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent w-20"></div>
                  <div className="text-orange-400 text-sm font-medium">Next Round</div>
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent w-20"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tournament Stats */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">8</div>
            <div className="text-sm text-gray-300">Total Teams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">5</div>
            <div className="text-sm text-gray-300">Matches Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">2</div>
            <div className="text-sm text-gray-300">Matches Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;