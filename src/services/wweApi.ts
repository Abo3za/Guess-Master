import { GameItem, Category } from '../types';
import wweDB from '../Database/WWEDB.json';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function formatYesNo(value: boolean): string {
  return value ? 'نعم' : 'لا';
}

function getDetailsForWrestler(wrestler: any): any[] {
  const allDetails = [
    { label: 'الجنسية', value: wrestler.nationality || 'غير معروف', revealed: false },
    { label: 'الأسلوب القتالي', value: wrestler.style || 'غير معروف', revealed: false },
    { label: 'الحركة المميزة', value: wrestler.finisher || 'غير معروف', revealed: false },
    { label: 'عدد البطولات', value: wrestler.championships?.toString() || '0', revealed: false },
    { label: 'الطول والوزن', value: wrestler.height_weight || 'غير معروف', revealed: false },
    { label: 'انضم لفريق', value: formatYesNo(wrestler.was_in_faction), revealed: false }
  ];

  return allDetails;
}

export async function fetchRandomWrestler(category: Category): Promise<GameItem> {
  if (!wweDB.players || !Array.isArray(wweDB.players) || wweDB.players.length === 0) {
    throw new Error('قاعدة بيانات المصارعة فارغة أو غير صالحة');
  }

  try {
    const availablePlayers = wweDB.players.filter(player => player.name && player.id);
    const randomWrestler = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    
    if (!randomWrestler) {
      throw new Error('لم يتم العثور على بيانات المصارع');
    }

    const details = getDetailsForWrestler(randomWrestler);
    return {
      id: randomWrestler.id.toString(),
      category,
      name: randomWrestler.name,
      details
    };
  } catch (error) {
    console.error('Error fetching wrestler:', error);
    throw new Error('فشل في جلب بيانات المصارع');
  }
}
