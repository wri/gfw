import React from 'react';
import PropTypes from 'prop-types';
import NextHead from 'next/head';
import ReactHtmlParser from 'react-html-parser';

// if the metaTags prop is returned from getStaticProps or getServerSide props
// we parse it and use in favour of page props
const Head = ({ title, description, noIndex, metaTags }) =>
  metaTags ? (
    ReactHtmlParser(metaTags)
  ) : (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Vizzuality" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@globalforests" />
      <meta name="twitter:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/preview.jpg" />
      {noIndex && <meta name="robots" content="noindex,follow" />}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />
    </NextHead>
  );

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  noIndex: PropTypes.bool,
  metaTags: PropTypes.string,
};

export default Head;
