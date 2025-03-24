import { GameItem, Category, Difficulty } from '../types';
import tvSeriesDB from '../Database/TVSeries.json';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getDetailsForTVShow(show: any, difficulty: Difficulty = 'normal'): any[] {
  const allDetails = [
    { label: 'سنة الإصدار', value: show.release_year?.toString() || 'غير معروف', revealed: false },
    { label: 'عدد المواسم', value: show.seasons?.toString() || 'غير معروف', revealed: false },
    { label: 'الممثل الرئيسي', value: show.main_actor || 'غير معروف', revealed: false },
    { label: 'عدد الحلقات', value: show.total_episodes?.toString() || 'غير معروف', revealed: false },
    { label: 'التصنيف', value: show.genre || 'غير معروف', revealed: false },
    { label: 'المنصة', value: show.platform || 'غير معروف', revealed: false }
  ];

  if (difficulty === 'hard') {
    return shuffleArray(allDetails).slice(0, 3);
  }
  return allDetails;
}

export async function fetchRandomTVShow(category: Category, difficulty: Difficulty): Promise<GameItem> {
  if (!Array.isArray(tvSeriesDB.shows) || tvSeriesDB.shows.length === 0) {
    throw new Error('قاعدة بيانات المسلسلات فارغة أو غير صالحة');
  }

  try {
    const randomShow = tvSeriesDB.shows[Math.floor(Math.random() * tvSeriesDB.shows.length)];
    const details = getDetailsForTVShow(randomShow, difficulty);
    
    return {
      id: randomShow.id.toString(),
      category,
      name: randomShow.title,
      details
    };
  } catch (error) {
    console.error('Error fetching TV show:', error);
    throw new Error('فشل في جلب بيانات المسلسل');
  }
}
