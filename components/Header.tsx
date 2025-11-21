import React from 'react';

const Header: React.FC = () => {
  const handleShare = async () => {
    const shareData = {
      title: 'Karaoke Pal',
      text: 'Check out this AI Karaoke assistant!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full py-3 md:py-6 px-4 flex flex-col items-center justify-center text-center bg-[#0f0f1a]/90 backdrop-blur-md border-b border-neon-purple/20 shadow-lg transition-all duration-300 relative">
      
      {/* Share Button */}
      <button 
        onClick={handleShare}
        className="absolute right-4 top-3 md:top-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-neon-blue active:scale-95"
        aria-label="Share App"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      <h1 className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-purple-400 to-neon-blue tracking-tight drop-shadow-lg">
        KARAOKE PAL
      </h1>
      <p className="text-gray-400 mt-1 text-xs md:text-base max-w-md hidden md:block">
        Find your perfect song. AI-powered recommendations based on your mood and style.
      </p>
    </header>
  );
};

export default Header;