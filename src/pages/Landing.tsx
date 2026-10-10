import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '../components/ui';
import heroClassroom from '../imports/hero-classroom.png';

const trustMarkers = ['Free for pilot schools', 'Works on any Android phone', 'Set up in a day'];

const problems = [
  { icon: '📓', title: 'Attendance takes 10 minutes per class on paper.' },
  { icon: '📊', title: "Test scores live in a teacher's notebook — parents never see them." },
  { icon: '💬', title: 'Parent updates happen through WhatsApp. Nothing is recorded.' },
];

const solutions = [
  { icon: '✅', title: 'Mark attendance for a whole class in 30 seconds.' },
  { icon: '✅', title: 'Enter test scores once — parents see them instantly.' },
  { icon: '✅', title: 'Message parents through the app. Every note is saved.' },
];

const features = [
  { icon: '🧾', title: 'Attendance', description: 'Present, absent, or late — one tap per student.' },
  { icon: '📈', title: 'Scores', description: 'Enter a Maths test for the whole class in one screen. BECE grades compute automatically.' },
  { icon: '📝', title: 'Class remarks', description: 'Post one remark for the class. Every parent sees it.' },
  { icon: '💬', title: 'Individual notes', description: 'Private notes to a specific parent about their child.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Parent linking', description: 'Parents link via student ID. Teachers approve. Nobody sees data they should not.' },
  { icon: '📲', title: 'Messaging', description: 'Direct messages between teachers and parents. No phone numbers shared.' },
];

const steps = [
  'School admin adds teachers and students',
  'Teachers take attendance and enter scores',
  'Parents link to their children with a student ID',
  'Everyone sees the same real-time picture',
];

const testimonials = [
  { quote: 'We used to chase marks in notebooks. Now the class teacher updates everything from one phone and parents can see it the same day.', author: 'Pilot school, Kumasi' },
  { quote: 'Attendance used to eat into lesson time. Now we finish before break and still know exactly who is present.', author: 'Pilot school, Kumasi' },
  { quote: 'Parents feel more informed. We now have one clear account of what is happening in class.', author: 'Pilot school, Kumasi' },
];

