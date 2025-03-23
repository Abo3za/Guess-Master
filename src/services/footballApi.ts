import axios from 'axios';
import { GameItem, Category } from '../types';

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
    case 'football-players':
      return [
        { label: 'Nationality', value: data.nationality, revealed: false },
        { label: 'Position', value: data.position, revealed: false },
        { label: 'Current Club', value: data.currentClub, revealed: false },
        { label: 'League', value: data.league, revealed: false },
        { label: 'Age', value: data.age?.toString(), revealed: false },
        { label: 'Number', value: data.number?.toString(), revealed: false },
        { label: 'Previous Club', value: data.previousClub, revealed: false },
        { label: 'International Team', value: data.internationalTeam, revealed: false },
        { label: 'Preferred Foot', value: data.preferredFoot, revealed: false },
        { label: 'Playing Style', value: data.playingStyle, revealed: false }
      ];

    case 'football-teams':
      return [
        { label: 'League', value: data.league, revealed: false },
        { label: 'Country', value: data.country, revealed: false },
        { label: 'Stadium', value: data.stadium, revealed: false },
        { label: 'Founded', value: data.founded?.toString(), revealed: false },
        { label: 'Manager', value: data.manager, revealed: false },
        { label: 'Nickname', value: data.nickname, revealed: false },
        { label: 'Club Colors', value: data.clubColors, revealed: false },
        { label: 'Rival Teams', value: data.rivals, revealed: false },
        { label: 'Last Trophy', value: data.lastTrophy, revealed: false },
        { label: 'Notable Players', value: data.notablePlayers, revealed: false }
      ];

    case 'football-stadiums':
      return [
        { label: 'Location', value: data.location, revealed: false },
        { label: 'Capacity', value: data.capacity?.toString(), revealed: false },
        { label: 'Home Team', value: data.homeTeam, revealed: false },
        { label: 'Opened', value: data.opened?.toString(), revealed: false },
        { label: 'Surface', value: data.surface, revealed: false },
        { label: 'Notable Events', value: data.notableEvents?.join(', '), revealed: false },
        { label: 'Architecture Style', value: data.architectureStyle, revealed: false },
        { label: 'Record Attendance', value: data.recordAttendance, revealed: false },
        { label: 'Nickname', value: data.stadiumNickname, revealed: false },
        { label: 'Recent Renovations', value: data.recentRenovations, revealed: false }
      ];

    default:
      return [
        { label: 'Type', value: data.type, revealed: false },
        { label: 'Country', value: data.country, revealed: false },
        { label: 'League', value: data.league, revealed: false },
        { label: 'Founded', value: data.founded?.toString(), revealed: false },
        { label: 'Notable Achievement', value: data.notableAchievement, revealed: false },
        { label: 'Current Status', value: data.currentStatus, revealed: false }
      ];
  }
}

// Comprehensive fallback data
const fallbackItems = [
  {
    id: 'player-1',
    name: 'Erling Haaland',
    nationality: 'Norway',
    position: 'Forward',
    currentClub: 'Manchester City',
    league: 'Premier League',
    age: '23',
    number: '9',
    previousClub: 'Borussia Dortmund',
    internationalTeam: 'Norway National Team',
    preferredFoot: 'Left',
    playingStyle: 'Power and Speed',
    type: 'Player'
  },
  {
    id: 'player-2',
    name: 'Jude Bellingham',
    nationality: 'England',
    position: 'Midfielder',
    currentClub: 'Real Madrid',
    league: 'La Liga',
    age: '20',
    number: '5',
    previousClub: 'Borussia Dortmund',
    internationalTeam: 'England National Team',
    preferredFoot: 'Right',
    playingStyle: 'Box-to-Box Midfielder',
    type: 'Player'
  },
  {
    id: 'team-1',
    name: 'Manchester City',
    league: 'Premier League',
    country: 'England',
    stadium: 'Etihad Stadium',
    founded: '1894',
    manager: 'Pep Guardiola',
    nickname: 'The Citizens',
    clubColors: 'Sky Blue and White',
    rivals: 'Manchester United, Liverpool',
    lastTrophy: 'UEFA Champions League 2023',
    notablePlayers: 'Kevin De Bruyne, Erling Haaland',
    type: 'Team'
  },
  {
    id: 'stadium-1',
    name: 'Santiago Bernabéu',
    location: 'Madrid, Spain',
    capacity: '81,044',
    homeTeam: 'Real Madrid',
    opened: '1947',
    surface: 'Hybrid grass',
    notableEvents: 'Multiple Champions League finals',
    architectureStyle: 'Modern',
    recordAttendance: '129,690 (1956)',
    stadiumNickname: 'The Bernabéu',
    recentRenovations: '2019-2023 Major Renovation',
    type: 'Stadium'
  }
];

export async function fetchRandomFootballItem(category: Category = 'football-players'): Promise<GameItem> {
  const relevantItems = fallbackItems.filter(item => {
    if (category === 'football-players') return item.type === 'Player';
    if (category === 'football-teams') return item.type === 'Team';
    if (category === 'football-stadiums') return item.type === 'Stadium';
    return true;
  });

  const randomItem = relevantItems[Math.floor(Math.random() * relevantItems.length)];
  const details = getDetailsForCategory(randomItem, category);
  const shuffledDetails = shuffleArray(details);
  const numberOfDetails = Math.floor(Math.random() * 3) + 5; // Random number between 5 and 7
  
  return {
    id: randomItem.id,
    category: category,
    name: randomItem.name,
    details: shuffledDetails.slice(0, numberOfDetails)
  };
}