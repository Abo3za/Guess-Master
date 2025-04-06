import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { WinPage } from './components/WinPage';

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isGameActive,
    initializeGame,
    setCategory,
    clearCategoryUsedItems,
    backToCategories,
    resetGame,
    setCurrentItem,
    gameEnded
  } = useGameStore();

  const shouldHideNav = isGameActive && (location.pathname === '/categories' || location.pathname === '/game');

  const handleGameStart = (teams: string[], winningPoints: number, hideHints: boolean) => {
    initializeGame(teams, winningPoints, hideHints);
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

  // Redirect to win page if game has ended and we're in a game-related page
  useEffect(() => {
    if (gameEnded && 
        (location.pathname === '/categories' || location.pathname === '/game')) {
      navigate('/win');
    }
  }, [gameEnded, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationBar />
      <main className={shouldHideNav ? "" : "pt-28"}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/setup" element={<GameSetup onStart={handleGameStart} />} />
          <Route path="/win" element={<WinPage />} />
          {!gameEnded && isGameActive ? (
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
            !gameEnded && <Route path="*" element={<Navigate to="/setup" replace />} />
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