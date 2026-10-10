import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import logoMark from '../imports/logo-mark.png';

export default function Login() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <main className="mx-auto flex max-w-4xl items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="text-center">
          <img src={logoMark} alt="Klastra" className="mx-auto h-14 w-14" />
          <h1 className="mt-6 text-3xl font-black text-slate-900 md:text-4xl">Sign in through the mobile app</h1>
          <p className="mt-3 text-slate-600">Klastra runs on your phone. Download the app to sign in.</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button variant="outline" size="lg" onClick={() => setNotice('Coming soon')}>Google Play</Button>
          <Button variant="outline" size="lg" onClick={() => setNotice('Coming soon')}>App Store</Button>
        </div>

        {notice && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            {notice}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-600">
          Are you a school interested in a pilot?{' '}
          <Link to="/contact" className="font-semibold text-[#102A43] underline-offset-4 hover:underline">Request a demo</Link>
        </div>
      </div>
    </main>
  );
}
