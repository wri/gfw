import UAParser from 'ua-parser-js';

const parser = new UAParser();
let isValidBrowser = true;

export const isTouch = () =>
  typeof window !== 'undefined' && 'ontouchstart' in window;

export default () => {
  const userAgent = parser.getResult();
  const {
    browser: { name, major },
  } = userAgent;
  const version = parseInt(major, 10);
  if (name === 'IE' && version < 11) {
    isValidBrowser = false;
  }

  return isValidBrowser;
};
