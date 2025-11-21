import React, { useState } from 'react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  index: number;
  onSelect: (song: Song) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, index, onSelect, isFavorite, onToggleFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate a consistent hash from the song details for the image seed
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
  const imageUrl = `https://loremflickr.com/400/400/music,concert,neon,singer/all?lock=${seed}`;
  
  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'Hard': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-gray-400';
    }
  };

  return (
    <div 
      onClick={() => onSelect(song)}
      className="group relative bg-neon-surface border border-white/5 rounded-lg md:rounded-xl overflow-hidden hover:border-neon-purple/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(191,0,255,0.15)] flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
    >
      
      {/* Image Header */}
      <div className="relative h-28 md:h-40 w-full overflow-hidden bg-[#0f0f1a]">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse z-10 flex items-center justify-center">
             <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
          </div>
        )}
        
        <img 
          src={imageUrl} 
          alt={`${song.title} cover`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 ${imageLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-surface to-transparent pointer-events-none"></div>
        
        {/* Rank Badge */}
        <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm font-bold text-neon-pink z-20">
          #{index + 1}
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(song);
            }}
            className="absolute top-1 right-1 md:top-2 md:right-2 z-30 p-1.5 md:p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 transition-all group/btn"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 md:h-5 md:w-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-white group-hover/btn:text-red-400'}`} 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={isFavorite ? 0 : 2}
              fill={isFavorite ? "currentColor" : "none"}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="mb-2 md:mb-3">
           <div className="flex justify-between items-start mb-0.5 md:mb-1">
              <h3 className="text-sm md:text-xl font-bold text-white leading-tight group-hover:text-neon-blue transition-colors truncate pr-1 w-full">{song.title}</h3>
           </div>
          <p className="text-gray-400 text-xs md:text-sm font-medium truncate">{song.artist} • {song.year}</p>
        </div>

        <div className="bg-black/20 p-2 md:p-3 rounded-lg mb-2 md:mb-4 border-l-2 border-neon-pink flex-grow hidden md:block">
          <p className="text-gray-300 text-sm italic line-clamp-3">"{song.lyricSnippet}"</p>
          <p className="text-xs text-neon-purple mt-2 font-semibold uppercase tracking-wider">Click to read more</p>
        </div>
        
        {/* Mobile Lyric Snippet (More Compact) */}
        <div className="md:hidden mb-2 flex-grow">
           <p className="text-gray-400 text-[10px] italic line-clamp-2">"{song.lyricSnippet}"</p>
        </div>

        <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0">
           <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400">
             <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-neon-purple flex-shrink-0"></span>
             <span className="truncate max-w-[80px] md:max-w-[100px]">{song.moodDescription}</span>
           </div>
           <span className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded border self-start md:self-auto ${getDifficultyColor(song.difficulty)}`}>
             {song.difficulty}
           </span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;