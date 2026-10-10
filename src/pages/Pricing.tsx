import { Button } from '../components/ui';

const pricingTiers = [
  {
    name: 'Free',
    price: 'GH₵0',
    description: 'Up to 20 students. Perfect for a pilot.',
    features: ['Up to 20 students', 'Daily attendance taking', 'Score entry', 'Parent updates'],
    cta: 'Start free',
  },
  {
    name: 'Basic',
    price: 'GH₵5 / student / month',
    description: 'For schools up to 200 students.',
    features: ['Everything in Free', 'Unlimited class records', 'Parent messaging', 'Progress summaries'],
    cta: 'Talk to us',
    featured: true,
  },
  {
    name: 'School',
    price: 'Custom',
    description: 'Multi-campus, custom reports, priority support.',
    features: ['Multi-campus rollup', 'Custom dashboards', 'Priority onboarding', 'Dedicated support'],
    cta: 'Talk to us',
  },
];

const featureRows = [
  'Attendance tracking',
  'Score entry',
  'Class remarks',
  'Individual notes',
  'Parent linking',
  'Messaging',
];

export default function Pricing() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#102A43]">Pricing</div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">Choose the right plan for your school</h1>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <div key={tier.name} className={`rounded-3xl border p-6 shadow-sm ${tier.featured ? 'border-[#102A43] bg-[#EFF6FF] ring-1 ring-[#102A43]/10' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">{tier.name}</h2>
              {tier.featured && <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-xs font-semibold text-[#1E40AF]">Popular</span>}
            </div>
            <div className="mt-4 text-3xl font-black text-slate-900">{tier.price}</div>
            <p className="mt-2 text-sm text-slate-600">{tier.description}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ECFDF5] text-[#22A06B]">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button variant={tier.featured ? 'primary' : 'outline'} fullWidth>{tier.cta}</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th className="px-5 py-4 font-bold">Features</th>
                <th className="px-5 py-4 font-bold">Free</th>
                <th className="px-5 py-4 font-bold">Basic</th>
                <th className="px-5 py-4 font-bold">School</th>
              </tr>
            </thead>
            <tbody>
              {featureRows.map((feature) => (
                <tr key={feature} className="border-t border-slate-200">
                  <td className="px-5 py-4 font-medium text-slate-900">{feature}</td>
                  <td className="px-5 py-4">{feature === 'Attendance tracking' || feature === 'Score entry' ? '✓' : '—'}</td>
                  <td className="px-5 py-4">✓</td>
                  <td className="px-5 py-4">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">All plans free during the pilot period.</p>
    </main>
  );
}
