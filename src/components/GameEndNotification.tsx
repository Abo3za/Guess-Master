import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface GameEndNotificationProps {
  winner: {
    name: string;
    score: number;
  };
  onClose: () => void;
}

export const GameEndNotification: React.FC<GameEndNotificationProps> = ({ winner, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start the entrance animation
    setIsVisible(true);
    
    // Show content after a short delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Auto-close after 5 seconds
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setShowContent(false);
      setTimeout(onClose, 500); // Wait for fade-out animation
    }, 5000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Notification Card */}
      <div 
        className={`relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 shadow-2xl transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Trophy Icon */}
        <div 
          className={`absolute -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
            showContent ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-4 shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div 
          className={`text-center text-white transition-all duration-500 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">انتهت اللعبة!</h2>
          <p className="text-xl mb-2">الفائز هو</p>
          <p className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {winner.name}
          </p>
          <p className="text-2xl">
            بـ <span className="font-bold">{winner.score}</span> نقطة
          </p>
        </div>

        {/* Confetti Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-yellow-400 rounded-full transition-opacity duration-500 ${
                showContent ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `confetti ${Math.random() * 2 + 1}s ease-out forwards`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}; 