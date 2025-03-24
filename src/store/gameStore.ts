import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Team, GameItem, Category, Difficulty, DIFFICULTY_POINTS } from '../types';

interface GameStore extends GameState {
  initializeGame: (teams: string[]) => void;
  setCurrentItem: (item: GameItem) => void;
  setCategory: (category: Category) => void;
  setDifficulty: (difficulty: Difficulty) => void;
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
  selectedDifficulty: null,
  round: 1,
  maxRounds: 10, // تعديل عدد الجولات إلى 10
  answerRevealed: false,
  isLoading: false,
  usedItems: new Set(),
  categoryUsedItems: {} as Record<Category, Set<string>>,
  gameEnded: false, // إضافة حالة جديدة
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
          selectedDifficulty: null,
          usedItems: new Set(),
          categoryUsedItems: {},
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
      setCategory: (category) => set({ selectedCategory: category }),
      setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
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
        const { currentItem, teams, selectedDifficulty, round, maxRounds } = get();
        if (!currentItem || !guess || !selectedDifficulty) return false;

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
          let points;

          if (allDetailsRevealed) {
            points = 10; // فقط 10 نقاط إذا تم كشف كل التلميحات
          } else {
            const basePoints = DIFFICULTY_POINTS[selectedDifficulty];
            points = unrevealedCount * basePoints;
          }

          const updatedTeams = teams.map((team) =>
            team.id === teamId
              ? { ...team, score: team.score + points }
              : team
          );
          
          // التحقق من انتهاء الجولات
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
              answerRevealed: false,
              round: round + 1
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
          selectedDifficulty: null,
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
        gameEnded: state.gameEnded,
        gameStarted: true,  // إضافة لحفظ حالة بدء اللعبة
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