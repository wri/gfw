import { useState, useEffect } from 'react';

/*
export interface ScreenSize {
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}
*/

export const SCREEN_SIZES = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1600,
});

/**
 * using screen SCREEN_SIZES from https://tailwindcss.com/docs/screens
 */
export function useDynamicScreenSize() {
  const [size, setSize] = useState('');

  useEffect(() => {
    const updateMedia = () => {
      switch (true) {
        case window.innerWidth < SCREEN_SIZES.sm:
          setSize(SCREEN_SIZES.sm);
          break;
        case window.innerWidth < SCREEN_SIZES.md:
          setSize(SCREEN_SIZES.md);
          break;
        case window.innerWidth < SCREEN_SIZES.lg:
          setSize(SCREEN_SIZES.lg);
          break;
        default:
          setSize(SCREEN_SIZES.xl);
      }
    };

    updateMedia();

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, [size]);

  return size;
}
