import { useEffect } from 'react';
import { useRouter } from 'next/router';
import UAParser from 'ua-parser-js';

const parser = new UAParser();
const isServer = typeof window === 'undefined';

export const isTouch = () => !isServer && 'ontouchstart' in window;

export const checkBrowser = () => {
  const userAgent = parser.getResult();
  const {
    browser: { name },
  } = userAgent;

  return name !== 'IE';
};

export const useCheckBrowser = () => {
  const { push } = useRouter();

  useEffect(() => {
    if (!checkBrowser()) {
      push('/browser-support/');
    }
  }, []);
};
