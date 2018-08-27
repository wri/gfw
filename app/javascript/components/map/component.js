import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import MiniLegend from 'components/map/components/mini-legend';

import './styles.scss';

class Map extends PureComponent {
  render() {
    const { loading, error, layers } = this.props;
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
        {!loading && layers && layers.length && <MiniLegend layers={layers} />}
      </div>
    );
  }
}

Map.propTypes = {
  loading: Proptypes.bool.isRequired,
  error: Proptypes.bool.isRequired,
  layers: Proptypes.array
};

export default Map;
