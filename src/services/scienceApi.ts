import scienceData from '../Database/ScienceDB.json';
import { createGenericApi } from './genericApi';

const formattedData = {
  items: scienceData.items.map(item => ({
    ...item,
    details: item.details.map(detail => ({
      ...detail,
      revealed: false
    }))
  }))
};

const scienceApi = createGenericApi(formattedData);

export const getScienceItems = scienceApi.getItems;
export const getRandomScienceItem = scienceApi.getRandomItem; 