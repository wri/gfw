import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Legend,
  LegendItemToolbar,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemButtonRemove,
  LegendItemTypes,
  LegendListItem,
  Icons
} from 'wri-api-components';

import Loader from 'components/ui/loader';

import './legend-styles.scss';

class MapLegend extends Component {
  render() {
    const { layerGroups, onChangeOrder, loading, ...rest } = this.props;
    return (
      <div className="c-legend">
        <Icons />
        {loading && <Loader />}
        {!loading &&
          layerGroups &&
          !!layerGroups.length && (
            <Legend
              layerGroups={layerGroups}
              collapsable={false}
              onChangeOrder={onChangeOrder}
            >
              {layerGroups.map((lg, i) => (
                <LegendListItem
                  index={i}
                  key={lg.id}
                  layerGroup={lg}
                  toolbar={
                    <LegendItemToolbar {...rest}>
                      <LegendItemButtonOpacity />
                      <LegendItemButtonVisibility />
                      <LegendItemButtonInfo />
                      <LegendItemButtonRemove />
                    </LegendItemToolbar>
                  }
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
  layerGroups: PropTypes.array,
  loading: PropTypes.bool,
  onChangeOrder: PropTypes.func
};

export default MapLegend;
