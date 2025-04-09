import React, { useState, useEffect } from 'react';
import { ArrowRight, Crown, Eye, Lightbulb, X, Play, Pause } from 'lucide-react';
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
    selectedCategory,
    isGameActive,
    setCurrentItem
  } = useGameStore();

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      const state = JSON.parse(savedGameState);
      if (state.showAnswer !== undefined) {
        setShowAnswer(state.showAnswer);
      }
      if (state.selectedTeam !== undefined) {
        setSelectedTeam(state.selectedTeam);
      }
      if (state.currentItem) {
        setCurrentItem(state.currentItem);
      }
    }
  }, []);

  useEffect(() => {
    if (isGameActive && currentItem) {
      const gameState = {
        isGameActive,
        teams,
        currentItem,
        showAnswer,
        selectedTeam,
        selectedCategory
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [isGameActive, teams, currentItem, showAnswer, selectedTeam, selectedCategory]);

  useEffect(() => {
    if (!isGameActive || !currentItem) {
      const savedGameState = localStorage.getItem('gameState');
      if (savedGameState) {
        const state = JSON.parse(savedGameState);
        if (!state.isGameActive) {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [isGameActive, currentItem, navigate]);

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
    if (!currentItem || showAnswer) return;
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
      navigate('/categories');
    }
  }, [currentItem, teams, adjustScore, setActiveTeam, checkWinCondition, navigate, selectedTeam]);

  // إعادة تعيين selectedTeam عند تغيير currentItem
  useEffect(() => {
    setSelectedTeam(null);
  }, [currentItem]);

  const handleBackToCategories = () => {
    navigate('/categories');
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIframeKey(prev => prev + 1); // Reset iframe to trigger new state
  };

  if (!currentItem) return null;

  const categoryLabel = selectedCategory && CATEGORIES[selectedCategory] 
    ? CATEGORIES[selectedCategory].label 
    : '';

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 relative" dir="rtl">
      {/* زر العودة */}
      <button
        onClick={handleBackToCategories}
        className="secondary-button mb-8 flex items-center gap-2 absolute top-4 right-4"
      >
        <ArrowRight className="w-5 h-5" />
        عودة للفئات (Esc)
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl mb-8 border border-gray-700/50">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4 bg-blue-500/10 px-6 py-3 rounded-xl border border-blue-500/20">
              <h2 className="text-2xl font-bold text-blue-400">التصنيف:</h2>
              <span className="text-white font-bold text-2xl">{categoryLabel}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 px-6 py-3 rounded-xl border border-green-500/20">
              <span className="text-gray-300">دور:</span>
              <span className="text-white font-bold text-xl flex items-center gap-2">
                {teams.find(t => t.isActive)?.name}
                <Crown className="w-5 h-5 text-yellow-400" />
              </span>
            </div>
          </div>

          {/* Add descriptive text for what to guess */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-8 text-center">
            <p className="text-xl text-gray-300">
              خمن {
                selectedCategory === 'anime' ? 'اسم الأنمي' :
                selectedCategory === 'tv' ? 'اسم المسلسل' :
                selectedCategory === 'movies' ? 'اسم الفيلم' :
                selectedCategory === 'games' ? 'اسم اللعبة' :
                selectedCategory === 'football' ? 'اسم اللاعب' :
                selectedCategory === 'wwe' ? 'اسم المصارع' :
                selectedCategory === 'music' ? 'اسم الأغنية أو الفنان' :
                selectedCategory === 'sports' ? 'اسم الرياضي أو الرياضة' :
                selectedCategory === 'tech' ? 'اسم التقنية أو الجهاز' :
                selectedCategory === 'history' ? 'الحدث أو الشخصية التاريخية' :
                selectedCategory === 'geography' ? 'المكان أو المعلم الجغرافي' :
                selectedCategory === 'science' ? 'المصطلح أو الاكتشاف العلمي' :
                selectedCategory === 'religion' ? 'حزر المكان' :
                selectedCategory === 'whoami' ? 'الشخصية' :
                selectedCategory === 'memories' ? 'الذكرى أو الشيء القديم' :
                selectedCategory === 'playerJourney' ? 'مسيرة اللاعب' :
                selectedCategory === 'prophets' ? 'اسم النبي أو الصحابي' :
                'الإجابة الصحيحة'
              }
            </p>
          </div>

          {/* Audio Player for Music Category */}
          {currentItem.category === 'music' && currentItem.mediaUrl && (
            <div className="mb-8">
              <div className="bg-gray-700/50 rounded-lg p-4">
                {isPlaying && (
                  <iframe
                    key={iframeKey}
                    className="w-full"
                    height="80"
                    src={currentItem.mediaUrl}
                    title="Music Preview"
                    allow="autoplay"
                    style={{ display: currentItem.isAudioOnly ? 'none' : 'block' }}
                  />
                )}
                <div className="h-20 flex items-center justify-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-all duration-300 transform hover:scale-110"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <p className="text-gray-400">
                    {isPlaying ? 'جاري تشغيل المقطع الصوتي...' : 'اضغط للتشغيل'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {currentItem.details.map((detail, index) => (
              <div
                key={index}
                className={`transform transition-all duration-300 ${
                  detail.revealed 
                    ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/30 scale-100' 
                    : 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 hover:scale-105'
                } rounded-xl p-6 shadow-lg border border-gray-700/50`}
              >
                {!detail.revealed ? (
                  <button
                    onClick={() => handleReveal(index)}
                    className="w-full h-32 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    <Eye className="w-8 h-8" />
                    <span className="text-sm">انقر لكشف التلميح</span>
                  </button>
                ) : (
                  <div className="text-center h-32 flex flex-col items-center justify-center">
                    <p className="text-sm text-blue-400 mb-3 font-medium">{detail.label}</p>
                    <p className="text-xl text-white font-bold">{detail.value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-8 py-4 rounded-xl text-xl font-bold flex items-center justify-center gap-3 w-full transform transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Lightbulb className="w-7 h-7" />
            هل عرفت الإجابة؟ اضغط هنا!
          </button>
        ) : (
          <>
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-8 shadow-xl mb-8 border border-green-500/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-400 mb-4">الإجابة الصحيحة هي</h3>
                <p className="text-4xl font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{currentItem.name}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-blue-400 mb-6 text-center">من الفريق الذي عرف الإجابة؟</h3>
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