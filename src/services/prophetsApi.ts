import { Category } from '../types';
import { createGenericApi } from './genericApi';
import prophetsData from '../Database/ProphetsDB.json';

// Convert the data to match our generic API format
const formattedProphetsData = prophetsData.map(prophet => ({
  ...prophet,
  name: prophet.title, // Map title to name for consistency
  details: {
    era: prophet.era,
    role: prophet.role,
    related_event: prophet.related_event,
    mentioned_in: prophet.mentioned_in,
    famous_for: prophet.famous_for
  }
}));

const prophetsApi = createGenericApi(formattedProphetsData, Category.PROPHETS);

export const getProphetsItems = prophetsApi.getItems;
export const getRandomProphet = prophetsApi.getRandomItem;

function getDetailsForCategory(data: any): any[] {
  const allDetails = [
    { label: 'العصر', value: data.era || 'غير معروف', revealed: false },
    { label: 'الدور', value: data.role || 'غير معروف', revealed: false },
    { label: 'الحدث المرتبط', value: data.related_event || 'غير معروف', revealed: false },
    { label: 'مذكور في', value: data.mentioned_in || 'غير معروف', revealed: false },
    { label: 'مشهور بـ', value: data.famous_for || 'غير معروف', revealed: false }
  ];

  return allDetails;
}

export async function fetchRandomProphet(category: Category): Promise<GameItem> {
  try {
    const randomProphet = prophetsDB[Math.floor(Math.random() * prophetsDB.length)];
    if (!randomProphet) {
      throw new Error('No prophet data available');
    }
    
    const details = getDetailsForCategory(randomProphet);
    return {
      id: randomProphet.id.toString(),
      category,
      name: randomProphet.title,
      details,
    };
  } catch (error) {
    console.error('Error fetching prophet data:', error);
    
    const fallbackProphet = prophetsDB[0];
    const details = getDetailsForCategory(fallbackProphet);
    
    return {
      id: fallbackProphet.id.toString(),
      category,
      name: fallbackProphet.title,
      details,
    };
  }
} 