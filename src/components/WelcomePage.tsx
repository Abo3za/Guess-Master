import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Play } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
        <div className="absolute inset-0 bg-[url('/Images/background.png')] bg-cover bg-center" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white drop-shadow-lg">
            مرحباً بك في لعبة التخمين
          </h1>
          <p className="text-2xl md:text-3xl mb-12 text-gray-100 drop-shadow-md">
            اختبر معلوماتك في مختلف المجالات
          </p>
          <button
            onClick={() => navigate('/setup')}
            className="primary-button text-xl px-12 py-5 flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
          >
            <Play className="w-6 h-6" />
            ابدأ اللعبة
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">مميزات اللعبة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold mb-4">فئات متنوعة</h3>
              <p className="text-gray-300">
                اختر من بين عدة فئات مثل الأنمي، الأفلام، المسلسلات، الألعاب، كرة القدم والمصارعة
              </p>
            </div>
            <div className="feature-card">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-4">لعب جماعي</h3>
              <p className="text-gray-300">
                العب مع أصدقائك في فرق وتنافسوا معاً للوصول إلى أعلى النقاط
              </p>
            </div>
            <div className="feature-card">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-4">تحديات ممتعة</h3>
              <p className="text-gray-300">
                استمتع بتحديات متنوعة وتعلم معلومات جديدة في كل جولة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Play Section */}
      <div className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">كيف تلعب</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="text-xl font-bold mb-2">اختر الفرق</h3>
              <p className="text-gray-300">قم بإضافة الفرق التي ستلعب معك</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="text-xl font-bold mb-2">اختر الفئة</h3>
              <p className="text-gray-300">اختر الفئة التي تريد اللعب فيها</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="text-xl font-bold mb-2">تخمين</h3>
              <p className="text-gray-300">حاول تخمين الإجابة من خلال التلميحات</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="text-xl font-bold mb-2">احصل على النقاط</h3>
              <p className="text-gray-300">احصل على النقاط عند الإجابة الصحيحة</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">هل أنت مستعد للعب؟</h2>
          <p className="text-xl text-gray-300 mb-8">
            انضم إلينا الآن واستمتع بتجربة ممتعة مع أصدقائك
          </p>
          <button
            onClick={() => navigate('/setup')}
            className="primary-button text-xl px-8 py-4 flex items-center gap-2 mx-auto"
          >
            <Users className="w-6 h-6" />
            ابدأ اللعبة الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 