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

function getFallbackMovieData(category: Category): GameItem {
  return {
    id: 'fallback-1',
    category: category,
    name: 'The Shawshank Redemption',
    details: [
      { label: 'Genre', value: 'Drama', revealed: false },
      { label: 'Director', value: 'Frank Darabont', revealed: false },
      { label: 'Release Year', value: '1994', revealed: false },
      { label: 'Actors', value: 'Tim Robbins, Morgan Freeman', revealed: false },
      { label: 'Plot', value: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', revealed: false },
      { label: 'Awards', value: 'Nominated for 7 Oscars', revealed: false }
    ]
  };
}

export async function fetchRandomMovie(category: Category): Promise<GameItem> {
  try {
    if (!Array.isArray(moviesDB) || moviesDB.length === 0) {
      throw new Error('Movies database is empty or invalid');
    }

    const randomMovie = moviesDB[Math.floor(Math.random() * moviesDB.length)];
    
    if (!randomMovie) {
      throw new Error('No movie data available');
    }

    const details = [
      { label: 'Genre', value: randomMovie.genre, revealed: false },
      { label: 'Director', value: randomMovie.director, revealed: false },
      { label: 'Release Year', value: randomMovie.release_year.toString(), revealed: false },
      { label: 'Main Actor', value: randomMovie.main_actor, revealed: false },
      { label: 'Rating', value: randomMovie.rating.toString() + '/10', revealed: false },
      { label: 'Highlight', value: randomMovie.highlight, revealed: false }
    ];

    return {
      id: randomMovie.id.toString(),
      category: category,
      name: randomMovie.title,
      details
    };
  } catch (error) {
    console.error('Error with movie data:', error);
    return getFallbackMovieData(category);
  }
}
