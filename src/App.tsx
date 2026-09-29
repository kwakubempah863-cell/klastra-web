import React, { useState } from 'react';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import TutorDiscovery from './pages/TutorDiscovery';
import StudentDashboard from './pages/StudentDashboard';
import BookingFlow from './pages/BookingFlow';
import MessagingPage from './pages/MessagingPage';
import ParentDashboard from './pages/ParentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { tutors } from './data/mockData';
import { Avatar, Badge, Button, SessionStatusBadge, StarRating, EmptyState, SectionHeader, ProgressBar } from './components/ui';

type Role = 'public' | 'student' | 'parent' | 'tutor' | 'admin';

const defaultPageByRole: Record<Role, string> = {
  public: 'landing',
  student: 'student-dashboard',
  parent: 'parent-dashboard',
  tutor: 'tutor-dashboard',
  admin: 'admin-dashboard',
};

export default function App() {
  const [role, setRole] = useState<Role>('public');
  const [page, setPage] = useState('landing');

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setPage(defaultPageByRole[newRole]);
  };

  const navigate = (p: string) => setPage(p);

  const renderPage = () => {
    switch (page) {
      case 'landing': return <Landing onNavigate={navigate} />;
      case 'discover': return <TutorDiscovery onNavigate={navigate} />;
      case 'subjects': return <SubjectsPage onNavigate={navigate} />;
      case 'login': return <AuthPage mode="login" onNavigate={navigate} onLogin={(r) => handleRoleChange(r)} />;
      case 'register': return <AuthPage mode="register" onNavigate={navigate} onLogin={(r) => handleRoleChange(r)} />;
      case 'student-dashboard': return <StudentDashboard onNavigate={navigate} />;
      case 'booking': return <BookingFlow onNavigate={navigate} />;
      case 'student-sessions': return <SessionsPage onNavigate={navigate} />;
      case 'student-messages': return <MessagingPage />;
      case 'student-profile': return <ProfilePage />;
      case 'parent-dashboard': return <ParentDashboard onNavigate={navigate} />;
      case 'parent-children': return <ParentDashboard onNavigate={navigate} />;
      case 'parent-tutors': return <ParentTutorsPage />;
      case 'parent-lessons': return <ParentDashboard onNavigate={navigate} />;
      case 'parent-payments': return <PaymentsPage />;
      case 'parent-messages': return <MessagingPage />;
      case 'parent-profile': return <ProfilePage />;
      case 'tutor-dashboard': return <TutorDashboard onNavigate={navigate} />;
      case 'tutor-bookings': return <TutorDashboard onNavigate={navigate} />;
      case 'tutor-students': return <TutorStudentsPage />;
      case 'tutor-earnings': return <TutorDashboard onNavigate={navigate} />;
      case 'tutor-messages': return <MessagingPage />;
      case 'tutor-profile': return <TutorDashboard onNavigate={navigate} />;
      case 'admin-dashboard': return <AdminDashboard />;
      case 'admin-users': return <AdminDashboard />;
      case 'admin-tutors': return <AdminDashboard />;
      case 'admin-verification': return <AdminDashboard />;
      case 'admin-bookings': return <AdminDashboard />;
      case 'admin-payments': return <PaymentsPage />;
      case 'admin-disputes': return <AdminDashboard />;
      case 'admin-analytics': return <AnalyticsPage />;
      default: return <Landing onNavigate={navigate} />;
    }
  };

  return (
    <Layout currentPage={page} onNavigate={navigate} role={role} onRoleChange={handleRoleChange}>
      {renderPage()}
    </Layout>
  );
}

