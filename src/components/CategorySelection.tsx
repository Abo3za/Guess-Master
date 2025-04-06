import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { 
  Users, Plus, Minus,
  Flag, Trophy, Crown
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
    bgImage: '/Images/AnimesCard.png'
  },
  {
    value: 'tv',
    label: 'مسلسلات',
    bgImage: '/Images/SeriesCard.png'
  },
  {
    value: 'movies',
    label: 'أفلام',
    bgImage: '/Images/MoviesCard.png'
  },
  {
    value: 'games',
    label: 'ألعاب',
    bgImage: '/Images/GamesCard.png'
  },
  {
    value: 'football',
    label: 'كرة القدم',
    bgImage: '/Images/FootballCard.png'
  },
  {
    value: 'wwe',
    label: 'المصارعة',
    bgImage: '/Images/WrestlingCard.png'
  }
];

export const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelect, onResetGame }) => {
  const { teams, adjustScore, endGame, categorySelectionCounts, checkWinCondition, winningPoints } = useGameStore();
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
      <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={onResetGame}
                className="secondary-button px-6 py-3 flex items-center gap-2 text-lg"
              >
                <Users className="w-6 h-6" />
                فرق جديدة
              </button>
              
              <button
                onClick={handleEndGame}
                className="primary-button bg-red-500 hover:bg-red-600 px-6 py-3 flex items-center gap-2 text-lg"
              >
                <Flag className="w-6 h-6" />
                إنهاء اللعبة
              </button>
            </div>

            <div className="text-center bg-blue-500/10 px-6 py-3 rounded-xl border border-blue-500/20">
              <span className="text-xl font-bold text-blue-400 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                أول فريق يصل إلى {winningPoints} نقطة يفوز
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`team-card ${team.isActive ? 'ring-2 ring-blue-500' : ''} transition-all duration-300`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{team.name}</h3>
                    {team.isActive && <Crown className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {team.score}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => adjustScore(team.id, -10)}
                    className="danger-button flex-1 py-2 flex items-center justify-center gap-2 text-lg"
                  >
                    <Minus className="w-5 h-5" />
                    -10
                  </button>
                  <button
                    onClick={() => adjustScore(team.id, 10)}
                    className="success-button flex-1 py-2 flex items-center justify-center gap-2 text-lg"
                  >
                    <Plus className="w-5 h-5" />
                    +10
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-blue-400 mb-2">
              دور {activeTeam?.name}
            </h2>
            <p className="text-xl text-gray-300">
              اختر الفئة التي تريد
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 mb-8">
          {categories.map((category) => {
            const selectionCount = categorySelectionCounts[category.value as Category] || 0;
            const isDisabled = selectionCount >= 3;
            
            return (
              <div key={category.value} className="relative group">
                <div className="flex flex-col">
                  <button
                    onClick={() => handleCategorySelect(category.value as Category)}
                    disabled={isDisabled}
                    className={`category-card ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'group-hover:scale-105'} transition-all duration-300 w-full aspect-[4/3] overflow-hidden rounded-t-2xl shadow-lg`}
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(${category.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="relative z-10 h-full flex flex-col items-center justify-end p-4">
                      <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <span className="text-lg text-white font-semibold drop-shadow-md">
                          {selectionCount}/3
                        </span>
                        {isDisabled && (
                          <span className="text-lg text-white font-semibold drop-shadow-md">تم اختيارها</span>
                        )}
                      </div>
                    </div>
                  </button>
                  <div className="bg-[#2F3640] w-full py-4 px-6 rounded-b-2xl shadow-lg">
                    <div className="text-2xl font-bold text-white text-center">
                      {category.label}
                    </div>
                  </div>
                </div>
              </div>
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