import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, User } from 'lucide-react';

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Parse display name if exists
        if (currentUser.displayName) {
          const [first, last] = currentUser.displayName.split(' ');
          setFirstName(first || '');
          setLastName(last || '');
        }
        setPhoneNumber(currentUser.phoneNumber || '');
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (user) {
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
        // Note: Phone number update requires additional Firebase setup
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/5">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">حسابي</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                تسجيل خروج
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-white/10 text-white'
                  : 'bg-black/20 text-white/60 hover:bg-black/30'
              }`}
            >
              حساب تعريفي
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors ${
                activeTab === 'password'
                  ? 'bg-white/10 text-white'
                  : 'bg-black/20 text-white/60 hover:bg-black/30'
              }`}
            >
              تغيير كلمة المرور
            </button>
          </div>

          {/* Profile Form */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white/80" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white/10 p-2 rounded-full shadow-lg hover:bg-white/20 transition-colors">
                    <User className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="الاسم الأول"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="الاسم الأخير"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20"
                    defaultValue="+966"
                  >
                    <option value="+966">Saudi Arabia (+966)</option>
                  </select>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white/70"
                  />
                </div>
                <div className="col-span-2 relative">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSaveChanges}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-lg font-semibold transition-all"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {/* Password Form */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <input
                type="password"
                placeholder="كلمة المرور الحالية"
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <input
                type="password"
                placeholder="كلمة المرور الجديدة"
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <input
                type="password"
                placeholder="تأكيد كلمة المرور الجديدة"
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <div className="flex justify-center">
                <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-lg font-semibold transition-all">
                  تغيير كلمة المرور
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 