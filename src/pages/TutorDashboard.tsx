import React, { useState } from 'react';
import { Button, StatCard, Avatar, Badge, SessionStatusBadge, SectionHeader, ProgressBar } from '../components/ui';
import { tutorBookings, tutors } from '../data/mockData';

const earningsData = [
  { month: 'Apr', amount: 3200 },
  { month: 'May', amount: 4100 },
  { month: 'Jun', amount: 3800 },
  { month: 'Jul', amount: 5200 },
  { month: 'Aug', amount: 4700 },
  { month: 'Sep', amount: 6400 },
];

const maxEarning = Math.max(...earningsData.map(d => d.amount));

export default function TutorDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'earnings' | 'profile'>('dashboard');
  const tutor = tutors[0];
  const pendingBookings = tutorBookings.filter(b => b.status === 'pending');

  return (
    <div className="fade-in p-5 lg:p-7 max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="text-sm text-slate-500 font-medium">Good morning 👋</div>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-0.5">Welcome back, Dr. Owusu</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge label="✓ Verified Tutor" color="teal" />
            <Badge label="⭐ Top Rated" color="amber" />
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setActiveTab('profile')}>Edit Profile</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {(['dashboard', 'bookings', 'earnings', 'profile'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-pill ${activeTab === tab ? 'active' : ''}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'bookings' && pendingBookings.length > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-[#f07a22] text-white text-[10px] flex items-center justify-center inline-flex">{pendingBookings.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Dashboard tab */}
      {activeTab === 'dashboard' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <StatCard label="This Month" value="GH₵6,400" icon={<WalletIcon />} color="#0a7244" trend={{ dir: 'up', val: '+36%' }} />
            <StatCard label="Total Students" value={tutor.totalStudents} icon={<UsersIcon />} color="#1b3d7e" trend={{ dir: 'up', val: '+8 this month' }} />
            <StatCard label="Lessons Taught" value={tutor.completedLessons} icon={<BookIcon />} color="#f07a22" />
            <StatCard label="Rating" value={`${tutor.rating}★`} icon={<StarIcon />} color="#9333ea" sub={`${tutor.reviews} reviews`} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Today's schedule */}
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <SectionHeader title="Today's Schedule" subtitle="Thursday, 25 September" />
                <div className="space-y-3">
                  {tutorBookings.filter(b => b.status === 'accepted').map(b => (
                    <div key={b.id} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Avatar src={b.student.avatar} name={b.student.name} size={42} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm">{b.student.name}</div>
                        <div className="text-xs text-slate-500">{b.subject} · {b.time} · {b.duration} min</div>
                      </div>
                      <SessionStatusBadge status={b.status} />
                      <Button size="sm" variant="secondary">Start Lesson</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending requests */}
              {pendingBookings.length > 0 && (
                <div className="bg-white rounded-2xl p-5 card-shadow">
                  <SectionHeader title="Booking Requests" subtitle={`${pendingBookings.length} pending`} />
                  <div className="space-y-3">
                    {pendingBookings.map(b => (
                      <div key={b.id} className="flex items-center gap-4 p-3.5 rounded-xl border-2 border-amber-100 bg-amber-50">
                        <Avatar src={b.student.avatar} name={b.student.name} size={42} />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 text-sm">{b.student.name}</div>
                          <div className="text-xs text-slate-500">{b.subject} · {b.date} · {b.time}</div>
                          <div className="text-xs text-[#d45f10] font-medium mt-0.5">GH₵{b.rate * b.duration / 60} earned</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Reject</Button>
                          <Button size="sm" variant="secondary">Accept</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Earnings chart */}
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <SectionHeader title="Earnings" subtitle="Last 6 months" />
                <div className="flex items-end gap-2 h-32">
                  {earningsData.map((d, i) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[10px] text-slate-400 font-medium">GH₵{(d.amount/1000).toFixed(1)}k</div>
                      <div className="w-full rounded-t-md transition-all" style={{ height: `${(d.amount / maxEarning) * 90}px`, background: i === earningsData.length - 1 ? '#1b3d7e' : '#e2e8f0' }} />
                      <div className="text-[10px] text-slate-500">{d.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Earnings summary */}
              <div className="rounded-2xl p-5 card-shadow text-white" style={{ background: 'linear-gradient(135deg, #0f2048, #1b3d7e)' }}>
                <div className="text-xs text-white/50 mb-1">Available Balance</div>
                <div className="text-3xl font-bold font-display text-white mb-1">GH₵4,820</div>
                <div className="text-xs text-white/60 mb-4">Last withdrawal: Sep 20, 2026</div>
                <Button size="sm" variant="secondary" fullWidth>Withdraw Funds</Button>
                <div className="grid grid-cols-2 gap-3 mt-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">GH₵1,580</div>
                    <div className="text-[10px] text-white/40">Pending</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">GH₵82,400</div>
                    <div className="text-[10px] text-white/40">All time</div>
                  </div>
                </div>
              </div>

              {/* Profile completion */}
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <h3 className="font-bold font-display text-slate-900 mb-1 text-sm">Profile Completion</h3>
                <p className="text-xs text-slate-500 mb-4">Complete your profile to attract more students</p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">Profile strength</span>
                    <span className="font-bold text-[#1b3d7e]">85%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill bg-[#1b3d7e]" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Photo uploaded', done: true },
                    { label: 'Bio added', done: true },
                    { label: 'Qualifications', done: true },
                    { label: 'Subjects set', done: true },
                    { label: 'Availability set', done: true },
                    { label: 'Intro video', done: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <span className={item.done ? 'text-[#0fb568]' : 'text-slate-300'}>{item.done ? '✓' : '○'}</span>
                      <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bookings tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {tutorBookings.map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-5 card-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar src={b.student.avatar} name={b.student.name} size={48} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900">{b.student.name}</div>
                <div className="text-sm text-slate-500">{b.subject} · {b.date} · {b.time} · {b.duration} min</div>
                <div className="text-sm font-semibold text-[#0a7244] mt-1">GH₵{b.rate * b.duration / 60} earned</div>
              </div>
              <div className="flex items-center gap-3">
                <SessionStatusBadge status={b.status} />
                {b.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Reject</Button>
                    <Button size="sm" variant="secondary">Accept</Button>
                  </div>
                )}
                {b.status === 'accepted' && <Button size="sm">Start Lesson</Button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Earnings tab */}
      {activeTab === 'earnings' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="This Month" value="GH₵6,400" icon={<WalletIcon />} color="#0a7244" />
              <StatCard label="Pending" value="GH₵1,580" icon={<WalletIcon />} color="#f07a22" />
              <StatCard label="Available" value="GH₵4,820" icon={<WalletIcon />} color="#1b3d7e" />
            </div>
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <SectionHeader title="Monthly Earnings" />
              <div className="flex items-end gap-3 h-40 mb-4">
                {earningsData.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs text-slate-500 font-medium">{(d.amount/1000).toFixed(1)}k</div>
                    <div className="w-full rounded-t-lg transition-all" style={{ height: `${(d.amount / maxEarning) * 120}px`, background: i === earningsData.length - 1 ? '#1b3d7e' : '#adc0e7' }} />
                    <div className="text-xs text-slate-400">{d.month}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl card-shadow overflow-hidden">
              <div className="p-5 border-b border-slate-100"><h3 className="font-bold font-display text-slate-900">Recent Transactions</h3></div>
              {tutorBookings.map(b => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${b.status === 'completed' ? 'bg-[#edfdf5] text-[#0a7244]' : 'bg-amber-50 text-amber-600'}`}>
                    {b.status === 'completed' ? '✓' : '⏳'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 text-sm">{b.student.name} · {b.subject}</div>
                    <div className="text-xs text-slate-400">{b.date} · {b.duration} min</div>
                  </div>
                  <div className={`font-bold text-sm ${b.status === 'completed' ? 'text-[#0a7244]' : 'text-amber-600'}`}>
                    +GH₵{b.rate * b.duration / 60}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl p-5 card-shadow mb-5">
              <h3 className="font-bold font-display text-slate-900 mb-4 text-sm">Withdraw Earnings</h3>
              <div className="bg-[#edfdf5] rounded-xl p-4 mb-4 text-center">
                <div className="text-xs text-[#0a7244] mb-1">Available Balance</div>
                <div className="text-2xl font-bold font-display text-[#0a7244]">GH₵4,820</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Withdraw to</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['MTN MoMo', 'Vodafone', 'AirtelTigo'].map((m, i) => (
                      <button key={m} className={`p-2 rounded-xl border-2 text-xs font-semibold ${i === 0 ? 'border-[#f07a22] text-[#d45f10] bg-amber-50' : 'border-slate-100 text-slate-500'}`}>{m}</button>
                    ))}
                  </div>
                </div>
                <input type="tel" placeholder="Mobile Money number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20" />
                <input type="number" placeholder="Amount (GH₵)" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20" />
                <Button fullWidth variant="secondary">Withdraw Funds</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <img src={tutor.avatar} alt={tutor.name} className="w-20 h-20 rounded-full object-cover bg-slate-100" />
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1b3d7e] text-white rounded-full flex items-center justify-center text-xs">✏️</button>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">{tutor.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge label="✓ Verified" color="teal" />
                    <span className="text-sm text-slate-500">GH₵{tutor.rate}/hr</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Bio', value: tutor.bio, type: 'textarea' },
                  { label: 'Subjects', value: tutor.subjects.join(', '), type: 'input' },
                  { label: 'Qualifications', value: tutor.qualifications, type: 'input' },
                  { label: 'Hourly Rate (GH₵)', value: String(tutor.rate), type: 'input' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea defaultValue={f.value} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 resize-none" />
                    ) : (
                      <input type="text" defaultValue={f.value} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20" />
                    )}
                  </div>
                ))}
                <Button>Save Changes</Button>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <SectionHeader title="Availability" subtitle="Set your weekly schedule" />
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} className="text-center">
                    <div className="text-xs font-medium text-slate-500 mb-2">{d}</div>
                    <button className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${tutor.availability.includes(d) ? 'bg-[#1b3d7e] text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {tutor.availability.includes(d) ? '✓' : '○'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <h3 className="font-bold font-display text-slate-900 mb-4 text-sm">Verification Status</h3>
              <div className="flex items-center gap-3 p-4 bg-[#edfdf5] rounded-xl mb-4">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="font-bold text-[#0a7244] text-sm">Verified Tutor</div>
                  <div className="text-xs text-[#0a7244]/70">All documents approved</div>
                </div>
              </div>
              <div className="space-y-2">
                {['ID Document', 'Academic Certificates', 'Background Check', 'Profile Review'].map(doc => (
                  <div key={doc} className="flex items-center justify-between text-sm py-1">
                    <span className="text-slate-700">{doc}</span>
                    <span className="text-[#0fb568] font-semibold text-xs">Approved</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WalletIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h2v-4z"/></svg>; }
function UsersIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function BookIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function StarIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
