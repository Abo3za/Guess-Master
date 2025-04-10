import { Category } from '../types';
import techData from '../Database/TechDB.json';
import { createGenericApi } from './genericApi';

const techApi = createGenericApi(techData);

export const getTechItems = techApi.getItems;
export const getRandomTechItem = techApi.getRandomItem; 