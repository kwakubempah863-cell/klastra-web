import { useState } from 'react';
import { Link } from 'react-router-dom';

type AuthRole = 'student' | 'parent' | 'tutor';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [activeRole, setActiveRole] = useState<AuthRole>('student');
  const isLogin = mode === 'login';

  return (
    <div className="fade-in min-h-full flex items-center justify-center p-5 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <div className="text-center mb-7">
            <img src="/src/imports/Logo-1.jpeg" alt="TutorKonnect" className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover" />
            <h1 className="text-2xl font-bold font-display text-slate-900">{isLogin ? 'Welcome back' : 'Join TutorKonnect'}</h1>
            <p className="text-slate-500 text-sm mt-1">{isLogin ? 'Sign in to your account' : 'Create your free account'}</p>
          </div>

          {!isLogin && (
            <div className="mb-5">
              <label className="text-sm font-semibold text-slate-700 block mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'parent', 'tutor'] as AuthRole[]).map(role => (
                  <button key={role} onClick={() => setActiveRole(role)} className={`p-3 rounded-xl border-2 text-xs font-semibold text-center transition-all ${activeRole === role ? 'border-[#1b3d7e] bg-[#eef2fb] text-[#1b3d7e]' : 'border-slate-100 text-slate-600'}`}>
                    {role === 'student' ? '🎓' : role === 'parent' ? '👨‍👩‍👧' : '📚'}<br />{role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 mb-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">First Name</label>
                  <input type="text" placeholder="Kwame" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 focus:border-[#1b3d7e]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Last Name</label>
                  <input type="text" placeholder="Asante" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 focus:border-[#1b3d7e]" />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-white flex-shrink-0">
                  <span className="text-sm">🇬🇭</span>
                  <span className="text-sm font-medium text-slate-600">+233</span>
                </div>
                <input type="tel" placeholder="054 123 4567" className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 focus:border-[#1b3d7e]" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 focus:border-[#1b3d7e]" />
            </div>
          </div>

          <button className="w-full py-3 rounded-xl bg-[#1b3d7e] text-white font-bold text-sm hover:bg-[#152e61] transition-colors">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link to={isLogin ? '/register' : '/login'} className="text-[#1b3d7e] font-semibold hover:underline">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}