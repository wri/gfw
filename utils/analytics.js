import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga';
import TwitterConvTrkr from 'react-twitter-conversion-tracker';

import ReactPixel from 'utils/facebook';
// import { getAgreedCookies } from 'utils/cookies';

const isServer = typeof window !== 'undefined';

export const initAnalytics = () => {
  if (isServer) {
    window.ANALYTICS_INITIALIZED = true;
    ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_PROPERTY_ID);
    ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
    TwitterConvTrkr.init(process.env.NEXT_PUBLIC_TWITTER_CONVERSION_ID);
  }
};

export const trackPage = (url) => {
  if (isServer && window.ANALYTICS_INITIALIZED) {
    const pageUrl =
      url || `${window.location.pathname}${window.location.search}`;
    ReactGA.set({ page: pageUrl });
    ReactGA.pageview(pageUrl);
    ReactPixel.pageView();
    TwitterConvTrkr.pageView();
  }
};

export const trackEvent = (event) => {
  if (isServer && window.ANALYTICS_INITIALIZED) {
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
