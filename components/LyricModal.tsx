import React, { useState } from 'react';
import { Song } from '../types';

interface LyricModalProps {
  song: Song;
  onClose: () => void;
}

const LyricModal: React.FC<LyricModalProps> = ({ song, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
  
  const generateHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; 
    }
    return Math.abs(hash);
  };

  const seed = generateHash(`${song.title}-${song.artist}`);
  // Use a higher resolution for the modal
  const imageUrl = `https://loremflickr.com/600/600/music,concert,neon,singer/all?lock=${seed}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-3xl bg-[#1a1a2e] border border-neon-purple/30 rounded-2xl shadow-[0_0_50px_rgba(191,0,255,0.3)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-[#0f0f1a]">
           {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse z-10 flex items-center justify-center">
               <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
            </div>
          )}

          <img 
            src={imageUrl} 
            alt={song.title} 
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent md:bg-gradient-to-r pointer-events-none"></div>
          
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 z-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1 leading-tight drop-shadow-lg">{song.title}</h2>
            <p className="text-neon-blue text-lg font-medium drop-shadow-md">{song.artist}</p>
            <div className="flex flex-wrap gap-2 mt-3">
               <span className="px-2 py-1 rounded bg-white/10 backdrop-blur text-xs text-white border border-white/10">{song.year}</span>
               <span className="px-2 py-1 rounded bg-white/10 backdrop-blur text-xs text-white border border-white/10">{song.genre}</span>
               <span className="px-2 py-1 rounded bg-white/10 backdrop-blur text-xs text-white border border-white/10">{song.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto bg-[#1a1a2e]">
          
          <div className="mb-6">
            <h3 className="text-neon-pink text-sm font-bold uppercase tracking-widest mb-3">Lyrics Preview</h3>
            <div className="bg-black/30 p-6 rounded-xl border border-white/5 shadow-inner">
              <p className="text-gray-200 text-lg italic leading-relaxed whitespace-pre-wrap font-serif">
                "{song.lyricSnippet}"
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-2">Vibe Check</h3>
            <p className="text-gray-400">{song.moodDescription}</p>
          </div>

          <a 
            href={spotifySearchUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-3.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] hover:scale-[1.02] active:scale-[0.98] text-black font-bold text-center transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
               <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Open in Spotify
          </a>
        </div>

      </div>
    </div>
  );
};

export default LyricModal;