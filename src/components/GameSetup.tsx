import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { Team } from '../types';
import { CATEGORY_CONFIG } from '../config/categories';
import { RECOMMENDED_POINTS, DEFAULT_WINNING_POINTS, DEFAULT_HIDE_HINTS } from '../config/gameConfig';

interface GameSetupProps {
  onStart: (
    teams: { id: number; name: string; score: number; isActive: boolean }[],
    winningPoints: number,
    selectedCategories: string[]
  ) => void;
}

// Replace the categories array with:
const categories = Object.entries(CATEGORY_CONFIG).map(([key, value]) => ({
  id: key,
  label: value.label,
  icon: value.icon,
  bgImage: value.bgImage
}));

export const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const { teams, resetGame } = useGameStore();
  const [team1Name, setTeam1Name] = useState('فريق 1');
  const [team2Name, setTeam2Name] = useState('فريق 2');
  const [winningPoints, setWinningPoints] = useState(DEFAULT_WINNING_POINTS);
  const [hideHints, setHideHints] = useState(DEFAULT_HIDE_HINTS);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Initialize teams when component mounts
  useEffect(() => {
    resetGame();
    
    // إنشاء معرفات فريدة للفرق
    const baseId = Date.now();
    const team1: Team = {
      id: baseId,
      name: team1Name,
      score: 0,
      isActive: true
    };
    
    const team2: Team = {
      id: baseId + 1,
      name: team2Name,
      score: 0,
      isActive: false
    };

    // تحديث حالة اللعبة مباشرة بالفرق الجديدة
    useGameStore.setState(state => ({
      ...state,
      teams: [team1, team2]
    }));
  }, []); // Run only once when component mounts

  const handleTeam1NameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value || 'فريق 1';
    setTeam1Name(newName);
    if (teams[0]) {
      useGameStore.setState(state => ({
        ...state,
        teams: state.teams.map((team, index) => 
          index === 0 ? { ...team, name: newName } : team
        )
      }));
    }
  };

  const handleTeam2NameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value || 'فريق 2';
    setTeam2Name(newName);
    if (teams[1]) {
      useGameStore.setState(state => ({
        ...state,
        teams: state.teams.map((team, index) => 
          index === 1 ? { ...team, name: newName } : team
        )
      }));
    }
  };

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

  const handlePointChange = (option: { value: number; label: string }) => {
    setWinningPoints(option.value);
  };

  const handleStartGame = () => {
    if (selectedCategories.length !== 6) {
      setError('الرجاء اختيار 6 تصنيفات');
      return;
    }

    // Ensure we have both teams with proper names
    const gameTeams = [
      { ...teams[0], name: team1Name, isActive: true },
      { ...teams[1], name: team2Name, isActive: false }
    ];

    onStart(gameTeams, winningPoints, hideHints, selectedCategories);
    navigate('/categories');
  };

  return (
    <div className="min-h-screen p-0 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-12 mt-8">حدد معلومات الفرق</h1>

      {/* Teams Section */}
      <div className="w-full px-8 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* First Team */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6">الفريق الأول</h2>
          <div className="w-full max-w-md">
            <input
              type="text"
              value={team1Name}
              onChange={handleTeam1NameChange}
              placeholder="اسم الفريق"
              className="w-full bg-transparent text-xl text-center border-b-2 border-gray-600 focus:border-blue-500 outline-none py-2"
              dir="rtl"
            />
          </div>
        </div>

        {/* Second Team */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6">الفريق الثاني</h2>
          <div className="w-full max-w-md">
            <input
              type="text"
              value={team2Name}
              onChange={handleTeam2NameChange}
              placeholder="اسم الفريق"
              className="w-full bg-transparent text-xl text-center border-b-2 border-gray-600 focus:border-blue-500 outline-none py-2"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="w-full px-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">اختر التصنيفات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`relative group overflow-hidden rounded-xl transition-all duration-300 aspect-[4/5] ${
                selectedCategories.includes(category.id)
                  ? 'ring-4 ring-orange-500'
                  : 'hover:ring-2 hover:ring-orange-500/50'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Selected Indicator */}
              {selectedCategories.includes(category.id) && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Category Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 className="text-2xl font-bold text-white">{category.label}</h3>
              </div>
            </button>
          ))}
        </div>
        <p className="text-gray-400 mt-6 text-center text-xl">
          تم اختيار {selectedCategories.length} من 6 تصنيفات
        </p>
      </div>

      {/* Points Selection */}
      <div className="w-full px-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">اختر عدد النقاط المطلوبة للفوز</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {RECOMMENDED_POINTS.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePointChange(option)}
              className={`p-6 rounded-xl text-center transition-all ${
                winningPoints === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="font-bold text-2xl mb-2">{option.label}</div>
              <div className="text-lg opacity-80">{option.value} نقطة</div>
              <div className="text-sm mt-2 opacity-80">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Start Game Button */}
      <button
        onClick={handleStartGame}
        disabled={selectedCategories.length < 6}
        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-16 py-4 rounded-full text-2xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
      >
        ابدأ اللعب
      </button>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-center mt-4">
          {error}
        </div>
      )}

    </div>
  );
};
