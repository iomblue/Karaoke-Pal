import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center text-center space-y-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-neon-pink/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-neon-pink rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-neon-blue/20 rounded-full"></div>
        <div className="absolute inset-4 border-4 border-b-neon-blue rounded-full animate-spin-slow"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
           </svg>
        </div>
      </div>
      
      <div className="space-y-2 animate-pulse">
        <h2 className="text-2xl font-bold text-white">Scanning Music Database...</h2>
        <p className="text-neon-blue">Analyzing vocal ranges • Matching vibes • Filtering genres</p>
      </div>
    </div>
  );
};

export default LoadingScreen;