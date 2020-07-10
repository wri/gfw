import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

class AppHead extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    noIndex: PropTypes.bool,
  };

  static defaultProps = {
    title:
      'Forest Monitoring, Land Use & Deforestation Trends | Global Forest Watch',
    description:
      'Global Forest Watch offers free, real-time data, technology and tools for monitoring the world’s forests, enabling better protection against illegal deforestation and unsustainable practices.',
    keywords:
      'Forest monitoring, data, technology, world forest, protection, deforestation',
  };

  render() {
    const { title, description, keywords, noIndex } = this.props;

    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Vizzuality" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@globalforests" />
        <meta name="twitter:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/preview.jpg" />
        {noIndex && <meta name="robots" content="noindex" />}
      </Head>
    );
  }
}

export default AppHead;
