import { SectionHeader } from '../components/ui';

const monthlyData = [
  { month: 'Apr', users: 6800, bookings: 980, revenue: 78400 },
  { month: 'May', users: 7100, bookings: 1040, revenue: 83200 },
  { month: 'Jun', users: 7400, bookings: 1100, revenue: 88000 },
  { month: 'Jul', users: 7700, bookings: 1150, revenue: 92000 },
  { month: 'Aug', users: 8100, bookings: 1190, revenue: 95200 },
  { month: 'Sep', users: 8472, bookings: 1248, revenue: 94820 },
];

export default function Analytics() {
  const maxRevenue = Math.max(...monthlyData.map(data => data.revenue));
  return (
    <div className="fade-in p-5 lg:p-7 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold font-display text-slate-900 mb-7">Platform Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Revenue (Sep)', value: 'GH₵94,820', color: '#0a7244' },
          { label: 'Total Bookings (Sep)', value: '1,248', color: '#1b3d7e' },
          { label: 'New Users (Sep)', value: '+372', color: '#2563EB' },
          { label: 'Platform Uptime', value: '99.8%', color: '#0a7244' },
        ].map(metric => (
          <div key={metric.label} className="bg-white rounded-2xl p-5 card-shadow">
            <div className="text-2xl font-bold font-display mb-1" style={{ color: metric.color }}>{metric.value}</div>
            <div className="text-sm text-slate-500">{metric.label}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <SectionHeader title="Monthly Revenue" subtitle="Last 6 months" />
          <div className="flex items-end gap-3 h-40 mb-3">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] text-slate-400">{(data.revenue / 1000).toFixed(0)}k</div>
                <div className="w-full rounded-t-lg" style={{ height: `${(data.revenue / maxRevenue) * 120}px`, background: index === monthlyData.length - 1 ? '#0a7244' : '#9af3c2' }} />
                <div className="text-[10px] text-slate-500">{data.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <SectionHeader title="Monthly Bookings" />
          <div className="flex items-end gap-3 h-40 mb-3">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] text-slate-400">{data.bookings}</div>
                <div className="w-full rounded-t-lg" style={{ height: `${(data.bookings / 1248) * 120}px`, background: index === monthlyData.length - 1 ? '#1b3d7e' : '#adc0e7' }} />
                <div className="text-[10px] text-slate-500">{data.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}