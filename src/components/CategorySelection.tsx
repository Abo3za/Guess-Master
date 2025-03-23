import React, { useState } from 'react';
import { Category, CategoryOption } from '../types';
import { 
  Gamepad2, Tv, Film, FolderRoot as Football, 
  BookOpen, Globe2, Plus, Minus, Trash2, Users,
  User, Building2, Trophy, MapPin, Landmark,
  Clapperboard, Camera, Video, Joystick, Users2
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../utils/cn';

interface CategorySelectionProps {
  onSelect: (category: Category) => void;
  onResetGame: () => void;
}

const categories: CategoryOption[] = [
  {
    value: 'anime',
    label: 'أنمي',
    icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        value: 'anime-series',
        label: 'مسلسلات أنمي',
        icon: <Video className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'anime-characters',
        label: 'شخصيات',
        icon: <User className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'anime-movies',
        label: 'أفلام أنمي',
        icon: <Film className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    value: 'tv',
    label: 'مسلسلات',
    icon: <Tv className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        value: 'tv-series',
        label: 'مسلسلات',
        icon: <Tv className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'tv-characters',
        label: 'شخصيات',
        icon: <User className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    value: 'movies',
    label: 'أفلام',
    icon: <Film className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        value: 'movie-titles',
        label: 'عناوين الأفلام',
        icon: <Clapperboard className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'movie-actors',
        label: 'ممثلين',
        icon: <Users2 className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'movie-directors',
        label: 'مخرجين',
        icon: <Camera className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    value: 'games',
    label: 'ألعاب',
    icon: <Gamepad2 className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        value: 'game-titles',
        label: 'عناوين الألعاب',
        icon: <Gamepad2 className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'game-characters',
        label: 'شخصيات',
        icon: <User className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'game-companies',
        label: 'شركات',
        icon: <Building2 className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    value: 'football',
    label: 'كرة القدم',
    icon: <Football className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        value: 'football-players',
        label: 'لاعبين',
        icon: <User className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'football-teams',
        label: 'فرق',
        icon: <Users2 className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'football-stadiums',
        label: 'ملاعب',
        icon: <Building2 className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    value: 'countries',
    label: 'دول',
    icon: <Globe2 className="w-6 h-6 md:w-8 md:h-8" />,
    bgImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      {
        value: 'countries-general',
        label: 'دول',
        icon: <Globe2 className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'countries-capitals',
        label: 'عواصم',
        icon: <MapPin className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800'
      },
      {
        value: 'countries-landmarks',
        label: 'معالم',
        icon: <Landmark className="w-5 h-5" />,
        bgImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800'
      }
    ]
  }
];

export const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelect, onResetGame }) => {
  const { teams, adjustScore, usedItems, initializeGame } = useGameStore();
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);

  const handleClearSession = () => {
    initializeGame(teams.map(team => team.name));
  };

  const handleMainCategorySelect = (category: MainCategory) => {
    setSelectedMainCategory(category);
  };

  const handleSubCategorySelect = (category: Category) => {
    setSelectedMainCategory(null);
    onSelect(category);
  };

  const selectedCategory = categories.find(cat => cat.value === selectedMainCategory);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6" dir="rtl">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <button
            onClick={onResetGame}
            className="secondary-button w-full sm:w-auto"
          >
            <Users className="w-5 h-5" />
            فرق جديدة
          </button>
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
            {selectedMainCategory ? 'اختر فئة فرعية' : 'اختر فئة'}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            {selectedMainCategory ? 'حدد فئة معينة للبدء' : 'حدد الفئة الرئيسية'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
        {selectedMainCategory ? (
          <>
            <button
              onClick={() => setSelectedMainCategory(null)}
              className="category-card col-span-full mb-4"
            >
              <div className="relative z-10 p-4 sm:p-6 flex items-center justify-center gap-2 text-white/80 hover:text-white">
                عودة للفئات الرئيسية ←
              </div>
            </button>
            {selectedCategory?.subcategories?.map((subcategory) => (
              <button
                key={subcategory.value}
                onClick={() => handleSubCategorySelect(subcategory.value)}
                className="category-card"
                style={{
                  backgroundImage: `url(${subcategory.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col items-center text-center min-h-[140px] sm:min-h-[180px] justify-center">
                  <div className="category-icon mb-3 sm:mb-4">
                    {subcategory.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{subcategory.label}</h3>
                </div>
              </button>
            ))}
          </>
        ) : (
          categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleMainCategorySelect(category.value)}
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
          ))
        )}
      </div>
    </div>
  );
};