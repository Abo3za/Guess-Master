import { GameItem, Category } from '../types';
import footballDB from '../Database/FootballDB.json';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getDetailsForCategory(player: any): any[] {
  if (!player) {
    throw new Error('Invalid player data');
  }

  const allDetails = [
    { label: 'الجنسية', value: player.nationality || 'Unknown', revealed: false },
    { label: 'المركز', value: player.position || 'Unknown', revealed: false },
    { label: 'النادي', value: player.club || 'Unknown', revealed: false },
    { label: 'الأهداف', value: player.goals?.toString() || 'Unknown', revealed: false },
    { label: 'البطولات', value: player.trophies?.toString() || 'Unknown', revealed: false },
    { label: 'الإنجاز الأبرز', value: player.highlight || 'Unknown', revealed: false }
  ];

  return allDetails;
}

export async function fetchRandomFootballItem(category: Category): Promise<GameItem> {
  if (!footballDB?.players?.length) {
    throw new Error('Football database is empty or invalid');
  }

  try {
    const randomPlayer = footballDB.players[Math.floor(Math.random() * footballDB.players.length)];
    if (!randomPlayer) {
      throw new Error('No player data available');
    }
    
    const details = getDetailsForCategory(randomPlayer);
    return {
      id: randomPlayer.id.toString(),
      category,
      name: randomPlayer.name,
      details,
    };
  } catch (error) {
    console.error('Error fetching football player data:', error);
    
    const fallbackPlayer = footballDB.players[0];
    if (!fallbackPlayer) {
      throw new Error('No fallback player data available');
    }
    
    const details = getDetailsForCategory(fallbackPlayer);
    return {
      id: fallbackPlayer.id.toString(),
      category,
      name: fallbackPlayer.name,
      details
    };
  }
}
