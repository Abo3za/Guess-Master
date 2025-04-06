import React, { useEffect } from 'react';
import { Trophy, AlertCircle, Users, Star, Award } from 'lucide-react';

interface GameEndNotificationProps {
  winner: {
    name: string;
    score: number;
  };
  onClose: () => void;
  reason: 'points' | 'categories';
}

export const GameEndNotification: React.FC<GameEndNotificationProps> = ({ winner, onClose, reason }) => {
  useEffect(() => {
    // Prevent scrolling when notification is shown
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 border border-white/10">
        <div className="text-center">
          <div className="mb-8">
            {reason === 'points' ? (
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

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
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-xl font-bold text-white">{winner.name}</span>
                </div>
                <span className="text-2xl font-bold text-blue-400">{winner.score} نقطة</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-gray-400" />
                  <span className="text-xl font-bold text-white">الفريق الثاني</span>
                </div>
                <span className="text-2xl font-bold text-gray-400">0 نقطة</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="primary-button w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-xl py-4"
          >
            بدء لعبة جديدة
          </button>
        </div>
      </div>
    </div>
  );
}; 