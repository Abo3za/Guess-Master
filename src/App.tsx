import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { WinPage } from './components/WinPage';
import WelcomePage from './components/WelcomePage';

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

  // Reset game state when app loads
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const shouldHideNav = isGameActive && (location.pathname === '/play' || location.pathname === '/game') && !gameEnded;

  const handleGameStart = (
    teams: { id: number; name: string; score: number; isActive: boolean }[], 
    winningPoints: number, 
    hideHints: boolean,
    selectedCategories: string[]
  ) => {
    initializeGame(teams, winningPoints, hideHints, selectedCategories);
    navigate('/play');
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
        // For demo categories, use placeholder data
        case 'music':
        case 'sports':
        case 'tech':
        case 'history':
        case 'geography':
        case 'science':
          // Use placeholder data for demo categories
          item = {
            id: `demo-${category}-${Date.now()}`,
            name: 'عنصر تجريبي',
            category: category,
            details: [
              { label: 'تلميح 1', value: 'معلومة تجريبية 1', revealed: false },
              { label: 'تلميح 2', value: 'معلومة تجريبية 2', revealed: false },
              { label: 'تلميح 3', value: 'معلومة تجريبية 3', revealed: false },
            ]
          };
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
    navigate('/play');
  };

  const handleResetGame = () => {
    resetGame();
    navigate('/');
  };

  // Redirect to win page if game has ended
  useEffect(() => {
    if (gameEnded && location.pathname !== '/win') {
      navigate('/win');
    }
  }, [gameEnded, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!shouldHideNav && <NavigationBar />}
      <main className={shouldHideNav ? "" : "pt-28"}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/setup" element={<GameSetup onStart={handleGameStart} />} />
          <Route path="/win" element={<WinPage onPlayAgain={handleResetGame} />} />
          {isGameActive && !gameEnded ? (
            <>
              <Route 
                path="/play" 
                element={
                  <CategorySelection 
                    onSelect={handleCategorySelect} 
                    onResetGame={handleResetGame} 
                  />
                } 
              />
              <Route 
                path="/game" 
                element={
                  <GameBoard 
                    onBackToCategories={handleBackToCategories} 
                  />
                } 
              />
            </>
          ) : null}
          <Route path="*" element={<Navigate to="/" replace />} />
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