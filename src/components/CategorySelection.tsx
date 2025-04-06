import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { 
  Gamepad2, Tv, Film, FolderRoot as Football, 
  BookOpen, Users, Plus, Minus,
  Sword, Flag
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { GameEndNotification } from './GameEndNotification';

interface CategorySelectionProps {
  onSelect: (category: Category) => void;
  onResetGame: () => void;
}

const categories = [
  {
    value: 'anime',
    label: 'أنمي',
    icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'tv',
    label: 'مسلسلات',
    icon: <Tv className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'movies',
    label: 'أفلام',
    icon: <Film className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'games',
    label: 'ألعاب',
    icon: <Gamepad2 className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'football',
    label: 'كرة القدم',
    icon: <Football className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'wwe',
    label: 'المصارعة',
    icon: <Sword className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1488656711237-487ce1cc53b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

export const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelect, onResetGame }) => {
  const { teams, adjustScore, endGame, categorySelectionCounts, checkWinCondition } = useGameStore();
  const [showEndNotification, setShowEndNotification] = useState(false);
  const [winner, setWinner] = useState<{ name: string; score: number } | null>(null);

  const activeTeam = teams.find(team => team.isActive);

  const getWinningTeam = () => {
    return teams.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );
  };

  const handleEndGame = () => {
    const winningTeam = getWinningTeam();
    setWinner({ name: winningTeam.name, score: winningTeam.score });
    setShowEndNotification(true);
  };

  const handleNotificationClose = () => {
    setShowEndNotification(false);
    setWinner(null);
    endGame();
    onResetGame();
  };

  // Check for win condition
  useEffect(() => {
    if (checkWinCondition()) {
      handleEndGame();
    }
  }, [teams]);

  const handleCategorySelect = (category: Category) => {
    const selectionCount = categorySelectionCounts[category] || 0;
    if (selectionCount >= 3) {
      return;
    }
    onSelect(category);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6" dir="rtl">
        <div className="mb-8">
          {/* Game Controls */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            {/* Game Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onResetGame}
                className="secondary-button whitespace-nowrap"
              >
                <Users className="w-5 h-5" />
                فرق جديدة
              </button>
              
              <button
                onClick={handleEndGame}
                className="primary-button bg-red-500 hover:bg-red-600 whitespace-nowrap"
              >
                <Flag className="w-5 h-5" />
                إنهاء اللعبة
              </button>
            </div>

            {/* Score Display */}
            <div className="text-center">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                أول فريق يصل إلى 200 نقطة يفوز
              </span>
            </div>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="team-card"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-white text-sm sm:text-base">{team.name}</h3>
                  <p className="text-base sm:text-lg text-white/90">النقاط: {team.score}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => adjustScore(team.id, -10)}
                    className="danger-button flex-1 py-1.5 flex items-center justify-center gap-1 text-sm sm:text-base"
                  >
                    <Minus className="w-4 h-4" />
                    -10
                  </button>
                  <button
                    onClick={() => adjustScore(team.id, 10)}
                    className="success-button flex-1 py-1.5 flex items-center justify-center gap-1 text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4" />
                    +10
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active Team Display */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              دور {activeTeam?.name}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mt-2">
              اختر الفئة التي تريد
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
          {categories.map((category) => {
            const selectionCount = categorySelectionCounts[category.value as Category] || 0;
            const isDisabled = selectionCount >= 3;
            
            return (
              <button
                key={category.value}
                onClick={() => handleCategorySelect(category.value as Category)}
                disabled={isDisabled}
                className={`category-card ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                style={{
                  backgroundImage: `url(${category.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col items-center text-center min-h-[140px] sm:min-h-[200px] justify-center">
                  <div className="category-icon mb-3 sm:mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold">{category.label}</h3>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-sm text-white/80">
                      {selectionCount}/3
                    </span>
                    {isDisabled && (
                      <span className="text-sm text-white/80">تم اختيارها</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showEndNotification && winner && (
        <div className="fixed inset-0 z-50">
          <GameEndNotification
            winner={winner}
            onClose={handleNotificationClose}
          />
        </div>
      )}
    </>
  );
};