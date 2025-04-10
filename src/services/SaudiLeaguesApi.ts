import { Category } from '../types';

import saudiLeagueData from '../Database/SaudiLeagueDB.json';
import { createGenericApi } from './genericApi';

const saudiLeagueApi = createGenericApi(saudiLeagueData);

export const getSaudiLeagueItems = saudiLeagueApi.getItems;
export const getRandomSaudiLeagueItem = saudiLeagueApi.getRandomItem;
