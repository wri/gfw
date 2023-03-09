import { useState, useEffect } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import useRouter from 'utils/router';

import { CookiesBanner } from 'gfw-components';

import { trackEvent, initAnalytics, trackPage } from 'utils/analytics';
import { getAgreedCookies, setAgreedCookies } from 'utils/cookies';

// import './styles.scss';

const Cookies = () => {
  const [accepted, setAccepted] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const agreedCookies = getAgreedCookies();
    setAccepted(agreedCookies);
    setOpen(!agreedCookies);
  }, []);

  const acceptCookies = () => {
    setAccepted(true);
    setOpen(false);
    setAgreedCookies();
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
      {open && (
        <div
          className={cx('c-cookies', {
            'c-cookies--map': router?.asPath.startsWith('/map'),
          })}
        >
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
