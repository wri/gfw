import { useState, useEffect } from 'react';

/*
export interface ScreenSize {
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}
*/

const SIZES = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1600,
});

/**
 * using screen sizes from https://tailwindcss.com/docs/screens
 */
export function useDynamicScreenSize({ size }) {
  const [isSizeOrAbove, setSizeOrAbove] = useState(false);

  useEffect(() => {
    if (window.innerWidth > SIZES[size]) {
      setSizeOrAbove(true);
    } else {
      setSizeOrAbove(false);
    }

    const updateMedia = () => {
      if (window.innerWidth > SIZES[size]) {
        setSizeOrAbove(true);
      } else {
        setSizeOrAbove(false);
      }
    };

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, [size]);

  return isSizeOrAbove;
}
