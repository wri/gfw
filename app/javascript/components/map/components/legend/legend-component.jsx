import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Legend,
  LegendItemToolbar,
  LegendItemTypes,
  Icons
} from 'wri-api-components';

import './legend-styles.scss';

class MapLegend extends Component {
  render() {
    const { layerGroups } = this.props;
    return (
      <div className="c-legend">
        <Icons />
        {layerGroups && <Legend {...this.props} />}
      </div>
    );
  }
}

MapLegend.defaultProps = {
  maxHeight: 300,
  LegendItemToolbar: <LegendItemToolbar />,
  LegendItemTypes: <LegendItemTypes />
};

MapLegend.propTypes = {
  layerGroups: PropTypes.array
};

export default MapLegend;
