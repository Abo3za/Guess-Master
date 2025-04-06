import React, { useState } from 'react';
import { Users, Gamepad2, Brain, Trophy, Target, Settings } from 'lucide-react';

interface GameSetupProps {
  onStart: (teams: string[], winningPoints: number) => void;
}

const RECOMMENDED_POINTS = [
  { value: 100, label: 'سريعة', description: 'مباراة قصيرة (15-20 دقيقة)' },
  { value: 200, label: 'عادية', description: 'مباراة متوسطة (25-30 دقيقة)' },
  { value: 300, label: 'طويلة', description: 'مباراة طويلة (35-45 دقيقة)' },
];

export const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [teams, setTeams] = useState(['الفريق 1', 'الفريق 2']);
  const [winningPoints, setWinningPoints] = useState(200);
  const [customPoints, setCustomPoints] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teams.every(team => team.trim())) {
      onStart(teams, winningPoints);
    }
  };

  const handleTeamChange = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index] = value;
    setTeams(newTeams);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Game Explanation Section */}
        <div className="glass-card rounded-xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-3 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              كيف تلعب
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/5 p-2 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">اختر فئة</h3>
                <p className="text-gray-300 text-sm">
                  اختر من الألعاب، الأفلام، المسلسلات، الأنمي، أو كرة القدم. كل فئة تقدم تحديات فريدة!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/5 p-2 rounded-lg">
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">اكتشف واخمن</h3>
                <p className="text-gray-300 text-sm">
                  يتناوب الفرق في كشف التلميحات. كلما قل عدد التلميحات المكشوفة قبل التخمين الصحيح، زادت النقاط!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/5 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">اجمع النقاط</h3>
                <p className="text-gray-300 text-sm">
                  كل تلميح غير مكشوف يساوي 10 نقاط. قم بتخمينات استراتيجية لتحقيق أقصى عدد من النقاط!
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-white/80">
                <span className="font-semibold text-purple-400">نصيحة:</span> وازن بين المخاطرة والمكافأة! إذا انتظرت طويلاً للتخمين، قد تسبقك الفرق الأخرى.
              </p>
            </div>
          </div>
        </div>

        {/* Team Setup Section */}
        <div className="glass-card rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              إعداد اللعبة
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Names */}
            {teams.map((team, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  اسم الفريق {index + 1}
                </label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => handleTeamChange(index, e.target.value)}
                  className="input-field text-right"
                  placeholder={`أدخل اسم الفريق ${index + 1}`}
                  required
                />
              </div>
            ))}

            {/* Winning Points Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">نقاط الفوز</h3>
              </div>

              {!customPoints ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    {RECOMMENDED_POINTS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setWinningPoints(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          winningPoints === option.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="text-lg font-bold text-white">{option.label}</div>
                        <div className="text-sm text-gray-400">{option.value} نقطة</div>
                        <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomPoints(true)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    تخصيص النقاط
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <input
                    type="number"
                    value={winningPoints}
                    onChange={(e) => setWinningPoints(Math.max(50, parseInt(e.target.value) || 50))}
                    className="input-field text-right"
                    min="50"
                    step="10"
                    required
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">الحد الأدنى: 50 نقطة</span>
                    <button
                      type="button"
                      onClick={() => setCustomPoints(false)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      العودة للإعدادات الموصى بها
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="primary-button w-full mt-8 group"
            >
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ابدأ اللعب
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};