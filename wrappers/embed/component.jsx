import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { useRouter } from 'next/router';
import { Loader, MediaContextProvider } from 'gfw-components';

import { usePageTrack } from 'analytics';
import { useCheckBrowser } from 'utils/browser';
import { useSetLanguage } from 'utils/lang';

import Head from 'wrappers/head';

import Button from 'components/ui/button';

import gfwLogo from 'assets/logos/gfw.png';

import './styles.scss';

const EmbedWrapper = ({
  children,
  title,
  description,
  noIndex,
  metaTags,
  exploreLink,
}) => {
  usePageTrack();
  useCheckBrowser();
  useSetLanguage();

  // if a page is statically built with
  // fallback true we show a loader
  const { isFallback, query = {} } = useRouter();
  const { trase, gfw } = query;

  return (
    <MediaContextProvider>
      <Head
        title={title}
        description={description}
        noIndex={noIndex}
        metaTags={metaTags}
      />
      <div className={cx('l-embed-page', { '-trase': trase })}>
        <a className="embed-logo" href="/" target="_blank">
          <img src={gfwLogo} alt="Global Forest Watch" />
        </a>
        {isFallback ? <Loader /> : children}
        {!trase && !gfw && (
          <div className="embed-footer">
            <p>For more info</p>
            <Button className="embed-btn" extLink={exploreLink}>
              EXPLORE ON GFW
            </Button>
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
};

export default EmbedWrapper;
