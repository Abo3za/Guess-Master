import { Category } from '../types';
import spacetoonData from '../Database/SpacetoonDB.json';
import { createGenericApi } from './genericApi';

const spacetoonApi = createGenericApi(spacetoonData);

export const getSpacetoonItems = spacetoonApi.getItems;
export const getRandomSpacetoonItem = spacetoonApi.getRandomItem; 