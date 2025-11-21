import { GoogleGenAI, Type } from "@google/genai";
import { Criteria, Song } from "../types";

const createClient = () => {
  // Use process.env.API_KEY exclusively as per guidelines
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

export const generateSongRecommendations = async (criteria: Criteria): Promise<Song[]> => {
  const ai = createClient();

  const customInstruction = criteria.customRequest 
    ? `IMPORTANT - USER SPECIAL REQUEST: "${criteria.customRequest}". Prioritize this request over other criteria if necessary.` 
    : "";

  // MODIFIED: Reduced count to 12 and requested shorter lyrics to ensure high success rate.
  const prompt = `
    Act as an expert Karaoke DJ with deep knowledge of Spotify trends and music history.
    I need a curated list of 12 karaoke songs that match the following criteria:
    - Vocal Preference: ${criteria.vocalType}
    - Decade/Era: ${criteria.decade}
    - Genre: ${criteria.genre}
    - Mood/Atmosphere: ${criteria.mood}
    - Difficulty Level: ${criteria.difficulty}
    ${customInstruction}

    For each song, provide:
    1. Title
    2. Artist
    3. Release Year
    4. Genre
    5. A very short, iconic lyric snippet (1-2 lines maximum). If the lyrics are copyrighted or blocked, provide a brief description of the hook instead.
    6. Difficulty rating (Easy, Medium, or Hard).
    7. A very brief description of the mood (e.g., "High energy party anthem").

    Ensure the songs are popular enough that a standard karaoke machine would have them.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              year: { type: Type.STRING },
              genre: { type: Type.STRING },
              lyricSnippet: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              moodDescription: { type: Type.STRING },
            },
            required: ["title", "artist", "year", "genre", "lyricSnippet", "difficulty", "moodDescription"]
          }
        }
      }
    });

    // Helper to check for text existence
    const text = response.text;

    if (text) {
      try {
        const data = JSON.parse(text);
        return data as Song[];
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.log("Raw Text:", text);
        throw new Error("Failed to parse song data from AI.");
      }
    }
    
    // Enhanced debugging for empty responses
    if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.finishReason !== "STOP") {
             console.warn("Gemini generation blocked/stopped. Reason:", candidate.finishReason);
             throw new Error(`Song generation blocked by AI safety filter (${candidate.finishReason}). Try requesting fewer songs or generic criteria.`);
        }
    }

    throw new Error("No data returned from Gemini (Empty Response)");
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
};