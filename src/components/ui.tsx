import React from 'react';

// ── Button ──────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type BtnSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const btnBase = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
const btnVariants: Record<BtnVariant, string> = {
  primary: 'bg-[#1b3d7e] text-white hover:bg-[#152e61] focus-visible:ring-[#1b3d7e] active:scale-[0.98]',
  secondary: 'bg-[#f07a22] text-white hover:bg-[#d45f10] focus-visible:ring-[#f07a22] active:scale-[0.98]',
  ghost: 'bg-transparent text-[#1b3d7e] hover:bg-[#eef2fb] focus-visible:ring-[#1b3d7e]',
  danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus-visible:ring-[#ef4444] active:scale-[0.98]',
  outline: 'bg-transparent border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] focus-visible:ring-[#1b3d7e]',
};
const btnSizes: Record<BtnSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export function Button({ variant = 'primary', size = 'md', icon, iconRight, fullWidth, className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={`bg-white rounded-[14px] card-shadow ${onClick ? 'cursor-pointer tutor-card' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
type BadgeColor = 'navy' | 'amber' | 'teal' | 'red' | 'gray' | 'green' | 'purple';
const badgeColors: Record<BadgeColor, string> = {
  navy: 'bg-[#eef2fb] text-[#1b3d7e]',
  amber: 'bg-[#fff8ec] text-[#d45f10]',
  teal: 'bg-[#edfdf5] text-[#0a7244]',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-slate-100 text-slate-600',
  green: 'bg-emerald-50 text-emerald-700',
  purple: 'bg-purple-50 text-purple-700',
};

export function Badge({ label, color = 'gray', icon }: { label: string; color?: BadgeColor; icon?: React.ReactNode }) {
  return (
    <span className={`badge ${badgeColors[color]}`}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}

// ── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ src, name, size = 40, online }: { src?: string; name: string; size?: number; online?: boolean }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} alt={name} className="rounded-full object-cover w-full h-full bg-slate-100" />
      ) : (
        <div className="rounded-full w-full h-full bg-[#1b3d7e] flex items-center justify-center text-white font-bold" style={{ fontSize: size * 0.35 }}>
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 block rounded-full border-2 border-white ${online ? 'bg-[#0fb568]' : 'bg-slate-300'}`} style={{ width: size * 0.28, height: size * 0.28 }} />
      )}
    </div>
  );
}

// ── StarRating ──────────────────────────────────────────────────────────────
export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= Math.round(rating) ? '#f59e0b' : '#e2e8f0'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── ProgressBar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = '#1b3d7e', label, showPercent = true }: { value: number; color?: string; label?: string; showPercent?: boolean }) {
  return (
    <div>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showPercent && <span className="text-sm font-semibold" style={{ color }}>{value}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// ── CircleProgress ───────────────────────────────────────────────────────────
export function CircleProgress({ value, size = 80, strokeWidth = 8, color = '#1b3d7e', label }: { value: number; size?: number; strokeWidth?: number; color?: string; label?: string }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fontSize: size * 0.22, fontWeight: 700, fill: color }}>
          {value}%
        </text>
      </svg>
      {label && <span className="text-xs font-medium text-slate-500 text-center">{label}</span>}
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, color = '#1b3d7e', trend }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode; color?: string; trend?: { dir: 'up' | 'down'; val: string } }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ background: color + '18' }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trend.dir === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend.dir === 'up' ? '↑' : '↓'} {trend.val}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-display text-slate-900 mb-0.5">{value}</div>
      <div className="text-sm font-medium text-slate-500">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          className={`w-full border border-[#e2e8f0] rounded-xl py-2.5 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/30 focus:border-[#1b3d7e] transition-all ${icon ? 'pl-10 pr-4' : 'px-4'}`}
          {...props}
        />
      </div>
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, actionLabel }: { title: string; subtitle?: string; action?: () => void; actionLabel?: string }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-lg font-bold font-display text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <button onClick={action} className="text-sm font-semibold text-[#1b3d7e] hover:underline">{actionLabel || 'View all'}</button>}
    </div>
  );
}

// ── TutorCard ─────────────────────────────────────────────────────────────────
export function TutorCard({ tutor, onBook, compact }: { tutor: any; onBook?: () => void; compact?: boolean }) {
  return (
    <div className="tutor-card bg-white rounded-[14px]">
      {!compact && (
        <div className="h-24 bg-gradient-to-r from-[#1b3d7e] to-[#2f54a8] relative">
          {tutor.verified && (
            <span className="absolute top-3 right-3 badge bg-[#edfdf5] text-[#0a7244]">✓ Verified</span>
          )}
          <span className={`absolute top-3 left-3 badge ${tutor.available ? 'bg-[#edfdf5] text-[#0a7244]' : 'bg-slate-100 text-slate-500'}`}>
            {tutor.available ? '● Available' : '○ Busy'}
          </span>
        </div>
      )}
      <div className={`p-4 ${!compact ? '-mt-8' : ''}`}>
        <div className="flex items-start gap-3 mb-3">
          <Avatar src={tutor.avatar} name={tutor.name} size={compact ? 44 : 56} online={tutor.available} />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold font-display text-slate-900 text-sm leading-tight truncate">{tutor.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{tutor.qualifications}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={tutor.rating} size={12} />
              <span className="text-xs font-semibold text-slate-700">{tutor.rating}</span>
              <span className="text-xs text-slate-400">({tutor.reviews})</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tutor.subjects.slice(0, 2).map((s: string) => (
            <Badge key={s} label={s} color="navy" />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold font-display text-[#1b3d7e]">GH₵{tutor.rate}</span>
            <span className="text-xs text-slate-400">/hr</span>
          </div>
          {onBook && (
            <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); onBook(); }}>
              Book
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SessionStatusBadge ────────────────────────────────────────────────────────
export function SessionStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: BadgeColor }> = {
    upcoming: { label: 'Upcoming', color: 'navy' },
    completed: { label: 'Completed', color: 'teal' },
    cancelled: { label: 'Cancelled', color: 'red' },
    pending: { label: 'Pending', color: 'amber' },
    accepted: { label: 'Accepted', color: 'teal' },
    live: { label: '● Live', color: 'green' },
  };
  const { label, color } = map[status] || { label: status, color: 'gray' };
  return <Badge label={label} color={color} />;
}

// ── EmptyState ─────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action, actionLabel }: { icon: string; title: string; description: string; action?: () => void; actionLabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold font-display text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {action && <Button onClick={action} size="md">{actionLabel}</Button>}
    </div>
  );
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[14px] p-4 card-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton rounded-full w-12 h-12" />
        <div className="flex-1">
          <div className="skeleton h-4 w-2/3 mb-2" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="skeleton h-3 w-full mb-2" />
      <div className="skeleton h-3 w-4/5 mb-4" />
      <div className="skeleton h-8 w-24 rounded-xl" />
    </div>
  );
}

// ── PageHeader ─────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold font-display text-slate-900">{title}</h1>
      {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
