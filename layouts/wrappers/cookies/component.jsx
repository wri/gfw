import { useState, useEffect } from 'react';
import Head from 'next/head';

import { CookiesBanner } from 'gfw-components';

import { trackEvent, initAnalytics, trackPage } from 'utils/analytics';

import './styles.scss';

const Cookies = () => {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const agreeCookies = JSON.parse(localStorage.getItem('agreeCookies'));
    setAccepted(agreeCookies);
  }, []);

  const acceptCookies = () => {
    setAccepted(true);
    localStorage.setItem('agreeCookies', true);
    initAnalytics();
    trackPage();
    trackEvent({
      category: 'Cookies banner',
      action: 'User accepts cookies',
      label: 'cookies',
    });
  };

  return (
    <>
      {!accepted && (
        <div className="c-cookies">
          <CookiesBanner onAccept={acceptCookies} />
        </div>
      )}
      {accepted && (
        <Head>
          <script
            key="hotjar"
            type="text/javascript"
            src="/scripts/hotjar.js"
          />
          <script
            key="crazyegg"
            type="text/javascript"
            src="//script.crazyegg.com/pages/scripts/0027/6897.js"
          />
        </Head>
      )}
    </>
  );
};

export default Cookies;
