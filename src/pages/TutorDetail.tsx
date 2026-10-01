import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Badge, StarRating } from '../components/ui';
import DownloadAppButton from '../components/DownloadAppButton';
import { useTutor } from '../hooks/useTutors';
import { adaptTutor } from '../services/tutorsService';

export default function TutorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tutorData, isLoading, isError } = useTutor(id);

  if (isLoading) {
    return (
      <div className="fade-in min-h-full flex items-center justify-center p-6">
        <div className="w-full max-w-5xl space-y-5">
          <div className="skeleton h-56 sm:h-64 rounded-xl" />
          <div className="skeleton h-8 w-1/3 rounded-lg" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !tutorData) {
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

  const tutor = adaptTutor(tutorData);

  return (
    <div className="min-h-full pb-24">
      <div className="fade-in">
      <section className="relative h-56 sm:h-64 bg-gradient-to-r from-[#0f2048] via-[#1b3d7e] to-[#2f54a8]">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full bg-white/90 text-[#1b3d7e] hover:bg-white shadow-md flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true"><path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
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
              <div className="bg-white rounded-xl p-4 card-shadow"><div className="text-xl font-bold font-display text-slate-900">{tutor.totalStudents ?? '—'}</div><div className="text-sm text-slate-500 mt-1">Students Taught</div></div>
              <div className="bg-white rounded-xl p-4 card-shadow"><div className="text-xl font-bold font-display text-slate-900">{tutor.completedLessons?.toLocaleString() ?? '—'}</div><div className="text-sm text-slate-500 mt-1">Lessons Completed</div></div>
            </section>

            <section className="bg-white rounded-xl p-5 card-shadow">
              <h2 className="font-bold font-display text-slate-900 mb-2">About {tutor.name.split(' ').slice(-1)[0]}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{tutor.bio}</p>
            </section>

            <section className="bg-white rounded-xl p-5 card-shadow">
              <h2 className="font-bold font-display text-slate-900 mb-2">Qualifications</h2>
              <p className="text-sm text-slate-600">{tutor.qualifications}</p>
              <p className="text-sm text-slate-500 mt-2">{tutor.experience === null ? 'Experience details not provided' : `${tutor.experience} years of teaching experience`}</p>
            </section>

            <section className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-5 card-shadow">
                <h2 className="text-sm font-bold font-display text-slate-900 mb-2">Languages</h2>
                <p className="text-sm text-slate-600">{tutor.languages.join(', ')}</p>
              </div>
              <div className="bg-white rounded-xl p-5 card-shadow">
                <h2 className="text-sm font-bold font-display text-slate-900 mb-2">Response Time</h2>
                <p className="text-sm text-slate-600">{tutor.responseTime ? `Usually responds in ${tutor.responseTime}` : 'Response time not provided'}</p>
              </div>
            </section>

            <section className="bg-white rounded-xl p-5 card-shadow">
              <h2 className="font-bold font-display text-slate-900 mb-3">Availability</h2>
              {tutor.availability.length > 0 ? (
                <div className="flex flex-wrap gap-2">{tutor.availability.map(day => <span key={day} className="px-3 py-1.5 rounded-lg bg-[#eef2fb] text-[#1b3d7e] text-sm font-medium">{day}</span>)}</div>
              ) : (
                <p className="text-sm text-slate-600">Contact tutor for lesson times.</p>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-display text-slate-900">Reviews <span className="text-slate-400 font-medium">({tutor.reviews})</span></h2>
              </div>
              <div className="bg-white rounded-xl p-5 card-shadow">
                <p className="text-sm text-slate-600">Review details are not available yet.</p>
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
          <DownloadAppButton variant="secondary" size="lg" label="Book a session on the app" />
        </div>
      </div>
    </div>
  );
}