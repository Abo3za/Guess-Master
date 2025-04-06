import React, { useEffect } from 'react';
import { Category } from '../types';
import { 
  Users,
  Flag, Trophy, Crown,
  AlertCircle
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

interface CategorySelectionProps {
  onSelect: (category: Category) => void;
  onResetGame: () => void;
}

const allCategories = [
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
  const navigate = useNavigate();
  const { 
    teams, 
    adjustScore, 
    endGame, 
    categorySelectionCounts, 
    checkWinCondition, 
    winningPoints, 
    gameEnded,
    selectedCategories 
  } = useGameStore();

  const activeTeam = teams.find(team => team.isActive);

  // Filter categories to only show selected ones
  const categories = allCategories.filter(cat => selectedCategories.includes(cat.value));

  // Check if all categories have reached their limit
  const checkAllCategoriesUsed = () => {
    return categories.every(category => 
      (categorySelectionCounts[category.value as Category] || 0) >= 3
    );
  };

  useEffect(() => {
    if (gameEnded) {
      navigate('/win');
    }
  }, [gameEnded, navigate]);

  useEffect(() => {
    if (!gameEnded) {
      const hasWinner = checkWinCondition();
      const allCategoriesUsed = checkAllCategoriesUsed();
      
      if (hasWinner || allCategoriesUsed) {
        endGame();
      }
    }
  }, [teams, categorySelectionCounts, gameEnded, checkWinCondition, endGame]);

  const handleCategorySelect = (category: Category) => {
    if (gameEnded) return;
    const selectionCount = categorySelectionCounts[category] || 0;
    if (selectionCount >= 3) {
      return;
    }
    onSelect(category);
  };

  const handleEndGame = () => {
    endGame();
  };

  return (
    <div className="min-h-screen bg-gray-900 fixed inset-0 overflow-auto">
      <div className="h-full px-4 py-8" dir="rtl">
        <div className="flex justify-between items-center gap-4 mb-8">
          <div className="text-center bg-blue-500/10 px-6 py-3 rounded-xl border border-blue-500/20">
            <span className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              أول فريق يصل إلى {winningPoints} نقطة يفوز
            </span>
          </div>

          <button
            onClick={handleEndGame}
            className="primary-button bg-red-500 hover:bg-red-600 px-6 py-3 flex items-center gap-2 text-lg"
          >
            <Flag className="w-6 h-6" />
            إنهاء اللعبة
          </button>
        </div>

        {/* Add category usage warning */}
        {categories.filter(category => (categorySelectionCounts[category.value as Category] || 0) >= 3).length > 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <p className="text-yellow-400 text-center">
              <AlertCircle className="w-5 h-5 inline-block mr-2" />
              بعض الفئات وصلت للحد الأقصى (3 مرات)
            </p>
          </div>
        )}

        <div className="flex gap-8 h-[calc(100vh-10rem)]">
          {/* الفريق الأول - يمين */}
          <div className="w-1/4 bg-gray-800/50 rounded-2xl p-6">
            {teams.slice(0, 1).map((team) => (
              <div
                key={team.id}
                className={`h-full flex flex-col justify-center relative overflow-hidden rounded-xl ${
                  team.isActive ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  backgroundImage: 'url(/Images/Team1.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gray-900/50"></div>
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <h3 className="text-4xl font-bold text-white">{team.name}</h3>
                    {team.isActive && <Crown className="w-10 h-10 text-yellow-400" />}
                  </div>
                  <div className="text-7xl font-bold text-blue-400 text-center">
                    {team.score}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* المحتوى الرئيسي - المنتصف */}
          <div className="w-2/4 flex flex-col">
            <div className="text-center mb-8 bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-5xl font-bold text-blue-400 mb-4">
                دور {activeTeam?.name}
              </h2>
              <p className="text-2xl text-gray-300">
                اختر الفئة التي تريد
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
              {categories.map((category) => {
                const selectionCount = categorySelectionCounts[category.value as Category] || 0;
                const isDisabled = selectionCount >= 3;
                
                return (
                  <div key={category.value} className="relative group">
                    <button
                      onClick={() => handleCategorySelect(category.value as Category)}
                      disabled={isDisabled}
                      className={`category-card ${
                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'group-hover:scale-105'
                      } transition-all duration-300 w-full h-full overflow-hidden rounded-2xl shadow-lg bg-gray-800/50`}
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${category.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0 bg-gray-900/50"></div>
                      <div className="relative z-10 p-6">
                        <h3 className="text-3xl font-bold text-white mb-4">
                          {category.label}
                        </h3>
                        <p className="text-lg text-gray-300">
                          تم اختيارها {selectionCount} مرة من 3
                        </p>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* الفريق الثاني - يسار */}
          <div className="w-1/4 bg-gray-800/50 rounded-2xl p-6">
            {teams.slice(1, 2).map((team) => (
              <div
                key={team.id}
                className={`h-full flex flex-col justify-center relative overflow-hidden rounded-xl ${
                  team.isActive ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  backgroundImage: 'url(/Images/Team2.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gray-900/50"></div>
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <h3 className="text-4xl font-bold text-white">{team.name}</h3>
                    {team.isActive && <Crown className="w-10 h-10 text-yellow-400" />}
                  </div>
                  <div className="text-7xl font-bold text-blue-400 text-center">
                    {team.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};