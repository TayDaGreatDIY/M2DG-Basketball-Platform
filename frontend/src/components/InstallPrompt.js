import React, { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const InstallPrompt = () => {
  const { isInstallable, promptInstall } = useInstallPrompt();
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || !isVisible) return null;

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setIsVisible(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-2xl border border-orange-400/20 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏀</div>
            <div>
              <div className="font-bold text-sm">Install M2DG Basketball</div>
              <div className="text-xs opacity-90">Get the full app experience</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;