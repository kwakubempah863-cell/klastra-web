import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from './ui';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';

type Role = 'public' | 'student' | 'parent' | 'tutor' | 'admin';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navByRole: Record<Role, NavItem[]> = {
  public: [
    { id: 'landing', label: 'Home', icon: <HomeIcon /> },
    { id: 'discover', label: 'Find Tutors', icon: <SearchIcon /> },
    { id: 'subjects', label: 'Subjects', icon: <BookIcon /> },
    { id: 'login', label: 'Sign In', icon: <UserIcon /> },
  ],
  student: [
    { id: 'student-dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'discover', label: 'Find Tutors', icon: <SearchIcon /> },
    { id: 'student-sessions', label: 'Bookings', icon: <CalendarIcon /> },
    { id: 'student-messages', label: 'Messages', icon: <MessageIcon /> },
    { id: 'student-profile', label: 'Profile', icon: <UserIcon /> },
  ],
  parent: [
    { id: 'parent-dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'parent-children', label: 'Children', icon: <UsersIcon /> },
    { id: 'parent-tutors', label: 'Tutors', icon: <StarIcon /> },
    { id: 'parent-lessons', label: 'Lessons', icon: <CalendarIcon /> },
    { id: 'parent-payments', label: 'Payments', icon: <WalletIcon /> },
    { id: 'parent-messages', label: 'Messages', icon: <MessageIcon /> },
    { id: 'parent-profile', label: 'Profile', icon: <UserIcon /> },
  ],
  tutor: [
    { id: 'tutor-dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'tutor-bookings', label: 'Bookings', icon: <CalendarIcon /> },
    { id: 'tutor-students', label: 'Students', icon: <UsersIcon /> },
    { id: 'tutor-earnings', label: 'Earnings', icon: <WalletIcon /> },
    { id: 'tutor-messages', label: 'Messages', icon: <MessageIcon /> },
    { id: 'tutor-profile', label: 'Profile', icon: <UserIcon /> },
  ],
  admin: [
    { id: 'admin-dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'admin-users', label: 'Users', icon: <UsersIcon /> },
    { id: 'admin-tutors', label: 'Tutors', icon: <StarIcon /> },
    { id: 'admin-verification', label: 'Verification', icon: <ShieldIcon /> },
    { id: 'admin-bookings', label: 'Bookings', icon: <CalendarIcon /> },
    { id: 'admin-payments', label: 'Payments', icon: <WalletIcon /> },
    { id: 'admin-disputes', label: 'Disputes', icon: <AlertIcon /> },
    { id: 'admin-analytics', label: 'Analytics', icon: <ChartIcon /> },
  ],
};

const roleProfiles: Record<Role, { name: string; sub: string; avatar?: string }> = {
  public: { name: 'Guest', sub: 'Not signed in' },
  student: { name: 'Kwame Asante', sub: 'Student · JHS 3', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop' },
  parent: { name: 'Grace Quaye', sub: 'Parent · 2 children', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop' },
  tutor: { name: 'Dr. Ama Owusu', sub: 'Tutor · Mathematics', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop' },
  admin: { name: 'Admin Yeboah', sub: 'Administrator', avatar: '' },
};

interface LayoutProps {
  children: React.ReactNode;
}

function getPath(id: string) {
  if (id === 'admin-analytics') return '/admin/analytics';
  if (id === 'admin-dashboard') return '/admin';
  if (id.startsWith('admin-')) return `/admin?nav=${id}`;
  if (id === 'discover') return '/tutors';
  if (id === 'subjects') return '/subjects';
  if (id === 'login') return '/login';
  return '/';
}

function isActive(id: string, pathname: string, search: string) {
  if (id === 'admin-analytics') return pathname === '/admin/analytics';
  if (id === 'admin-dashboard') return pathname === '/admin' && !new URLSearchParams(search).has('nav');
  if (id.startsWith('admin-')) return pathname === '/admin' && new URLSearchParams(search).get('nav') === id;
  return pathname === getPath(id);
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [tutorBannerDismissed, setTutorBannerDismissed] = useState(() => sessionStorage.getItem('tutor-onboarding-banner-dismissed') === 'true');
  const [scrolled, setScrolled] = useState(false);
  const { profile: authProfile, loading: authLoading, signOut } = useAuth();
  const location = useLocation();
  const isPublic = !location.pathname.startsWith('/admin');
  const role: Role = isPublic ? 'public' : 'admin';
  const navItems = navByRole[role];
  const profile = roleProfiles[role];
  const authRole: string | undefined = authProfile?.role;
  const showTutorBanner = authRole === 'tutor'
    && authProfile?.verification_status !== 'approved'
    && !tutorBannerDismissed;
  const accountDashboard = authRole === 'admin'
    ? { label: 'School dashboard', path: '/school-admin' }
    : authRole === 'platform_admin'
      ? { label: 'Super Admin', path: '/super-admin' }
      : null;

  const handleSignOut = async () => {
    setAccountError(null);
    try {
      await signOut();
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : 'Unable to sign out.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFC' }}>
      {/* Sidebar (desktop) */}
      {!isPublic && (
        <aside className="hidden md:flex flex-col w-60 flex-shrink-0 h-screen" style={{ background: '#0F172A' }}>
          {/* Logo */}
          <div className="px-5 py-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <img src={logoMark} alt="Klastra" className="w-9 h-9 rounded-lg object-cover" />
              <div>
                <div className="font-display font-bold text-white text-sm leading-tight">Klastra</div>
                <div className="text-[10px] text-white/40 capitalize">{role} Portal</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={getPath(item.id)}
                className={`sidebar-nav-item w-full text-left ${isActive(item.id, location.pathname, location.search) ? 'active' : ''}`}
              >
                <span className="nav-icon w-5 flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Profile */}
          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/05 cursor-pointer">
              <Avatar src={profile.avatar} name={profile.name} size={36} online />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{profile.name}</div>
                <div className="text-xs text-white/40 truncate">{profile.sub}</div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className={`h-14 flex-shrink-0 border-b border-slate-100 flex items-center px-4 gap-3 z-10 ${scrolled ? 'header-glass' : 'bg-white'}`}>
          {isPublic && (
            <div className="flex items-center gap-2 mr-4">
              <img src={logoMark} alt="Klastra" className="w-7 h-7 rounded-lg object-cover" />
              <span className="font-display font-bold text-[#102A43] text-sm">Klastra</span>
            </div>
          )}
          {!isPublic && (
            <button
              type="button"
              aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={sidebarOpen}
              aria-controls="mobile-navigation"
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MenuIcon />
            </button>
          )}

          <div className="flex-1" />

          {!authLoading && (authProfile ? (
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <span className="hidden max-w-52 truncate text-sm text-slate-600 md:inline">{authProfile.email}</span>
              {accountDashboard && (
                <Link
                  to={accountDashboard.path}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#102A43] hover:bg-[#EFF6FF]"
                >
                  {accountDashboard.label}
                </Link>
              )}
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Sign out
              </button>
              {accountError && <p role="alert" className="basis-full text-right text-xs text-red-600">{accountError}</p>}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/contact" className="px-3 py-2 text-sm font-semibold text-[#102A43] hover:bg-[#EFF6FF] rounded-lg min-h-11">Request demo</Link>
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-white bg-[#102A43] hover:bg-[#0F172A] rounded-lg min-h-11">Sign in</Link>
            </div>
          ))}
        </header>

        {showTutorBanner && (
          <div className="flex items-center justify-between gap-3 bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-900">
            <span>Your tutor account is pending verification. <Link to="/tutor/onboarding" className="font-semibold underline underline-offset-2">Complete profile →</Link></span>
            <button type="button" aria-label="Dismiss verification reminder" onClick={() => { sessionStorage.setItem('tutor-onboarding-banner-dismissed', 'true'); setTutorBannerDismissed(true); }} className="text-amber-700 hover:text-amber-950">×</button>
          </div>
        )}

        {/* Page content */}
        <main onScroll={event => setScrolled(event.currentTarget.scrollTop > 40)} className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        {!isPublic && (
          <nav className="md:hidden flex-shrink-0 bg-white border-t border-slate-100 flex items-center justify-around px-2 py-2 z-10">
            {navItems.slice(0, 5).map(item => (
              <Link
                key={item.id}
                to={getPath(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${isActive(item.id, location.pathname, location.search) ? 'text-[#102A43]' : 'text-slate-400'}`}
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && !isPublic && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 h-full w-full cursor-default border-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside id="mobile-navigation" className="absolute left-0 top-0 bottom-0 w-64 flex flex-col" style={{ background: '#0F172A' }}>
            <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={logoMark} alt="Klastra" className="w-9 h-9 rounded-lg object-cover" />
                <span className="font-display font-bold text-white text-sm">Klastra</span>
              </div>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="min-h-11 min-w-11 text-white/60"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  to={getPath(item.id)}
                  className={`sidebar-nav-item w-full text-left ${isActive(item.id, location.pathname, location.search) ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon w-5">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function HomeIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>; }
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function BookIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function UserIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MessageIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function UsersIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function StarIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function WalletIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h2v-4z"/></svg>; }
function ShieldIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function AlertIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
function ChartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function MenuIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
