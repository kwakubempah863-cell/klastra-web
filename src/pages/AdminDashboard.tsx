import React, { useState } from 'react';
import { Button, StatCard, Badge, Avatar, SectionHeader } from '../components/ui';
import { tutors, adminMetrics } from '../data/mockData';

const barData = [
  { label: 'Mon', bookings: 48, revenue: 3840 },
  { label: 'Tue', bookings: 62, revenue: 4960 },
  { label: 'Wed', bookings: 55, revenue: 4400 },
  { label: 'Thu', bookings: 71, revenue: 5680 },
  { label: 'Fri', bookings: 89, revenue: 7120 },
  { label: 'Sat', bookings: 104, revenue: 8320 },
  { label: 'Sun', bookings: 76, revenue: 6080 },
];
const maxBar = Math.max(...barData.map(d => d.bookings));

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'verification' | 'bookings' | 'disputes'>('overview');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  return (
    <div className="fade-in p-5 lg:p-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">TutorKonnect Platform Management · Kumasi, Ghana</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge label="● 34 Live Sessions" color="teal" />
          <Button size="sm" variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit overflow-x-auto">
        {(['overview', 'users', 'verification', 'bookings', 'disputes'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-pill whitespace-nowrap ${activeTab === tab ? 'active' : ''}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'verification' && <span className="ml-1 badge bg-[#fff8ec] text-[#d45f10] text-[10px] py-0">{adminMetrics.pendingVerifications}</span>}
            {tab === 'disputes' && <span className="ml-1 badge bg-red-50 text-red-600 text-[10px] py-0">{adminMetrics.openDisputes}</span>}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Users" value={adminMetrics.totalUsers.toLocaleString()} icon={<UsersIcon />} color="#1b3d7e" trend={{ dir: 'up', val: '+124 today' }} />
            <StatCard label="Active Tutors" value={adminMetrics.tutors} icon={<StarIcon />} color="#0a7244" trend={{ dir: 'up', val: '+12 this week' }} />
            <StatCard label="Monthly Revenue" value={`GH₵${(adminMetrics.revenueThisMonth/1000).toFixed(0)}k`} icon={<WalletIcon />} color="#f07a22" trend={{ dir: 'up', val: '+18%' }} />
            <StatCard label="This Month Bookings" value={adminMetrics.bookingsThisMonth.toLocaleString()} icon={<CalIcon />} color="#9333ea" trend={{ dir: 'up', val: '+22%' }} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <StatCard label="Students" value={adminMetrics.students.toLocaleString()} icon={<BookIcon />} color="#1b3d7e" />
            <StatCard label="Parents" value={adminMetrics.parents.toLocaleString()} icon={<UsersIcon />} color="#0a7244" />
            <StatCard label="Pending Verifications" value={adminMetrics.pendingVerifications} icon={<ShieldIcon />} color="#f07a22" />
            <StatCard label="Open Disputes" value={adminMetrics.openDisputes} icon={<AlertIcon />} color="#ef4444" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Weekly bookings chart */}
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <SectionHeader title="Weekly Bookings" subtitle="This week" />
                <div className="flex items-end gap-2 h-36 mb-3">
                  {barData.map((d, i) => (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[10px] text-slate-400">{d.bookings}</div>
                      <div className="w-full rounded-t-md" style={{ height: `${(d.bookings / maxBar) * 110}px`, background: i === 4 ? '#f07a22' : '#adc0e7' }} />
                      <div className="text-[10px] text-slate-500">{d.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>Total this week: <strong className="text-slate-900">505 bookings</strong></span>
                  <span>Revenue: <strong className="text-[#0a7244]">GH₵40,400</strong></span>
                </div>
              </div>

              {/* User breakdown */}
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <SectionHeader title="User Distribution" />
                <div className="space-y-4">
                  {[
                    { label: 'Students', value: adminMetrics.students, total: adminMetrics.totalUsers, color: '#1b3d7e' },
                    { label: 'Parents', value: adminMetrics.parents, total: adminMetrics.totalUsers, color: '#f07a22' },
                    { label: 'Tutors', value: adminMetrics.tutors, total: adminMetrics.totalUsers, color: '#0fb568' },
                  ].map(u => (
                    <div key={u.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700">{u.label}</span>
                        <span className="font-semibold" style={{ color: u.color }}>{u.value.toLocaleString()} ({Math.round(u.value / u.total * 100)}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(u.value / u.total) * 100}%`, background: u.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-white rounded-2xl card-shadow overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold font-display text-slate-900">Recent Activity</h3>
                </div>
                {[
                  { type: 'verification', text: 'New tutor verification request from Kwabena Asare', time: '2 min ago', badge: { label: 'Pending', color: 'amber' as const } },
                  { type: 'booking', text: 'New booking: Ama Serwaa → Dr. Owusu (Mathematics)', time: '5 min ago', badge: { label: 'Booking', color: 'navy' as const } },
                  { type: 'payment', text: 'Payment GH₵80 received — Ref: TK-2026-XA7K2', time: '8 min ago', badge: { label: 'Payment', color: 'teal' as const } },
                  { type: 'dispute', text: 'Dispute filed: Yaw Amponsah vs. Kofi Mensah (Session quality)', time: '22 min ago', badge: { label: 'Dispute', color: 'red' as const } },
                  { type: 'verification', text: 'Tutor profile approved: Mrs. Efua Darko', time: '45 min ago', badge: { label: 'Approved', color: 'teal' as const } },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
                      {a.type === 'verification' ? '🛡️' : a.type === 'booking' ? '📅' : a.type === 'payment' ? '💳' : '⚠️'}
                    </div>
                    <p className="flex-1 text-sm text-slate-700">{a.text}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge label={a.badge.label} color={a.badge.color} />
                      <span className="text-xs text-slate-400 whitespace-nowrap">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* Top tutors */}
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <SectionHeader title="Top Tutors" subtitle="By bookings this month" />
                <div className="space-y-3">
                  {tutors.slice(0, 4).map((t, i) => (
                    <div key={t.id} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-400 w-5">#{i + 1}</span>
                      <Avatar src={t.avatar} name={t.name} size={36} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">{t.name}</div>
                        <div className="text-xs text-slate-500">{t.subjects[0]}</div>
                      </div>
                      <div className="text-xs font-bold text-[#0a7244]">GH₵{(t.rate * 40).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending actions */}
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <h3 className="font-bold font-display text-slate-900 mb-4 text-sm">Pending Actions</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                    <span className="text-sm text-amber-800">Verification requests</span>
                    <Badge label={String(adminMetrics.pendingVerifications)} color="amber" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                    <span className="text-sm text-red-800">Open disputes</span>
                    <Badge label={String(adminMetrics.openDisputes)} color="red" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#eef2fb] rounded-xl">
                    <span className="text-sm text-[#1b3d7e]">Review requests</span>
                    <Badge label="3" color="navy" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold font-display text-slate-900">All Users</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Search users..." className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 w-48" />
              <Button size="sm" variant="outline">Export</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Joined</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Kwame Asante', email: 'kwame@example.com', role: 'Student', status: 'Active', joined: 'Jan 2026', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=60&h=60&fit=crop' },
                  { name: 'Grace Quaye', email: 'grace@example.com', role: 'Parent', status: 'Active', joined: 'Feb 2026', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop' },
                  { name: 'Dr. Ama Owusu', email: 'ama@example.com', role: 'Tutor', status: 'Verified', joined: 'Nov 2025', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=60&h=60&fit=crop' },
                  { name: 'Mr. Kofi Mensah', email: 'kofi@example.com', role: 'Tutor', status: 'Verified', joined: 'Dec 2025', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop' },
                  { name: 'Adwoa Nyarko', email: 'adwoa@example.com', role: 'Student', status: 'Active', joined: 'Mar 2026', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop' },
                ].map((u, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.name} size={36} />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge label={u.role} color={u.role === 'Tutor' ? 'amber' : u.role === 'Parent' ? 'teal' : 'navy'} />
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge label={u.status} color={u.status === 'Verified' ? 'teal' : 'gray'} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{u.joined}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="ghost">Suspend</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verification tab */}
      {activeTab === 'verification' && (
        <div>
          <div className="flex gap-1 bg-white rounded-xl p-1 mb-5 w-fit border border-slate-100 card-shadow">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button key={f} onClick={() => setVerificationFilter(f)} className={`tab-pill text-xs ${verificationFilter === f ? 'active' : ''}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {tutors.map((t, i) => {
              const status = i === 0 ? 'pending' : i === 1 ? 'pending' : i === 2 ? 'approved' : 'approved';
              if (verificationFilter !== 'all' && verificationFilter !== status) return null;
              return (
                <div key={t.id} className="bg-white rounded-2xl p-5 card-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover bg-slate-100" />
                      <div>
                        <h3 className="font-bold font-display text-slate-900">{t.name}</h3>
                        <div className="text-sm text-slate-500">{t.qualifications}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{t.subjects.join(', ')}</div>
                      </div>
                    </div>
                    <Badge label={status === 'pending' ? 'Pending Review' : 'Approved'} color={status === 'pending' ? 'amber' : 'teal'} />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['National ID', 'Academic Certificate', 'Teaching Certificate'].map(doc => (
                      <div key={doc} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs">
                        <span>📄</span>
                        <span className="text-slate-700">{doc}</span>
                        <span className="text-[#0a7244]">✓</span>
                      </div>
                    ))}
                  </div>
                  {status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="danger">Reject</Button>
                      <Button size="sm" variant="outline">Request Changes</Button>
                      <Button size="sm" variant="secondary">Approve Tutor</Button>
                    </div>
                  )}
                  {status === 'approved' && (
                    <div className="flex items-center gap-2 text-sm text-[#0a7244]">
                      <span>✅</span>
                      <span>Approved and verified on Sep 15, 2026</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disputes tab */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {[
            { id: 'DS-001', student: 'Yaw Amponsah', tutor: 'Kofi Mensah', subject: 'Physics', issue: 'Session quality — tutor was unprepared and session ended 20 minutes early.', date: 'Sep 23, 2026', status: 'open', priority: 'high' },
            { id: 'DS-002', student: 'Akua Boateng', tutor: 'Abena Boateng', subject: 'English', issue: 'Payment charged but session did not happen due to tutor cancellation.', date: 'Sep 21, 2026', status: 'investigating', priority: 'medium' },
            { id: 'DS-003', student: 'Kweku Antwi', tutor: 'Yaw Boadu', subject: 'Economics', issue: 'Tutor rescheduled without notice. Requesting refund.', date: 'Sep 18, 2026', status: 'resolved', priority: 'low' },
          ].map(d => (
            <div key={d.id} className="bg-white rounded-2xl p-5 card-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">{d.id}</span>
                    <Badge label={d.priority === 'high' ? '⚠ High Priority' : d.priority === 'medium' ? 'Medium' : 'Low'} color={d.priority === 'high' ? 'red' : d.priority === 'medium' ? 'amber' : 'gray'} />
                    <Badge label={d.status === 'open' ? 'Open' : d.status === 'investigating' ? 'Investigating' : 'Resolved'} color={d.status === 'open' ? 'red' : d.status === 'investigating' ? 'amber' : 'teal'} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Student: <strong className="text-slate-900">{d.student}</strong></span>
                    <span>·</span>
                    <span>Tutor: <strong className="text-slate-900">{d.tutor}</strong></span>
                    <span>·</span>
                    <span>{d.subject}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{d.date}</span>
              </div>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 mb-3">{d.issue}</p>
              {d.status !== 'resolved' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="ghost">Contact Student</Button>
                  <Button size="sm" variant="ghost">Contact Tutor</Button>
                  <Button size="sm" variant="secondary">Issue Refund</Button>
                </div>
              )}
              {d.status === 'resolved' && (
                <div className="text-sm text-[#0a7244] flex items-center gap-2"><span>✅</span> Resolved — Refund issued Sep 19, 2026</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bookings tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold font-display text-slate-900">All Bookings</h3>
            <div className="text-sm text-slate-500">1,248 bookings this month</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Booking ID', 'Student', 'Tutor', 'Subject', 'Date', 'Amount', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'TK-2026-XA7K2', student: 'Ama Serwaa', tutor: 'Dr. Ama Owusu', subject: 'Mathematics', date: 'Sep 27', amount: 80, status: 'confirmed' },
                  { id: 'TK-2026-BM9F1', student: 'Kweku Frimpong', tutor: 'Mr. Kofi Mensah', subject: 'Physics', date: 'Sep 28', amount: 105, status: 'confirmed' },
                  { id: 'TK-2026-CQ3T8', student: 'Adwoa Nyarko', tutor: 'Ms. Abena Boateng', subject: 'English', date: 'Sep 29', amount: 60, status: 'pending' },
                  { id: 'TK-2026-DK5R4', student: 'Yaw Antwi', tutor: 'Mr. Yaw Boadu', subject: 'Economics', date: 'Sep 25', amount: 85, status: 'completed' },
                  { id: 'TK-2026-EL2W7', student: 'Akua Boateng', tutor: 'Mr. Kwame Asante', subject: 'ICT', date: 'Sep 24', amount: 75, status: 'completed' },
                ].map((b, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{b.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{b.student}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{b.tutor}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{b.subject}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{b.date}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#0a7244]">GH₵{b.amount}</td>
                    <td className="px-5 py-3.5">
                      <Badge label={b.status} color={b.status === 'completed' ? 'teal' : b.status === 'confirmed' ? 'navy' : 'amber'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function StarIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function WalletIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h2v-4z"/></svg>; }
function CalIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function BookIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function ShieldIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function AlertIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
