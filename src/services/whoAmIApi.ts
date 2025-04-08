import { GameItem, Category } from '../types';
import whoAmIDB from '../Database/WhoAmIDB.json';

function getDetailsForCategory(data: any): any[] {
  const allDetails = [
    { label: 'المهنة', value: data.occupation || 'Unknown', revealed: false },
    { label: 'الجنسية', value: data.nationality || 'Unknown', revealed: false },
    { label: 'العمر/تاريخ الميلاد', value: data.birthDate || 'Unknown', revealed: false },
    { label: 'الإنجازات', value: data.achievements || 'Unknown', revealed: false },
    { label: 'معلومة مميزة', value: data.highlight || 'Unknown', revealed: false },
    { label: 'مجال الشهرة', value: data.field || 'Unknown', revealed: false }
  ];

  return allDetails;
}

export async function fetchRandomWhoAmI(category: Category): Promise<GameItem> {
  try {
    const randomPerson = whoAmIDB[Math.floor(Math.random() * whoAmIDB.length)];
    if (!randomPerson) {
      throw new Error('No WhoAmI data available');
    }
    
    const details = getDetailsForCategory(randomPerson);
    return {
      id: randomPerson.id.toString(),
      category,
      name: randomPerson.name,
      details,
    };
  } catch (error) {
    console.error('Error fetching WhoAmI data:', error);
    
    const fallbackPerson = {
      id: 'fallback-1',
      name: 'محمد صلاح',
      occupation: 'لاعب كرة قدم',
      nationality: 'مصري',
      birthDate: '1992',
      achievements: 'هداف الدوري الإنجليزي الممتاز عدة مرات',
      highlight: 'يلعب في نادي ليفربول',
      field: 'رياضة'
    };
    
    const details = getDetailsForCategory(fallbackPerson);
    return {
      id: fallbackPerson.id,
      category,
      name: fallbackPerson.name,
      details,
    };
  }
} 