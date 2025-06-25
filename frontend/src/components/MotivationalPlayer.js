import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MotivationalPlayer = ({ videoId, onClose }) => {
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      const [videoRes, relatedRes] = await Promise.all([
        api.getMotivationalVideo(videoId),
        api.getRelatedVideos(videoId)
      ]);

      setVideo(videoRes.data || mockVideo);
      setRelatedVideos(relatedRes.data || mockRelatedVideos);
    } catch (error) {
      console.error('Failed to fetch video data:', error);
      setVideo(mockVideo);
      setRelatedVideos(mockRelatedVideos);
    } finally {
      setLoading(false);
    }
  };

  const mockVideo = {
    id: videoId,
    title: 'Mental Toughness in Basketball - Kobe Bryant',
    description: 'Learn from the Black Mamba himself about developing unbreakable mental toughness on and off the basketball court. This powerful talk covers mindset, preparation, and the champion mentality.',
    speaker: 'Kobe Bryant',
    duration: '12:34',
    views: '2,143,567',
    likes: '98,432',
    category: 'Motivation',
    tags: ['Mental Toughness', 'Basketball', 'Mindset', 'Championship'],
    transcript: [
      { time: '0:00', text: 'Mental toughness is about having the mindset that you can overcome any obstacle...' },
      { time: '1:23', text: 'When I was playing, I would visualize every scenario, every possible outcome...' },
      { time: '3:45', text: 'The difference between good players and great players is mental preparation...' }
    ],
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedDate: '2023-08-15',
    source: 'YouTube'
  };

  const mockRelatedVideos = [
    {
      id: '2',
      title: 'Overcoming Failure - Michael Jordan',
      speaker: 'Michael Jordan',
      duration: '8:45',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: '1,834,221'
    },
    {
      id: '3',
      title: 'Building Confidence - TEDTalk',
      speaker: 'Dr. Sports Psychology',
      duration: '15:22',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: '967,543'
    },
    {
      id: '4',
      title: 'Championship Mindset',
      speaker: 'LeBron James',
      duration: '11:18',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: '2,567,891'
    }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white/10 rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-white mt-4">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Motivational Content Player</h1>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Video Player */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
                {/* Video Player */}
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
                  <div className="flex items-center space-x-4 text-gray-300 text-sm mb-4">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>{new Date(video.publishedDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{video.duration}</span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {video.speaker.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{video.speaker}</h3>
                        <p className="text-gray-400 text-sm">{video.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{video.likes}</span>
                      </button>
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors">
                        Save to Playlist
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white font-bold mb-2">Description</h4>
                    <p className="text-gray-300 leading-relaxed">{video.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-white font-bold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Video Transcript</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {video.transcript.map((item, index) => (
                    <div key={index} className="flex space-x-4">
                      <span className="text-purple-400 font-mono text-sm min-w-fit">{item.time}</span>
                      <p className="text-gray-300 text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Up Next</h3>
              {relatedVideos.map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/motivational-video/${relatedVideo.id}`}
                >
                  <div className="flex space-x-3">
                    <img
                      src={relatedVideo.thumbnail}
                      alt={relatedVideo.title}
                      className="w-20 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-gray-400 text-xs">{relatedVideo.speaker}</p>
                      <div className="flex items-center space-x-2 text-gray-400 text-xs mt-1">
                        <span>{relatedVideo.views} views</span>
                        <span>•</span>
                        <span>{relatedVideo.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create Playlist */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-white font-bold mb-2">💡 Pro Tip</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Create custom playlists to organize your favorite motivational content for easy access during training.
                </p>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm">
                  Create Playlist
                </button>
              </div>

              {/* Share Options */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-bold mb-3">Share Video</h4>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    Share on Twitter
                  </button>
                  <button className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    Share on Facebook
                  </button>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationalPlayer;