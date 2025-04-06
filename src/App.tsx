import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import NavigationBar from './components/NavigationBar';
import { GameSetup } from './components/GameSetup';
import { CategorySelection } from './components/CategorySelection';
import { GameBoard } from './components/GameBoard';
import { useGameStore } from './store/gameStore';
import { Category } from './types';
import { fetchRandomAnime } from './services/jikanApi';
import { fetchRandomMovie } from './services/omdbApi';
import { fetchRandomTVShow } from './services/tvSeriesApi';
import { fetchRandomGame } from './services/rawgApi';
import { fetchRandomFootballItem } from './services/footballApi';
import { fetchRandomWrestler } from './services/wweApi';
import { fetchRandomCountry } from './services/countriesApi';

function AppRoutes() {
  const navigate = useNavigate();
  const { 
    isGameActive,
    initializeGame,
    setCategory,
    clearCategoryUsedItems,
    backToCategories,
    resetGame,
    setCurrentItem
  } = useGameStore();

  const handleGameStart = (teams: string[]) => {
    initializeGame(teams);
    navigate('/categories');
  };

  const handleCategorySelect = async (category: Category) => {
    setCategory(category);
    clearCategoryUsedItems(category);
    
    let item;
    try {
      switch (category) {
        case 'anime':
          item = await fetchRandomAnime(category);
          break;
        case 'movies':
          item = await fetchRandomMovie(category);
          break;
        case 'tv':
          item = await fetchRandomTVShow(category);
          break;
        case 'games':
          item = await fetchRandomGame(category);
          break;
        case 'football':
          item = await fetchRandomFootballItem(category);
          break;
        case 'wwe':
          item = await fetchRandomWrestler(category);
          break;
        case 'countries':
          item = await fetchRandomCountry(category);
          break;
        default:
          throw new Error(`Unknown category: ${category}`);
      }

      if (item) {
        setCurrentItem(item);
        navigate('/game');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      // Handle error appropriately
    }
  };

  const handleBackToCategories = () => {
    backToCategories();
    navigate('/categories');
  };

  const handleResetGame = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationBar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/setup" element={<GameSetup onStart={handleGameStart} />} />
          {isGameActive ? (
            <>
              <Route path="/categories" element={
                <CategorySelection 
                  onSelect={handleCategorySelect} 
                  onResetGame={handleResetGame} 
                />
              } />
              <Route path="/game" element={
                <GameBoard 
                  onBackToCategories={handleBackToCategories} 
                  onResetGame={handleResetGame} 
                />
              } />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/setup" replace />} />
          )}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;