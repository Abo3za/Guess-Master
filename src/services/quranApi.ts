import { Category } from '../types';
import quranData from '../Database/QuranDB.json';
import { createGenericApi } from './genericApi';

const quranApi = createGenericApi(quranData);

export const getQuranItems = quranApi.getItems;
export const getRandomQuranItem = quranApi.getRandomItem; 