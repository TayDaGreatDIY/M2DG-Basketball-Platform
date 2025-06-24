import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CommunityForumsPage = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('general');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock forum data (in real app, this would come from API)
  const [forumPosts, setForumPosts] = useState({
    general: [
      {
        id: 1,
        title: 'Welcome to M2DG Basketball Community!',
        author: 'Admin',
        avatar: '👑',
        content: 'Welcome everyone! This is your space to discuss basketball, share tips, and connect with fellow players.',
        timestamp: '2024-06-20 10:00',
        replies: 15,
        likes: 45,
        category: 'general',
        isPinned: true,
        replies_data: [
          { id: 1, author: 'CourtMaster', avatar: '⭐', content: 'Excited to be part of this community!', timestamp: '2024-06-20 10:30', likes: 8 },
          { id: 2, author: 'ShotCaller', avatar: '🎯', content: 'Looking forward to connecting with players!', timestamp: '2024-06-20 11:00', likes: 5 }
        ]
      },
      {
        id: 2,
        title: 'Best courts in downtown area?',
        author: 'BasketballNewbie',
        avatar: '🌟',
        content: 'Hey everyone! I just moved to downtown and looking for good basketball courts to play at. Any recommendations?',
        timestamp: '2024-06-23 14:30',
        replies: 8,
        likes: 12,
        category: 'general',
        replies_data: [
          { id: 1, author: 'LocalPlayer', avatar: '🏀', content: 'Downtown Basketball Court is amazing! Great facilities and always has good pickup games.', timestamp: '2024-06-23 15:00', likes: 6 },
          { id: 2, author: 'CourtMaster', avatar: '⭐', content: 'I second that! Also check out Riverside Courts for outdoor games.', timestamp: '2024-06-23 15:30', likes: 4 }
        ]
      }
    ],
    tips: [
      {
        id: 3,
        title: 'How to improve your shooting form',
        author: 'CoachMike',
        avatar: '🎯',
        content: 'Here are my top 5 tips for better shooting form: 1) Keep your elbow aligned, 2) Follow through with your wrist...',
        timestamp: '2024-06-22 16:00',
        replies: 23,
        likes: 67,
        category: 'tips',
        replies_data: [
          { id: 1, author: 'AspiringShooten', avatar: '🚀', content: 'This helped me so much! My shooting percentage has improved significantly.', timestamp: '2024-06-22 17:00', likes: 12 },
          { id: 2, author: 'DefenseFirst', avatar: '🛡️', content: 'Great tips! Could you do one on defensive positioning next?', timestamp: '2024-06-22 18:00', likes: 8 }
        ]
      },
      {
        id: 4,
        title: 'Conditioning exercises for basketball',
        author: 'FitnessGuru',
        avatar: '💪',
        content: 'Basketball requires specific conditioning. Here are exercises that will improve your game performance...',
        timestamp: '2024-06-21 09:15',
        replies: 16,
        likes: 34,
        category: 'tips',
        replies_data: []
      }
    ],
    tournaments: [
      {
        id: 5,
        title: 'Summer Tournament Registration Open!',
        author: 'TournamentOrganizer',
        avatar: '🏆',
        content: 'Our summer basketball tournament is now open for registration! Prize pool: $5000. Sign up now!',
        timestamp: '2024-06-23 08:00',
        replies: 42,
        likes: 89,
        category: 'tournaments',
        isPinned: true,
        replies_data: [
          { id: 1, author: 'CompetitivePlayer', avatar: '⚔️', content: 'Already registered! Can\'t wait to compete!', timestamp: '2024-06-23 08:30', likes: 15 },
          { id: 2, author: 'TeamCaptain', avatar: '👨‍💼', content: 'Is this individual or team registration?', timestamp: '2024-06-23 09:00', likes: 7 }
        ]
      }
    ],
    teams: [
      {
        id: 6,
        title: 'Looking for a point guard - competitive team',
        author: 'TeamThunder',
        avatar: '⚡',
        content: 'We\'re a competitive team looking for a skilled point guard. Must be available for practice twice a week.',
        timestamp: '2024-06-22 20:00',
        replies: 12,
        likes: 18,
        category: 'teams',
        replies_data: []
      }
    ]
  });

  const categories = [
    { id: 'general', name: 'General Discussion', icon: '💬', count: forumPosts.general?.length || 0 },
    { id: 'tips', name: 'Tips & Training', icon: '🎯', count: forumPosts.tips?.length || 0 },
    { id: 'tournaments', name: 'Tournaments', icon: '🏆', count: forumPosts.tournaments?.length || 0 },
    { id: 'teams', name: 'Team Recruitment', icon: '👥', count: forumPosts.teams?.length || 0 }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post = {
      id: Date.now(),
      title: newPost.title,
      author: user?.username || 'Anonymous',
      avatar: '👤',
      content: newPost.content,
      timestamp: new Date().toISOString(),
      replies: 0,
      likes: 0,
      category: newPost.category,
      replies_data: []
    };

    setForumPosts(prev => ({
      ...prev,
      [newPost.category]: [post, ...prev[newPost.category]]
    }));

    setNewPost({ title: '', content: '', category: 'general' });
    setShowCreatePost(false);
  };

  const handleReply = (postId) => {
    if (!newReply.trim()) return;

    const reply = {
      id: Date.now(),
      author: user?.username || 'Anonymous',
      avatar: '👤',
      content: newReply,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setForumPosts(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(category => {
        updated[category] = updated[category].map(post => {
          if (post.id === postId) {
            return {
              ...post,
              replies: post.replies + 1,
              replies_data: [...post.replies_data, reply]
            };
          }
          return post;
        });
      });
      return updated;
    });

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({
        ...prev,
        replies: prev.replies + 1,
        replies_data: [...prev.replies_data, reply]
      }));
    }

    setNewReply('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💭</div>
          <div className="text-xl text-gray-600">Loading community forums...</div>
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
              <h1 className="text-3xl font-bold mb-2">💭 Community Forums</h1>
              <p className="text-orange-100">
                Connect, discuss, and learn from the basketball community
              </p>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900">Categories</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setSelectedPost(null);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 ${
                      activeCategory === category.id ? 'bg-orange-50 border-r-4 border-orange-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Forum Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Forum Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Posts:</span>
                  <span className="font-medium">
                    {Object.values(forumPosts).flat().length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users:</span>
                  <span className="font-medium">324</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online Now:</span>
                  <span className="font-medium text-green-600">42</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPost ? (
              /* Post Detail View */
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-orange-600 hover:text-orange-700 mb-4 flex items-center"
                  >
                    ← Back to posts
                  </button>
                  
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{selectedPost.avatar}</div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedPost.title}</h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span>by {selectedPost.author}</span>
                        <span>{formatTimestamp(selectedPost.timestamp)}</span>
                        <span>{selectedPost.replies} replies</span>
                        <span>{selectedPost.likes} likes</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{selectedPost.content}</p>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Replies</h3>
                  <div className="space-y-4 mb-6">
                    {selectedPost.replies_data?.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{reply.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{reply.author}</span>
                            <span className="text-sm text-gray-500">{formatTimestamp(reply.timestamp)}</span>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                          <button className="text-sm text-orange-600 hover:text-orange-700 mt-2">
                            👍 {reply.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Add a reply</h4>
                    <div className="space-y-4">
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        onClick={() => handleReply(selectedPost.id)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Posts List */
              <div className="space-y-4">
                {forumPosts[activeCategory]?.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{post.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600">
                            {post.title}
                          </h3>
                          {post.isPinned && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>by {post.author}</span>
                            <span>{formatTimestamp(post.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>💬 {post.replies}</span>
                            <span>👍 {post.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {forumPosts[activeCategory]?.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-6">
                      Be the first to start a discussion in this category!
                    </p>
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Create First Post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share your thoughts with the community..."
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForumsPage;