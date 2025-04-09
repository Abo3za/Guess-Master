import carsData from '../Database/CarsDB.json';

export const getCarsItems = () => {
  return carsData.items;
};

export const getRandomCarsItem = () => {
  const items = carsData.items;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}; 