import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Loader, MediaContextProvider } from 'gfw-components';

import { usePageTrack } from 'analytics';
import { useCheckBrowser } from 'utils/browser';
import { useSetLanguage } from 'utils/lang';

import Head from 'wrappers/head';

import Header from 'components/header';
import Cookies from 'components/cookies';
import ContactUsModal from 'components/modals/contact-us';

import './styles.scss';

const FullScreenWrapper = ({
  children,
  title,
  description,
  noIndex,
  metaTags,
}) => {
  usePageTrack();
  useCheckBrowser();
  useSetLanguage();

  // if a page is statically built with
  // fallback true we show a loader
  const { isFallback } = useRouter();

  return (
    <MediaContextProvider>
      <Head
        title={title}
        description={description}
        noIndex={noIndex}
        metaTags={metaTags}
      />
      <div className="l-fullscreen-page">
        <Header fullScreen />
        <div className="content-wrapper">
          {isFallback ? <Loader /> : children}
        </div>
        <Cookies />
        <ContactUsModal />
      </div>
    </MediaContextProvider>
  );
};

FullScreenWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  noIndex: PropTypes.bool,
  metaTags: PropTypes.string,
};

export default FullScreenWrapper;
