import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Loader from 'components/loader/loader';

import './map-styles.scss';

class Map extends PureComponent {
  render() {
    const { isLoading, isGeostoreLoading } = this.props;
    return (
      <div className="c-map">
        {(isLoading || isGeostoreLoading) && (
          <Loader className="loader" theme="theme-loader-light" />
        )}
        <div id="map" className="c-map" />
      </div>
    );
  }
}

Map.propTypes = {
  isLoading: Proptypes.bool.isRequired,
  isGeostoreLoading: Proptypes.bool.isRequired
};

export default Map;
