import React from 'react';
import { MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            تواصل معنا
          </h1>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">معلومات التواصل</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400">البريد الإلكتروني</p>
                <p className="text-white">support@guess-master.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400">رقم الهاتف</p>
                <p className="text-white">+966 12 345 6789</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400">العنوان</p>
                <p className="text-white">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4">أرسل لنا رسالة</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">الاسم</label>
              <input
                type="text"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">الرسالة</label>
              <textarea
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}; 