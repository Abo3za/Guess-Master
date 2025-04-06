import React from 'react';
import { Trophy, AlertCircle, Users, Star, Award, Home, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

interface WinPageProps {
  onPlayAgain: () => void;
}

export const WinPage: React.FC<WinPageProps> = ({ onPlayAgain }) => {
  const navigate = useNavigate();
  const { teams, winningPoints, gameEnded } = useGameStore();

  // Get the winning team
  const winner = teams.reduce((prev, current) => 
    (prev.score > current.score) ? prev : current
  );

  // Check if game ended due to points or categories
  const reason = teams.some(team => team.score >= winningPoints) ? 'points' : 'categories';

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleNewGameClick = () => {
    onPlayAgain();
    navigate('/setup');
  };

  return (
    <div className="min-h-screen">
      {/* Background section starting after nav bar */}
      <div 
        className="h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: 'url("/Images/WinBackground.png")',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full border border-white/10 relative z-10 mt-[20vh]">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              {reason === 'points' ? 'مبروك!' : 'انتهت اللعبة!'}
            </h2>

            <p className="text-xl text-gray-300 mb-8">
              {reason === 'points' 
                ? `${winner.name} وصل إلى النقاط المطلوبة للفوز!`
                : 'تم استخدام جميع الفئات للحد الأقصى'}
            </p>

            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Award className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-blue-400">الفائز</h3>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg p-4 mb-4">
                <p className="text-3xl font-bold text-white">{winner.name}</p>
                <p className="text-xl text-gray-400 mt-2">بـ {winner.score} نقطة</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Users className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-blue-400">ملخص النتائج</h3>
              </div>
              <div className="space-y-4">
                {teams.map((team, index) => (
                  <div 
                    key={team.id}
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      team.id === winner.id 
                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20' 
                        : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Star className={`w-6 h-6 ${team.id === winner.id ? 'text-yellow-400' : 'text-gray-400'}`} />
                      <span className="text-xl font-bold text-white">{team.name}</span>
                    </div>
                    <span className={`text-2xl font-bold ${team.id === winner.id ? 'text-blue-400' : 'text-gray-400'}`}>
                      {team.score} نقطة
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleHomeClick}
                className="primary-button flex-1 text-xl py-4"
              >
                <Home className="w-6 h-6" />
                الصفحة الرئيسية
              </button>
              <button
                onClick={handleNewGameClick}
                className="primary-button flex-1 text-xl py-4"
              >
                <Gamepad2 className="w-6 h-6" />
                لعبة جديدة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 