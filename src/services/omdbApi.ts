import { GameItem, Category, Difficulty } from '../types';
import moviesDB from '../Database/MoviesDB.json';

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

function getDetailsForCategory(data: any, difficulty: Difficulty = 'normal'): any[] {
  const allDetails = [
    { label: 'سنة الإصدار', value: data.release_year?.toString() || 'Unknown', revealed: false },
    { label: 'الاستوديو', value: data.studio || 'Unknown', revealed: false },
    { label: 'عدد الحلقات', value: data.episodes?.toString() || 'Unknown', revealed: false },
    { label: 'التقييم', value: data.rating?.toString() + '/10' || 'Unknown', revealed: false },
    { label: 'التصنيف', value: formatGenres(data.genre), revealed: false },
    { label: 'الشخصية الرئيسية', value: data.main_character || 'Unknown', revealed: false }
  ];

  if (difficulty === 'hard') {
    return shuffleArray([...allDetails]).slice(0, 3);
  }
  return allDetails;
}

export async function fetchRandomAnime(category: Category, difficulty: Difficulty): Promise<GameItem> {
  try {
    const randomAnime = moviesDB[Math.floor(Math.random() * moviesDB.length)];
    if (!randomAnime) {
      throw new Error('No anime data available');
    }
    
    const details = getDetailsForCategory(randomAnime, difficulty);
    return {
      id: randomAnime.id.toString(),
      category,
      name: randomAnime.title,
      details,
    };
  } catch (error) {
    console.error('Error fetching anime data:', error);
    
    const fallbackAnime = moviesDB[0];
    const details = getDetailsForCategory(fallbackAnime, difficulty);
    
    return {
      id: fallbackAnime.id.toString(),
      category,
      name: fallbackAnime.title,
      details: details
    };
  }
}

export async function fetchRandomMovie(category: Category = 'movies', difficulty: Difficulty = 'normal'): Promise<GameItem> {
  if (!Array.isArray(moviesDB) || moviesDB.length === 0) {
    throw new Error('Movies database is empty or invalid');
  }

  try {
    const randomMovie = moviesDB[Math.floor(Math.random() * moviesDB.length)];
    const details = getDetailsForCategory(randomMovie, difficulty);
    return {
      id: randomMovie.id.toString(),
      category,
      name: randomMovie.title,
      details
    };
  } catch (error) {
    console.error('Error fetching movie:', error);
    if (!moviesDB[0]) {
      throw new Error('No fallback movie data available');
    }
    const details = getDetailsForCategory(moviesDB[0], difficulty);
    return {
      id: moviesDB[0].id.toString(),
      category,
      name: moviesDB[0].title,
      details
    };
  }
}
