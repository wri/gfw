import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Legend, LegendItemToolbar, LegendItemTypes } from 'wri-api-components';

import '../../../../../../node_modules/wri-api-components/dist/components.css';
import './legend-styles.scss';

class MapLegend extends PureComponent {
  render() {
    const { layerGroups } = this.props;
    return (
      <div className="c-legend">
        {layerGroups &&
          layerGroups.length > 0 && (
            <Legend
              {...this.props}
              // List item
              LegendItemToolbar={<LegendItemToolbar />}
              LegendItemTypes={<LegendItemTypes />}
            />
          )}
      </div>
    );
  }
}

MapLegend.propTypes = {
  layerGroups: PropTypes.array
};

export default MapLegend;
