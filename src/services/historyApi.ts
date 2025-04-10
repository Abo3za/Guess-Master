import historyData from '../Database/HistoryDB.json';
import { createGenericApi } from './genericApi';

const historyApi = createGenericApi(historyData);

export const getHistoryItems = historyApi.getItems;
export const getRandomHistoryItem = historyApi.getRandomItem; 