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
      const sizeChecker = (sizeElement) => window.innerWidth < sizeElement;
      const findFirstMatchedValue = (obj, fn) =>
        Object.keys(obj).find((key) => fn(obj[key], key, obj));

      const sizeIndex = findFirstMatchedValue(SCREEN_SIZES, sizeChecker);

      setSize(SCREEN_SIZES[sizeIndex]);
    };

    updateMedia();

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, [size]);

  return size;
}
