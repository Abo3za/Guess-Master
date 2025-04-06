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
  endGame: () => void;
  getRemainingRounds: () => number;
  checkWinCondition: () => boolean;
}

const initialState: GameState = {
  teams: [],
  currentItem: null,
  selectedCategory: null,
  answerRevealed: false,
  isLoading: false,
  usedItems: new Set<string>(),
  categoryUsedItems: {} as Record<Category, Set<string>>,
  gameEnded: false,
  categorySelectionCounts: {} as Record<Category, number>,
  isGameActive: false,
};

const TOTAL_CATEGORIES = 10; // Total number of categories
const SELECTIONS_PER_CATEGORY = 3; // Maximum selections per category
const WINNING_SCORE = 200; // Points needed to win

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
          answerRevealed: false,
          currentItem: null,
          selectedCategory: null,
          usedItems: new Set<string>(),
          categoryUsedItems: {} as Record<Category, Set<string>>,
          categorySelectionCounts: {},
          isGameActive: true,
        });
      },
      setCurrentItem: (item) => {
        set((state) => {
          const newCategoryUsedItems = { ...state.categoryUsedItems };
          if (!newCategoryUsedItems[item.category]) {
            newCategoryUsedItems[item.category] = new Set<string>();
          }
          
          newCategoryUsedItems[item.category].add(item.id);
          
          return {
            currentItem: item,
            usedItems: new Set([...state.usedItems, item.id]),
            categoryUsedItems: newCategoryUsedItems
          };
        });
      },
      setCategory: (category) => set((state) => {
        const currentCount = state.categorySelectionCounts[category] || 0;
        return {
          selectedCategory: category,
          categorySelectionCounts: {
            ...state.categorySelectionCounts,
            [category]: currentCount + 1
          }
        };
      }),
      revealDetail: (index) => {
        set((state) => {
          if (!state.currentItem) return state;
          
          const updatedDetails = [...state.currentItem.details];
          updatedDetails[index] = { ...updatedDetails[index], revealed: true };
          
          return {
            currentItem: {
              ...state.currentItem,
              details: updatedDetails,
            },
          };
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
          const allDetailsRevealed = unrevealedCount === 0;
          const points = allDetailsRevealed ? 10 : unrevealedCount * 10;

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
        set((state) => {
          const updatedTeams = state.teams.map((team) =>
            team.id === teamId
              ? { ...team, score: Math.max(0, team.score + amount) }
              : team
          );

          // Check if any team has reached the winning score
          const hasWinner = updatedTeams.some(team => team.score >= WINNING_SCORE);
          if (hasWinner) {
            return { 
              teams: updatedTeams,
              isGameActive: false 
            };
          }

          return { teams: updatedTeams };
        });
      },
      nextTurn: () => {
        set((state) => {
          const currentActiveIndex = state.teams.findIndex((team) => team.isActive);
          const nextActiveIndex = (currentActiveIndex + 1) % state.teams.length;
          
          return {
            teams: state.teams.map((team, index) => ({
              ...team,
              isActive: index === nextActiveIndex,
            })),
          };
        });
      },
      revealAnswer: () => {
        set((state) => ({
          answerRevealed: true,
        }));
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
      clearCategoryUsedItems: (category) => {
        set((state) => {
          const newCategoryUsedItems = { ...state.categoryUsedItems };
          newCategoryUsedItems[category] = new Set<string>();
          return { categoryUsedItems: newCategoryUsedItems };
        });
      },
      endGame: () => {
        set({ isGameActive: false });
      },
      getRemainingRounds: () => {
        const state = get();
        const usedRounds = Object.values(state.categorySelectionCounts).reduce(
          (sum, count) => sum + count,
          0
        );
        return state.maxRounds - usedRounds;
      },
      checkWinCondition: () => {
        const state = get();
        return state.teams.some(team => team.score >= WINNING_SCORE);
      },
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        teams: state.teams,
        categorySelectionCounts: state.categorySelectionCounts,
      }),
    }
  )
);