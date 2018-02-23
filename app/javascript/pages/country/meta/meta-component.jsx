import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';

class Meta extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { page } = this.props;
    return (
      <Helmet>
        <title>{`${page ? `${page} | ` : ''}Global Forest Watch`}</title>
        <meta
          name="description"
          content={`Data about forest change, tenure, forest related employment and land use in ${page}`}
        />
        <meta name="DC.title" content={`${page} | Global Forest Watch`} />
        <meta property="og:title" content={`${page} | Global Forest Watch`} />
        <meta
          property="og:description"
          content={`Data about forest change, tenure, forest related employment and land use in ${page}`}
        />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
    );
  }
}

Meta.propTypes = {
  page: PropTypes.string
};

export default Meta;
