import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import RecentImagery from 'pages/map/recent-imagery';

import './root-styles.scss';

class Root extends PureComponent {
  render() {
    const { loading } = this.props;
    return <div className="l-map">{!loading && <RecentImagery />}</div>;
  }
}

Root.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default Root;
