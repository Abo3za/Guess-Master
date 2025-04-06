import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  Eye, 
  Gamepad2, 
  ArrowLeft, 
  Users,
  Check,
  X,
  Search
} from 'lucide-react';


interface GameBoardProps {
  onBackToCategories: () => void;
  onResetGame: () => void;
}

const getCategoryPrompt = (category: string): string => {
  switch (category) {
    case 'games':
      return 'خمن لعبة الفيديو';
    case 'movies':
      return 'خمن الفيلم';
    case 'tv':
      return 'خمن المسلسل';
    case 'anime':
      return 'خمن الأنمي';
    case 'football':
      return 'خمن اللاعب/الفريق';
    case 'music':
      return 'خمن الأغنية';
    case 'countries':
      return 'خمن الدولة';
    case 'history':
      return 'خمن الحدث التاريخي';
    case 'science':
      return 'خمن الاكتشاف العلمي';
    case 'wwe':
      return 'خمن المصارع';
    default:
      return 'قم بالتخمين';
  }
};

export const GameBoard: React.FC<GameBoardProps> = ({ onBackToCategories, onResetGame }) => {
  const { 
    teams, 
    currentItem,
    revealDetail,
    makeGuess,
    nextTurn,
  } = useGameStore();
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const activeTeam = teams.find((team) => team.isActive);

  const handleReveal = (index: number) => {
    revealDetail(index);
    // إزالة nextTurn() لأننا لا نريد التناوب عند فتح التلميحات
  };

  const handleTeamSelect = (teamId: string) => {
    if (currentItem) {
      makeGuess(teamId, currentItem.name);
    }
    setAnswerRevealed(false);
    nextTurn(); // انتقل للفريق التالي بعد انتهاء الدور
    onBackToCategories();
  };
  if (!currentItem || !activeTeam) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToCategories}
              className="primary-button bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <ArrowLeft className="w-5 h-5" />
              عودة للفئات
            </button>
            <button
              onClick={onResetGame}
              className="secondary-button"
            >
              <Users className="w-5 h-5" />
              فرق جديدة
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {getCategoryPrompt(currentItem.category)}
          </h3>
          <p className="text-center text-white/60">
            محاولة {activeTeam.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`team-card ${team.isActive ? 'active' : ''}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">{team.name}</h3>
                <p className="text-lg text-white/90">النقاط: {team.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        {!answerRevealed ? (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setAnswerRevealed(true)}
              className="primary-button"
            >
              <Search className="w-5 h-5" />
              كشف الإجابة
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">الإجابة:</h3>
              <p className="text-3xl text-white/90 font-bold">{currentItem.name}</p>
            </div>

            <div className="mb-6 p-4 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4">أي فريق أجاب صحيحاً؟</h3>
              <div className="grid grid-cols-2 gap-4">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamSelect(team.id)}
                    className="success-button"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {team.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    onBackToCategories();
                  }}
                  className="danger-button col-span-2"
                >
                  <X className="w-5 h-5 mr-2" />
                  لا أحد حصل على نقاط
                </button>
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          {currentItem.details.map((detail, index) => (
            <div
              key={index}
              className="game-detail-card"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-white/90">{detail.label}</span>
                {!detail.revealed && (
                  <button
                    onClick={() => handleReveal(index)}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> كشف
                  </button>
                )}
              </div>
              <p className="mt-2 text-white text-right">
                {detail.revealed ? detail.value : '???'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};