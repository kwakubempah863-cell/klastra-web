import React, { useState } from 'react';
import { Button, StatCard, Avatar, Badge, ProgressBar, CircleProgress, SectionHeader, SessionStatusBadge } from '../components/ui';
import { childrenData, tutors } from '../data/mockData';

export default function ParentDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeChild, setActiveChild] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'history' | 'tutors' | 'feedback'>('overview');
  const child = childrenData[activeChild];

  return (
    <div className="fade-in p-5 lg:p-7 max-w-6xl mx-auto">
      {/* Greeting + child selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <div className="text-sm text-slate-500 font-medium">Good morning 👋</div>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-0.5">Welcome, Grace</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's how your children are progressing</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">Child:</span>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
            {childrenData.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveChild(i)}
                className={`px-4 py-2 text-sm font-semibold transition-all flex items-center gap-2 ${activeChild === i ? 'bg-[#1b3d7e] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Avatar src={c.avatar} name={c.name} size={20} />
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Overall Progress" value={`${child.overallProgress}%`} icon={<ChartIcon />} color="#1b3d7e" trend={{ dir: 'up', val: '+4% this week' }} />
        <StatCard label="Completed Lessons" value={child.completedLessons} icon={<BookIcon />} color="#0a7244" />
        <StatCard label="Upcoming Lessons" value={child.upcomingLessons} icon={<CalIcon />} color="#f07a22" />
        <StatCard label="Learning Streak" value={`${child.streak} days`} icon={<FireIcon />} color="#9333ea" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {(['overview', 'subjects', 'history', 'tutors', 'feedback'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-pill ${activeTab === tab ? 'active' : ''}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Child info */}
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-4 mb-5">
                <img src={child.avatar} alt={child.name} className="w-16 h-16 rounded-full object-cover bg-slate-100" />
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">{child.name}</h2>
                  <div className="text-sm text-slate-500">{child.grade} · {child.activeTutors} active tutors</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge label={`🔥 ${child.streak}-day streak`} color="amber" />
                    <Badge label={`${child.completedLessons} lessons done`} color="teal" />
                  </div>
                </div>
                <div className="ml-auto">
                  <CircleProgress value={child.overallProgress} size={90} color="#1b3d7e" label="Overall" />
                </div>
              </div>
              <div className="space-y-3">
                {child.subjects.map(s => (
                  <ProgressBar key={s.name} label={s.name} value={s.progress} color={s.progress >= 80 ? '#0fb568' : s.progress >= 60 ? '#f07a22' : '#ef4444'} />
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <SectionHeader title="Recent Activity" />
              <div className="space-y-3">
                {child.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 py-2.5 border-b border-slate-50 last:border-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${a.attended ? 'bg-[#0fb568]' : 'bg-red-400'}`} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">{a.subject}</div>
                      <div className="text-xs text-slate-500">{a.tutor} · {a.duration} min</div>
                    </div>
                    <div className="text-xs text-slate-400">{a.date}</div>
                    <Badge label={a.attended ? 'Attended' : 'Missed'} color={a.attended ? 'teal' : 'red'} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Progress circles */}
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <h3 className="font-bold font-display text-slate-900 mb-5 text-sm">Subject Progress</h3>
              <div className="grid grid-cols-3 gap-4">
                {child.subjects.map(s => (
                  <CircleProgress key={s.name} value={s.progress} size={72} strokeWidth={7} color={s.progress >= 80 ? '#0fb568' : s.progress >= 60 ? '#f07a22' : '#ef4444'} label={s.name.split(' ')[0]} />
                ))}
              </div>
            </div>

            {/* Next lessons */}
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <SectionHeader title="Upcoming Lessons" />
              <div className="space-y-3">
                {child.subjects.slice(0, 2).map(s => (
                  <div key={s.name} className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.tutor}</div>
                    <div className="text-xs text-[#1b3d7e] font-medium mt-1">📅 Sep 27, 2026 · 10:00 AM</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Subjects */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          {child.subjects.map(s => (
            <div key={s.name} className="bg-white rounded-2xl p-5 card-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">{s.name}</h3>
                  <div className="text-sm text-slate-500">Tutor: {s.tutor}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-display" style={{ color: s.progress >= 80 ? '#0a7244' : s.progress >= 60 ? '#d45f10' : '#dc2626' }}>{s.progress}%</div>
                  <div className="text-xs text-slate-400">Progress</div>
                </div>
              </div>
              <ProgressBar value={s.progress} color={s.progress >= 80 ? '#0fb568' : s.progress >= 60 ? '#f07a22' : '#ef4444'} showPercent={false} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Completed</div>
                  <div className="font-bold font-display text-slate-900">{s.lessonsCompleted} lessons</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Remaining</div>
                  <div className="font-bold font-display text-slate-900">{s.lessonsPending} lessons</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-[#eef2fb] rounded-xl">
                <div className="text-xs font-semibold text-[#1b3d7e] mb-1">📝 Tutor Feedback</div>
                <p className="text-sm text-slate-700">{s.lastFeedback}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <div className="text-xs font-semibold text-[#0a7244] mb-1.5">Strengths</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.strengths.map(str => <Badge key={str} label={str} color="teal" />)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#d45f10] mb-1.5">Needs Work</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.improve.map(i => <Badge key={i} label={i} color="amber" />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold font-display text-slate-900">Lesson History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Subject</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Tutor</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Duration</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {child.recentActivity.map((a, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-slate-700">{a.date}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{a.subject}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{a.tutor}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{a.duration} min</td>
                    <td className="px-5 py-3.5">
                      <Badge label={a.attended ? 'Attended' : 'Missed'} color={a.attended ? 'teal' : 'red'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Tutors */}
      {activeTab === 'tutors' && (
        <div className="space-y-4">
          {child.subjects.map(s => {
            const tutor = tutors.find(t => t.name === s.tutor) || tutors[0];
            return (
              <div key={s.name} className="bg-white rounded-2xl p-5 card-shadow flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <img src={tutor.avatar} alt={tutor.name} className="w-14 h-14 rounded-full object-cover bg-slate-100" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold font-display text-slate-900">{tutor.name}</h3>
                      <div className="text-sm text-slate-500">{tutor.qualifications}</div>
                      <div className="text-xs text-[#1b3d7e] font-medium mt-1">Teaching: {s.name}</div>
                    </div>
                    <Badge label="★ " color="amber" />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                    <span>⭐ {tutor.rating} rating</span>
                    <span>📚 {s.lessonsCompleted} lessons with {child.name.split(' ')[0]}</span>
                    <span>📅 Next: Sep 27, 2026</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => onNavigate('student-messages')}>Message</Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {child.subjects.map(s => (
            <div key={s.name} className="bg-white rounded-2xl p-5 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold font-display text-slate-900">{s.name}</h3>
                  <div className="text-xs text-slate-400">{s.tutor} · Sep 24, 2026</div>
                </div>
                <Badge label={s.progress >= 80 ? 'Excellent' : s.progress >= 60 ? 'Good Progress' : 'Needs Attention'} color={s.progress >= 80 ? 'teal' : s.progress >= 60 ? 'navy' : 'amber'} />
              </div>
              <p className="text-sm text-slate-700 mb-4 bg-slate-50 rounded-xl p-3">{s.lastFeedback}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#edfdf5] rounded-xl p-3">
                  <div className="text-xs font-bold text-[#0a7244] mb-2">✅ Strengths</div>
                  <ul className="space-y-1">
                    {s.strengths.map(str => <li key={str} className="text-xs text-[#0a7244]">• {str}</li>)}
                  </ul>
                </div>
                <div className="bg-[#fff8ec] rounded-xl p-3">
                  <div className="text-xs font-bold text-[#d45f10] mb-2">💡 To Improve</div>
                  <ul className="space-y-1">
                    {s.improve.map(i => <li key={i} className="text-xs text-[#d45f10]">• {i}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function BookIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function CalIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function FireIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>; }
