import { GameItem, Category, Difficulty } from '../types';
import gamesDB from '../Database/GamesDB.json';

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
    return newArray;
}

// Helper function to format genres
function formatGenres(genres: string[]): string {
  if (!genres || !Array.isArray(genres)) return 'Unknown';
  return genres.join(', ');
}

function getDetailsForCategory(game: any, difficulty: Difficulty = 'normal'): any[] {
  const allDetails = [
    { label: 'سنة الإصدار', value: game.release_year?.toString() || 'Unknown', revealed: false },
    { label: 'المطور', value: game.developer || 'Unknown', revealed: false },
    { label: 'المنصة', value: game.platform || 'Unknown', revealed: false },
    { label: 'التقييم', value: game.rating?.toString() + '/10' || 'Unknown', revealed: false },
    { label: 'التصنيف', value: game.genre || 'Unknown', revealed: false },
    { label: 'الوضع', value: game.mode || 'Unknown', revealed: false }
  ];

  if (difficulty === 'hard') {
    return shuffleArray([...allDetails]).slice(0, 3);
  }
  return allDetails;
}

export async function fetchRandomGame(category: Category, difficulty: Difficulty): Promise<GameItem> {
  if (!gamesDB?.games?.length) {
    throw new Error('Games database is empty or invalid');
  }

  try {
    const randomGame = gamesDB.games[Math.floor(Math.random() * gamesDB.games.length)];
    if (!randomGame) {
      throw new Error('No game data available');
    }
    
    const details = getDetailsForCategory(randomGame, difficulty);
    return {
      id: randomGame.id.toString(),
      category,
      name: randomGame.title,
      details,
    };
  } catch (error) {
    console.error('Error fetching game data:', error);
    
    const fallbackGame = gamesDB.games[0];
    if (!fallbackGame) {
      throw new Error('No fallback game data available');
    }
    const details = getDetailsForCategory(fallbackGame, difficulty);
    
    return {
      id: fallbackGame.id.toString(),
      category,
      name: fallbackGame.title,
      details
    };
  }
}

export async function fetchRandomMovie(category: Category = 'movies', difficulty: Difficulty = 'normal'): Promise<GameItem> {
  if (!Array.isArray(gamesDB) || gamesDB.length === 0) {
    throw new Error('Movies database is empty or invalid');
  }

  try {
    const randomMovie = gamesDB[Math.floor(Math.random() * gamesDB.length)];
    const details = getDetailsForCategory(randomMovie, difficulty);
    return {
      id: randomMovie.id.toString(),
      category,
      name: randomMovie.title,
      details
    };
  } catch (error) {
    console.error('Error fetching movie:', error);
    if (!gamesDB[0]) {
      throw new Error('No fallback movie data available');
    }
    const details = getDetailsForCategory(gamesDB[0], difficulty);
    return {
      id: gamesDB[0].id.toString(),
      category,
      name: gamesDB[0].title,
      details
    };
  }
}
