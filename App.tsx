import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CriteriaForm from './components/CriteriaForm';
import SongCard from './components/SongCard';
import LoadingScreen from './components/LoadingScreen';
import LyricModal from './components/LyricModal';
import { AppState, Criteria, Song } from './types';
import { generateSongRecommendations } from './services/geminiService';

type Tab = 'SEARCH' | 'SETLIST' | 'HISTORY';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [songs, setSongs] = useState<Song[]>([]);
  const [savedSongs, setSavedSongs] = useState<Song[]>([]);
  const [searchHistory, setSearchHistory] = useState<Criteria[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Song[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [lastCriteria, setLastCriteria] = useState<Criteria | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('SEARCH');

  // --- Persistence Effects ---

  // Load all data from local storage on mount
  useEffect(() => {
    const loadFromStorage = (key: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setter(JSON.parse(saved));
        } catch (e) {
          console.error(`Failed to parse ${key}`, e);
        }
      }
    };

    loadFromStorage('karaokePalSetlist', setSavedSongs);
    loadFromStorage('karaokePalSearchHistory', setSearchHistory);
    loadFromStorage('karaokePalRecentlyViewed', setRecentlyViewed);
  }, []);

  // Save effects
  useEffect(() => {
    localStorage.setItem('karaokePalSetlist', JSON.stringify(savedSongs));
  }, [savedSongs]);

  useEffect(() => {
    localStorage.setItem('karaokePalSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('karaokePalRecentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);


  // --- Handlers ---

  const toggleFavorite = (song: Song) => {
    setSavedSongs(prev => {
      const exists = prev.some(s => s.title === song.title && s.artist === song.artist);
      if (exists) {
        return prev.filter(s => !(s.title === song.title && s.artist === song.artist));
      } else {
        return [...prev, song];
      }
    });
  };

  const isFavorite = (song: Song) => {
    return savedSongs.some(s => s.title === song.title && s.artist === song.artist);
  };

  const addToSearchHistory = (criteria: Criteria) => {
    setSearchHistory(prev => {
      // Filter out identical criteria to avoid duplicates, keep last 10
      const filtered = prev.filter(c => JSON.stringify(c) !== JSON.stringify(criteria));
      return [criteria, ...filtered].slice(0, 10);
    });
  };

  const addToRecentlyViewed = (song: Song) => {
    setRecentlyViewed(prev => {
      // Remove if exists (to bump to top), keep last 12
      const filtered = prev.filter(s => !(s.title === song.title && s.artist === song.artist));
      return [song, ...filtered].slice(0, 12);
    });
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    addToRecentlyViewed(song);
  };

  const executeSearch = async (criteria: Criteria) => {
    setAppState(AppState.LOADING);
    setError(null);
    setLastCriteria(criteria);
    setActiveTab('SEARCH');

    try {
      const recommendations = await generateSongRecommendations(criteria);
      setSongs(recommendations);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Failed to generate songs. Please verify your API key or try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleCriteriaSubmit = (criteria: Criteria) => {
    addToSearchHistory(criteria);
    executeSearch(criteria);
  };

  const restoreSearch = (criteria: Criteria) => {
    // Scroll to top to see loader
    window.scrollTo({ top: 0, behavior: 'smooth' });
    executeSearch(criteria);
  };

  const handleReset = () => {
    setAppState(AppState.SETUP);
    setSongs([]);
    setError(null);
    setSelectedSong(null);
  };

  const clearHistory = () => {
    if(confirm("Are you sure you want to clear your search history?")) {
      setSearchHistory([]);
      setRecentlyViewed([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] text-white font-sans selection:bg-neon-pink selection:text-white pb-24">
      <Header />

      {/* Sticky Tab Navigation */}
      {appState !== AppState.SETUP && appState !== AppState.LOADING && (
        <div className="sticky top-[56px] md:top-[92px] z-40 bg-[#0f0f1a]/95 backdrop-blur-md border-b border-white/10 mb-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between md:justify-center md:gap-12">
              <button 
                onClick={() => setActiveTab('SEARCH')}
                className={`flex-1 md:flex-none py-3 md:py-4 px-2 font-bold uppercase tracking-wider text-[10px] md:text-sm border-b-2 transition-colors text-center ${activeTab === 'SEARCH' ? 'border-neon-blue text-neon-blue' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Results {songs.length > 0 && `(${songs.length})`}
              </button>
              <button 
                 onClick={() => setActiveTab('SETLIST')}
                 className={`flex-1 md:flex-none py-3 md:py-4 px-2 font-bold uppercase tracking-wider text-[10px] md:text-sm border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'SETLIST' ? 'border-neon-pink text-neon-pink' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Setlist
                {savedSongs.length > 0 && (
                  <span className="bg-neon-pink text-white text-[10px] px-1.5 py-0.5 rounded-full">{savedSongs.length}</span>
                )}
              </button>
              <button 
                 onClick={() => setActiveTab('HISTORY')}
                 className={`flex-1 md:flex-none py-3 md:py-4 px-2 font-bold uppercase tracking-wider text-[10px] md:text-sm border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'HISTORY' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                History
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 pt-4">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 text-center max-w-2xl mx-auto flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button onClick={() => setAppState(AppState.SETUP)} className="underline hover:text-white ml-2">Try Again</button>
          </div>
        )}

        {/* State: Setup */}
        {appState === AppState.SETUP && (
          <div className="flex flex-col items-center animate-fade-in">
             
             {(savedSongs.length > 0 || recentlyViewed.length > 0) && (
               <div className="flex gap-3 mb-6">
                  {savedSongs.length > 0 && (
                    <button 
                      onClick={() => { setAppState(AppState.RESULTS); setActiveTab('SETLIST'); }}
                      className="flex items-center gap-2 text-neon-pink hover:text-white transition-colors text-xs md:text-sm font-medium border border-neon-pink/30 px-4 py-2 rounded-full bg-neon-pink/5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      My Setlist
                    </button>
                  )}
                  {recentlyViewed.length > 0 && (
                    <button 
                      onClick={() => { setAppState(AppState.RESULTS); setActiveTab('HISTORY'); }}
                      className="flex items-center gap-2 text-purple-400 hover:text-white transition-colors text-xs md:text-sm font-medium border border-purple-400/30 px-4 py-2 rounded-full bg-purple-400/5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Recent History
                    </button>
                  )}
               </div>
             )}

             <div className="mb-8 text-center space-y-2">
               <h2 className="text-2xl font-bold text-white">Setup Your Session</h2>
               <p className="text-gray-400 text-sm">Tell us what you want to sing, and we'll handle the playlist.</p>
             </div>
             <CriteriaForm onSubmit={handleCriteriaSubmit} isGenerating={false} />
             
             {/* Quick Access to Recent Searches on Setup Page */}
             {searchHistory.length > 0 && (
               <div className="w-full max-w-2xl mt-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 3).map((item, i) => (
                       <button 
                         key={i}
                         onClick={() => restoreSearch(item)}
                         className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-300 transition-colors text-left"
                       >
                         {item.customRequest ? `"${item.customRequest}"` : `${item.decade} ${item.genre} • ${item.mood}`}
                       </button>
                    ))}
                  </div>
               </div>
             )}
          </div>
        )}

        {/* State: Loading */}
        {appState === AppState.LOADING && (
          <LoadingScreen />
        )}

        {/* State: Results / Setlist / History */}
        {appState === AppState.RESULTS && (
          <div className="animate-fade-in">
            
            {/* VIEW: SEARCH RESULTS */}
            {activeTab === 'SEARCH' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neon-surface/30 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="text-center md:text-left">
                    <h2 className="text-lg md:text-xl font-bold text-white">Suggestions</h2>
                    <p className="text-gray-400 text-xs mt-1">
                      Criteria: <span className="text-neon-blue">{lastCriteria?.mood}</span> • <span className="text-neon-pink">{lastCriteria?.decade}</span> • <span className="text-purple-400">{lastCriteria?.genre}</span>
                      {lastCriteria?.customRequest && <span className="text-yellow-400 block mt-1">Req: "{lastCriteria.customRequest}"</span>}
                    </p>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="w-full md:w-auto px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-all whitespace-nowrap"
                  >
                    New Search
                  </button>
                </div>

                {songs.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {songs.map((song, index) => (
                      <SongCard 
                        key={`${song.title}-${index}`} 
                        song={song} 
                        index={index} 
                        onSelect={handleSongSelect}
                        isFavorite={isFavorite(song)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                   <div className="text-center py-12 text-gray-500">No songs found. Try adjusting your criteria.</div>
                )}
                
                {songs.length > 0 && (
                  <div className="text-center mt-12 p-8 bg-neon-surface/20 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold mb-2">Not feeling these?</h3>
                    <button 
                      onClick={handleReset}
                      className="text-neon-pink hover:text-white underline underline-offset-4 transition-colors"
                    >
                      Adjust criteria and scan again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: SETLIST */}
            {activeTab === 'SETLIST' && (
              <div className="space-y-8">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neon-pink/10 p-4 rounded-xl border border-neon-pink/20 backdrop-blur-sm">
                  <div className="text-center md:text-left">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                       My Setlist 
                       <svg className="w-5 h-5 text-neon-pink fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">
                      Your saved songs are stored locally on this device.
                    </p>
                  </div>
                   <button 
                    onClick={handleReset}
                    className="w-full md:w-auto px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-all whitespace-nowrap"
                  >
                    Add More Songs
                  </button>
                </div>

                {savedSongs.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {savedSongs.map((song, index) => (
                      <SongCard 
                        key={`saved-${song.title}-${index}`} 
                        song={song} 
                        index={index} 
                        onSelect={handleSongSelect}
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5 border-dashed">
                    <h3 className="text-xl text-gray-300 mb-2">Your setlist is empty</h3>
                    <p className="text-gray-500 mb-6">Heart songs from your search results to save them here.</p>
                    <button 
                      onClick={() => setActiveTab('SEARCH')}
                      className="px-6 py-3 bg-neon-purple rounded-lg hover:bg-neon-purple/80 transition-colors"
                    >
                      Browse Songs
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: HISTORY */}
            {activeTab === 'HISTORY' && (
              <div className="space-y-10 animate-fade-in">
                 
                 <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-purple-400">Search History</h2>
                    <button onClick={clearHistory} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear History</button>
                 </div>

                 {/* Recent Searches List */}
                 {searchHistory.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {searchHistory.map((item, idx) => (
                        <button 
                          key={`hist-search-${idx}`}
                          onClick={() => restoreSearch(item)}
                          className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl group transition-all text-left"
                        >
                          <div>
                            <p className="font-bold text-white group-hover:text-neon-blue transition-colors">
                              {item.customRequest ? `"${item.customRequest}"` : `${item.genre} from the ${item.decade}`}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex gap-2">
                               <span className="bg-black/30 px-1.5 py-0.5 rounded text-neon-pink">{item.mood}</span>
                               <span className="bg-black/30 px-1.5 py-0.5 rounded">{item.difficulty}</span>
                            </p>
                          </div>
                          <div className="text-neon-blue opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </div>
                        </button>
                      ))}
                   </div>
                 ) : (
                   <p className="text-gray-500 text-sm italic">No recent searches found.</p>
                 )}

                 <div className="border-t border-white/10 pt-8">
                    <h2 className="text-xl font-bold text-white mb-4">Recently Viewed Songs</h2>
                    {recentlyViewed.length > 0 ? (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {recentlyViewed.map((song, index) => (
                          <SongCard 
                            key={`viewed-${song.title}-${index}`} 
                            song={song} 
                            index={index} 
                            onSelect={handleSongSelect}
                            isFavorite={isFavorite(song)}
                            onToggleFavorite={toggleFavorite}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">Songs you view will appear here.</p>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}

        {/* State: Error (Fallback if not handled in banner) */}
        {appState === AppState.ERROR && !error && (
           <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
              <button onClick={handleReset} className="px-6 py-2 bg-neon-purple rounded-lg">Try Again</button>
           </div>
        )}
      </main>

      {/* Modal Overlay */}
      {selectedSong && (
        <LyricModal 
          song={selectedSong} 
          onClose={() => setSelectedSong(null)} 
        />
      )}
    </div>
  );
};

export default App;