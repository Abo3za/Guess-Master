import { GameItem, Category } from '../types';
import memoriesDB from '../Database/MemoriesDB.json';

function getDetailsForCategory(data: any): any[] {
  const allDetails = [
    { label: 'السنة', value: data.year || 'Unknown', revealed: false },
    { label: 'المكان', value: data.location || 'Unknown', revealed: false },
    { label: 'الحدث', value: data.event || 'Unknown', revealed: false },
    { label: 'الشخصيات المشهورة', value: data.celebrities || 'Unknown', revealed: false },
    { label: 'معلومة مميزة', value: data.highlight || 'Unknown', revealed: false },
    { label: 'التأثير', value: data.impact || 'Unknown', revealed: false }
  ];

  return allDetails;
}

export async function fetchRandomMemory(category: Category): Promise<GameItem> {
  try {
    const randomMemory = memoriesDB[Math.floor(Math.random() * memoriesDB.length)];
    if (!randomMemory) {
      throw new Error('No memories data available');
    }
    
    const details = getDetailsForCategory(randomMemory);
    return {
      id: randomMemory.id.toString(),
      category,
      name: randomMemory.name,
      details,
    };
  } catch (error) {
    console.error('Error fetching memory data:', error);
    
    const fallbackMemory = {
      id: 'fallback-1',
      name: 'سبيس تون',
      year: '1990s',
      location: 'القنوات العربية',
      event: 'بث الأنمي المدبلج للعربية',
      celebrities: 'طاقم الدبلجة العربي',
      highlight: 'أول قناة عربية متخصصة في الرسوم المتحركة',
      impact: 'تأثير كبير على جيل التسعينات'
    };
    
    const details = getDetailsForCategory(fallbackMemory);
    return {
      id: fallbackMemory.id,
      category,
      name: fallbackMemory.name,
      details,
    };
  }
} 