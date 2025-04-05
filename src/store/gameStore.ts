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
}

const initialState: GameState = {
  teams: [],
  currentItem: null,
  selectedCategory: null,
  round: 1,
  maxRounds: 10,
  answerRevealed: false,
  isLoading: false,
  usedItems: new Set(),
  categoryUsedItems: {} as Record<Category, Set<string>>,
  gameEnded: false,
  categorySelectionCounts: {} as Record<Category, number>,
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
          categorySelectionCounts: {},
        });
      },
      setCurrentItem: (item) => {
        set((state) => {
          const newCategoryUsedItems = { ...state.categoryUsedItems };
          if (!newCategoryUsedItems[item.category]) {
            newCategoryUsedItems[item.category] = new Set();
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
        const { currentItem, teams, round, maxRounds } = get();
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
          const points = allDetailsRevealed ? 10 : unrevealedCount * 5;

          const updatedTeams = teams.map((team) =>
            team.id === teamId
              ? { ...team, score: team.score + points }
              : team
          );
          
          const isLastRound = round >= maxRounds;
          if (isLastRound) {
            set({ 
              teams: updatedTeams,
              answerRevealed: false,
              gameEnded: true
            });
          } else {
            set({ 
              teams: updatedTeams,
              answerRevealed: false
            });
          }
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
        const { teams, round, maxRounds } = get();
        const currentActiveIndex = teams.findIndex((team) => team.isActive);
        const nextActiveIndex = (currentActiveIndex + 1) % teams.length;
        
        const shouldIncrementRound = nextActiveIndex === 0;
        const nextRound = shouldIncrementRound ? round + 1 : round;

        const updatedTeams = teams.map((team, index) => ({
          ...team,
          isActive: index === nextActiveIndex,
        }));

        set({ 
          teams: updatedTeams,
          round: nextRound
        });
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
      },
      endGame: () => {
        set({ gameEnded: true });
      },
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        teams: state.teams,
        round: state.round,
        maxRounds: state.maxRounds,
        usedItems: state.usedItems,
        categoryUsedItems: state.categoryUsedItems,
        categorySelectionCounts: state.categorySelectionCounts,
      })
    }
  )
);