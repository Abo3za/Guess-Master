import quranData from '../Database/QuranDB.json';

export const getQuranItems = () => {
  return quranData.items;
};

export const getRandomQuranItem = () => {
  const items = quranData.items;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}; 