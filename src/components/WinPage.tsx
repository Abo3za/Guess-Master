import React, { useEffect } from 'react';
import { Trophy, AlertCircle, Users, Star, Award, Home, Gamepad2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

interface WinPageProps {
  onPlayAgain: () => void;
}

export const WinPage: React.FC<WinPageProps> = ({ onPlayAgain }) => {
  const navigate = useNavigate();
  const { teams, winningPoints, gameEnded, resetGame } = useGameStore();

  useEffect(() => {
    // If there are no teams or game hasn't ended, redirect to setup
    if (!teams?.length || !gameEnded) {
      navigate('/setup');
      return;
    }
  }, [teams, gameEnded, navigate]);

  // Get the winning team
  const winner = teams?.length ? teams.reduce((prev, current) => 
    (prev.score > current.score) ? prev : current
  ) : null;

  // Check if game ended due to points or categories
  const reason = teams?.some(team => team.score >= winningPoints) ? 'points' : 'categories';

  const handleHomeClick = () => {
    resetGame();
    navigate('/');
  };

  const handleNewGameClick = () => {
    resetGame();
    onPlayAgain();
    navigate('/setup');
  };

  if (!winner) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Images/WinBackground.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90" />
        <div className="absolute inset-0 animate-pulse">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
          {/* Winner Announcement */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center animate-bounce">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-4">
              {reason === 'points' ? 'مبروك!' : 'انتهت اللعبة!'}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {reason === 'points' 
                ? `${winner.name} وصل إلى النقاط المطلوبة للفوز!`
                : 'تم استخدام جميع الفئات للحد الأقصى'}
            </p>
          </div>

          {/* Winner Card */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl p-6 mb-8 border border-yellow-500/20 transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Award className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-400">الفائز</h3>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg p-6">
              <p className="text-4xl font-bold text-white text-center mb-2">{winner.name}</p>
              <p className="text-2xl text-yellow-400 text-center">بـ {winner.score} نقطة</p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-6 mb-8 border border-blue-500/20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Users className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold text-blue-400">ملخص النتائج</h3>
            </div>
            <div className="space-y-4">
              {teams.map((team, index) => (
                <div 
                  key={team.id}
                  className={`flex justify-between items-center p-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02] ${
                    team.id === winner.id 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/20' 
                      : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star className={`w-6 h-6 ${team.id === winner.id ? 'text-yellow-400' : 'text-gray-400'}`} />
                    <span className="text-xl font-bold text-white">{team.name}</span>
                  </div>
                  <span className={`text-2xl font-bold ${team.id === winner.id ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {team.score} نقطة
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleHomeClick}
              className="primary-button flex-1 text-xl py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform transition-all duration-300 hover:scale-105"
            >
              <Home className="w-6 h-6" />
              الصفحة الرئيسية
            </button>
            <button
              onClick={handleNewGameClick}
              className="primary-button flex-1 text-xl py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform transition-all duration-300 hover:scale-105"
            >
              <Gamepad2 className="w-6 h-6" />
              لعبة جديدة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 