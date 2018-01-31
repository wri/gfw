import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';

class Meta extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { page, widgetImage } = this.props;
    return (
      <Helmet>
        <title>{`${page ? `${page} | ` : ''}Global Forest Watch`}</title>
        <meta
          name="description"
          content={`Data about forest change, tenure, forest related employment and land use in ${page}`}
        />
        <meta name="author" content="World Resources Institute" />
        <meta name="DC.title" content={`${page} | Global Forest Watch`} />
        <meta property="og:title" content={`${page} | Global Forest Watch`} />
        <meta
          property="og:description"
          content={`Data about forest change, tenure, forest related employment and land use in ${page}`}
        />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:image"
          content={
            widgetImage ||
            'http://www.globalforestwatch.org/assets/backgrounds/home-slider/bg_slide1.png'
          }
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@globalforests" />
      </Helmet>
    );
  }
}

Meta.propTypes = {
  page: PropTypes.string,
  widgetImage: PropTypes.string
};

export default Meta;
