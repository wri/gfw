import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

class AppHead extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string
  };

  static defaultProps = {
    title: '',
    description: '',
    keywords: '',
  };

  render() {
    const {
      title,
      description,
      keywords
    } = this.props;

    return (
      <Head>
        <title>{`${title ? `${title} | ` : ''}Global Forest Watch`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Vizzuality" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@globalforests" />
        <meta name="twitter:description" content={description} />
        <meta property="og:title" content={`${title} | Global Forest Watch`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/preview.jpg" />
      </Head>
    );
  }
}

export default AppHead;
