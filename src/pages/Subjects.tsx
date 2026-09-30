import { Link } from 'react-router-dom';
import { Badge } from '../components/ui';

const subjects = [
  { name: 'Mathematics', icon: '📐', tutors: 48, desc: 'Algebra, Calculus, Statistics, Further Maths, WASSCE prep', color: '#1b3d7e' },
  { name: 'Physics', icon: '⚗️', tutors: 32, desc: 'Mechanics, Waves, Electricity, Modern Physics', color: '#0a7244' },
  { name: 'Chemistry', icon: '🧪', tutors: 29, desc: 'Organic, Inorganic, Physical chemistry and lab work', color: '#d45f10' },
  { name: 'English', icon: '📖', tutors: 41, desc: 'Comprehension, Essay writing, Literature, Grammar', color: '#1b3d7e' },
  { name: 'Biology', icon: '🔬', tutors: 27, desc: 'Cell biology, Ecology, Genetics, Human anatomy', color: '#0a7244' },
  { name: 'Economics', icon: '📊', tutors: 22, desc: 'Micro/Macro economics, Business management, Accounting', color: '#d45f10' },
  { name: 'ICT', icon: '💻', tutors: 19, desc: 'Programming, Spreadsheets, Databases, Web design', color: '#1b3d7e' },
  { name: 'Geography', icon: '🌍', tutors: 16, desc: 'Physical, Human and Economic Geography', color: '#0a7244' },
];

export default function Subjects() {
  return (
    <div className="fade-in p-5 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Browse Subjects</h1>
        <p className="text-slate-500">Expert tutors available across all major subjects</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map(subject => (
          <Link key={subject.name} to="/tutors" className="bg-white rounded-2xl p-6 card-shadow cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: subject.color + '15' }}>{subject.icon}</div>
              <Badge label={`${subject.tutors} tutors`} color="navy" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-2">{subject.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{subject.desc}</p>
            <span className="text-sm font-semibold group-hover:text-[#1b3d7e] text-slate-400 transition-colors">Find tutors →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}