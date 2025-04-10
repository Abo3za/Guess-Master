import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import NavigationBar from './components/NavigationBar';
import { GameSetup } from './components/GameSetup';
import { CategorySelection } from './components/CategorySelection';
import { GameBoard } from './components/GameBoard';
import { useGameStore } from './store/gameStore';
import { Category } from './types';
import { API_CONFIG } from './config/apiConfig';
import { WinPage } from './components/WinPage';
import WelcomePage from './components/WelcomePage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
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
    gameEnded,
    teams,
    winningPoints,
    hideHints,
    selectedCategories,
    currentItem
  } = useGameStore();

  // استرجاع حالة اللعبة عند تحميل التطبيق
  useEffect(() => {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      const state = JSON.parse(savedGameState);
      
      // Don't restore if game has ended or we're on the win page
      if (state.gameEnded || window.location.pathname === '/win') {
        localStorage.removeItem('gameState');
        return;
      }

      if (state.isGameActive) {
        // استرجاع حالة اللعبة كاملة
        initializeGame(
          state.teams,
          state.winningPoints || 200,
          state.hideHints || false,
          state.selectedCategories || []
        );

        if (state.currentItem) {
          setCurrentItem(state.currentItem);
        }

        // Only redirect if we're on the home page or setup page and not coming from win page
        if ((location.pathname === '/' || location.pathname === '/setup') && !window.location.pathname.includes('/win')) {
          if (state.currentItem) {
            navigate('/game');
          } else {
            navigate('/categories');
          }
        }
      }
    }
  }, []);

  // حفظ حالة اللعبة عند أي تغيير
  useEffect(() => {
    if (isGameActive && !gameEnded) {
      const gameState = {
        isGameActive,
        teams,
        winningPoints,
        hideHints,
        selectedCategories,
        currentItem,
        gameEnded,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    } else if (gameEnded) {
      // Clear game state when game ends
      localStorage.removeItem('gameState');
    }
  }, [isGameActive, teams, winningPoints, hideHints, selectedCategories, currentItem, gameEnded]);

  const shouldHideNav = isGameActive && (location.pathname === '/play' || location.pathname === '/game') && !gameEnded;

  const handleGameStart = (
    teams: { id: number; name: string; score: number; isActive: boolean }[], 
    winningPoints: number, 
    hideHints: boolean,
    selectedCategories: string[]
  ) => {
    initializeGame(teams, winningPoints, hideHints, selectedCategories);
    navigate('/categories');
  };

  const handleCategorySelect = async (category: Category) => {
    setCategory(category);
    clearCategoryUsedItems(category);
    
    try {
      const item = await API_CONFIG[category](category);
      if (item) {
        setCurrentItem(item);
        navigate('/game');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
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
      <main>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1F2937',
              color: '#fff',
              fontSize: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Routes */}
          <Route path="/setup" element={
            <ProtectedRoute>
              <GameSetup onStart={handleGameStart} />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute>
              <CategorySelection 
                onSelect={handleCategorySelect} 
                onResetGame={handleResetGame} 
              />
            </ProtectedRoute>
          } />
          <Route path="/game" element={
            <ProtectedRoute>
              <GameBoard 
                onBackToCategories={handleBackToCategories} 
              />
            </ProtectedRoute>
          } />
          <Route path="/win" element={
            <ProtectedRoute>
              <WinPage onPlayAgain={handleResetGame} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
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