import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import GnwAnnouncementBanner from 'components/gnw-announcement-banner';

const Header = dynamic(() => import('components/header'), { ssr: false });

const isServer = typeof window === 'undefined';

const updateSiteHeaderHeight = (height) => {
  if (!isServer) {
    document.documentElement.style.setProperty(
      '--site-header-height',
      `${height}px`
    );
  }
};

const SiteHeader = ({ notifications, slim }) => {
  const siteHeaderRef = useRef(null);

  useEffect(() => {
    const element = siteHeaderRef.current;

    if (!element) {
      return undefined;
    }

    const measureHeight = () => {
      updateSiteHeaderHeight(element.offsetHeight);
    };

    measureHeight();

    const resizeObserver = new ResizeObserver(measureHeight);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="c-site-header" ref={siteHeaderRef}>
      <GnwAnnouncementBanner />
      <Header slim={slim} notifications={notifications} />
    </div>
  );
};

SiteHeader.propTypes = {
  notifications: PropTypes.array,
  slim: PropTypes.bool,
};

export default SiteHeader;
