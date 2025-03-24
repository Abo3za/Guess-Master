import { GameItem, Category, Difficulty, DIFFICULTY_HINTS } from '../types';
import animeDB from '../Database/AnimeDB.json';

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
    const randomAnime = animeDB[Math.floor(Math.random() * animeDB.length)];
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
    
    const fallbackAnime = animeDB[0];
    const details = getDetailsForCategory(fallbackAnime, difficulty);
    
    return {
      id: fallbackAnime.id.toString(),
      category,
      name: fallbackAnime.title,
      details: details
    };
  }
}