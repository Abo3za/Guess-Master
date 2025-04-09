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
import { fetchRandomMusic } from './services/Music';
import { fetchRandomReligion } from './services/religionApi';
import { fetchRandomWhoAmI } from './services/whoAmIApi';
import { fetchRandomMemory } from './services/memoriesApi';
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

        // توجيه المستخدم إلى الصفحة المناسبة
        if (location.pathname === '/') {
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
    if (isGameActive) {
      const gameState = {
        isGameActive,
        teams,
        winningPoints,
        hideHints,
        selectedCategories,
        currentItem,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [isGameActive, teams, winningPoints, hideHints, selectedCategories, currentItem]);

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
        case 'music':
          item = await fetchRandomMusic(category);
          break;
        case 'religion':
          item = await fetchRandomReligion(category);
          break;
        case 'whoami':
          item = await fetchRandomWhoAmI(category);
          break;
        case 'memories':
          item = await fetchRandomMemory(category);
          break;
        // For demo categories, use placeholder data
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
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/win" element={
            <ProtectedRoute>
              <WinPage onPlayAgain={handleResetGame} />
            </ProtectedRoute>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div dir="rtl">
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
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;