import { Category } from '../types';
import globalBrandsData from '../Database/GlobalBrandsDB.json';
import { createGenericApi } from './genericApi';

const globalBrandsApi = createGenericApi(globalBrandsData);

export const getGlobalBrandsItems = globalBrandsApi.getItems;
export const getRandomGlobalBrandsItem = globalBrandsApi.getRandomItem; 