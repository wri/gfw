import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Loader from 'components/loader';
import NoContent from 'components/no-content';

import './map-styles.scss';

class Map extends PureComponent {
  render() {
    const { loading, error } = this.props;
    return (
      <div className="c-map">
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        {!loading &&
          error && (
            <NoContent message="An error occured. Please try again later." />
          )}
        <div id="map" className="c-map" />
      </div>
    );
  }
}

Map.propTypes = {
  loading: Proptypes.bool.isRequired,
  error: Proptypes.bool.isRequired
};

export default Map;
