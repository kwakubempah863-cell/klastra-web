import React from 'react';
import { Button, StatCard, TutorCard, Avatar, StarRating, Badge, SessionStatusBadge, ProgressBar, SectionHeader } from '../components/ui';
import { tutors, studentSessions, messages } from '../data/mockData';

export default function StudentDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const nextSession = studentSessions.find(s => s.status === 'upcoming');
  const upcoming = studentSessions.filter(s => s.status === 'upcoming');

  return (
    <div className="fade-in p-5 lg:p-7 max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="text-sm text-slate-500 font-medium">Good morning 👋</div>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-0.5">Welcome back, Kwame</h1>
          <p className="text-sm text-slate-500 mt-1">Thursday, 25 September 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" onClick={() => onNavigate('discover')}>Find a Tutor</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Upcoming Lessons" value={upcoming.length} icon={<CalIcon />} color="#1b3d7e" trend={{ dir: 'up', val: '2 this week' }} />
        <StatCard label="Total Sessions" value="34" icon={<BookIcon />} color="#0a7244" trend={{ dir: 'up', val: '+6 this month' }} />
        <StatCard label="Active Tutors" value="3" icon={<UserIcon />} color="#f07a22" />
        <StatCard label="Learning Streak" value="12 days" icon={<FireIcon />} color="#9333ea" trend={{ dir: 'up', val: 'Personal best!' }} />
      </div>

      {/* Next session banner */}
      {nextSession && (
        <div className="rounded-2xl mb-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2048 0%, #1b3d7e 100%)' }}>
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-1">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Next Lesson</div>
              <div className="flex items-center gap-3 mb-3">
                <Avatar src={nextSession.tutor.avatar} name={nextSession.tutor.name} size={44} />
                <div>
                  <div className="font-bold font-display text-white">{nextSession.tutor.name}</div>
                  <div className="text-sm text-white/70">{nextSession.subject}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span>📅 {nextSession.date}</span>
                <span>🕐 {nextSession.time}</span>
                <span>⏱ {nextSession.duration} min</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <div className="text-xs text-white/50 text-center">Starts in</div>
              <div className="text-2xl font-bold font-display text-[#f07a22]">2 days</div>
              <Button size="sm" variant="secondary" onClick={() => onNavigate('student-sessions')}>
                View Details
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming sessions */}
          <div className="bg-white rounded-[14px] p-5 card-shadow">
            <SectionHeader title="Upcoming Sessions" action={() => onNavigate('student-sessions')} />
            <div className="space-y-3">
              {upcoming.map(session => (
                <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Avatar src={session.tutor.avatar} name={session.tutor.name} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm">{session.tutor.name}</div>
                    <div className="text-xs text-slate-500">{session.subject} · {session.date} · {session.time}</div>
                  </div>
                  <SessionStatusBadge status={session.status} />
                  <Button size="sm" variant="outline" onClick={() => {}}>Join</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Learning progress */}
          <div className="bg-white rounded-[14px] p-5 card-shadow">
            <SectionHeader title="Learning Progress" subtitle="This month" />
            <div className="space-y-4">
              <ProgressBar value={82} label="Mathematics" color="#1b3d7e" />
              <ProgressBar value={71} label="English" color="#f07a22" />
              <ProgressBar value={91} label="Physics" color="#0fb568" />
            </div>
          </div>

          {/* Recommended tutors */}
          <div>
            <SectionHeader title="Recommended Tutors" subtitle="Based on your subjects" action={() => onNavigate('discover')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tutors.slice(3, 5).map(t => (
                <TutorCard key={t.id} tutor={t} compact onBook={() => onNavigate('booking')} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick actions */}
          <div className="bg-white rounded-[14px] p-5 card-shadow">
            <h3 className="font-bold font-display text-slate-900 mb-4 text-sm">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Find Tutor', icon: '🔍', page: 'discover' },
                { label: 'Book Session', icon: '📅', page: 'booking' },
                { label: 'My Sessions', icon: '📚', page: 'student-sessions' },
                { label: 'Messages', icon: '💬', page: 'student-messages' },
              ].map(a => (
                <button key={a.label} onClick={() => onNavigate(a.page)} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-[#eef2fb] hover:text-[#1b3d7e] transition-colors text-center">
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-xs font-semibold text-slate-700">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent messages */}
          <div className="bg-white rounded-[14px] p-5 card-shadow">
            <SectionHeader title="Messages" action={() => onNavigate('student-messages')} />
            <div className="space-y-3">
              {messages.slice(0, 3).map(msg => (
                <div key={msg.id} className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 rounded-xl p-2 -mx-2 transition-colors" onClick={() => onNavigate('student-messages')}>
                  <Avatar src={msg.contact.avatar} name={msg.contact.name} size={36} online={msg.online} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 truncate">{msg.contact.name}</span>
                      <span className="text-xs text-slate-400 ml-2 flex-shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{msg.lastMessage}</p>
                  </div>
                  {msg.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#f07a22] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{msg.unread}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent session history */}
          <div className="bg-white rounded-[14px] p-5 card-shadow">
            <SectionHeader title="Recent Sessions" />
            <div className="space-y-3">
              {studentSessions.filter(s => s.status === 'completed').map(s => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <Avatar src={s.tutor.avatar} name={s.tutor.name} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{s.subject}</div>
                    <div className="text-xs text-slate-400">{s.date}</div>
                  </div>
                  {s.rating && <StarRating rating={s.rating} size={12} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function BookIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function UserIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function FireIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>; }
