import { Category } from '../types';
import arabicSeriesData from '../Database/ArabicSeriesDB.json';
import { createGenericApi } from './genericApi';

const arabicSeriesApi = createGenericApi(arabicSeriesData);

export const getArabicSeriesItems = arabicSeriesApi.getItems;
export const getRandomArabicSeriesItem = arabicSeriesApi.getRandomItem; 