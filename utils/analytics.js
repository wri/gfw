import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga';
import TwitterConvTrkr from 'react-twitter-conversion-tracker';

import ReactPixel from 'utils/facebook';
import { COOKIES_SLUG } from 'utils/cookies';

const IS_BROWSER = typeof window !== 'undefined';

export const initAnalytics = () => {
  if (IS_BROWSER) {
    const agreeCookies = localStorage.getItem(COOKIES_SLUG);
    if (agreeCookies) {
      window.ANALYTICS_INITIALIZED = true;
      ReactGA.initialize(process.env.ANALYTICS_PROPERTY_ID);
      ReactPixel.init(process.env.FACEBOOK_PIXEL_ID);
      TwitterConvTrkr.init(process.env.TWITTER_CONVERSION_ID);
    }
  }
};

export const trackPage = (url) => {
  if (IS_BROWSER && window.ANALYTICS_INITIALIZED) {
    const pageUrl =
      url || `${window.location.pathname}${window.location.search}`;
    ReactGA.set({ page: pageUrl });
    ReactGA.pageview(pageUrl);
    ReactPixel.pageView();
    TwitterConvTrkr.pageView();
  }
};

export const trackEvent = (event) => {
  if (IS_BROWSER && window.ANALYTICS_INITIALIZED) {
    ReactGA.event(event);
  }
};

export const trackMapLatLon = (location) => {
  const { query } = location || {};
  const { map } = query || {};
  const position =
    map && `/location/${map.center.lat}/${map.center.lng}/${map.zoom}`;
  if (position) {
    trackPage(`${position}${window.location.pathname}`);
  }
};

export const useTrackPage = () => {
  const { asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useEffect(() => {
    if (!window.ANALYTICS_INITIALIZED) {
      initAnalytics();
    }
    trackPage();
  }, [fullPathname]);
};
