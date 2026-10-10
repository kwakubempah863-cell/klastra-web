import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signIn, signUp } from '../services/authService';
import logoMark from '../imports/logo-mark.png';

type AuthRole = 'student' | 'parent' | 'tutor';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [activeRole, setActiveRole] = useState<AuthRole>('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const isLogin = mode === 'login';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setConfirmationSent(false);
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        const profile = await refresh();
        if (profile?.role === 'tutor') navigate('/tutor/onboarding');
        else if (profile?.role === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        const { session } = await signUp({ email, password, role: activeRole, firstName, lastName, phone });
        if (!session) {
          setConfirmationSent(true);
          return;
        }
        const profile = await refresh();
        navigate(profile?.role === 'tutor' ? '/tutor/onboarding' : '/');
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in min-h-full flex items-center justify-center p-5 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <div className="text-center mb-7">
            <img src={logoMark} alt="Klastra" className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover" />
            <h1 className="text-2xl font-bold font-display text-slate-900">{isLogin ? 'Welcome back' : 'Join Klastra'}</h1>
            <p className="text-slate-500 text-sm mt-1">{isLogin ? 'Sign in to your account' : 'Create your free account'}</p>
          </div>

          <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-5">
              <label className="text-sm font-semibold text-slate-700 block mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'parent', 'tutor'] as AuthRole[]).map(role => (
                  <button type="button" key={role} onClick={() => setActiveRole(role)} className={`p-3 rounded-xl border-2 text-xs font-semibold text-center transition-all ${activeRole === role ? 'border-[#102A43] bg-[#EFF6FF] text-[#102A43]' : 'border-slate-100 text-slate-600'}`}>
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
                  <input type="text" placeholder="Kwame" value={firstName} onChange={event => setFirstName(event.target.value)} autoComplete="given-name" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#102A43]/20 focus:border-[#102A43]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Last Name</label>
                  <input type="text" placeholder="Asante" value={lastName} onChange={event => setLastName(event.target.value)} autoComplete="family-name" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#102A43]/20 focus:border-[#102A43]" />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#102A43]/20 focus:border-[#102A43]" />
            </div>
            {!isLogin && <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-white flex-shrink-0">
                  <span className="text-sm">🇬🇭</span>
                  <span className="text-sm font-medium text-slate-600">+233</span>
                </div>
                <input type="tel" placeholder="054 123 4567" value={phone} onChange={event => setPhone(event.target.value)} autoComplete="tel-national" className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#102A43]/20 focus:border-[#102A43]" />
              </div>
            </div>}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={event => setPassword(event.target.value)} autoComplete={isLogin ? 'current-password' : 'new-password'} required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#102A43]/20 focus:border-[#102A43]" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#102A43] text-white font-bold text-sm hover:bg-[#0F172A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (isLogin ? 'Signing in…' : 'Creating account…') : isLogin ? 'Sign In' : 'Create Account'}
          </button>
          {error && <p role="alert" className="text-sm text-red-600 mt-3">{error}</p>}
          {confirmationSent && <p role="status" className="text-sm text-emerald-700 mt-3">We've sent a confirmation link to {email}.<br />Click the link to activate your account.</p>}
          </form>

          <div className="text-center mt-4">
            <span className="text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link to={isLogin ? '/register' : '/login'} className="text-[#102A43] font-semibold hover:underline">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}