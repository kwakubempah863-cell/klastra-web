import React from 'react';
import { Button, Badge, StatCard, TutorCard, StarRating } from '../components/ui';
import { tutors, subjects } from '../data/mockData';

export default function Landing({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2048 0%, #1b3d7e 60%, #2f54a8 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #f07a22 0%, transparent 60%), radial-gradient(circle at 80% 20%, #0fb568 0%, transparent 60%)' }} />
        <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge label="🇬🇭 Now serving Kumasi, Ghana" color="amber" />
            <h1 className="font-display font-bold text-white mt-4 leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Find Expert Tutors<br />
              <span className="text-[#f07a22]">For Every Subject</span>
            </h1>
            <p className="text-white/70 mt-4 text-base leading-relaxed max-w-md">
              Connect with verified, qualified tutors for live online lessons. From WASSCE preparation to university-level support — TutorKonnect has you covered.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button size="lg" variant="secondary" onClick={() => onNavigate('discover')}>
                Find a Tutor
              </Button>
              <Button size="lg" variant="ghost" className="text-white border border-white/30 hover:bg-white/10">
                How it Works
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div>
                <div className="text-2xl font-bold font-display text-white">740+</div>
                <div className="text-xs text-white/50">Verified Tutors</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <div className="text-2xl font-bold font-display text-white">8,400+</div>
                <div className="text-xs text-white/50">Active Students</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <div className="text-2xl font-bold font-display text-white">4.8★</div>
                <div className="text-xs text-white/50">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10" style={{ height: 380 }}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&auto=format"
                alt="Students learning online"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,32,72,0.4), transparent)' }} />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 card-shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#edfdf5] flex items-center justify-center text-[#0a7244] font-bold">✓</div>
              <div>
                <div className="text-sm font-bold text-slate-900">Lesson Booked!</div>
                <div className="text-xs text-slate-500">Mathematics · Saturday 10AM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl card-shadow-md p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search subjects, tutors, or topics..."
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 focus:border-[#1b3d7e]"
            />
          </div>
          <select className="px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 bg-white">
            <option>All Subjects</option>
            {subjects.map(s => <option key={s.id}>{s.name}</option>)}
          </select>
          <Button size="md" onClick={() => onNavigate('discover')}>Search Tutors</Button>
        </div>
      </section>

      {/* Subjects */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-display text-slate-900">Browse by Subject</h2>
          <p className="text-slate-500 mt-2">Expert tutors available across all major WASSCE and university subjects</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {subjects.map(subject => (
            <button
              key={subject.id}
              onClick={() => onNavigate('discover')}
              className="bg-white rounded-[14px] p-4 card-shadow text-left hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className="text-2xl mb-2">{subject.icon}</div>
              <div className="font-semibold font-display text-slate-900 text-sm">{subject.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{subject.tutors} tutors</div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900">Top-Rated Tutors</h2>
            <p className="text-slate-500 mt-1">Highly reviewed and verified by TutorKonnect</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('discover')}>View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutors.slice(0, 3).map(tutor => (
            <TutorCard key={tutor.id} tutor={tutor} onBook={() => onNavigate('booking')} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold font-display text-slate-900">How TutorKonnect Works</h2>
            <p className="text-slate-500 mt-2">From first search to live lesson in minutes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Find Your Tutor', desc: 'Search by subject, price, rating, and availability', icon: '🔍' },
              { step: '02', title: 'Book a Session', desc: 'Pick a date and time that works for you', icon: '📅' },
              { step: '03', title: 'Pay via MoMo', desc: 'Secure Mobile Money payment — quick and easy', icon: '📱' },
              { step: '04', title: 'Learn Online', desc: 'Join your live lesson via Google Meet', icon: '🎓' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: '#eef2fb' }}>
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-[#f07a22] mb-1">{item.step}</div>
                <h3 className="font-bold font-display text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-display text-slate-900">What Students Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Ama Serwaa', grade: 'WASSCE 2026', text: 'Dr. Owusu helped me go from a C6 to B3 in Mathematics in just two months. TutorKonnect is incredible!', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop' },
            { name: 'Kweku Frimpong', grade: 'University Level', text: 'Mr. Mensah explains Physics concepts better than anyone I\'ve had. The Google Meet sessions are super convenient.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop' },
            { name: 'Adwoa Nyarko', grade: 'JHS 3', text: 'I was struggling with English essays, but Ms. Boateng has been so patient and helpful. Highly recommend!', rating: 4, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop' },
          ].map(r => (
            <div key={r.name} className="bg-white rounded-[14px] p-5 card-shadow">
              <StarRating rating={r.rating} size={16} />
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-3 mt-4">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.grade}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-2xl p-10 text-center" style={{ background: 'linear-gradient(135deg, #0f2048 0%, #1b3d7e 100%)' }}>
          <h2 className="text-2xl font-bold font-display text-white mb-3">Ready to Start Learning?</h2>
          <p className="text-white/70 mb-8">Join thousands of students already learning with TutorKonnect</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" variant="secondary" onClick={() => onNavigate('register')}>Get Started Free</Button>
            <Button size="lg" className="border border-white/30 text-white hover:bg-white/10 bg-transparent">Browse Tutors</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/src/imports/Logo-1.jpeg" alt="TutorKonnect" className="w-7 h-7 rounded-lg" />
            <span className="font-display font-bold text-[#1b3d7e] text-sm">Tutor<span className="text-[#f07a22]">Konnect</span></span>
          </div>
          <div className="text-xs text-slate-400">© 2026 TutorKonnect · Kumasi, Ghana · All rights reserved</div>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-[#1b3d7e]">Privacy</a>
            <a href="#" className="hover:text-[#1b3d7e]">Terms</a>
            <a href="#" className="hover:text-[#1b3d7e]">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
