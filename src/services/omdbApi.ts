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
function formatGenres(genre: string): string {
  if (!genre) return 'Unknown';
  return genre;
}

function getDetailsForCategory(data: any, difficulty: Difficulty = 'normal'): any[] {
  const allDetails = [
    { label: 'سنة الإصدار', value: data.release_year?.toString() || 'Unknown', revealed: false },
    { label: 'المخرج', value: data.director || 'Unknown', revealed: false },
    { label: 'الممثل الرئيسي', value: data.main_actor || 'Unknown', revealed: false },
    { label: 'التقييم', value: data.rating?.toString() + '/10' || 'Unknown', revealed: false },
    { label: 'التصنيف', value: formatGenres(data.genre), revealed: false },
    { label: 'معلومة مميزة', value: data.highlight || 'Unknown', revealed: false }
  ];

  if (difficulty === 'hard') {
    return shuffleArray([...allDetails]).slice(0, 3);
  }
  return allDetails;
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
