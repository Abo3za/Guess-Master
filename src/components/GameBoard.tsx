import React, { useState, useEffect } from 'react';
import { ArrowRight, Crown, Eye, Lightbulb, X } from 'lucide-react';
import { useGameStore, CATEGORIES } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

interface GameBoardProps {
  onBackToCategories: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ onBackToCategories }) => {
  const navigate = useNavigate();
  const { 
    teams, 
    currentItem, 
    revealDetail,
    checkWinCondition,
    gameEnded,
    adjustScore,
    setActiveTeam,
    selectedCategory
  } = useGameStore();

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  useEffect(() => {
    if (gameEnded) {
      navigate('/win');
    }
  }, [gameEnded, navigate]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToCategories();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleReveal = (index: number) => {
    if (!currentItem) return;
    revealDetail(index);
  };

  const handleTeamSelect = React.useCallback((teamId: number | null) => {
    if (!currentItem) return;
    
    // منع تحديث النقاط إذا تم اختيار فريق بالفعل
    if (selectedTeam !== null) return;
    
    setSelectedTeam(teamId);

    if (teamId !== null) {
      const unrevealedCount = currentItem.details.filter(d => !d.revealed).length;
      const allDetailsRevealed = unrevealedCount === 0;
      const points = allDetailsRevealed ? 10 : unrevealedCount * 10;
      
      adjustScore(teamId, points);
    }

    // تغيير الدور للفريق التالي
    const currentActiveTeam = teams.find(t => t.isActive);
    if (currentActiveTeam) {
      const currentTeamIndex = teams.findIndex(t => t.id === currentActiveTeam.id);
      const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
      setActiveTeam(teams[nextTeamIndex].id);
    }
    
    if (checkWinCondition()) {
      navigate('/win');
    } else {
      onBackToCategories();
    }
  }, [currentItem, teams, adjustScore, setActiveTeam, checkWinCondition, navigate, onBackToCategories, selectedTeam]);

  // إعادة تعيين selectedTeam عند تغيير currentItem
  useEffect(() => {
    setSelectedTeam(null);
  }, [currentItem]);

  if (!currentItem) return null;

  const categoryLabel = selectedCategory && CATEGORIES[selectedCategory] 
    ? CATEGORIES[selectedCategory].label 
    : '';

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 relative" dir="rtl">
      {/* زر العودة */}
      <button
        onClick={onBackToCategories}
        className="secondary-button mb-8 flex items-center gap-2 absolute top-4 right-4"
      >
        <ArrowRight className="w-5 h-5" />
        عودة للفئات (Esc)
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8 shadow-xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-blue-400">التصنيف:</h2>
              <span className="text-white font-bold text-xl">{categoryLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">الفريق النشط:</span>
              <span className="text-white font-bold">
                {teams.find(t => t.isActive)?.name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {currentItem.details.map((detail, index) => (
              <div
                key={index}
                className={`bg-gray-700/50 rounded-lg p-6 ${
                  detail.revealed ? 'opacity-100' : 'opacity-50'
                }`}
              >
                {!detail.revealed ? (
                  <button
                    onClick={() => handleReveal(index)}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <Eye className="w-8 h-8 text-gray-400" />
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">{detail.label}</p>
                    <p className="text-lg text-white">{detail.value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="primary-button px-8 py-4 text-xl flex items-center justify-center gap-2 w-full"
          >
            <Lightbulb className="w-6 h-6" />
            كشف الجواب
          </button>
        ) : (
          <>
            <div className="bg-gray-800 rounded-xl p-8 shadow-xl mb-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">الإجابة</h3>
                <p className="text-3xl font-bold text-white">{currentItem.name}</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-blue-400 mb-4 text-center">اختر الفريق الذي جاوب</h3>
              <div className="grid grid-cols-2 gap-4">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    className={`team-card ${
                      selectedTeam === team.id ? 'ring-2 ring-green-500' : ''
                    } ${
                      selectedTeam !== null && selectedTeam !== team.id ? 'opacity-50' : ''
                    } ${
                      selectedTeam !== null ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      if (selectedTeam === null) {
                        handleTeamSelect(team.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-xl font-bold text-white">{team.name}</h3>
                      {team.isActive && <Crown className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {team.score}
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  className={`team-card ${
                    selectedTeam === null ? 'ring-2 ring-red-500' : ''
                  } ${selectedTeam !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => {
                    if (selectedTeam === null) {
                      handleTeamSelect(null);
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <X className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-bold text-white">لم يجب أحد</h3>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};