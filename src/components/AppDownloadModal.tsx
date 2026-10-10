import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { APP_STORE_URLS } from '../config/appStore';
import logoMark from '../imports/logo-mark.png';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AppDownloadModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-download-title"
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative"
        onClick={event => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <img src={logoMark} alt="Klastra" className="w-16 h-16 rounded-2xl mx-auto mb-4 object-cover" />
          <h2 id="app-download-title" className="text-xl font-bold font-display text-slate-900">Get Klastra on your phone</h2>
          <p className="text-sm text-slate-500 mt-1">Scan the codes below or tap a store to install</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <a
            href={APP_STORE_URLS.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <PlayStoreIcon />
            <span className="text-sm font-semibold leading-snug text-slate-800">Get it on Google Play</span>
          </a>
          <a
            href={APP_STORE_URLS.appStore}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <AppleStoreIcon />
            <span className="text-sm font-semibold leading-snug text-slate-800">Download on the App Store</span>
          </a>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">The mobile app is where you'll book, message, and join lessons.</p>
      </div>
    </div>,
    document.body,
  );
}

function PlayStoreIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0" aria-hidden="true">
      <path fill="#34A853" d="M4.8 3.5c-.5.5-.8 1.2-.8 2.1v20.8c0 .9.3 1.6.8 2.1L16.4 16z" />
      <path fill="#4285F4" d="m20.2 20-3.8-4 3.8-4 7.2 4.1c1.1.6 1.1 1.2 0 1.8z" />
      <path fill="#FBBC04" d="m4.8 28.5 15.4-8.5-3.8-4z" />
      <path fill="#EA4335" d="m4.8 3.5 15.4 8.5-3.8 4z" />
    </svg>
  );
}

function AppleStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 flex-shrink-0 text-slate-900" aria-hidden="true">
      <path d="M16.37 12.19c.02 2.17 1.9 2.89 1.92 2.9-.02.05-.3 1.03-.99 2.04-.6.87-1.22 1.73-2.2 1.75-.96.02-1.27-.57-2.37-.57-1.1 0-1.45.55-2.36.59-.95.04-1.67-.94-2.28-1.81-1.24-1.79-2.19-5.05-.91-7.25.64-1.09 1.78-1.78 3.02-1.8.94-.02 1.82.63 2.39.63.56 0 1.62-.78 2.73-.67.46.02 1.77.19 2.61 1.42-.07.04-1.56.91-1.56 2.77ZM14.58 6.63c.5-.6.84-1.44.75-2.27-.72.03-1.59.48-2.11 1.08-.46.53-.86 1.38-.75 2.19.8.06 1.62-.4 2.11-1Z" />
    </svg>
  );
}