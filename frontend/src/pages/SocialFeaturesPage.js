import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SocialFeaturesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [conversations, setConversations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data (in real app, this would come from API)
  const mockConversations = [
    {
      id: 1,
      participant: 'CourtMaster',
      lastMessage: 'Great game yesterday! Ready for a rematch?',
      timestamp: '2024-06-23 15:30',
      unread: 2,
      avatar: '⭐',
      messages: [
        { id: 1, sender: 'CourtMaster', text: 'Hey! Good game today!', timestamp: '14:25', isMe: false },
        { id: 2, sender: 'You', text: 'Thanks! You played really well too', timestamp: '14:27', isMe: true },
        { id: 3, sender: 'CourtMaster', text: 'Want to practice together sometime?', timestamp: '14:30', isMe: false },
        { id: 4, sender: 'You', text: 'Absolutely! I need to work on my defense', timestamp: '14:32', isMe: true },
        { id: 5, sender: 'CourtMaster', text: 'Great game yesterday! Ready for a rematch?', timestamp: '15:30', isMe: false }
      ]
    },
    {
      id: 2,
      participant: 'ShotCaller',
      lastMessage: 'The tournament bracket is out!',
      timestamp: '2024-06-23 12:15',
      unread: 0,
      avatar: '🎯',
      messages: [
        { id: 1, sender: 'ShotCaller', text: 'Did you see the tournament bracket?', timestamp: '12:10', isMe: false },
        { id: 2, sender: 'You', text: 'Not yet, where can I check it?', timestamp: '12:12', isMe: true },
        { id: 3, sender: 'ShotCaller', text: 'The tournament bracket is out!', timestamp: '12:15', isMe: false }
      ]
    },
    {
      id: 3,
      participant: 'DunkLegend',
      lastMessage: 'Thanks for the coaching tips!',
      timestamp: '2024-06-22 18:45',
      unread: 0,
      avatar: '💪',
      messages: [
        { id: 1, sender: 'You', text: 'Try keeping your elbow aligned when shooting', timestamp: '18:40', isMe: true },
        { id: 2, sender: 'DunkLegend', text: 'Thanks for the coaching tips!', timestamp: '18:45', isMe: false }
      ]
    }
  ];

  const mockFriends = [
    { id: 1, username: 'CourtMaster', status: 'online', avatar: '⭐', lastSeen: 'now' },
    { id: 2, username: 'ShotCaller', status: 'playing', avatar: '🎯', lastSeen: 'in game' },
    { id: 3, username: 'DunkLegend', status: 'offline', avatar: '💪', lastSeen: '2 hours ago' },
    { id: 4, username: 'ThreePointer', status: 'online', avatar: '🚀', lastSeen: 'now' },
    { id: 5, username: 'FastBreak', status: 'offline', avatar: '⚡', lastSeen: '1 day ago' }
  ];

  const [playerSearch, setPlayerSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setConversations(mockConversations);
      setFriends(mockFriends);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const newMsg = {
          id: conv.messages.length + 1,
          sender: 'You',
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true
        };
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMessage,
          timestamp: new Date().toISOString()
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: prev.messages.length + 1,
        sender: 'You',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }]
    }));
    setNewMessage('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'playing': return 'bg-orange-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'playing': return 'Playing';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <div className="text-xl text-gray-600">Loading social features...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">💬 Social Hub</h1>
          <p className="text-orange-100">
            Connect with fellow basketball players
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Messages ({conversations.reduce((sum, conv) => sum + conv.unread, 0)})
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'friends'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Friends ({friends.filter(f => f.status === 'online').length} online)
              </button>
              <button
                onClick={() => setActiveTab('find')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'find'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Find Players
              </button>
            </nav>
          </div>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900">Conversations</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedConversation?.id === conv.id ? 'bg-orange-50 border-r-4 border-orange-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{conv.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{conv.participant}</p>
                          {conv.unread > 0 && (
                            <span className="bg-orange-600 text-white text-xs rounded-full px-2 py-1">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-400">{new Date(conv.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-gray-50 border-b flex items-center space-x-3">
                    <div className="text-2xl">{selectedConversation.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.participant}</h3>
                      <p className="text-sm text-gray-500">Active player</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="h-96 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.isMe
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isMe ? 'text-orange-200' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💬</div>
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend) => (
              <div key={friend.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="text-3xl">{friend.avatar}</div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{friend.username}</h3>
                    <p className="text-sm text-gray-600">{getStatusText(friend.status)}</p>
                    <p className="text-xs text-gray-500">{friend.lastSeen}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                    Message
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium">
                    Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Find Players Tab */}
        {activeTab === 'find' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Find New Players</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                  placeholder="Search by username..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium">
                  Search
                </button>
              </div>
            </div>

            {/* Suggested Players */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Players</h3>
              <div className="space-y-4">
                {[
                  { username: 'RookieRising', level: 'Beginner', location: 'Downtown Courts', avatar: '🌟' },
                  { username: 'VeteranShooter', level: 'Advanced', location: 'Riverside Courts', avatar: '🎖️' },
                  { username: 'TeamPlayer', level: 'Intermediate', location: 'Community Center', avatar: '🤝' }
                ].map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{player.avatar}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{player.username}</h4>
                        <p className="text-sm text-gray-600">{player.level} • {player.location}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Add Friend
                      </button>
                      <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Connect */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Connect</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition duration-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏀</div>
                    <div className="font-medium text-gray-900">Find Pickup Game</div>
                    <div className="text-sm text-gray-600">Join nearby games</div>
                  </div>
                </button>
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition duration-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-medium text-gray-900">Practice Partner</div>
                    <div className="text-sm text-gray-600">Find training buddy</div>
                  </div>
                </button>
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition duration-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-medium text-gray-900">Join Team</div>
                    <div className="text-sm text-gray-600">Find your squad</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeaturesPage;