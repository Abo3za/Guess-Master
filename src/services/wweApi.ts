import { GameItem, Category, Difficulty } from '../types';
import wweDB from '../Database/WWEDB.json';

function shuffleArray<T>(array: T[]): T[] {
  // ...existing code...
}

function formatAchievements(achievements: string[]): string {
  if (!achievements || !Array.isArray(achievements)) return 'Unknown';
  return achievements.join(', ');
}

function getDetailsForCategory(wrestler: any, difficulty: Difficulty = 'normal'): any[] {
  const allDetails = [
    { label: 'السنة', value: wrestler.debut_year?.toString() || 'Unknown', revealed: false },
    { label: 'الوزن', value: wrestler.weight?.toString() + ' kg' || 'Unknown', revealed: false },
    { label: 'الطول', value: wrestler.height?.toString() + ' cm' || 'Unknown', revealed: false },
    { label: 'الجنسية', value: wrestler.nationality || 'Unknown', revealed: false },
    { label: 'البطولات', value: formatAchievements(wrestler.championships), revealed: false },
    { label: 'اللقب', value: wrestler.nickname || 'Unknown', revealed: false }
  ];

  if (difficulty === 'hard') {
    return shuffleArray([...allDetails]).slice(0, 3);
  }
  return allDetails;
}

export async function fetchRandomWrestler(category: Category, difficulty: Difficulty): Promise<GameItem> {
  if (!Array.isArray(wweDB) || wweDB.length === 0) {
    throw new Error('WWE database is empty or invalid');
  }

  try {
    const randomWrestler = wweDB[Math.floor(Math.random() * wweDB.length)];
    if (!randomWrestler) {
      throw new Error('No wrestler data available');
    }

    const details = getDetailsForCategory(randomWrestler, difficulty);
    return {
      id: randomWrestler.id.toString(),
      category,
      name: randomWrestler.name,
      details,
    };
  } catch (error) {
    console.error('Error fetching wrestler data:', error);
    if (!wweDB[0]) {
      throw new Error('No fallback wrestler data available');
    }
    const details = getDetailsForCategory(wweDB[0], difficulty);
    return {
      id: wweDB[0].id.toString(),
      category,
      name: wweDB[0].name,
      details
    };
  }
}
