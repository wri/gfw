import UAParser from 'ua-parser-js';

const parser = new UAParser();
let isValidBrowser = true;

const isServer = typeof window === 'undefined';

export const isTouch = () => !isServer && 'ontouchstart' in window;

const allowedBrowsers = {
  Chrome: 50,
  Safari: 10,
  Firefox: 48,
  Opera: 51,
  IE: 11,
  Edge: 15,
};

export const checkBrowser = () => {
  const userAgent = parser.getResult();
  const {
    browser: { name, major },
  } = userAgent;

  if (
    Object.keys(allowedBrowsers).includes(name) &&
    parseInt(major, 10) < allowedBrowsers[name]
  ) {
    isValidBrowser = false;
  }

  return isValidBrowser;
};
