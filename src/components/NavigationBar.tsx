import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, MessageSquare, User } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const NavigationBar: React.FC = () => {
  const { isGameActive, resetGame } = useGameStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const shouldHideNav = isGameActive || location.pathname === '/win';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (shouldHideNav) return null;

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/signup');
    }
  };

  const handleNavigation = (path: string) => {
    if (isGameActive) {
      resetGame();
      setTimeout(() => {
        navigate(path);
      }, 100);
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Profile Button */}
          <div className="flex items-center gap-4">
            <button onClick={() => handleNavigation('/')} className="flex items-center">
              <img 
                src="/Images/Logo.png" 
                alt="Guess Master Logo" 
                className="h-16 w-auto"
              />
            </button>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-gray-200 hover:text-white"
            >
              <User className="w-5 h-5" />
              {isLoggedIn ? 'حسابي' : 'تسجيل'}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavigation('/')}
              className="text-gray-200 hover:text-white transition-colors flex items-center gap-2 text-lg hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <Home className="w-5 h-5" />
              الرئيسية
            </button>
            <button
              onClick={() => handleNavigation('/about')}
              className="text-gray-200 hover:text-white transition-colors flex items-center gap-2 text-lg hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <Info className="w-5 h-5" />
              عن اللعبة
            </button>
            <button
              onClick={() => handleNavigation('/contact')}
              className="text-gray-200 hover:text-white transition-colors flex items-center gap-2 text-lg hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <MessageSquare className="w-5 h-5" />
              تواصل معنا
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar; 