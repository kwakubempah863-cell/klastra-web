export const APP_STORE_URLS = {
  playStore: 'https://play.google.com/store/apps/details?id=com.tutorkonnect.app',
  appStore: 'https://apps.apple.com/app/id0000000000',
} as const;

export type Platform = 'android' | 'ios' | 'desktop';

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const userAgent = navigator.userAgent.toLowerCase();

  const isIpad =
    /ipad/.test(userAgent) ||
    (/macintosh/.test(userAgent) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);

  if (/iphone|ipod/.test(userAgent) || isIpad) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  return 'desktop';
}

export function getStoreUrlForPlatform(platform: Platform): string | null {
  if (platform === 'android') return APP_STORE_URLS.playStore;
  if (platform === 'ios') return APP_STORE_URLS.appStore;
  return null;
}