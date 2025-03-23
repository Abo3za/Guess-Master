export type MainCategory = 'anime' | 'tv' | 'movies' | 'games' | 'football' | 'countries';

export type SubCategory = 
  | 'anime-series' 
  | 'anime-characters' 
  | 'anime-movies'
  | 'tv-series' 
  | 'tv-characters'
  | 'movie-titles' 
  | 'movie-actors' 
  | 'movie-directors'
  | 'game-titles' 
  | 'game-characters' 
  | 'game-companies'
  | 'football-players' 
  | 'football-teams' 
  | 'football-stadiums'
  | 'countries-general' 
  | 'countries-capitals' 
  | 'countries-landmarks';

export type Category = MainCategory | SubCategory;

export interface Detail {
  label: string;
  value: string;
  revealed: boolean;
}

export interface GameItem {
  id: string;
  category: Category;
  name: string;
  details: Detail[];
}

export interface Team {
  id: string;
  name: string;
  score: number;
  isActive: boolean;
}

export interface GameState {
  teams: Team[];
  currentItem: GameItem | null;
  selectedCategory: Category | null;
  round: number;
  maxRounds: number;
  answerRevealed: boolean;
  isLoading: boolean;
  usedItems: Set<string>;
  categoryUsedItems: Record<Category, Set<string>>;
}

export interface CategoryOption {
  value: Category;
  label: string;
  icon: React.ReactNode;
  bgImage: string;
  subcategories?: CategoryOption[];
}