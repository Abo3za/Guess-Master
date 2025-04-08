import { GameItem, Category } from '../types';
import religionDB from '../Database/ReligionDB.json';

// Helper function to format genres
function formatGenres(genres: string[]): string {
  if (!genres || !Array.isArray(genres)) return 'Unknown';
  return genres.join(', ');
}

function getDetailsForCategory(data: any): any[] {
  const allDetails = [
    { label: 'النوع', value: data.type || 'Unknown', revealed: false },
    { label: 'المكان', value: data.location || 'Unknown', revealed: false },
    { label: 'التاريخ', value: data.date?.toString() || 'Unknown', revealed: false },
    { label: 'معلومة مميزة', value: data.highlight || 'Unknown', revealed: false },
    { label: 'الأهمية', value: data.importance || 'Unknown', revealed: false },
    { label: 'مرتبط بـ', value: data.related_to || 'Unknown', revealed: false }
  ];

  return allDetails;
}

export async function fetchRandomReligion(category: Category): Promise<GameItem> {
  try {
    const randomReligion = religionDB[Math.floor(Math.random() * religionDB.length)];
    if (!randomReligion) {
      throw new Error('No religion data available');
    }
    
    const details = getDetailsForCategory(randomReligion);
    return {
      id: randomReligion.id.toString(),
      category,
      name: randomReligion.title,
      details,
    };
  } catch (error) {
    console.error('Error fetching religion data:', error);
    
    const fallbackReligion = {
      id: 'fallback-1',
      title: 'المسجد النبوي',
      type: 'مسجد',
      location: 'المدينة المنورة',
      date: '622',
      highlight: 'ثاني أكبر مسجد في الإسلام',
      importance: 'ثاني أقدس موقع في الإسلام',
      related_to: 'النبي محمد ﷺ'
    };
    
    const details = getDetailsForCategory(fallbackReligion);
    return {
      id: fallbackReligion.id,
      category,
      name: fallbackReligion.title,
      details,
    };
  }
} 