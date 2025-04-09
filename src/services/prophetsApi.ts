import { GameItem, Category } from '../types';
import prophetsDB from '../Database/ProphetsDB.json';

export const fetchProphetsItems = () => {
  return prophetsDB;
};

export const fetchProphetItemById = (id: string) => {
  return prophetsDB.find(item => item.id.toString() === id);
};

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