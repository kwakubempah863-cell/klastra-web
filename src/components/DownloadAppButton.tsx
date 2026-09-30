import { useState } from 'react';
import { Button } from './ui';
import AppDownloadModal from './AppDownloadModal';
import { detectPlatform, getStoreUrlForPlatform } from '../config/appStore';

type Props = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
};

export default function DownloadAppButton({ variant = 'primary', size = 'md', label = 'Download the app', className }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    const platform = detectPlatform();
    const storeUrl = getStoreUrlForPlatform(platform);
    if (storeUrl) {
      window.location.href = storeUrl;
      return;
    }
    setModalOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        icon={(
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        onClick={handleClick}
      >
        {label}
      </Button>
      {modalOpen && <AppDownloadModal open={modalOpen} onClose={() => setModalOpen(false)} />}
    </>
  );
}