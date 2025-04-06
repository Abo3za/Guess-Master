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
  const [showCorrectGuess, setShowCorrectGuess] = useState(false);

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

  const handleTeamSelect = (teamId: number | null) => {
    if (!currentItem) return;
    
    setSelectedTeam(teamId);
    setShowCorrectGuess(true);

    if (teamId !== null) {
      const unrevealedCount = currentItem.details.filter(d => !d.revealed).length;
      const allDetailsRevealed = unrevealedCount === 0;
      const points = allDetailsRevealed ? 10 : unrevealedCount * 10;
      adjustScore(teamId, points);
    }

    // Always rotate to next team
    const currentActiveTeam = teams.find(t => t.isActive);
    if (currentActiveTeam) {
      const currentTeamIndex = teams.findIndex(t => t.id === currentActiveTeam.id);
      const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
      setActiveTeam(teams[nextTeamIndex].id);
    }
    
    if (checkWinCondition()) {
      setTimeout(() => {
        setShowCorrectGuess(false);
        navigate('/win');
      }, 2000);
    } else {
      setTimeout(() => {
        setShowCorrectGuess(false);
        onBackToCategories();
      }, 2000);
    }
  };

  if (!currentItem) return null;

  const categoryLabel = selectedCategory && CATEGORIES[selectedCategory] 
    ? CATEGORIES[selectedCategory].label 
    : '';

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBackToCategories}
          className="secondary-button mb-8 flex items-center gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          عودة للفئات (Esc)
        </button>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        <div className="flex flex-col gap-4">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="primary-button px-8 py-4 text-xl flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-6 h-6" />
              كشف الجواب
            </button>
          ) : (
            <>
              <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">الإجابة</h3>
                  <p className="text-3xl font-bold text-white">{currentItem.name}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-blue-400 mb-4 text-center">اختر الفريق الذي جاوب</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className={`team-card ${selectedTeam === team.id ? 'ring-2 ring-green-500' : ''}`}
                      onClick={() => handleTeamSelect(team.id)}
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{team.name}</h3>
                        {team.isActive && <Crown className="w-5 h-5 text-yellow-400" />}
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {team.score}
                      </div>
                    </div>
                  ))}
                  <div
                    className={`team-card ${selectedTeam === null ? 'ring-2 ring-red-500' : ''}`}
                    onClick={() => handleTeamSelect(null)}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">لا أحد جاوب</h3>
                      <X className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {showCorrectGuess && (
          <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-green-400 text-center text-xl">
              {selectedTeam === null ? 'تم الانتقال للفئة التالية' : 'تم تسجيل النقاط بنجاح! 🎉'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};