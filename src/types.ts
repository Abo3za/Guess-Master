export type Category = 
  | 'anime'
  | 'tv'
  | 'movies'
  | 'games'
  | 'football'
  | 'countries'
  | 'wwe';

export interface GameItem {
  id: string;
  category: Category;
  name: string;
  details: {
    label: string;
    value: string;
    revealed: boolean;
  }[];
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
  gameEnded: boolean;
  categorySelectionCounts: Record<Category, number>;
}

export interface CategoryOption {
  value: Category;
  label: string;
  icon: React.ReactNode;
  bgImage: string;
}

export const DIFFICULTY_POINTS = {
  normal: 10,
  hard: 30
} as const;

export const DIFFICULTY_HINTS = {
  anime: {
    normal: 6,
    hard: 3
  },
  default: {
    normal: 6,
    hard: 3
  }
} as const;