// ── Auth Page ──────────────────────────────────────────────────────────────
function AuthPage({ mode, onNavigate, onLogin }: { mode: 'login' | 'register'; onNavigate: (p: string) => void; onLogin: (r: Role) => void }) {
  const [activeRole, setActiveRole] = useState<Role>('student');
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
                {(['student', 'parent', 'tutor'] as Role[]).map(r => (
                  <button key={r} onClick={() => setActiveRole(r)} className={`p-3 rounded-xl border-2 text-xs font-semibold text-center transition-all ${activeRole === r ? 'border-[#1b3d7e] bg-[#eef2fb] text-[#1b3d7e]' : 'border-slate-100 text-slate-600'}`}>
                    {r === 'student' ? '🎓' : r === 'parent' ? '👨‍👩‍👧' : '📚'}<br />{r.charAt(0).toUpperCase() + r.slice(1)}
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

          <button
            onClick={() => onLogin(activeRole)}
            className="w-full py-3 rounded-xl bg-[#1b3d7e] text-white font-bold text-sm hover:bg-[#152e61] transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => onNavigate(isLogin ? 'register' : 'login')} className="text-[#1b3d7e] font-semibold hover:underline">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sessions Page ──────────────────────────────────────────────────────────
function SessionsPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const sessions = [
    { id: 1, tutor: tutors[0], subject: 'Mathematics', date: 'Sep 27, 2026', time: '10:00 AM', duration: 60, status: 'upcoming', meetLink: '#' },
    { id: 2, tutor: tutors[1], subject: 'Physics', date: 'Sep 29, 2026', time: '2:00 PM', duration: 90, status: 'upcoming', meetLink: '#' },
    { id: 3, tutor: tutors[0], subject: 'Mathematics', date: 'Sep 20, 2026', time: '10:00 AM', duration: 60, status: 'completed' },
    { id: 4, tutor: tutors[2], subject: 'English', date: 'Sep 15, 2026', time: '4:00 PM', duration: 60, status: 'completed' },
    { id: 5, tutor: tutors[1], subject: 'Physics', date: 'Sep 10, 2026', time: '2:00 PM', duration: 60, status: 'cancelled' },
  ];

  return (
    <div className="fade-in p-5 lg:p-7 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">My Sessions</h1>
          <p className="text-sm text-slate-500 mt-0.5">All your booked and past lessons</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button onClick={() => setView('list')} className={`tab-pill ${view === 'list' ? 'active' : ''}`}>List</button>
            <button onClick={() => setView('calendar')} className={`tab-pill ${view === 'calendar' ? 'active' : ''}`}>Calendar</button>
          </div>
          <Button size="sm" variant="secondary" onClick={() => onNavigate('booking')}>+ Book Session</Button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {sessions.map(s => (
            <div key={s.id} className="bg-white rounded-2xl p-5 card-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar src={s.tutor.avatar} name={s.tutor.name} size={52} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold font-display text-slate-900">{s.tutor.name}</span>
                  <SessionStatusBadge status={s.status} />
                </div>
                <div className="text-sm text-slate-500">{s.subject} · {s.date} · {s.time} · {s.duration} min</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.status === 'upcoming' && (
                  <>
                    <Button size="sm" variant="secondary" icon={<span>🎥</span>}>Join Google Meet</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                    <Button size="sm" variant="ghost">Cancel</Button>
                  </>
                )}
                {s.status === 'completed' && (
                  <>
                    <Button size="sm" variant="outline">Leave Review</Button>
                    <Button size="sm" variant="ghost">Book Again</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <div className="text-center text-slate-500 mb-4 font-semibold font-display">September 2026</div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 2 }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
              const hasSession = [20, 27, 29].includes(d);
              const isToday = d === 25;
              return (
                <div key={d} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium cursor-pointer transition-colors ${isToday ? 'bg-[#1b3d7e] text-white' : hasSession ? 'bg-[#eef2fb] text-[#1b3d7e]' : 'hover:bg-slate-50 text-slate-700'}`}>
                  {d}
                  {hasSession && !isToday && <div className="w-1.5 h-1.5 rounded-full bg-[#f07a22] mt-0.5" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Profile Page ───────────────────────────────────────────────────────────
function ProfilePage() {
  return (
    <div className="fade-in p-5 lg:p-7 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold font-display text-slate-900 mb-6">My Profile</h1>
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&h=120&fit=crop" alt="Profile" className="w-20 h-20 rounded-full object-cover bg-slate-100" />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1b3d7e] text-white rounded-full flex items-center justify-center text-xs">✏️</button>
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">Kwame Asante</h2>
            <div className="text-sm text-slate-500">Student · JHS 3 · Kumasi, Ghana</div>
            <Badge label="Member since Jan 2026" color="gray" />
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'First Name', value: 'Kwame', type: 'text' },
            { label: 'Last Name', value: 'Asante', type: 'text' },
            { label: 'Phone Number', value: '0541234567', type: 'tel' },
            { label: 'Grade / Level', value: 'JHS 3', type: 'text' },
            { label: 'Learning Interests', value: 'Mathematics, Physics, ICT', type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">{f.label}</label>
              <input type={f.type} defaultValue={f.value} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20" />
            </div>
          ))}
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

// ── Subjects Page ──────────────────────────────────────────────────────────
function SubjectsPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const subjects = [
    { name: 'Mathematics', icon: '📐', tutors: 48, desc: 'Algebra, Calculus, Statistics, Further Maths, WASSCE prep', color: '#1b3d7e' },
    { name: 'Physics', icon: '⚗️', tutors: 32, desc: 'Mechanics, Waves, Electricity, Modern Physics', color: '#0a7244' },
    { name: 'Chemistry', icon: '🧪', tutors: 29, desc: 'Organic, Inorganic, Physical chemistry and lab work', color: '#d45f10' },
    { name: 'English', icon: '📖', tutors: 41, desc: 'Comprehension, Essay writing, Literature, Grammar', color: '#1b3d7e' },
    { name: 'Biology', icon: '🔬', tutors: 27, desc: 'Cell biology, Ecology, Genetics, Human anatomy', color: '#0a7244' },
    { name: 'Economics', icon: '📊', tutors: 22, desc: 'Micro/Macro economics, Business management, Accounting', color: '#d45f10' },
    { name: 'ICT', icon: '💻', tutors: 19, desc: 'Programming, Spreadsheets, Databases, Web design', color: '#1b3d7e' },
    { name: 'Geography', icon: '🌍', tutors: 16, desc: 'Physical, Human and Economic Geography', color: '#0a7244' },
  ];
  return (
    <div className="fade-in p-5 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Browse Subjects</h1>
        <p className="text-slate-500">Expert tutors available across all major subjects</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map(s => (
          <div key={s.name} onClick={() => onNavigate('discover')} className="bg-white rounded-2xl p-6 card-shadow cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: s.color + '15' }}>{s.icon}</div>
              <Badge label={`${s.tutors} tutors`} color="navy" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-2">{s.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{s.desc}</p>
            <button className="text-sm font-semibold group-hover:text-[#1b3d7e] text-slate-400 transition-colors">Find tutors →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Payments Page ──────────────────────────────────────────────────────────
function PaymentsPage() {
  const payments = [
    { id: 'TK-2026-XA7K2', tutor: 'Dr. Ama Owusu', subject: 'Mathematics', date: 'Sep 25, 2026', amount: 80, status: 'successful', method: 'MTN MoMo' },
    { id: 'TK-2026-BM9F1', tutor: 'Mr. Kofi Mensah', subject: 'Physics', date: 'Sep 18, 2026', amount: 105, status: 'successful', method: 'MTN MoMo' },
    { id: 'TK-2026-CQ3T8', tutor: 'Ms. Abena Boateng', subject: 'English', date: 'Sep 12, 2026', amount: 60, status: 'successful', method: 'Vodafone Cash' },
    { id: 'TK-2026-DK5R4', tutor: 'Dr. Ama Owusu', subject: 'Mathematics', date: 'Sep 5, 2026', amount: 80, status: 'failed', method: 'MTN MoMo' },
    { id: 'TK-2026-EL2W7', tutor: 'Dr. Ama Owusu', subject: 'Mathematics', date: 'Aug 28, 2026', amount: 80, status: 'successful', method: 'MTN MoMo' },
  ];
  return (
    <div className="fade-in p-5 lg:p-7 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Payments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your payment history and receipts</p>
        </div>
        <Button size="sm" variant="outline">Download Statement</Button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 card-shadow text-center">
          <div className="text-2xl font-bold font-display text-[#0a7244]">GH₵405</div>
          <div className="text-xs text-slate-500 mt-1">Total spent</div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow text-center">
          <div className="text-2xl font-bold font-display text-[#1b3d7e]">5</div>
          <div className="text-xs text-slate-500 mt-1">Transactions</div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow text-center">
          <div className="text-2xl font-bold font-display text-[#f07a22]">4</div>
          <div className="text-xs text-slate-500 mt-1">Successful</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        {payments.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 px-5 py-4 ${i < payments.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-slate-50 transition-colors`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${p.status === 'successful' ? 'bg-[#edfdf5]' : 'bg-red-50'}`}>
              {p.status === 'successful' ? '✅' : '❌'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 text-sm">{p.tutor} · {p.subject}</div>
              <div className="text-xs text-slate-400">{p.date} · {p.method} · {p.id}</div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${p.status === 'successful' ? 'text-slate-900' : 'text-red-500'}`}>
                {p.status === 'successful' ? '-' : ''}GH₵{p.amount}
              </div>
              <Badge label={p.status} color={p.status === 'successful' ? 'teal' : 'red'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Parent Tutors Page ─────────────────────────────────────────────────────
function ParentTutorsPage() {
  return (
    <div className="fade-in p-5 lg:p-7 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold font-display text-slate-900 mb-6">Active Tutors</h1>
      <div className="space-y-4">
        {tutors.slice(0, 3).map(t => (
          <div key={t.id} className="bg-white rounded-2xl p-5 card-shadow flex items-start gap-5">
            <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover bg-slate-100 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold font-display text-slate-900">{t.name}</h3>
                  <div className="text-sm text-slate-500">{t.qualifications}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.subjects.map(s => <Badge key={s} label={s} color="navy" />)}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">★ {t.rating}</div>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                <span>Teaching: <strong className="text-slate-900">Sarah Quaye</strong></span>
                <span>Lessons: <strong className="text-slate-900">14</strong></span>
                <span>Next: <strong className="text-[#1b3d7e]">Sep 27, 10 AM</strong></span>
              </div>
            </div>
            <Button size="sm" variant="outline">Message</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tutor Students Page ────────────────────────────────────────────────────
function TutorStudentsPage() {
  return (
    <div className="fade-in p-5 lg:p-7 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold font-display text-slate-900 mb-6">My Students</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'Ama Serwaa', grade: 'SHS 2', subject: 'Mathematics', lessons: 14, nextLesson: 'Sep 27, 10 AM', progress: 82, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
          { name: 'Kweku Frimpong', grade: 'JHS 3', subject: 'Further Maths', lessons: 9, nextLesson: 'Sep 28, 3 PM', progress: 67, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
          { name: 'Adwoa Nyarko', grade: 'Primary 6', subject: 'Mathematics', lessons: 6, nextLesson: 'Sep 30, 11 AM', progress: 54, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop' },
          { name: 'Sarah Quaye', grade: 'JHS 3', subject: 'Mathematics', lessons: 14, nextLesson: 'Sep 27, 10 AM', progress: 82, avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop' },
        ].map(s => (
          <div key={s.name} className="bg-white rounded-2xl p-5 card-shadow">
            <div className="flex items-center gap-3 mb-4">
              <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover bg-slate-100" />
              <div>
                <div className="font-bold text-slate-900">{s.name}</div>
                <div className="text-xs text-slate-500">{s.grade} · {s.subject}</div>
              </div>
            </div>
            <ProgressBar value={s.progress} label="Progress" color={s.progress >= 80 ? '#0fb568' : s.progress >= 60 ? '#f07a22' : '#ef4444'} />
            <div className="flex justify-between text-xs text-slate-500 mt-3">
              <span>{s.lessons} lessons</span>
              <span>📅 {s.nextLesson}</span>
            </div>
            <Button size="sm" variant="ghost" fullWidth className="mt-3">Message Student</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analytics Page ─────────────────────────────────────────────────────────
function AnalyticsPage() {
  const monthlyData = [
    { month: 'Apr', users: 6800, bookings: 980, revenue: 78400 },
    { month: 'May', users: 7100, bookings: 1040, revenue: 83200 },
    { month: 'Jun', users: 7400, bookings: 1100, revenue: 88000 },
    { month: 'Jul', users: 7700, bookings: 1150, revenue: 92000 },
    { month: 'Aug', users: 8100, bookings: 1190, revenue: 95200 },
    { month: 'Sep', users: 8472, bookings: 1248, revenue: 94820 },
  ];
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  return (
    <div className="fade-in p-5 lg:p-7 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold font-display text-slate-900 mb-7">Platform Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Revenue (Sep)', value: 'GH₵94,820', color: '#0a7244' },
          { label: 'Total Bookings (Sep)', value: '1,248', color: '#1b3d7e' },
          { label: 'New Users (Sep)', value: '+372', color: '#f07a22' },
          { label: 'Platform Uptime', value: '99.8%', color: '#0a7244' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 card-shadow">
            <div className="text-2xl font-bold font-display mb-1" style={{ color: m.color }}>{m.value}</div>
            <div className="text-sm text-slate-500">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <SectionHeader title="Monthly Revenue" subtitle="Last 6 months" />
          <div className="flex items-end gap-3 h-40 mb-3">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] text-slate-400">{(d.revenue/1000).toFixed(0)}k</div>
                <div className="w-full rounded-t-lg" style={{ height: `${(d.revenue / maxRevenue) * 120}px`, background: i === monthlyData.length - 1 ? '#0a7244' : '#9af3c2' }} />
                <div className="text-[10px] text-slate-500">{d.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <SectionHeader title="Monthly Bookings" />
          <div className="flex items-end gap-3 h-40 mb-3">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] text-slate-400">{d.bookings}</div>
                <div className="w-full rounded-t-lg" style={{ height: `${(d.bookings / 1248) * 120}px`, background: i === monthlyData.length - 1 ? '#1b3d7e' : '#adc0e7' }} />
                <div className="text-[10px] text-slate-500">{d.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
