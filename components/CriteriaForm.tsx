import React, { useState } from 'react';
import { Criteria } from '../types';
import { DECADES, GENRES, MOODS, VOCAL_TYPES, DIFFICULTIES } from '../constants';

interface CriteriaFormProps {
  onSubmit: (criteria: Criteria) => void;
  isGenerating: boolean;
}

const CriteriaForm: React.FC<CriteriaFormProps> = ({ onSubmit, isGenerating }) => {
  const [vocalType, setVocalType] = useState(VOCAL_TYPES[3].id); // Default 'Any'
  const [decade, setDecade] = useState(DECADES[0]);
  const [genre, setGenre] = useState(GENRES[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0].id);
  const [customRequest, setCustomRequest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      vocalType: VOCAL_TYPES.find(v => v.id === vocalType)?.label || 'Any',
      decade,
      genre,
      mood,
      difficulty: DIFFICULTIES.find(d => d.id === difficulty)?.label || 'Any',
      customRequest: customRequest.trim()
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-neon-surface/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up">
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        
        {/* Vocal Type Section */}
        <div className="space-y-3">
          <label className="text-neon-blue font-semibold tracking-wide uppercase text-sm">Vocal Style</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {VOCAL_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setVocalType(type.id)}
                className={`py-3 px-2 md:px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  vocalType === type.id
                    ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(191,0,255,0.5)]'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Select Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-neon-pink font-semibold tracking-wide uppercase text-sm">Decade</label>
            <select
              value={decade}
              onChange={(e) => setDecade(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-neon-pink focus:ring-1 focus:ring-neon-pink outline-none transition-colors"
            >
              {DECADES.map(d => <option key={d} value={d} className="bg-neon-surface">{d}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-neon-blue font-semibold tracking-wide uppercase text-sm">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-colors"
            >
              {GENRES.map(g => <option key={g} value={g} className="bg-neon-surface">{g}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-purple-400 font-semibold tracking-wide uppercase text-sm">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-colors"
            >
              {MOODS.map(m => <option key={m} value={m} className="bg-neon-surface">{m}</option>)}
            </select>
          </div>

           <div className="space-y-2">
            <label className="text-green-400 font-semibold tracking-wide uppercase text-sm">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none transition-colors"
            >
              {DIFFICULTIES.map(d => <option key={d.id} value={d.id} className="bg-neon-surface">{d.label}</option>)}
            </select>
          </div>

        </div>

        {/* Custom Request Input */}
        <div className="space-y-2">
          <label className="text-yellow-400 font-semibold tracking-wide uppercase text-sm">
            Special Request <span className="text-gray-500 text-xs normal-case">(Optional)</span>
          </label>
          <input
            type="text"
            value={customRequest}
            onChange={(e) => setCustomRequest(e.target.value)}
            placeholder='e.g. "Disney songs", "Breakup anthems", "Songs with key changes"'
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-colors"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-lg tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              isGenerating
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-[0_0_20px_rgba(191,0,255,0.4)] hover:shadow-[0_0_30px_rgba(191,0,255,0.6)]'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding Tracks...
              </span>
            ) : (
              "Find My Songs"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CriteriaForm;