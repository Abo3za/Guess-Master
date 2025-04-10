import { Category } from '../types';
import carsData from '../Database/CarsDB.json';
import { createGenericApi } from './genericApi';

const carsApi = createGenericApi(carsData);

export const getCarsItems = carsApi.getItems;
export const getRandomCarsItem = carsApi.getRandomItem; 