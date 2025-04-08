import { Category, GameItem } from '../types';
import animeDB from '../Database/AnimeDB.json';
import moviesDB from '../Database/MoviesDB.json';
import tvSeriesDB from '../Database/TVSeries.json';
import gamesDB from '../Database/GamesDB.json';
import footballDB from '../Database/FootballDB.json';
import wweDB from '../Database/WWEDB.json';
import whoAmIDB from '../Database/WhoAmIDB.json';

const categoryToDB: Record<Category, any[]> = {
  anime: animeDB,
  movies: moviesDB,
  tv: tvSeriesDB,
  games: gamesDB,
  football: footballDB,
  wwe: wweDB,
  whoami: whoAmIDB,
  countries: [] // No database for countries yet
};

export const getRandomItem = (category: Category): GameItem | null => {
  const db = categoryToDB[category];
  if (!db || db.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * db.length);
  const item = db[randomIndex];

  // Convert the database item to a GameItem
  if (category === 'whoami') {
    return {
      id: item.id.toString(),
      category,
      name: item.name,
      details: [
        { label: 'المهنة', value: item.occupation || '', revealed: false },
        { label: 'الجنسية', value: item.nationality || '', revealed: false },
        { label: 'العمر/تاريخ الميلاد', value: item.birthDate || '', revealed: false },
        { label: 'الإنجازات', value: item.achievements || '', revealed: false },
        { label: 'معلومة مميزة', value: item.highlight || '', revealed: false },
        { label: 'مجال الشهرة', value: item.field || '', revealed: false }
      ].filter(detail => detail.value)
    };
  }

  return {
    id: item.id.toString(),
    category,
    name: item.title || item.name,
    details: [
      { label: 'سنة الإصدار', value: item.release_year?.toString() || '', revealed: false },
      { label: 'التصنيف', value: Array.isArray(item.genre) ? item.genre.join(', ') : item.genre || '', revealed: false },
      { label: 'الاستوديو', value: item.studio || '', revealed: false },
      { label: 'الشخصية الرئيسية', value: item.main_character || '', revealed: false }
    ].filter(detail => detail.value)
  };
}; 