
import geographyData from '../Database/GeographyDB.json';
import { createGenericApi } from './genericApi';

const geographyApi = createGenericApi(geographyData);

export const getGeographyItems = geographyApi.getItems;
export const getRandomGeographyItem = geographyApi.getRandomItem; 