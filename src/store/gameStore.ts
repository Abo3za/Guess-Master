import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Team, GameItem, Category } from '../types';

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
  | 'memories';

interface CategoryInfo {
  label: string;
  icon: string;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  anime: { label: 'أنمي', icon: '🎭' },
  tv: { label: 'مسلسلات', icon: '📺' },
  movies: { label: 'أفلام', icon: '🎬' },
  games: { label: 'ألعاب', icon: '🎮' },
  football: { label: 'كرة القدم', icon: '⚽' },
  wwe: { label: 'المصارعة', icon: '🤼' },
  music: { label: 'موسيقى', icon: '🎵' },
  sports: { label: 'رياضات متنوعة', icon: '🏆' },
  tech: { label: 'تكنولوجيا', icon: '💻' },
  history: { label: 'تاريخ', icon: '📜' },
  geography: { label: 'جغرافيا', icon: '🌍' },
  science: { label: 'علوم', icon: '🔬' },
  religion: { label: 'دين', icon: '🕌' },
  whoami: { label: 'من انا', icon: '❓' },
  memories: { label: 'ذكريات', icon: '📷' }
};

interface GameStore extends GameState {
  initializeGame: (teams: Team[], winningPoints: number, hideHints: boolean, selectedCategories: string[]) => void;
  setCurrentItem: (item: GameItem) => void;
  setCategory: (category: Category) => void;
  revealDetail: (detailIndex: number) => void;
  makeGuess: (teamId: number, guess: string) => boolean;
  nextTurn: () => void;
  revealAnswer: () => void;
  resetGame: () => void;
  backToCategories: () => void;
  adjustScore: (teamId: number, amount: number) => void;
  clearUsedItems: () => void;
  clearCategoryUsedItems: (category: Category) => void;
  endGame: () => void;
  checkWinCondition: () => boolean;
  winningPoints: number;
  hideHints: boolean;
  selectedCategories: string[];
  addTeam: (name: string) => void;
  removeTeam: (id: number) => void;
  setActiveTeam: (id: number) => void;
  addUsedCategory: (category: string) => void;
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
  selectedCategories: [],
  usedCategories: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      initializeGame: (teams, winningPoints, hideHints, selectedCategories) => {
        // Ensure teams have proper structure and initial values
        const initializedTeams = teams.map((team, index) => ({
          ...team,
          id: team.id || Date.now() + index,
          score: 0,
          isActive: index === 0
        }));

        set({ 
          teams: initializedTeams, 
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
          selectedCategories,
          usedCategories: [],
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
          if (!state.currentItem) {
            console.log('No current item to reveal details for');
            return state;
          }
          
          console.log('Revealing detail at index:', index);
          console.log('Current details:', state.currentItem.details);
          
          const updatedDetails = state.currentItem.details.map((detail, i) => 
            i === index ? { ...detail, revealed: true } : detail
          );
          
          console.log('Updated details:', updatedDetails);
          
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
          const points = unrevealedCount * 10 + 10; // 10 نقاط إضافية للإجابة الصحيحة

          // Only update the score for the team that made the correct guess
          const updatedTeams = teams.map((team) => {
            if (team.id === teamId) {
              console.log(`Adding ${points} points to team ${team.name}`);
              return { ...team, score: team.score + points };
            }
            return team;
          });
          
          set({ 
            teams: updatedTeams,
            answerRevealed: true
          });

          // Check if the team has won
          const winningTeam = updatedTeams.find(team => team.score >= get().winningPoints);
          if (winningTeam) {
            set({ gameEnded: true });
          }
        }

        return isCorrect;
      },
      adjustScore: (teamId: number, amount: number) => {
        set((state) => {
          // Only update the score for the specified team
          const updatedTeams = state.teams.map((team) => {
            if (team.id === teamId) {
              console.log(`Adjusting score for team ${team.name} by ${amount}`);
              return { ...team, score: Math.max(0, team.score + amount) };
            }
            return team;
          });

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
        set({
          ...initialState,
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
          selectedCategories: [],
          usedCategories: [],
        });
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
          gameEnded: true
        }));
      },
      checkWinCondition: () => {
        const { teams, winningPoints } = get();
        return teams.some(team => team.score >= winningPoints);
      },
      addTeam: (name: string) => {
        const newTeam: Team = {
          id: Date.now(),
          name,
          score: 0,
          isActive: get().teams.length === 0
        };
        set((state) => ({
          teams: [...state.teams, newTeam]
        }));
      },
      removeTeam: (id: number) => {
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id)
        }));
      },
      setActiveTeam: (id: number) => {
        set((state) => ({
          teams: state.teams.map((team) => ({
            ...team,
            isActive: team.id === id
          }))
        }));
      },
      addUsedCategory: (category: string) => {
        set((state) => ({
          usedCategories: [...state.usedCategories, category]
        }));
      }
    }),
    {
      name: 'game-storage',
      version: 1,
      partialize: (state) => ({
        ...state,
        usedItems: Array.from(state.usedItems),
        categoryUsedItems: Object.fromEntries(
          Object.entries(state.categoryUsedItems).map(([k, v]) => [k, Array.from(v)])
        ),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.usedItems = new Set(state.usedItems);
          state.categoryUsedItems = Object.fromEntries(
            Object.entries(state.categoryUsedItems).map(([k, v]) => [k, new Set(v)])
          );
        }
      },
    }
  )
);