import { fetchRandomAnime } from './jikanApi';
import { fetchRandomTVShow } from './tvSeriesApi';
import { fetchRandomMovie } from './omdbApi';
import { fetchRandomGame } from './rawgApi';
import { fetchRandomWrestler } from './wweApi';
import { fetchRandomFootballItem } from './footballApi';
import { fetchRandomMusic } from './Music';
import { fetchRandomWhoAmI } from './whoAmIApi';
import { fetchRandomMemory } from './memoriesApi';
import { fetchRandomPlayerJourney } from './playerJourneyApi';
import { fetchRandomProphet } from './prophetsApi';
import { fetchRandomReligion } from './religionApi';
import { getRandomSpacetoonItem } from './spacetoonApi';
import { getRandomArabicSeriesItem } from './arabicSeriesApi';
import { getRandomQuranItem } from './quranApi';
import { getRandomCarsItem } from './carsApi';
import { getRandomGlobalBrandsItem } from './globalBrandsApi';
import { getRandomAnimal } from './animalsApi';
import { Category, GameItem } from '../types';

const categoryToApiMap: Record<Category, (category: Category) => Promise<GameItem>> = {
  [Category.anime]: fetchRandomAnime,
  [Category.tv]: fetchRandomTVShow,
  [Category.movies]: fetchRandomMovie,
  [Category.games]: fetchRandomGame,
  [Category.wwe]: fetchRandomWrestler,
  [Category.football]: fetchRandomFootballItem,
  [Category.music]: fetchRandomMusic,
  [Category.whoami]: fetchRandomWhoAmI,
  [Category.memories]: fetchRandomMemory,
  [Category.playerJourney]: fetchRandomPlayerJourney,
  [Category.prophets]: fetchRandomProphet,
  [Category.religion]: fetchRandomReligion,
  [Category.spacetoon]: getRandomSpacetoonItem,
  [Category.arabicSeries]: getRandomArabicSeriesItem,
  [Category.quran]: getRandomQuranItem,
  [Category.cars]: getRandomCarsItem,
  [Category.globalBrands]: getRandomGlobalBrandsItem,
  [Category.animals]: getRandomAnimal,
  [Category.sports]: fetchRandomFootballItem,
  [Category.tech]: fetchRandomGame,
  [Category.history]: fetchRandomReligion,
  [Category.geography]: fetchRandomReligion,
  [Category.science]: fetchRandomReligion
};

export const getRandomItem = (category: Category): Promise<GameItem> => {
  const getItemFunction = categoryToApiMap[category];
  if (!getItemFunction) {
    throw new Error(`No API function found for category: ${category}`);
  }
  return getItemFunction(category);
}; 