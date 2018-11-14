import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';

class Meta extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { title, description } = this.props;

    return title ? (
      <Helmet>
        <title>{`${title} | Global Forest Watch`}</title>
        <meta name="description" content={description} />
        <meta name="DC.title" content={`${title} | Global Forest Watch`} />
        <meta property="og:title" content={`${title} | Global Forest Watch`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
    ) : null;
  }
}

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

export default Meta;
