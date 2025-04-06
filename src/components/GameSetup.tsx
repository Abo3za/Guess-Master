import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameSetupProps {
  onStart: (
    teams: { id: number; name: string; score: number; isActive: boolean }[],
    winningPoints: number,
    hideHints: boolean,
    selectedCategories: string[]
  ) => void;
}

const RECOMMENDED_POINTS = [
  { value: 100, label: 'سريعة', description: 'مباراة قصيرة (15-20 دقيقة)' },
  { value: 200, label: 'عادية', description: 'مباراة متوسطة (25-30 دقيقة)' },
  { value: 300, label: 'طويلة', description: 'مباراة طويلة (35-45 دقيقة)' },
];

// Extended category list including both real and placeholder categories
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
  },
  // Additional placeholder categories
  {
    value: 'music',
    label: 'موسيقى',
    bgImage: '/Images/MusicCard.png'
  },
  {
    value: 'sports',
    label: 'رياضات متنوعة',
    bgImage: '/Images/SportsCard.png'
  },
  {
    value: 'tech',
    label: 'تكنولوجيا',
    bgImage: '/Images/TechCard.png'
  },
  {
    value: 'history',
    label: 'تاريخ',
    bgImage: '/Images/HistoryCard.png'
  },
  {
    value: 'geography',
    label: 'جغرافيا',
    bgImage: '/Images/GeographyCard.png'
  },
  {
    value: 'science',
    label: 'علوم',
    bgImage: '/Images/ScienceCard.png'
  }
];

export const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [winningPoints, setWinningPoints] = useState(200);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleCategoryToggle = (categoryValue: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryValue)) {
        return prev.filter(c => c !== categoryValue);
      } else if (prev.length < 6) {
        return [...prev, categoryValue];
      }
      return prev;
    });
  };

  const handleStartGame = () => {
    if (!team1Name || !team2Name) {
      setError('الرجاء إدخال أسماء الفريقين');
      return;
    }
    if (selectedCategories.length !== 6) {
      setError('الرجاء اختيار 6 تصنيفات');
      return;
    }

    onStart(
      [
        { id: 1, name: team1Name, score: 0, isActive: true },
        { id: 2, name: team2Name, score: 0, isActive: false }
      ],
      winningPoints,
      false,
      selectedCategories
    );
    navigate('/play');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">إعداد اللعبة</h1>
          <p className="text-gray-300 text-lg">أدخل أسماء الفريقين واختر التصنيفات</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-300 text-lg mb-2">الفريق الأول</label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="اسم الفريق الأول"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-lg mb-2">الفريق الثاني</label>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="اسم الفريق الثاني"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-300 text-lg mb-4">نقاط الفوز</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {RECOMMENDED_POINTS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setWinningPoints(option.value)}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    winningPoints === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-lg font-semibold">{option.label}</div>
                  <div className="text-sm opacity-75">{option.value} نقطة</div>
                  <div className="text-xs mt-2 opacity-60">{option.description}</div>
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                value={winningPoints}
                onChange={(e) => setWinningPoints(Number(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                min="50"
                step="10"
              />
              <div className="absolute left-0 top-full mt-1">
                <span className="text-sm text-gray-400">الحد الأدنى: 50 نقطة</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-300 text-lg mb-4">اختر 6 تصنيفات</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryToggle(category.value)}
                  className={`relative group p-4 rounded-xl transition-all duration-300 ${
                    selectedCategories.includes(category.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">{category.label}</div>
                    {selectedCategories.includes(category.value) && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-gray-400 mt-2">
              تم اختيار {selectedCategories.length} من 6 تصنيفات
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleStartGame}
              className="primary-button px-8 py-4 text-xl flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              ابدأ اللعبة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};