const pricingTiers = [
  {
    name: 'Free',
    price: 'GH₵0',
    description: 'Up to 20 students. Perfect for a pilot.',
    cta: 'Start free',
    featured: false,
    perks: ['Up to 20 students', 'Daily attendance', 'Score entry', 'Parent updates'],
  },
  {
    name: 'Basic',
    price: 'GH₵5',
    description: 'GH₵5 / student / month. For schools up to 200 students.',
    cta: 'Talk to us',
    featured: true,
    perks: ['Everything in Free', 'Unlimited classes', 'Parent messaging', 'Progress reports'],
  },
  {
    name: 'School',
    price: 'Custom',
    description: 'Custom. Multi-campus, custom reports, priority support.',
    cta: 'Talk to us',
    featured: false,
    perks: ['Multi-campus support', 'Custom dashboards', 'Priority onboarding', 'Dedicated support'],
  },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <div className="relative mx-auto h-[590px] w-[300px] rounded-[34px] border-[10px] border-slate-900 bg-slate-950 p-3 shadow-[0_30px_80px_rgba(15,32,72,0.35)]">
        <div className="h-full rounded-[24px] bg-slate-100 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Today</div>
              <div className="text-lg font-bold text-slate-900">Class 4A</div>
            </div>
            <div className="rounded-full bg-[#22A06B] px-2 py-1 text-[10px] font-semibold text-white">Live</div>
          </div>
          <div className="mb-4 rounded-2xl bg-[#102A43] p-3 text-white">
            <div className="text-[10px] uppercase tracking-[0.18em] text-sky-100">Attendance</div>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-bold">28</span>
              <span className="text-xs text-sky-100">/ 30 students</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              ['Ama', 'Present'],
              ['Kofi', 'Late'],
              ['Efua', 'Absent'],
            ].map(([name, status], index) => (
              <div key={name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#102A43]">
                    {name.slice(0, 1)}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{name}</span>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${index === 0 ? 'bg-[#ECFDF5] text-[#22A06B]' : index === 1 ? 'bg-[#EFF6FF] text-[#1E40AF]' : 'bg-[#fef2f2] text-[#b91c1c]'}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Scores</span>
              <span className="text-xs font-bold text-[#22A06B]">87%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div className="h-2 w-[87%] rounded-full bg-[#22A06B]" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -left-4 bottom-10 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-200">
        <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Parent updates</div>
        <div className="mt-1 text-sm font-bold text-slate-900">4 new notes</div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img src={heroClassroom} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(15,23,42,0.55) 0%, rgba(16,42,67,0.45) 55%, rgba(37,99,235,0.35) 100%)',
            }}
          />
        </div>
        <div className="hero-orb" style={{ top: '20%', left: '30%' }} aria-hidden="true" />
        <div className="hero-orb" style={{ top: '50%', right: '10%', animationDelay: '-7s' }} aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <Badge label="🇬🇭 Built for Ghanaian private schools" color="amber" />
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight text-white md:text-5xl">
              Run your school from one app.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-sky-100/90">
              Attendance, scores, and parent updates — without paper record books, WhatsApp groups, or spreadsheets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" onClick={() => navigate('/contact')}>Request a demo</Button>
              <Button variant="ghost" size="lg" className="border border-white/25 text-white hover:bg-white/10" onClick={() => navigate('/features')}>See features</Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-sky-100/90">
              {trustMarkers.map((marker) => (
                <span key={marker} className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#22A06B]" />
                  {marker}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl lg:max-w-none">
            <div className="glass-medium rounded-3xl p-6">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
            Running a school shouldn&apos;t require three notebooks and four WhatsApp groups.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {problems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-3xl">{item.icon}</div>
              <p className="text-lg font-bold text-slate-900">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-100/70 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Klastra replaces all three.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {solutions.map((item) => (
              <div key={item.title} className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="mb-4 text-3xl">{item.icon}</div>
                <p className="text-lg font-bold text-slate-900">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Everything your school needs in one place</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0F172A] py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black md:text-4xl">How it works</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">0{index + 1}</div>
                <p className="text-base font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">What schools are saying</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div key={`${item.author}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-base leading-relaxed text-slate-700">“{item.quote}”</p>
              <div className="mt-6 text-sm font-semibold text-[#102A43]">{item.author}</div>
              <div className="mt-1 text-xs text-slate-400">// TODO: replace with real testimonials once pilot school feedback arrives</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mesh-bg mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Simple pricing for growing schools</h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`glass-medium glass-hover-lift rounded-3xl border p-6 ${tier.featured ? 'ring-1 ring-[#2563EB]/40' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">{tier.name}</h3>
                {tier.featured && <Badge label="Popular" color="amber" />}
              </div>
              <div className="mt-4 text-4xl font-black text-slate-900">{tier.price}</div>
              <p className="mt-2 text-sm text-slate-600">{tier.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ECFDF5] text-[#22A06B]">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant={tier.featured ? 'primary' : 'outline'} fullWidth onClick={() => navigate('/contact')}>{tier.cta}</Button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">All plans free during the pilot period.</p>
      </section>

      <section className="bg-[#0F172A] py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-black md:text-4xl">Ready to see it in action?</h2>
          <p className="mt-4 text-sky-100/80">Request a demo. We&apos;ll visit your school and set up the first class in person.</p>
          <div className="mt-8">
            <Button variant="primary" size="lg" onClick={() => navigate('/contact')}>Request a demo</Button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#2563EB] px-2 py-1 text-sm font-black text-white">K</div>
              <div className="font-display text-xl font-black text-white">Klastra</div>
            </div>
            <p className="mt-4 max-w-xs text-sm text-slate-400">School management for Ghanaian private basic schools.</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">Product</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button type="button" onClick={() => navigate('/features')} className="hover:text-white">Features</button></li>
              <li><button type="button" onClick={() => navigate('/pricing')} className="hover:text-white">Pricing</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button type="button" onClick={() => navigate('/about')} className="hover:text-white">About</button></li>
              <li><button type="button" onClick={() => navigate('/contact')} className="hover:text-white">Contact</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button type="button" onClick={() => navigate('/terms')} className="hover:text-white">Terms</button></li>
              <li><button type="button" onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
          © 2026 Klastra · Kumasi, Ghana
        </div>
      </footer>
    </div>
  );
}
