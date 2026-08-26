import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import cx from 'classnames';

import Icon from 'components/ui/icon';

import { GNW_ANNOUNCEMENT_URL } from 'utils/external-links';

import treeFillIcon from 'assets/logos/tree-fill.svg?sprite';
import unionIcon from 'assets/logos/union.svg?sprite';
import closeIcon from 'assets/icons/close.svg?sprite';

const isServer = typeof window === 'undefined';
const STORAGE_KEY = 'gnwAnnouncementBannerDismissed';

const GnwAnnouncementBanner = ({ className }) => {
  const { pathname } = useRouter();
  const isHomePage = pathname === '/';
  const [visible, setVisible] = useState(isHomePage ? true : null);

  useEffect(() => {
    if (isHomePage) {
      setVisible(true);
      return;
    }

    const isDismissed =
      !isServer && localStorage.getItem(STORAGE_KEY) === 'true';
    setVisible(!isDismissed);
  }, [isHomePage]);

  const handleDismiss = () => {
    if (!isServer) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setVisible(false);
  };

  if (visible !== true) {
    return null;
  }

  return (
    <div
      className={cx('c-gnw-announcement-banner', className)}
      role="region"
      aria-label="Global Nature Watch announcement"
    >
      <div className="banner-content">
        <Icon icon={treeFillIcon} className="tree-icon" />
        <div className="banner-text">
          <p className="banner-title">
            Global Forest Watch is now Global Nature Watch
          </p>
          <p className="banner-description">
            A new name for the next chapter of our work — continuing to advance
            forest monitoring while expanding monitoring coverage and
            capabilities. Our name has changed, but our commitment remains the
            same and your workflows will continue to be supported. Check out{' '}
            <a
              className="banner-link"
              href="https://horizon.globalnaturewatch.org/?utm_medium=notification&utm_source=homepage&utm_campaign=gnwannoucement"
              target="_blank"
              rel="noopener noreferrer"
            >
              Global Nature Watch Horizon
              <Icon icon={unionIcon} className="union-icon" />
            </a>
          </p>
          <a
            className="banner-link"
            href={GNW_ANNOUNCEMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
            <Icon icon={unionIcon} className="union-icon" />
          </a>
        </div>
      </div>
      {!isHomePage && (
        <button
          type="button"
          className="banner-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
        >
          <Icon icon={closeIcon} className="close-icon" />
        </button>
      )}
    </div>
  );
};

GnwAnnouncementBanner.propTypes = {
  className: PropTypes.string,
};

export default GnwAnnouncementBanner;
