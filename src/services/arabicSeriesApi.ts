import arabicSeriesData from '../Database/ArabicSeriesDB.json';

export const getArabicSeriesItems = () => {
  return arabicSeriesData.items;
};

export const getRandomArabicSeriesItem = () => {
  const items = arabicSeriesData.items;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}; 