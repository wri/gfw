import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Loader, MediaContextProvider } from '@worldresources/gfw-components';
import cx from 'classnames';

import { useTrackPage } from 'utils/analytics';
import { useSetLanguage } from 'utils/lang';

import Head from 'wrappers/head';

import ContactUsModal from 'components/modals/contact-us';
import ErrorMessage from 'components/error-message';
import SiteHeader from 'components/site-header';

// Footer's own MediaContextProvider (nested inside gfw-components' Footer)
// has the same SSR-vs-client mismatch issue as the Carousel: it can't
// reliably reproduce server-side markup that matches the client mount.
// SiteHeader already avoids this for Header via ssr:false; do the same here.
const Footer = dynamic(() => import('components/footer'), { ssr: false });

const PageWrapper = ({
  children,
  showFooter,
  title,
  description,
  noIndex,
  metaTags,
  error,
  errorTitle,
  errorDescription,
  debugErrors,
  notifications,
}) => {
  useTrackPage();
  useSetLanguage();

  // if a page is statically built with fallback true and not cached
  // we show a loader while the staticProps are fetched
  const { isFallback } = useRouter();

  return (
    <MediaContextProvider>
      <Head
        title={title}
        description={description}
        noIndex={noIndex}
        metaTags={metaTags}
      />
      <div className="l-page">
        <SiteHeader notifications={notifications} />
        <div className={cx('content-wrapper', { '-error': error })}>
          {isFallback && <Loader />}
          {!isFallback && error && (
            <ErrorMessage
              title={errorTitle || 'Page Not Found'}
              description={
                errorDescription ||
                'You may have mistyped the address or the page may have moved.'
              }
              errors={debugErrors}
            />
          )}
          {!isFallback && !error && children}
        </div>
        {showFooter && <Footer />}
        <ContactUsModal />
      </div>
    </MediaContextProvider>
  );
};

PageWrapper.propTypes = {
  children: PropTypes.node,
  showFooter: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  noIndex: PropTypes.bool,
  metaTags: PropTypes.string,
  error: PropTypes.number,
  errorTitle: PropTypes.string,
  errorDescription: PropTypes.string,
  debugErrors: PropTypes.array || PropTypes.object,
  notifications: PropTypes.array,
};

PageWrapper.defaultProps = {
  showFooter: true,
};

export default PageWrapper;
