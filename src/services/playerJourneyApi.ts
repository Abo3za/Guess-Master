import playerJourneyData from '../Database/PlayerJurney.json';
import { GameItem, Category } from '../types';

// Function to fetch all player journey items
export const fetchPlayerJourneyItems = (): GameItem[] => {
  return playerJourneyData;
};

// Function to fetch a specific player journey item by ID
export const fetchPlayerJourneyItemById = (id: string): GameItem | undefined => {
  return playerJourneyData.find(item => item.id === id);
};

// Function to fetch a random player journey item
export const fetchRandomPlayerJourney = async (category: Category): Promise<GameItem> => {
  const randomIndex = Math.floor(Math.random() * playerJourneyData.length);
  const item = playerJourneyData[randomIndex];
  
  const clubs = Object.entries(item)
    .filter(([key]) => key.startsWith('club'))
    .map(([_, value]) => value)
    .filter(Boolean);

  return {
    id: item.id.toString(),
    category,
    name: item.name,
    details: clubs.map((club, index) => ({
      label: `النادي ${index + 1}`,
      value: club,
      revealed: false
    }))
  };
}; 