import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CommunityStoryForm from '../components/CommunityStoryForm';

const CommunityStoriesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommunityStories();
  }, []);

  useEffect(() => {
    filterAndSortStories();
  }, [stories, selectedCategory, sortBy, searchTerm]);

  const fetchCommunityStories = async () => {
    try {
      const response = await api.getCommunityStories();
      setStories(response.data || mockStories);
    } catch (error) {
      console.error('Failed to fetch community stories:', error);
      setStories(mockStories);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStories = () => {
    let filtered = [...stories];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(story => story.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort stories
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'most_liked':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'most_commented':
        filtered.sort((a, b) => b.comments.length - a.comments.length);
        break;
      default:
        break;
    }

    setFilteredStories(filtered);
  };

  const handleLikeStory = async (storyId) => {
    if (!isAuthenticated) return;

    try {
      await api.likeStory(storyId);
      setStories(prev => prev.map(story =>
        story.id === storyId
          ? { ...story, likes: story.likes + 1, likedByUser: true }
          : story
      ));
    } catch (error) {
      console.error('Failed to like story:', error);
    }
  };

  const handleStorySubmitted = (newStory) => {
    setStories(prev => [newStory, ...prev]);
    setShowStoryForm(false);
  };

  // Mock stories data
  const mockStories = [
    {
      id: '1',
      title: 'From Bench Warmer to Team Captain',
      content: 'Three years ago, I was the last player picked and rarely got playing time. I felt defeated and considered quitting basketball. But instead of giving up, I used that pain as fuel. I spent every morning at 5 AM working on my fundamentals, studying game film, and improving my mindset with meditation. Today, I\'m proud to say I\'m team captain and leading scorer. The key was never giving up on myself, even when others did.',
      category: 'inspiration',
      tags: ['Perseverance', 'Leadership', 'Personal Growth', 'Team Spirit'],
      author: 'Marcus Johnson',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      createdAt: '2024-01-20T10:30:00Z',
      likes: 156,
      comments: [
        { id: '1', author: 'Sarah K.', content: 'This is so inspiring! Similar thing happened to me.', createdAt: '2024-01-20T11:00:00Z' },
        { id: '2', author: 'Mike R.', content: 'The 5 AM training shows real dedication. Respect!', createdAt: '2024-01-20T11:15:00Z' }
      ],
      likedByUser: false,
      status: 'published'
    },
    {
      id: '2',
      title: 'Overcoming Free Throw Anxiety',
      content: 'I used to freeze up at the free throw line, especially in clutch moments. My shooting percentage dropped to 40% in games vs 80% in practice. Working with our team\'s sports psychologist, I learned breathing techniques and visualization. Now I actually look forward to free throws because I know I\'ve prepared mentally. Last week I hit the game-winning free throws in our championship game!',
      category: 'breakthrough',
      tags: ['Mental Health', 'Overcoming Obstacles', 'Sports Psychology', 'Clutch Performance'],
      author: 'Anonymous',
      authorAvatar: null,
      createdAt: '2024-01-18T14:22:00Z',
      likes: 89,
      comments: [
        { id: '3', author: 'Coach Williams', content: 'Mental preparation is just as important as physical training!', createdAt: '2024-01-18T15:00:00Z' }
      ],
      likedByUser: false,
      status: 'published'
    },
    {
      id: '3',
      title: 'Building Team Chemistry',
      content: 'Our team was talented but couldn\'t win close games. We had egos, blame, and zero trust. I suggested we start having weekly team dinners where we talk about life, not just basketball. We also began doing community service together. These activities built real friendships and trust. Now we play like brothers and have won 15 straight games. Basketball is a team sport in every sense.',
      category: 'lesson',
      tags: ['Team Spirit', 'Leadership', 'Community', 'Trust'],
      author: 'David Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      createdAt: '2024-01-15T09:45:00Z',
      likes: 203,
      comments: [
        { id: '4', author: 'Lisa M.', content: 'Team chemistry is everything! Love this approach.', createdAt: '2024-01-15T10:30:00Z' },
        { id: '5', author: 'Tony B.', content: 'Gonna suggest this to my coach. Great idea!', createdAt: '2024-01-15T11:15:00Z' },
        { id: '6', author: 'Jessica P.', content: 'Community service builds character too. Win-win!', createdAt: '2024-01-15T12:00:00Z' }
      ],
      likedByUser: true,
      status: 'published'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Stories', icon: '📚' },
    { value: 'inspiration', label: 'Inspirational', icon: '💪' },
    { value: 'breakthrough', label: 'Breakthrough', icon: '🚀' },
    { value: 'lesson', label: 'Lessons', icon: '📚' },
    { value: 'motivation', label: 'Motivation', icon: '🔥' },
    { value: 'achievement', label: 'Achievements', icon: '🏆' },
    { value: 'advice', label: 'Advice', icon: '💡' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_liked', label: 'Most Liked' },
    { value: 'most_commented', label: 'Most Discussed' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" color="purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">💬 Community Stories</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Share your basketball journey and get inspired by stories from fellow players. 
            Every experience has the power to motivate and teach others.
          </p>
        </div>

        {/* Share Story CTA */}
        {isAuthenticated && !showStoryForm && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Share Your Basketball Story</h2>
              <p className="text-gray-300 mb-4">
                Inspire others with your journey, breakthrough moments, or lessons learned on the court.
              </p>
              <button
                onClick={() => setShowStoryForm(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Share Your Story
              </button>
            </div>
          </div>
        )}

        {/* Story Form */}
        {showStoryForm && (
          <div className="mb-8">
            <CommunityStoryForm
              onStorySubmitted={handleStorySubmitted}
              onCancel={() => setShowStoryForm(false)}
            />
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search stories, tags, or keywords..."
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <div className="text-gray-300">
              Showing {filteredStories.length} of {stories.length} stories
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-white mb-2">No Stories Found</h3>
            <p className="text-gray-300 mb-6">
              {searchTerm ? 'Try different search terms' : 'Be the first to share a story in this category!'}
            </p>
            {isAuthenticated && (
              <button
                onClick={() => setShowStoryForm(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Share First Story
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredStories.map((story) => (
              <div key={story.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                {/* Story Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {story.authorAvatar ? (
                      <img
                        src={story.authorAvatar}
                        alt={story.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {story.author === 'Anonymous' ? '?' : story.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-bold">{story.author}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(story.createdAt).toLocaleDateString()} • 
                        <span className="ml-1 capitalize">{story.category}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">{story.likes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-gray-300">{story.comments.length}</span>
                    </div>
                  </div>
                </div>

                {/* Story Title */}
                <h2 className="text-2xl font-bold text-white mb-4">{story.title}</h2>

                {/* Story Content */}
                <p className="text-gray-300 leading-relaxed mb-4">{story.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Story Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeStory(story.id)}
                      disabled={!isAuthenticated}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                        story.likedByUser
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <svg className="w-5 h-5" fill={story.likedByUser ? 'currentColor' : 'none'} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{story.likes} {story.likedByUser ? 'Liked' : 'Like'}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 bg-white/10 text-gray-300 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{story.comments.length} Comments</span>
                    </button>
                  </div>

                  <button className="bg-white/10 text-gray-300 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors">
                    Share Story
                  </button>
                </div>

                {/* Comments Preview */}
                {story.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-white font-medium mb-3">Recent Comments</h4>
                    <div className="space-y-3">
                      {story.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="bg-white/5 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium text-sm">{comment.author}</span>
                            <span className="text-gray-400 text-xs">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.content}</p>
                        </div>
                      ))}
                      {story.comments.length > 2 && (
                        <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                          View all {story.comments.length} comments
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredStories.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Load More Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityStoriesPage;