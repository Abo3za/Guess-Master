import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Eye, EyeOff } from 'lucide-react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      toast.error('كلمات المرور غير متطابقة');
      return;
    }
    if (!agreeToTerms) {
      setError('يجب الموافقة على الشروط والأحكام');
      toast.error('يجب الموافقة على الشروط والأحكام');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('جاري إنشاء الحساب...');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });

      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        email,
        phoneNumber,
        birthDate,
        createdAt: new Date().toISOString()
      });

      toast.success('تم إنشاء الحساب بنجاح! 🎮', {
        duration: 3000,
        icon: '🎯'
      });
      
      navigate('/');
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة جداً';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صالح';
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000
      });
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/5">
          <h1 className="text-3xl font-bold text-white text-center mb-8">إنشاء حساب جديد</h1>

          {error && <p className="text-red-500 text-center mb-6">{error}</p>}

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="الاسم الأول"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-right"
                required
              />
              <input
                type="text"
                placeholder="اسم العائلة"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-right"
                required
              />
            </div>

            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-right"
              required
              disabled={isLoading}
            />

            <div className="relative">
              <input
                type="date"
                placeholder="تاريخ الميلاد"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 text-right"
                required
              />
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <select
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 text-right"
                defaultValue="+966"
              >
                <option value="+966">Saudi Arabia (+966)</option>
              </select>
              <input
                type="tel"
                placeholder="رقم التليفون"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-right"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة السر"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-right"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-right"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <label className="text-white/70 cursor-pointer select-none" htmlFor="terms">
                أوافق على <span className="text-white hover:text-white/80">الشروط والأحكام</span>
              </label>
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 text-white focus:ring-white/20"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-lg font-semibold transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </form>

          <p className="mt-6 text-center text-white/70">
            هل لديك حساب؟{' '}
            <Link to="/login" className="text-white hover:text-white/80">
              تسجيل دخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 