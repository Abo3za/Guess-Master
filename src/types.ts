export type Category = 
  | 'anime'
  | 'tv'
  | 'movies'
  | 'games'
  | 'football'
  | 'wwe'
  | 'music'
  | 'sports'
  | 'tech'
  | 'history'
  | 'geography'
  | 'science'
  | 'religion'
  | 'whoami'
  | 'memories'
  | 'playerJourney'
  | 'prophets'
  | 'spacetoon'
  | 'arabicSeries'
  | 'quran'
  | 'cars'
  | 'globalBrands';

export interface GameItem {
  id: string;
  name: string;
  category: Category;
  details: {
    label: string;
    value: string;
    revealed: boolean;
  }[];
  mediaUrl?: string;
  isAudioOnly?: boolean;
}

export interface Team {
  id: number;
  name: string;
  score: number;
  isActive: boolean;
}

export interface GameState {
  teams: Team[];
  currentItem: GameItem | null;
  selectedCategory: Category | null;
  answerRevealed: boolean;
  isLoading: boolean;
  usedItems: Set<string>;
  categoryUsedItems: Record<Category, Set<string>>;
  gameEnded: boolean;
  categorySelectionCounts: Record<Category, number>;
  isGameActive: boolean;
  winningPoints: number;
  hideHints: boolean;
  selectedCategories: string[];
}

export interface CategoryOption {
  value: Category;
  label: string;
  icon: React.ReactNode;
  bgImage: string;
}