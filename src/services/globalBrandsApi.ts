import globalBrandsData from '../Database/GlobalBrandsDB.json';

export const getGlobalBrandsItems = () => {
  return globalBrandsData.items;
};

export const getRandomGlobalBrandsItem = () => {
  const items = globalBrandsData.items;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}; 