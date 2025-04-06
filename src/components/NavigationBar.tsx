import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Home, Info, MessageSquare } from 'lucide-react';

const NavigationBar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              لعبة التخمين
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Home className="w-5 h-5" />
              الرئيسية
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Info className="w-5 h-5" />
              عن اللعبة
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-5 h-5" />
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar; 