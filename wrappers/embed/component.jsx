import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useRouter } from 'next/router';

import { Loader, MediaContextProvider, Button } from 'gfw-components';

import { useTrackPage } from 'utils/analytics';
import { useSetLanguage } from 'utils/lang';

import Head from 'wrappers/head';

import ErrorMessage from 'components/error-message';

const EmbedWrapper = ({
  children,
  title,
  description,
  noIndex,
  metaTags,
  exploreLink,
  error,
  errorTitle,
  errorDescription,
}) => {
  useTrackPage();
  useSetLanguage();

  // if a page is statically built with
  // fallback true we show a loader
  const {
    isFallback,
    query: { trase, gfw },
  } = useRouter();

  return (
    <MediaContextProvider>
      <Head
        title={title}
        description={description}
        noIndex={noIndex}
        metaTags={metaTags}
      />
      <div className={cx('l-embed-page', { '-trase': trase })}>
        <div className={cx('embed-content', { '-error': error })}>
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
        {!trase && !gfw && (
          <div className="embed-footer">
            <p>For more info</p>
            <a href={exploreLink} target="_blank" rel="noopener noreferrer">
              <Button className="embed-btn">EXPLORE ON GFW</Button>
            </a>
          </div>
        )}
      </div>
    </MediaContextProvider>
  );
};

EmbedWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  noIndex: PropTypes.bool,
  metaTags: PropTypes.string,
  exploreLink: PropTypes.string,
  error: PropTypes.number,
  errorTitle: PropTypes.string,
  errorDescription: PropTypes.string,
};

export default EmbedWrapper;
