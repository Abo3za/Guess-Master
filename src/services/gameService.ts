import { getRandomAnimeItem } from './animeApi';
import { getRandomTVItem } from './tvApi';
import { getRandomMoviesItem } from './moviesApi';
import { getRandomGamesItem } from './gamesApi';
import { getRandomWWEItem } from './wweApi';
import { getRandomFootballItem } from './footballApi';
import { getRandomMusicItem } from './musicApi';
import { getRandomWhoAmIItem } from './whoAmIApi';
import { getRandomMemoriesItem } from './memoriesApi';
import { getRandomPlayerJourneyItem } from './playerJourneyApi';
import { getRandomProphetsItem } from './prophetsApi';
import { getRandomReligionItem } from './religionApi';
import { getRandomSpacetoonItem } from './spacetoonApi';
import { getRandomArabicSeriesItem } from './arabicSeriesApi';
import { getRandomQuranItem } from './quranApi';
import { getRandomCarsItem } from './carsApi';
import { getRandomGlobalBrandsItem } from './globalBrandsApi';
import { Category } from '../store/gameStore';

const categoryToApiMap: Record<Category, () => any> = {
  anime: getRandomAnimeItem,
  tv: getRandomTVItem,
  movies: getRandomMoviesItem,
  games: getRandomGamesItem,
  wwe: getRandomWWEItem,
  football: getRandomFootballItem,
  music: getRandomMusicItem,
  whoami: getRandomWhoAmIItem,
  memories: getRandomMemoriesItem,
  playerJourney: getRandomPlayerJourneyItem,
  prophets: getRandomProphetsItem,
  religion: getRandomReligionItem,
  spacetoon: getRandomSpacetoonItem,
  arabicSeries: getRandomArabicSeriesItem,
  quran: getRandomQuranItem,
  cars: getRandomCarsItem,
  globalBrands: getRandomGlobalBrandsItem
};

export const getRandomItem = (category: Category) => {
  const getItemFunction = categoryToApiMap[category];
  if (!getItemFunction) {
    throw new Error(`No API function found for category: ${category}`);
  }
  return getItemFunction();
}; 