import spacetoonData from '../Database/SpacetoonDB.json';

export const getSpacetoonItems = () => {
  return spacetoonData.items;
};

export const getRandomSpacetoonItem = () => {
  const items = spacetoonData.items;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}; 