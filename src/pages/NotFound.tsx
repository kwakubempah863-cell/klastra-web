import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="fade-in min-h-full flex items-center justify-center p-6 text-center">
      <div>
        <div className="text-8xl font-bold font-display text-[#1b3d7e]">404</div>
        <h1 className="text-2xl font-bold font-display text-slate-900 mt-3">Page not found</h1>
        <p className="text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-xl bg-[#1b3d7e] text-white text-sm font-semibold hover:bg-[#152e61] transition-colors">Back to home</Link>
      </div>
    </div>
  );
}