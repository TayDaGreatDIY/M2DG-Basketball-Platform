import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const CommunityStoryForm = ({ onStorySubmitted, onCancel }) => {
  const { user } = useAuth();
  const [storyData, setStoryData] = useState({
    title: '',
    content: '',
    category: 'inspiration',
    tags: [],
    isAnonymous: false,
    allowComments: true
  });
  const [customTag, setCustomTag] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'inspiration', label: '💪 Inspirational Story', icon: '💪' },
    { value: 'breakthrough', label: '🚀 Breakthrough Moment', icon: '🚀' },
    { value: 'lesson', label: '📚 Lesson Learned', icon: '📚' },
    { value: 'motivation', label: '🔥 Motivational Post', icon: '🔥' },
    { value: 'achievement', label: '🏆 Achievement Story', icon: '🏆' },
    { value: 'advice', label: '💡 Advice & Tips', icon: '💡' }
  ];

  const commonTags = [
    'Mental Health', 'Overcoming Obstacles', 'Team Spirit', 'Personal Growth',
    'Training', 'Competition', 'Friendship', 'Perseverance', 'Goal Setting',
    'Confidence', 'Leadership', 'Comeback', 'First Game', 'Championship'
  ];

  const handleInputChange = (field, value) => {
    setStoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = (tag) => {
    if (tag && !storyData.tags.includes(tag)) {
      setStoryData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setStoryData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = {
        ...storyData,
        author: storyData.isAnonymous ? 'Anonymous' : user?.username,
        authorId: user?.id,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        status: 'pending_review' // Stories go through moderation
      };

      await api.submitCommunityStory(submissionData);
      
      if (onStorySubmitted) {
        onStorySubmitted(submissionData);
      }

      // Reset form
      setStoryData({
        title: '',
        content: '',
        category: 'inspiration',
        tags: [],
        isAnonymous: false,
        allowComments: true
      });

      alert('Story submitted successfully! It will be reviewed and published soon.');
    } catch (error) {
      console.error('Failed to submit story:', error);
      alert('Failed to submit story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = storyData.title.trim() && storyData.content.trim() && storyData.category;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Share Your Story</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Story Title *</label>
          <input
            type="text"
            value={storyData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Give your story an inspiring title..."
            required
            maxLength={100}
          />
          <p className="text-gray-400 text-xs mt-1">{storyData.title.length}/100 characters</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Story Category *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleInputChange('category', category.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  storyData.category === category.value
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium">{category.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Story *</label>
          <textarea
            value={storyData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="6"
            placeholder="Share your inspiring basketball story... What challenge did you overcome? What lesson did you learn? How did basketball change your life?"
            required
            maxLength={2000}
          />
          <p className="text-gray-400 text-xs mt-1">{storyData.content.length}/2000 characters</p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tags (Help others find your story)</label>
          
          {/* Selected Tags */}
          {storyData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {storyData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-purple-300 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Common Tags */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
            {commonTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                disabled={storyData.tags.includes(tag)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  storyData.tags.includes(tag)
                    ? 'bg-purple-500/30 text-purple-300 cursor-not-allowed'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Custom Tag Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add custom tag..."
              maxLength={20}
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={storyData.isAnonymous}
              onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
              className="rounded text-purple-500 focus:ring-purple-500"
            />
            <span className="text-gray-300">Post anonymously</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={storyData.allowComments}
              onChange={(e) => handleInputChange('allowComments', e.target.checked)}
              className="rounded text-purple-500 focus:ring-purple-500"
            />
            <span className="text-gray-300">Allow comments on this story</span>
          </label>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <h4 className="text-blue-300 font-bold mb-2">📋 Community Guidelines</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Keep stories positive and inspiring</li>
            <li>• Respect others' experiences and perspectives</li>
            <li>• No inappropriate language or content</li>
            <li>• Stories will be reviewed before publishing</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Share Story'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityStoryForm;