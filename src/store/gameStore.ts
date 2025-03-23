import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Team, GameItem, Category } from '../types';

interface GameStore extends GameState {
  initializeGame: (teams: string[]) => void;
  setCurrentItem: (item: GameItem) => void;
  setCategory: (category: Category) => void;
  revealDetail: (detailIndex: number) => void;
  makeGuess: (teamId: string, guess: string) => boolean;
  nextTurn: () => void;
  revealAnswer: () => void;
  resetGame: () => void;
  backToCategories: () => void;
  adjustScore: (teamId: string, amount: number) => void;
  clearUsedItems: () => void;
  clearCategoryUsedItems: (category: Category) => void;
}

const POINTS_PER_INFO = 10;
const MIN_POINTS = 10; // Minimum points awarded for a correct guess

const initialState: GameState = {
  teams: [],
  currentItem: null,
  selectedCategory: null,
  round: 1,
  maxRounds: 5,
  answerRevealed: false,
  isLoading: false,
  usedItems: new Set(),
  categoryUsedItems: {} as Record<Category, Set<string>>,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      initializeGame: (teamNames) => {
        const teams: Team[] = teamNames.map((name, index) => ({
          id: `team-${index + 1}`,
          name,
          score: 0,
          isActive: index === 0,
        }));
        set({ 
          teams, 
          round: 1, 
          answerRevealed: false,
          currentItem: null,
          selectedCategory: null,
          usedItems: new Set(),
          categoryUsedItems: {},
        });
      },
      setCurrentItem: (item) => {
        const { usedItems, categoryUsedItems } = get();
        // Add the item to both global and category-specific used items sets
        const newUsedItems = new Set(usedItems);
        newUsedItems.add(item.id);

        const newCategoryUsedItems = { ...categoryUsedItems };
        if (!newCategoryUsedItems[item.category]) {
          newCategoryUsedItems[item.category] = new Set();
        }
        newCategoryUsedItems[item.category].add(item.id);

        set({ 
          currentItem: item, 
          answerRevealed: false,
          usedItems: newUsedItems,
          categoryUsedItems: newCategoryUsedItems
        });
      },
      setCategory: (category) => set({ selectedCategory: category }),
      revealDetail: (detailIndex) => {
        const { currentItem } = get();
        if (!currentItem) return;

        const updatedDetails = [...currentItem.details];
        updatedDetails[detailIndex].revealed = true;

        set({
          currentItem: {
            ...currentItem,
            details: updatedDetails,
          },
        });
      },
      makeGuess: (teamId, guess) => {
        const { currentItem, teams } = get();
        if (!currentItem || !guess) return false;

        const normalizeString = (str: string) => 
          str.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        const normalizedGuess = normalizeString(guess);
        const normalizedAnswer = normalizeString(currentItem.name);

        const isCorrect = normalizedGuess === normalizedAnswer;

        if (isCorrect) {
          const unrevealedCount = currentItem.details.filter(d => !d.revealed).length;
          // Calculate points based on unrevealed details, with a minimum of MIN_POINTS
          const points = Math.max(unrevealedCount * POINTS_PER_INFO, MIN_POINTS);

          const updatedTeams = teams.map((team) =>
            team.id === teamId
              ? { ...team, score: team.score + points }
              : team
          );
          
          set({ 
            teams: updatedTeams,
            answerRevealed: false
          });
        }

        return isCorrect;
      },
      adjustScore: (teamId: string, amount: number) => {
        const { teams } = get();
        const updatedTeams = teams.map((team) =>
          team.id === teamId
            ? { ...team, score: Math.max(0, team.score + amount) }
            : team
        );
        set({ teams: updatedTeams });
      },
      nextTurn: () => {
        const { teams } = get();
        const currentActiveIndex = teams.findIndex((team) => team.isActive);
        const nextActiveIndex = (currentActiveIndex + 1) % teams.length;

        const updatedTeams = teams.map((team, index) => ({
          ...team,
          isActive: index === nextActiveIndex,
        }));
        set({ teams: updatedTeams });
      },
      revealAnswer: () => {
        set({ answerRevealed: true });
      },
      resetGame: () => {
        set(initialState);
      },
      backToCategories: () => {
        set({ 
          currentItem: null, 
          selectedCategory: null, 
          answerRevealed: false 
        });
      },
      clearUsedItems: () => {
        set({ usedItems: new Set() });
      },
      clearCategoryUsedItems: (category: Category) => {
        const { categoryUsedItems } = get();
        const newCategoryUsedItems = { ...categoryUsedItems };
        newCategoryUsedItems[category] = new Set();
        set({ categoryUsedItems: newCategoryUsedItems });
      }
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        teams: state.teams,
        round: state.round,
        maxRounds: state.maxRounds,
        usedItems: Array.from(state.usedItems),
        categoryUsedItems: Object.fromEntries(
          Object.entries(state.categoryUsedItems).map(([category, items]) => [
            category,
            Array.from(items)
          ])
        )
      })
    }
  )
);