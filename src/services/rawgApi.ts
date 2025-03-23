import axios from 'axios';
import { GameItem } from '../types';

const API_KEY = 'b2a77037d6c842708f7693e469108185';
const BASE_URL = 'https://api.rawg.io/api';

interface RawgGame {
  id: number;
  name: string;
  released: string;
  publishers: Array<{ name: string }>;
  developers: Array<{ name: string }>;
  genres: Array<{ name: string }>;
  platforms: Array<{ platform: { name: string } }>;
  tags: Array<{ name: string }>;
  description_raw?: string;
  metacritic?: number;
  esrb_rating?: { name: string };
  added?: number;
  playtime?: number;
  achievements_count?: number;
  ratings_count?: number;
  updated?: string;
  website?: string;
  reddit_url?: string;
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getDetailsForCategory(data: any, category: Category): any[] {
  switch (category) {
    case 'game-titles':
      return [
        { label: 'Release Year', value: data.released, revealed: false },
        { label: 'Developer', value: data.developers?.map(d => d.name).join(', '), revealed: false },
        { label: 'Genre', value: data.genres?.map(g => g.name).join(', '), revealed: false },
        { label: 'Platforms', value: data.platforms?.map(p => p.platform.name).join(', '), revealed: false },
        { label: 'Rating', value: data.rating?.toString(), revealed: false },
        { label: 'Game Mode', value: data.gameModes?.join(', '), revealed: false }
      ];

    case 'game-characters':
      return [
        { label: 'Game', value: data.game, revealed: false },
        { label: 'Role', value: data.role, revealed: false },
        { label: 'Species', value: data.species, revealed: false },
        { label: 'Abilities', value: data.abilities?.join(', '), revealed: false },
        { label: 'First Appearance', value: data.firstAppearance, revealed: false },
        { label: 'Voice Actor', value: data.voiceActor, revealed: false }
      ];

    case 'game-companies':
      return [
        { label: 'Founded', value: data.founded, revealed: false },
        { label: 'Headquarters', value: data.headquarters, revealed: false },
        { label: 'Notable Games', value: data.notableGames?.join(', '), revealed: false },
        { label: 'Platforms', value: data.platforms?.join(', '), revealed: false },
        { label: 'CEO', value: data.ceo, revealed: false },
        { label: 'Type', value: data.type, revealed: false }
      ];

    default:
      return [
        { label: 'Release Year', value: data.released, revealed: false },
        { label: 'Developer', value: data.developers?.map(d => d.name).join(', '), revealed: false },
        { label: 'Genre', value: data.genres?.map(g => g.name).join(', '), revealed: false },
        { label: 'Rating', value: data.rating?.toString(), revealed: false }
      ];
  }
}

// Fallback games data
const fallbackGames = [
  {
    id: '1',
    name: 'The Last of Us',
    details: [
      { label: 'Release Year', value: '2013', revealed: false },
      { label: 'Developer', value: 'Naughty Dog', revealed: false },
      { label: 'Platforms', value: 'PlayStation 3, PlayStation 4, PlayStation 5', revealed: false },
      { label: 'Genre', value: 'Action-adventure, Survival horror', revealed: false },
      { label: 'Main Character', value: 'Joel and Ellie', revealed: false },
      { label: 'Metacritic Score', value: '95', revealed: false }
    ]
  },
  {
    id: '2',
    name: 'Red Dead Redemption 2',
    details: [
      { label: 'Release Year', value: '2018', revealed: false },
      { label: 'Developer', value: 'Rockstar Games', revealed: false },
      { label: 'Setting/Theme', value: 'Western, Historical', revealed: false },
      { label: 'Main Character', value: 'Arthur Morgan', revealed: false },
      { label: 'Game Modes', value: 'Single-player, Online multiplayer', revealed: false },
      { label: 'Metacritic Score', value: '97', revealed: false }
    ]
  },
  {
    id: '3',
    name: 'Elden Ring',
    details: [
      { label: 'Release Year', value: '2022', revealed: false },
      { label: 'Developer', value: 'FromSoftware', revealed: false },
      { label: 'Genre', value: 'Action RPG, Open World', revealed: false },
      { label: 'Setting/Theme', value: 'Dark Fantasy', revealed: false },
      { label: 'Game Modes', value: 'Single-player, Online co-op', revealed: false },
      { label: 'Metacritic Score', value: '96', revealed: false }
    ]
  },
  {
    id: '4',
    name: 'God of War Ragnarök',
    details: [
      { label: 'Release Year', value: '2022', revealed: false },
      { label: 'Developer', value: 'Santa Monica Studio', revealed: false },
      { label: 'Setting/Theme', value: 'Norse Mythology', revealed: false },
      { label: 'Main Character', value: 'Kratos and Atreus', revealed: false },
      { label: 'Platforms', value: 'PlayStation 4, PlayStation 5', revealed: false },
      { label: 'Genre', value: 'Action-adventure', revealed: false }
    ]
  },
  {
    id: '5',
    name: 'Cyberpunk 2077',
    details: [
      { label: 'Release Year', value: '2020', revealed: false },
      { label: 'Developer', value: 'CD Projekt Red', revealed: false },
      { label: 'Setting/Theme', value: 'Cyberpunk, Sci-fi', revealed: false },
      { label: 'Main Character', value: 'V', revealed: false },
      { label: 'Game Modes', value: 'Single-player', revealed: false },
      { label: 'Genre', value: 'Action RPG, Open World', revealed: false }
    ]
  },
  {
    id: '6',
    name: 'Horizon Forbidden West',
    details: [
      { label: 'Release Year', value: '2022', revealed: false },
      { label: 'Developer', value: 'Guerrilla Games', revealed: false },
      { label: 'Setting/Theme', value: 'Post-apocalyptic, Sci-fi', revealed: false },
      { label: 'Main Character', value: 'Aloy', revealed: false },
      { label: 'Platforms', value: 'PlayStation 4, PlayStation 5', revealed: false },
      { label: 'Gameplay Style', value: 'Action RPG, Open World', revealed: false }
    ]
  },
  {
    id: '7',
    name: 'Hades',
    details: [
      { label: 'Release Year', value: '2020', revealed: false },
      { label: 'Developer', value: 'Supergiant Games', revealed: false },
      { label: 'Setting/Theme', value: 'Greek Mythology', revealed: false },
      { label: 'Main Character', value: 'Zagreus', revealed: false },
      { label: 'Genre', value: 'Roguelike, Action RPG', revealed: false },
      { label: 'Metacritic Score', value: '93', revealed: false }
    ]
  },
  {
    id: '8',
    name: 'Baldur\'s Gate 3',
    details: [
      { label: 'Release Year', value: '2023', revealed: false },
      { label: 'Developer', value: 'Larian Studios', revealed: false },
      { label: 'Setting/Theme', value: 'Fantasy, D&D', revealed: false },
      { label: 'Game Modes', value: 'Single-player, Co-op', revealed: false },
      { label: 'Genre', value: 'RPG, Turn-based Strategy', revealed: false },
      { label: 'Metacritic Score', value: '96', revealed: false }
    ]
  }
];

export async function fetchRandomGame(): Promise<GameItem> {
  try {
    // Get games from 2010-2024 to ensure more recognizable titles
    const currentYear = new Date().getFullYear();
    const startDate = '2010-01-01';
    const endDate = `${currentYear}-12-31`;
    
    // Query parameters for popular games
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        dates: `${startDate},${endDate}`,
        metacritic: '80,100', // Only highly rated games
        ordering: '-added', // Sort by most added to user libraries
        exclude_additions: true,
        exclude_parents: false,
        page_size: 40, // Larger pool for better randomization
        platforms: '4,187,1,18,186,7', // PC, PS4, PS5, Xbox One, Xbox Series X
        minimum_games_count: 10000 // Games that are widely known
      }
    });

    const games = response.data.results as RawgGame[];
    const randomIndex = Math.floor(Math.random() * games.length);
    const game = games[randomIndex];

    const detailsResponse = await axios.get(`${BASE_URL}/games/${game.id}`, {
      params: {
        key: API_KEY
      }
    });
    const gameDetails = detailsResponse.data;

    // Create an array to store all possible details
    const allDetails = [];

    // Basic Information
    if (game.released) {
      allDetails.push({
        label: 'Release Year',
        value: new Date(game.released).getFullYear().toString(),
        revealed: false
      });
    }

    if (gameDetails.publishers?.length > 0) {
      allDetails.push({
        label: 'Publisher',
        value: gameDetails.publishers.map(p => p.name).join(', '),
        revealed: false
      });
    }

    if (gameDetails.developers?.length > 0) {
      allDetails.push({
        label: 'Developer',
        value: gameDetails.developers.map(d => d.name).join(', '),
        revealed: false
      });
    }

    if (gameDetails.genres?.length > 0) {
      allDetails.push({
        label: 'Genre',
        value: gameDetails.genres.map(g => g.name).join(', '),
        revealed: false
      });
    }

    // Platforms
    if (gameDetails.platforms?.length > 0) {
      const platforms = gameDetails.platforms
        .map(p => p.platform.name)
        .filter(name => 
          name.includes('PlayStation') || 
          name.includes('Xbox') || 
          name === 'PC' ||
          name.includes('Nintendo')
        );
      
      if (platforms.length > 0) {
        allDetails.push({
          label: 'Platforms',
          value: platforms.slice(0, 3).join(', '),
          revealed: false
        });
      }
    }

    // Metacritic Score
    if (gameDetails.metacritic) {
      allDetails.push({
        label: 'Metacritic Score',
        value: gameDetails.metacritic.toString(),
        revealed: false
      });
    }

    // ESRB Rating
    if (gameDetails.esrb_rating) {
      allDetails.push({
        label: 'Age Rating',
        value: gameDetails.esrb_rating.name,
        revealed: false
      });
    }

    // Playtime
    if (gameDetails.playtime && gameDetails.playtime > 0) {
      allDetails.push({
        label: 'Average Playtime',
        value: `${gameDetails.playtime} hours`,
        revealed: false
      });
    }

    // Achievements
    if (gameDetails.achievements_count && gameDetails.achievements_count > 0) {
      allDetails.push({
        label: 'Achievements',
        value: gameDetails.achievements_count.toString(),
        revealed: false
      });
    }

    // Franchise/Series
    const franchiseMatch = gameDetails.description_raw?.match(/part of the ([^,.!?]+) series/i) ||
                         gameDetails.description_raw?.match(/latest in the ([^,.!?]+) series/i);
    if (franchiseMatch) {
      allDetails.push({
        label: 'Franchise',
        value: franchiseMatch[1].trim(),
        revealed: false
      });
    }

    // Main Character or Protagonist
    const characterMatches = gameDetails.description_raw?.match(/(?:starring|playing as|protagonist|main character|hero) ([^,.!?]+)/i);
    if (characterMatches && characterMatches[1]) {
      allDetails.push({
        label: 'Main Character',
        value: characterMatches[1].trim(),
        revealed: false
      });
    }

    // Setting/Theme
    const thematicTags = gameDetails.tags
      .filter(t => 
        t.name.includes('Fantasy') || 
        t.name.includes('Sci-fi') || 
        t.name.includes('Historical') || 
        t.name.includes('Medieval') ||
        t.name.includes('Futuristic') || 
        t.name.includes('Modern') ||
        t.name.includes('Western') ||
        t.name.includes('Cyberpunk') ||
        t.name.includes('Post-apocalyptic')
      )
      .map(t => t.name);

    if (thematicTags.length > 0) {
      allDetails.push({
        label: 'Setting/Theme',
        value: thematicTags.join(', '),
        revealed: false
      });
    }

    // Gameplay Features
    const gameplayTags = gameDetails.tags
      .filter(t => 
        t.name.includes('Open World') ||
        t.name.includes('RPG') ||
        t.name.includes('FPS') ||
        t.name.includes('Action') ||
        t.name.includes('Survival') ||
        t.name.includes('Racing') ||
        t.name.includes('Strategy')
      )
      .map(t => t.name);

    if (gameplayTags.length > 0) {
      allDetails.push({
        label: 'Gameplay Style',
        value: gameplayTags.slice(0, 2).join(', '),
        revealed: false
      });
    }

    // Game Modes
    const gameModes = gameDetails.tags
      .filter(t => ['Singleplayer', 'Multiplayer', 'Co-op', 'Online multiplayer', 'PvP']
        .includes(t.name))
      .map(t => t.name);
    
    if (gameModes.length > 0) {
      allDetails.push({
        label: 'Game Modes',
        value: gameModes.join(', '),
        revealed: false
      });
    }

    // Player Perspective
    const perspectives = gameDetails.tags
      .filter(t => ['First-Person', 'Third-Person', 'Top-Down', 'Side View', 'VR']
        .includes(t.name))
      .map(t => t.name);

    if (perspectives.length > 0) {
      allDetails.push({
        label: 'Player Perspective',
        value: perspectives.join(', '),
        revealed: false
      });
    }

    // Randomly select 4-6 details from all available details
    const numberOfDetails = Math.floor(Math.random() * 3) + 4; // Random number between 4 and 6
    const shuffledDetails = shuffleArray(allDetails);
    const finalDetails = shuffledDetails.slice(0, numberOfDetails);

    return {
      id: game.id.toString(),
      category: 'games',
      name: game.name,
      details: finalDetails
    };
  } catch (error) {
    console.error('Error fetching game data:', error);
    
    // Use fallback data when API fails
    const randomGame = fallbackGames[Math.floor(Math.random() * fallbackGames.length)];
    const shuffledDetails = shuffleArray(randomGame.details);
    const numberOfDetails = Math.floor(Math.random() * 3) + 4; // Random number between 4 and 6
    
    return {
      id: randomGame.id,
      category: 'games',
      name: randomGame.name,
      details: shuffledDetails.slice(0, numberOfDetails)
    };
  }
}