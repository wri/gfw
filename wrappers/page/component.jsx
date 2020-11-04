import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Loader, MediaContextProvider } from 'gfw-components';
import cx from 'classnames';

import { useTrackPage } from 'utils/analytics';
import { useSetLanguage } from 'utils/lang';

import Head from 'wrappers/head';
import Cookies from 'wrappers/cookies';

import Header from 'components/header';
import Footer from 'components/footer';
import ContactUsModal from 'components/modals/contact-us';
import ErrorMessage from 'components/error-message';

import './styles.scss';

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
        <Header />
        <div className={cx('content-wrapper', { '-error': error })}>
          {isFallback && <Loader />}
          {!isFallback && error && (
            <ErrorMessage
              title={errorTitle || 'Page Not Found'}
              description={
                errorDescription ||
                'You may have mistyped the address or the page may have moved.'
              }
            />
          )}
          {!isFallback && !error && children}
        </div>
        {showFooter && <Footer />}
        <Cookies />
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
};

PageWrapper.defaultProps = {
  showFooter: true,
};

export default PageWrapper;
