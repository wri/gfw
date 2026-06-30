import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import GnwAnnouncementBanner from 'components/gnw-announcement-banner';

const Header = dynamic(() => import('components/header'), { ssr: false });

const isServer = typeof window === 'undefined';

const HEADER_LOGO_SIZE = 76;
const HEADER_NAV_HEIGHT = { default: 56, slim: 43 };

const updateSiteHeaderCssVars = (height, logoOverhang) => {
  if (!isServer) {
    document.documentElement.style.setProperty(
      '--site-header-height',
      `${height}px`
    );
    document.documentElement.style.setProperty(
      '--header-logo-overhang',
      `${logoOverhang}px`
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

    const navHeight = slim ? HEADER_NAV_HEIGHT.slim : HEADER_NAV_HEIGHT.default;
    const logoOverhang = Math.max(0, HEADER_LOGO_SIZE - navHeight);

    const measureHeight = () => {
      updateSiteHeaderCssVars(element.offsetHeight, logoOverhang);
    };

    measureHeight();

    const resizeObserver = new ResizeObserver(measureHeight);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [slim]);

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
