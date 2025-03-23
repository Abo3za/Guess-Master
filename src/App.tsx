import React, { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { CategorySelection } from './components/CategorySelection';
import { useGameStore } from './store/gameStore';
import { Category, GameItem } from './types';
import { fetchRandomGame } from './services/rawgApi';
import { fetchRandomMovie, fetchRandomTVShow } from './services/omdbApi';
import { fetchRandomAnime } from './services/jikanApi';
import { fetchRandomFootballItem } from './services/footballApi';
import { fetchRandomCountry } from './services/countriesApi';
import { Gamepad2 } from 'lucide-react';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { 
    initializeGame, 
    setCurrentItem, 
    setCategory, 
    usedItems, 
    categoryUsedItems,
    clearUsedItems, 
    clearCategoryUsedItems,
    resetGame 
  } = useGameStore();

  const handleGameStart = (teams: string[]) => {
    initializeGame(teams);
    setGameStarted(true);
  };

  const handleResetGame = () => {
    resetGame();
    setGameStarted(false);
    setCategorySelected(false);
  };

  const handleCategorySelect = async (category: Category) => {
    setLoading(true);
    setCategory(category);

    try {
      let item: GameItem | null = null;
      let attempts = 0;
      const maxAttempts = 5;

      // Get the used items for this category
      const categoryItems = categoryUsedItems[category] || new Set();

      while (!item && attempts < maxAttempts) {
        let fetchedItem: GameItem | null = null;
        
        // Handle subcategories
        if (category.startsWith('anime-')) {
          fetchedItem = await fetchRandomAnime(category);
        } else if (category.startsWith('tv-')) {
          fetchedItem = await fetchRandomTVShow(category);
        } else if (category.startsWith('movie-')) {
          fetchedItem = await fetchRandomMovie(category);
        } else if (category.startsWith('game-')) {
          fetchedItem = await fetchRandomGame(category);
        } else if (category.startsWith('football-')) {
          fetchedItem = await fetchRandomFootballItem(category);
        } else if (category.startsWith('countries-')) {
          fetchedItem = await fetchRandomCountry(category);
        } else {
          // Handle main categories
          switch (category) {
            case 'anime':
              fetchedItem = await fetchRandomAnime('anime-series');
              break;
            case 'tv':
              fetchedItem = await fetchRandomTVShow('tv-series');
              break;
            case 'movies':
              fetchedItem = await fetchRandomMovie('movie-titles');
              break;
            case 'games':
              fetchedItem = await fetchRandomGame('game-titles');
              break;
            case 'football':
              fetchedItem = await fetchRandomFootballItem('football-players');
              break;
            case 'countries':
              fetchedItem = await fetchRandomCountry('countries-general');
              break;
          }
        }

        // Check if this item has been used in this category
        if (fetchedItem && !categoryItems.has(fetchedItem.id)) {
          item = fetchedItem;
        }
        attempts++;
      }

      if (item) {
        setCurrentItem(item);
        setCategorySelected(true);
      } else {
        // If we couldn't get a new item after max attempts, clear the category history and try again
        clearCategoryUsedItems(category);
        const newItem = await fetchRandomAnime(category);
        if (newItem) {
          setCurrentItem(newItem);
          setCategorySelected(true);
        } else {
          throw new Error('Failed to fetch new item');
        }
      }
    } catch (error) {
      console.error('Error setting up game:', error);
      setCategorySelected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setCategorySelected(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-gray-100 relative overflow-hidden" dir="rtl">
      {/* Animated background gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 to-transparent animate-pulse-subtle" style={{ animationDelay: '0s' }} />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 to-transparent animate-pulse-subtle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-0 bg-gradient-radial from-indigo-500/5 to-transparent animate-pulse-subtle" style={{ animationDelay: '1s' }} />
      </div>

      <header className="app-header relative z-10">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              لعبة التخمين
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto py-8 px-6">
        {!gameStarted ? (
          <GameSetup onStart={handleGameStart} />
        ) : !categorySelected ? (
          <CategorySelection onSelect={handleCategorySelect} onResetGame={handleResetGame} />
        ) : (
          <GameBoard onBackToCategories={handleBackToCategories} onResetGame={handleResetGame} />
        )}
        
        {loading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-xl border border-white/10">
              <div className="loading-spinner h-12 w-12 mx-auto"></div>
              <p className="mt-4 text-white/80">جاري تحميل البيانات...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;