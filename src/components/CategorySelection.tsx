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
    icon: <BookOpen className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'tv',
    label: 'مسلسلات',
    icon: <Tv className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'movies',
    label: 'أفلام',
    icon: <Film className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'games',
    label: 'ألعاب',
    icon: <Gamepad2 className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800'
  },
  {
    value: 'football',
    label: 'كرة القدم',
    icon: <Football className="w-6 h-6" />,
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
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6" dir="rtl">
        <div className="mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={onResetGame}
                className="secondary-button"
              >
                <Users className="w-5 h-5" />
                فرق جديدة
              </button>
              
              <button
                onClick={handleEndGame}
                className="primary-button bg-red-500 hover:bg-red-600"
              >
                <Flag className="w-5 h-5" />
                إنهاء اللعبة
              </button>
            </div>

            <div className="text-center">
              <span className="text-lg font-bold text-purple-400">
                أول فريق يصل إلى 200 نقطة يفوز
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="team-card"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-white">{team.name}</h3>
                  <p className="text-white/90">النقاط: {team.score}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => adjustScore(team.id, -10)}
                    className="danger-button flex-1 py-1.5 flex items-center justify-center gap-1"
                  >
                    <Minus className="w-4 h-4" />
                    -10
                  </button>
                  <button
                    onClick={() => adjustScore(team.id, 10)}
                    className="success-button flex-1 py-1.5 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    +10
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-blue-400">
              دور {activeTeam?.name}
            </h2>
            <p className="text-gray-300 mt-1">
              اختر الفئة التي تريد
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="relative z-10 p-4 h-full flex flex-col items-center text-center min-h-[140px] justify-center">
                  <div className="category-icon mb-2">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.label}</h3>
                  <div className="mt-1 flex items-center gap-1">
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
    </div>
  );
};