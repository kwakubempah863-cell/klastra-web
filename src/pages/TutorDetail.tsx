import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Badge, StarRating } from '../components/ui';
import { tutors } from '../data/mockData';

const tutorReviews = [
  { name: 'Ama Serwaa', level: 'WASSCE student', rating: 5, date: 'September 2026', text: 'Her explanations made difficult topics feel clear. My confidence in mathematics has improved so much.' },
  { name: 'Kweku Frimpong', level: 'University student', rating: 5, date: 'August 2026', text: 'Patient, well prepared, and excellent at breaking down complex problems step by step.' },
  { name: 'Grace Quaye', level: 'Parent', rating: 5, date: 'July 2026', text: 'We have seen a real improvement in our daughter’s results. Highly recommended.' },
  { name: 'Adwoa Nyarko', level: 'SHS student', rating: 4, date: 'June 2026', text: 'The lessons are engaging and focused on exactly what I need to practice.' },
];

export default function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const tutor = tutors.find(item => String(item.id) === id);

  if (!tutor) {
    return (
      <div className="fade-in min-h-full flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-6xl font-bold font-display text-[#1b3d7e]">Tutor not found</div>
          <p className="text-slate-500 mt-3">This tutor profile may have been removed or the link may be incorrect.</p>
          <Link to="/tutors" className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-xl bg-[#1b3d7e] text-white text-sm font-semibold hover:bg-[#152e61] transition-colors">Browse tutors</Link>
        </div>
      </div>
    );
  }

  const reviews = showAllReviews ? tutorReviews : tutorReviews.slice(0, 3);

  return (
    <div className="min-h-full pb-24">
      <div className="fade-in">
      <section className="relative h-56 sm:h-64 bg-gradient-to-r from-[#0f2048] via-[#1b3d7e] to-[#2f54a8]">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="absolute top-5 left-5 z-10 w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center text-2xl">←</button>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0f2048]/30 to-transparent" />
      </section>

      <div className="max-w-5xl mx-auto px-5 sm:px-7">
        <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="rounded-full ring-4 ring-white shadow-lg"><Avatar src={tutor.avatar} name={tutor.name} size={128} /></div>
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">{tutor.name}</h1>
              {tutor.verified && <Badge label="Verified tutor" color="teal" />}
            </div>
            <p className="text-sm text-slate-600">{tutor.qualifications}</p>
            <p className="text-sm text-slate-500 mt-1">📍 {tutor.location}</p>
          </div>
          <div className="sm:text-right pb-1">
            <div className="flex items-center gap-2 sm:justify-end">
              <StarRating rating={tutor.rating} size={16} />
              <span className="font-bold text-slate-900">{tutor.rating}</span>
            </div>
            <div className="text-sm text-slate-500 mt-1">{tutor.reviews} reviews</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-7 mt-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-slate-500 mb-3">Subjects</h2>
              <div className="flex flex-wrap gap-2">{tutor.subjects.map(subject => <Badge key={subject} label={subject} color="navy" />)}</div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 card-shadow"><div className="text-xl font-bold font-display text-slate-900">{tutor.totalStudents}</div><div className="text-sm text-slate-500 mt-1">Students Taught</div></div>
              <div className="bg-white rounded-xl p-4 card-shadow"><div className="text-xl font-bold font-display text-slate-900">{tutor.completedLessons.toLocaleString()}</div><div className="text-sm text-slate-500 mt-1">Lessons Completed</div></div>
            </section>

            <section className="bg-white rounded-xl p-5 card-shadow">
              <h2 className="font-bold font-display text-slate-900 mb-2">About {tutor.name.split(' ').slice(-1)[0]}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{tutor.bio}</p>
            </section>

            <section className="bg-white rounded-xl p-5 card-shadow">
              <h2 className="font-bold font-display text-slate-900 mb-2">Qualifications</h2>
              <p className="text-sm text-slate-600">{tutor.qualifications}</p>
              <p className="text-sm text-slate-500 mt-2">{tutor.experience} years of teaching experience</p>
            </section>

            <section className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-5 card-shadow">
                <h2 className="text-sm font-bold font-display text-slate-900 mb-2">Languages</h2>
                <p className="text-sm text-slate-600">{tutor.languages.join(', ')}</p>
              </div>
              <div className="bg-white rounded-xl p-5 card-shadow">
                <h2 className="text-sm font-bold font-display text-slate-900 mb-2">Response Time</h2>
                <p className="text-sm text-slate-600">Usually responds in {tutor.responseTime}</p>
              </div>
            </section>

            <section className="bg-white rounded-xl p-5 card-shadow">
              <h2 className="font-bold font-display text-slate-900 mb-3">Availability</h2>
              <div className="flex flex-wrap gap-2">{tutor.availability.map(day => <span key={day} className="px-3 py-1.5 rounded-lg bg-[#eef2fb] text-[#1b3d7e] text-sm font-medium">{day}</span>)}</div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-display text-slate-900">Reviews <span className="text-slate-400 font-medium">({tutor.reviews})</span></h2>
                {tutorReviews.length > 3 && <button onClick={() => setShowAllReviews(!showAllReviews)} className="text-sm font-semibold text-[#1b3d7e] hover:underline">{showAllReviews ? 'Show fewer' : 'Show all'}</button>}
              </div>
              <div className="space-y-3">
                {reviews.map(review => (
                  <article key={review.name} className="bg-white rounded-xl p-5 card-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div><h3 className="text-sm font-semibold text-slate-900">{review.name}</h3><p className="text-xs text-slate-500 mt-0.5">{review.level} · {review.date}</p></div>
                      <StarRating rating={review.rating} size={13} />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mt-3">{review.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-5 h-fit bg-white rounded-xl p-5 card-shadow">
            <div className="text-3xl font-bold font-display text-[#1b3d7e]">GH₵{tutor.rate}<span className="text-sm font-medium text-slate-400"> /hr</span></div>
            <p className="text-sm text-slate-500 mt-2">Online lessons available</p>
            <div className="mt-4 text-sm text-slate-600">{tutor.available ? '● Available for new students' : '○ Currently busy'}</div>
          </aside>
        </div>
      </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-slate-200 px-5 py-3 shadow-[0_-4px_16px_rgba(15,32,72,0.08)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div><span className="text-lg font-bold font-display text-[#1b3d7e]">GH₵{tutor.rate}</span><span className="text-sm text-slate-400"> /hr</span></div>
          <button onClick={() => console.log('Book')} className="px-6 py-3 rounded-xl bg-[#f07a22] text-white font-bold text-sm hover:bg-[#d45f10] transition-colors">Book a session on the app</button>
        </div>
      </div>
    </div>
  );
}