import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, TutorCard, Input, SkeletonCard } from '../components/ui';
import { subjects } from '../data/mockData';
import { useTutors } from '../hooks/useTutors';
import { adaptTutor } from '../services/tutorsService';

export default function TutorDiscovery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [selectedSubject, setSelectedSubject] = useState(() => searchParams.get('subject') || 'All');
  const [sortBy, setSortBy] = useState('rating');
  const [minRating, setMinRating] = useState(0);
  const [maxRate, setMaxRate] = useState(200);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const filters = {
    search: search || undefined,
    subject: selectedSubject === 'All' ? undefined : selectedSubject,
    minRating: minRating > 0 ? minRating : undefined,
    maxRate: maxRate < 200 ? maxRate : undefined,
    onlyAvailable,
    sort: sortBy as 'rating' | 'rate_asc' | 'rate_desc',
  };
  const { data: tutors = [], isLoading, isError, refetch } = useTutors(filters);

  return (
    <div className="fade-in flex flex-col lg:flex-row gap-0 lg:gap-6 h-full">
      {/* Filters sidebar */}
      <aside className="lg:w-64 flex-shrink-0 bg-white lg:rounded-none border-b lg:border-b-0 lg:border-r border-slate-100 p-5">
        <h2 className="font-bold font-display text-slate-900 mb-5 text-base">Filter Tutors</h2>

        <div className="space-y-5">
          <Input
            label="Search"
            placeholder="Name or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<span>🔍</span>}
          />

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Subject</label>
            <div className="flex flex-wrap gap-1.5">
              {['All', ...subjects.slice(0, 8).map(s => s.name)].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className={`tab-pill text-xs py-1 px-2.5 ${selectedSubject === s ? 'active' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Min Rating: {minRating === 0 ? 'Any' : `${minRating}★`}</label>
            <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full accent-[#1b3d7e]" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Any</span><span>5★</span></div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Max Rate: GH₵{maxRate}/hr</label>
            <input type="range" min="30" max="200" step="10" value={maxRate} onChange={e => setMaxRate(Number(e.target.value))} className="w-full accent-[#1b3d7e]" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>GH₵30</span><span>GH₵200</span></div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} className="rounded accent-[#1b3d7e] w-4 h-4" />
            <span className="text-sm font-medium text-slate-700">Available now only</span>
          </label>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Sort by</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 bg-white">
              <option value="rating">Highest Rated</option>
              <option value="rate_asc">Lowest Price</option>
              <option value="rate_desc">Highest Price</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1 p-5 lg:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold font-display text-slate-900">Find a Tutor</h1>
            <p className="text-sm text-slate-500 mt-0.5">{isLoading ? 'Finding tutors...' : `${tutors.length} tutors found`}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : isError ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-600 mb-4">We couldn't load tutors. Please try again.</p>
            <Button variant="outline" onClick={() => void refetch()}>Retry</Button>
          </div>
        ) : tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold font-display text-slate-800 mb-2">No tutors found</h3>
            <p className="text-sm text-slate-500 mb-5">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={() => { setSearch(''); setSelectedSubject('All'); setMinRating(0); setMaxRate(200); setOnlyAvailable(false); }}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tutors.map(tutor => (
              <div key={tutor.id} role="link" tabIndex={0} onClick={() => navigate(`/tutors/${tutor.id}`)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') navigate(`/tutors/${tutor.id}`); }}>
                <TutorCard tutor={adaptTutor(tutor)} onBook={() => navigate(`/tutors/${tutor.id}`)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
