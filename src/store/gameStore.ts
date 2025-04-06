import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Team, GameItem, Category } from '../types';

interface GameStore extends GameState {
  initializeGame: (teams: string[], winningPoints: number, hideHints: boolean) => void;
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
  checkWinCondition: () => boolean;
  winningPoints: number;
  hideHints: boolean;
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
  winningPoints: 200,
  hideHints: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      initializeGame: (teamNames, winningPoints, hideHints) => {
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
          gameEnded: false,
          winningPoints,
          hideHints,
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
          
          const updatedDetails = state.currentItem.details.map((detail, i) => 
            i === index ? { ...detail, revealed: true } : detail
          );
          
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
          const hasWinner = updatedTeams.some(team => team.score >= state.winningPoints);
          if (hasWinner) {
            return { 
              teams: updatedTeams,
              isGameActive: false,
              gameEnded: true
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
        // Clear the persisted state
        localStorage.removeItem('game-storage');
        // Reset to initial state
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
        set((state) => ({ 
          isGameActive: false,
          gameEnded: true,
          currentItem: null,
          selectedCategory: null,
          answerRevealed: false
        }));
      },
      checkWinCondition: () => {
        const { teams, winningPoints } = get();
        return teams.some(team => team.score >= winningPoints);
      }
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        teams: state.teams,
        currentItem: state.currentItem,
        selectedCategory: state.selectedCategory,
        answerRevealed: state.answerRevealed,
        usedItems: state.usedItems,
        categoryUsedItems: state.categoryUsedItems,
        categorySelectionCounts: state.categorySelectionCounts,
        isGameActive: state.isGameActive,
        gameEnded: state.gameEnded,
        winningPoints: state.winningPoints
      })
    }
  )
);