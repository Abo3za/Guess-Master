import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, MessageSquare } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const NavigationBar: React.FC = () => {
  const { isGameActive } = useGameStore();
  const location = useLocation();
  const shouldHideNav = isGameActive && (location.pathname === '/categories' || location.pathname === '/game');

  if (shouldHideNav) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-28">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-200 hover:text-white transition-colors flex items-center gap-2 text-lg hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <Home className="w-6 h-6" />
              الرئيسية
            </Link>
            <Link
              to="/about"
              className="text-gray-200 hover:text-white transition-colors flex items-center gap-2 text-lg hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <Info className="w-6 h-6" />
              عن اللعبة
            </Link>
            <Link
              to="/contact"
              className="text-gray-200 hover:text-white transition-colors flex items-center gap-2 text-lg hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <MessageSquare className="w-6 h-6" />
              تواصل معنا
            </Link>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/Images/Logo.png" 
              alt="Guess Master Logo" 
              className="h-20 w-auto"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar; 