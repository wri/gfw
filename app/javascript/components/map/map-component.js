import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Loader from 'components/loader';

import './map-styles.scss';

class Map extends PureComponent {
  render() {
    const { isLoading, isParentLoading } = this.props;
    return (
      <div className="c-map">
        {(isLoading || isParentLoading) && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        <div id="map" className="c-map" />
      </div>
    );
  }
}

Map.propTypes = {
  isLoading: Proptypes.bool.isRequired,
  isParentLoading: Proptypes.bool.isRequired
};

export default Map;
