import { Category, GameItem } from '../types';
import { fetchRandomAnime } from '../services/jikanApi';
import { fetchRandomMovie } from '../services/omdbApi';
import { fetchRandomTVShow } from '../services/tvSeriesApi';
import { fetchRandomGame } from '../services/rawgApi';
import { fetchRandomFootballItem } from '../services/footballApi';
import { fetchRandomWrestler } from '../services/wweApi';
import { fetchRandomMusic } from '../services/Music';
import { fetchRandomReligion } from '../services/religionApi';
import { fetchRandomWhoAmI } from '../services/whoAmIApi';
import { fetchRandomMemory } from '../services/memoriesApi';
import { fetchRandomPlayerJourney } from '../services/playerJourneyApi';
import { fetchRandomProphet } from '../services/prophetsApi';
import { getRandomSpacetoonItem } from '../services/spacetoonApi';
import { getRandomArabicSeriesItem } from '../services/arabicSeriesApi';
import { getRandomQuranItem } from '../services/quranApi';
import { getRandomCarsItem } from '../services/carsApi';
import { getRandomGlobalBrandsItem } from '../services/globalBrandsApi';
import { getRandomAnimal } from '../services/animalsApi';
import { getRandomSaudiLeagueItem } from '../services/SaudiLeaguesApi';
import { getRandomHistoryItem } from '../services/historyApi';
import { getRandomGeographyItem } from '../services/geographyApi';
import { getRandomScienceItem } from '../services/scienceApi';
import { getRandomTechItem } from '../services/techApi';

type ApiFunction = (category: Category) => Promise<GameItem>;

export const API_CONFIG: Record<Category, ApiFunction> = {
  [Category.anime]: fetchRandomAnime,
  [Category.movies]: fetchRandomMovie,
  [Category.tv]: fetchRandomTVShow,
  [Category.games]: fetchRandomGame,
  [Category.football]: fetchRandomFootballItem,
  [Category.wwe]: fetchRandomWrestler,
  [Category.music]: fetchRandomMusic,
  [Category.religion]: fetchRandomReligion,
  [Category.whoami]: fetchRandomWhoAmI,
  [Category.memories]: fetchRandomMemory,
  [Category.playerJourney]: fetchRandomPlayerJourney,
  [Category.prophets]: fetchRandomProphet,
  [Category.spacetoon]: getRandomSpacetoonItem,
  [Category.arabicSeries]: getRandomArabicSeriesItem,
  [Category.quran]: getRandomQuranItem,
  [Category.cars]: getRandomCarsItem,
  [Category.globalBrands]: getRandomGlobalBrandsItem,
  [Category.animals]: getRandomAnimal,
  [Category.saudiLeague]: getRandomSaudiLeagueItem,
  [Category.history]: getRandomHistoryItem,
  [Category.geography]: getRandomGeographyItem,
  [Category.science]: getRandomScienceItem,
  [Category.tech]: getRandomTechItem
}; 