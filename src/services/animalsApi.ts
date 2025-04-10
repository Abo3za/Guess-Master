import { Category } from '../types';
import { createGenericApi } from './genericApi';
import animalsData from '../Database/AnimalsDB.json';

// Convert the data to match our generic API format
const formattedAnimalsData = animalsData.map(animal => ({
  id: animal.id,
  name: animal.name,
  details: animal.details.map(detail => ({
    label: detail.label,
    value: detail.value,
    revealed: false
  }))
}));

const animalsApi = createGenericApi({ items: formattedAnimalsData });

export const getAnimalsItems = animalsApi.getItems;
export const getRandomAnimal = async (category: Category) => {
  const item = await animalsApi.getRandomItem(category);
  return {
    ...item,
    category: Category.animals
  };
}; 