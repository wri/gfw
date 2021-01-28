const isServer = typeof window !== 'undefined';

export const COOKIES_SLUG = 'agreeCookies';

export const getAgreedCookies = () =>
  isServer && JSON.parse(localStorage.getItem(COOKIES_SLUG));

export const setAgreedCookies = () =>
  isServer && localStorage.setItem(COOKIES_SLUG, true);

export const setSurveySeenCookie = (trackingID) =>
  localStorage.setItem(trackingID, true);

export const hasSeenSurvey = (trackingID) =>
  JSON.parse(localStorage.getItem(trackingID)) === true;
