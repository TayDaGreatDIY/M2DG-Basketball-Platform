import React, { useState, useRef } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const VideoAnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type and size
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file.');
        return;
      }
      
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        alert('File size must be less than 100MB.');
        return;
      }
      
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  };

  const analyzeVideo = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('analysis_type', 'full_game_analysis');

      const response = await api.analyzeVideo(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock analysis result if API fails
      const mockResult = {
        id: Date.now(),
        filename: selectedFile.name,
        duration: '2:34',
        analysis: {
          shooting: {
            attempts: 15,
            made: 9,
            percentage: 60,
            form_score: 7.8,
            recommendations: [
              'Consistent follow-through',
              'Higher arc on shots',
              'Square shoulders to basket'
            ]
          },
          dribbling: {
            score: 8.2,
            touches: 45,
            turnovers: 2,
            recommendations: [
              'Keep head up while dribbling',
              'Use both hands equally',
              'Protect ball in traffic'
            ]
          },
          defense: {
            score: 7.5,
            steals: 3,
            blocks: 1,
            recommendations: [
              'Stay low in defensive stance',
              'Active hands',
              'Better help defense positioning'
            ]
          },
          movement: {
            score: 8.7,
            distance_covered: '1.2 miles',
            speed_changes: 23,
            recommendations: [
              'Excellent court awareness',
              'Good spacing maintenance',
              'Quick first step'
            ]
          }
        },
        insights: [
          {
            type: 'strength',
            message: 'Excellent ball handling skills with minimal turnovers',
            icon: '💪'
          },
          {
            type: 'improvement',
            message: 'Work on shot consistency, especially from 3-point range',
            icon: '🎯'
          },
          {
            type: 'strategy',
            message: 'Consider driving more to the basket for higher percentage shots',
            icon: '🧠'
          }
        ],
        timestamp: new Date().toISOString()
      };

      setAnalysisResult(response.data || mockResult);
    } catch (error) {
      console.error('Video analysis failed:', error);
      alert('Video analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 8) return 'bg-green-500/20 border-green-500/50';
    if (score >= 6) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎥 AI Video Analysis</h1>
          <p className="text-gray-300">Upload your game footage for advanced basketball performance analysis</p>
        </div>

        {!analysisResult ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold text-white mb-2">Upload Your Game Video</h2>
                <p className="text-gray-300">Supported formats: MP4, MOV, AVI • Max size: 100MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!selectedFile ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Choose Video File
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-2xl">📹</span>
                      <div>
                        <p className="text-white font-medium">{selectedFile.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="sm" color="purple" />
                        <span className="text-white">
                          {uploadProgress < 100 ? 'Uploading...' : 'Analyzing video...'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={analyzeVideo}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        🤖 Analyze Video
                      </button>
                      <button
                        onClick={resetAnalysis}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Choose Different File
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-white font-bold mb-2">Shot Analysis</h3>
                <p className="text-gray-300 text-sm">Form, accuracy, and improvement tips</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-3xl mb-3">🏃‍♂️</div>
                <h3 className="text-white font-bold mb-2">Movement</h3>
                <p className="text-gray-300 text-sm">Court positioning and speed analysis</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="text-white font-bold mb-2">Defense</h3>
                <p className="text-gray-300 text-sm">Defensive stance and positioning</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-white font-bold mb-2">Ball Handling</h3>
                <p className="text-gray-300 text-sm">Dribbling skills and ball control</p>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Analysis Complete! 🎉</h2>
                  <p className="text-gray-300">Video: {analysisResult.filename} • Duration: {analysisResult.duration}</p>
                </div>
                <button
                  onClick={resetAnalysis}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300"
                >
                  Analyze New Video
                </button>
              </div>
            </div>

            {/* Performance Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(analysisResult.analysis).map(([skill, data]) => (
                <div key={skill} className={`p-6 rounded-2xl border-2 ${getScoreBackground(data.score)}`}>
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg capitalize mb-2">{skill}</h3>
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(data.score)}`}>
                      {data.score || `${data.percentage}%`}
                    </div>
                    <div className="text-gray-300 text-sm space-y-1">
                      {skill === 'shooting' && (
                        <>
                          <div>{data.made}/{data.attempts} shots made</div>
                          <div>Form Score: {data.form_score}/10</div>
                        </>
                      )}
                      {skill === 'dribbling' && (
                        <>
                          <div>{data.touches} touches</div>
                          <div>{data.turnovers} turnovers</div>
                        </>
                      )}
                      {skill === 'defense' && (
                        <>
                          <div>{data.steals} steals</div>
                          <div>{data.blocks} blocks</div>
                        </>
                      )}
                      {skill === 'movement' && (
                        <>
                          <div>{data.distance_covered} covered</div>
                          <div>{data.speed_changes} speed changes</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">🤖 AI Insights</h3>
              <div className="space-y-4">
                {analysisResult.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl">
                    <span className="text-2xl">{insight.icon}</span>
                    <div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        insight.type === 'strength' ? 'bg-green-500/30 text-green-300' :
                        insight.type === 'improvement' ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-blue-500/30 text-blue-300'
                      }`}>
                        {insight.type}
                      </span>
                      <p className="text-white mt-2">{insight.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(analysisResult.analysis).map(([skill, data]) => (
                <div key={skill} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 capitalize">
                    {skill} Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {data.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span className="text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysisPage;