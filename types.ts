export interface Song {
  title: string;
  artist: string;
  year: string;
  genre: string;
  lyricSnippet: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  spotifyUrl?: string;
  moodDescription: string;
}

export interface Criteria {
  vocalType: string; // e.g., Male, Female, Duet, Any
  decade: string;
  genre: string;
  mood: string; // Renamed from vibe
  difficulty: string;
  customRequest?: string; // New field for specific user prompts
}

export enum AppState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}