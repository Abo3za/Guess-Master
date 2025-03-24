import React, { useState } from 'react';
import { Category, Difficulty, DIFFICULTY_POINTS, DIFFICULTY_HINTS } from '../types';
import { 
  Gamepad2, Tv, Film, FolderRoot as Football, 
  BookOpen, Globe2, Trash2, Users, Plus, Minus,
  Sparkles, Target, Zap, Sword, ArrowLeft, X  // إضافة أيقونة X
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';

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

const getDifficultyDescription = (difficulty: Difficulty, category: Category | null) => {
  const hints = category === 'anime' 
    ? DIFFICULTY_HINTS.anime[difficulty]
    : DIFFICULTY_HINTS.default[difficulty];
  return `${hints} تلميحات - ${DIFFICULTY_POINTS[difficulty]} نقاط لكل تلميح`;
};

const difficulties: { value: Difficulty; label: string; icon: JSX.Element }[] = [
  {
    value: 'normal',
    label: 'عادي',
    icon: <Target className="w-6 h-6" />
  },
  {
    value: 'hard',
    label: 'صعب',
    icon: <Zap className="w-6 h-6" />
  }
];

export const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelect, onResetGame }) => {
  const { teams, adjustScore, usedItems, initializeGame, setDifficulty, endGame, round } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const activeTeam = teams.find(team => team.isActive);

  const handleClearSession = () => {
    initializeGame(teams.map(team => team.name));
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    if (!selectedCategory) return;
    setDifficulty(difficulty);
    // Add a small delay to ensure the difficulty is set before proceeding
    setTimeout(() => {
      onSelect(selectedCategory);
    }, 0);
  };

  const handleEndGame = () => {
    if (window.confirm('هل أنت متأكد من إنهاء اللعبة الآن؟')) {
      const winner = teams.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      alert(`🎉 مبروك! الفريق ${winner.name} فاز بمجموع ${winner.score} نقطة`);
      endGame();
      onResetGame();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6" dir="rtl">
      <div className="text-center mb-6">
        <p className="text-xl font-bold text-gray-300">
          الجولة {round}
        </p>
      </div>
      
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onResetGame}
              className="secondary-button flex-1 sm:flex-initial"
            >
              <Users className="w-5 h-5" />
              فرق جديدة
            </button>
            <button
              onClick={handleEndGame}
              className="danger-button flex-1 sm:flex-initial"
            >
              <X className="w-5 h-5" />
              إنهاء اللعبة
            </button>
          </div>
          <button
            onClick={handleClearSession}
            className="secondary-button w-full sm:w-auto"
            title="مسح سجل العناصر المستخدمة"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">مسح الجلسة</span>
            <span className="inline sm:hidden">مسح ({usedItems.size})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
          {teams.map((team) => (
            <div
              key={team.id}
              className="team-card"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-white text-sm sm:text-base">{team.name}</h3>
                <p className="text-base sm:text-lg text-white/90">Score: {team.score}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => adjustScore(team.id, -10)}
                  className="danger-button flex-1 py-1 flex items-center justify-center gap-1 text-sm sm:text-base"
                >
                  <Minus className="w-4 h-4" />
                  -10
                </button>
                <button
                  onClick={() => adjustScore(team.id, 10)}
                  className="success-button flex-1 py-1 flex items-center justify-center gap-1 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  +10
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center sm:text-right mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            دور {activeTeam?.name}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            {selectedCategory ? 'حدد مستوى الصعوبة للبدء' : 'اختر الفئة التي تريد'}
          </p>
        </div>
      </div>

      {!selectedCategory ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategorySelect(category)}
              className="category-card"
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
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className="secondary-button"
            >
              <ArrowLeft className="w-5 h-5" />
              عودة للفئات
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                onClick={() => handleDifficultySelect(difficulty.value)}
                className="difficulty-card glass-card p-6 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="category-icon">
                    {difficulty.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">{difficulty.label}</h3>
                    <p className="text-sm text-gray-300">
                      {getDifficultyDescription(difficulty.value, selectedCategory)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};