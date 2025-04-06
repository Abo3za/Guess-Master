import React from 'react';
import { Info } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const AboutPage: React.FC = () => {
  const { winningPoints } = useGameStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
            <Info className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            عن لعبة التخمين
          </h1>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">ما هي لعبة التخمين؟</h2>
          <p className="text-gray-300 mb-4">
            لعبة التخمين هي لعبة مسلية تعتمد على الذكاء والسرعة في التخمين. يمكنك اللعب مع أصدقائك في فرق وتتنافسون على جمع النقاط من خلال تخمين الإجابات الصحيحة.
          </p>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">كيف تلعب؟</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• اختر الفئة التي تريد اللعب بها</li>
            <li>• استخدم التلميحات المتاحة للوصول إلى الإجابة</li>
            <li>• كل تلميح يكشفه الفريق يقلل من النقاط المحتملة</li>
            <li>• الفريق الذي يجمع {winningPoints} نقطة أولاً يفوز</li>
          </ul>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4">مميزات اللعبة</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• واجهة مستخدم سهلة وجذابة</li>
            <li>• فئات متنوعة تشمل الأفلام، الألعاب، الأنمي والمزيد</li>
            <li>• نظام نقاط متوازن</li>
            <li>• إمكانية اللعب مع فريقين أو أكثر</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 