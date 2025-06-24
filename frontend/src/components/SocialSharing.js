import React, { useState } from 'react';

const SocialSharing = ({ content, type = 'achievement' }) => {
  const [isSharing, setIsSharing] = useState(false);

  const generateShareText = (platform) => {
    const baseTexts = {
      achievement: `🏀 Just earned "${content.title}" on M2DG Basketball Platform! 🎉`,
      tournament: `🏆 Participating in ${content.name} tournament on M2DG Basketball! Wish me luck! 🍀`,
      game: `🏀 Just finished an epic basketball game! Score: ${content.score} 🔥`,
      team: `👥 Joined the ${content.name} team on M2DG Basketball Platform! Ready to dominate! 💪`,
      court: `🏀 Booked ${content.name} for some serious basketball action! 🔥`,
      level: `📈 Just reached Level ${content.level} on M2DG Basketball Platform! 🚀`
    };

    const hashtags = '#Basketball #M2DGBasketball #Hoops #Sports #Achievement';
    const appUrl = 'https://m2dgbasketball.com'; // This would be your actual deployed URL

    return {
      twitter: `${baseTexts[type]} ${hashtags} ${appUrl}`,
      facebook: `${baseTexts[type]} Join me on M2DG Basketball Platform! ${appUrl}`,
      linkedin: `${baseTexts[type]} Check out this amazing basketball platform! ${appUrl}`,
      instagram: baseTexts[type] // Instagram doesn't support direct URL sharing
    };
  };

  const shareToSocial = async (platform) => {
    setIsSharing(true);
    const shareTexts = generateShareText(platform);
    
    try {
      switch (platform) {
        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}`;
          window.open(twitterUrl, '_blank', 'width=600,height=400');
          break;
          
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://m2dgbasketball.com')}&quote=${encodeURIComponent(shareTexts.facebook)}`;
          window.open(facebookUrl, '_blank', 'width=600,height=400');
          break;
          
        case 'linkedin':
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://m2dgbasketball.com')}&summary=${encodeURIComponent(shareTexts.linkedin)}`;
          window.open(linkedinUrl, '_blank', 'width=600,height=400');
          break;
          
        case 'copy':
          await navigator.clipboard.writeText(shareTexts.twitter);
          alert('Share text copied to clipboard!');
          break;
          
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: 'M2DG Basketball Platform',
              text: shareTexts.twitter,
              url: 'https://m2dgbasketball.com'
            });
          } else {
            // Fallback to copy
            await navigator.clipboard.writeText(shareTexts.twitter);
            alert('Share text copied to clipboard!');
          }
          break;
          
        default:
          console.log('Unknown platform:', platform);
      }
    } catch (error) {
      console.error('Failed to share:', error);
      alert('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <span>📱</span>
        <span>Share Your Achievement</span>
      </h3>
      
      <div className="mb-4 p-4 bg-white/5 rounded-xl">
        <p className="text-gray-300 text-sm">Preview:</p>
        <p className="text-white mt-2">{generateShareText('twitter').twitter}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => shareToSocial('twitter')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          <span className="text-lg">🐦</span>
          <span className="text-sm font-medium">Twitter</span>
        </button>

        <button
          onClick={() => shareToSocial('facebook')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          <span className="text-lg">📘</span>
          <span className="text-sm font-medium">Facebook</span>
        </button>

        <button
          onClick={() => shareToSocial('linkedin')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          <span className="text-lg">💼</span>
          <span className="text-sm font-medium">LinkedIn</span>
        </button>

        <button
          onClick={() => shareToSocial('copy')}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          <span className="text-lg">📋</span>
          <span className="text-sm font-medium">Copy</span>
        </button>
      </div>

      {/* Mobile native sharing */}
      <div className="mt-3">
        <button
          onClick={() => shareToSocial('native')}
          disabled={isSharing}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          <span className="text-lg">📤</span>
          <span className="text-sm font-medium">Share via...</span>
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-xs">
          Share your basketball achievements and invite friends to join M2DG!
        </p>
      </div>
    </div>
  );
};

// Social Media Connect Component
const SocialConnect = () => {
  const [connectedAccounts, setConnectedAccounts] = useState({
    twitter: false,
    facebook: false,
    instagram: false,
    tiktok: false
  });

  const connectSocial = (platform) => {
    // In a real app, this would redirect to OAuth flow
    alert(`Connect ${platform} functionality would redirect to OAuth flow here.`);
  };

  const disconnectSocial = (platform) => {
    setConnectedAccounts(prev => ({ ...prev, [platform]: false }));
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <span>🔗</span>
        <span>Connect Social Accounts</span>
      </h3>
      
      <div className="space-y-3">
        {Object.entries(connectedAccounts).map(([platform, connected]) => (
          <div key={platform} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {platform === 'twitter' && '🐦'}
                {platform === 'facebook' && '📘'}
                {platform === 'instagram' && '📷'}
                {platform === 'tiktok' && '🎵'}
              </span>
              <div>
                <h4 className="text-white font-medium capitalize">{platform}</h4>
                <p className="text-gray-400 text-sm">
                  {connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            
            {connected ? (
              <button
                onClick={() => disconnectSocial(platform)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => connectSocial(platform)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
        <div className="flex items-start space-x-2">
          <span className="text-blue-400 text-lg">💡</span>
          <div>
            <h4 className="text-blue-300 font-medium">Auto-Share Benefits</h4>
            <p className="text-blue-200 text-sm">
              Connect your accounts to automatically share achievements and build your basketball presence!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SocialSharing, SocialConnect };