import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Legend,
  LegendItemToolbar,
  LegendItemTypes,
  LegendListItem,
  Icons
} from 'wri-api-components';

import './legend-styles.scss';

class MapLegend extends Component {
  render() {
    const { layerGroups, ...rest } = this.props;
    return (
      <div className="c-legend">
        <Icons />
        {layerGroups &&
          !!layerGroups.length && (
            <Legend layerGroups={layerGroups} collapsable={false}>
              {layerGroups.map((lg, i) => (
                <LegendListItem
                  index={i}
                  key={lg.id}
                  layerGroup={lg}
                  toolbar={<LegendItemToolbar {...rest} />}
                >
                  <LegendItemTypes />
                </LegendListItem>
              ))}
            </Legend>
          )}
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
