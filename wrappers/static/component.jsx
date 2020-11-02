import React from 'react';
import PropTypes from 'prop-types';

import { useTrackPage } from 'utils/analytics';
import { useSetLanguage } from 'utils/lang';

import Head from 'wrappers/head';

import './styles.scss';

const StaticWrapper = ({ children, title, description, noIndex, metaTags }) => {
  useTrackPage();
  useSetLanguage();

  return (
    <>
      <Head
        title={title}
        description={description}
        noIndex={noIndex}
        metaTags={metaTags}
      />
      <div className="l-static-page">{children}</div>
    </>
  );
};

StaticWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  noIndex: PropTypes.bool,
  metaTags: PropTypes.string,
};

export default StaticWrapper;
