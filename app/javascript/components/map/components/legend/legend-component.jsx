import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Legend,
  LegendItemToolbar,
  LegendItemButtonLayers,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemButtonRemove,
  LegendItemTypes,
  LegendListItem,
  Icons
} from 'wri-api-components';

import Loader from 'components/ui/loader';
import Timeline from 'components/timeline';

import './legend-styles.scss';

class MapLegend extends Component {
  render() {
    const {
      layerGroups,
      onChangeOrder,
      onChangeTimeline,
      loading,
      ...rest
    } = this.props;
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
              {layerGroups.map((lg, i) => {
                const activeLayer = lg.layers.find(l => l.active);
                const { decodeParams, legendConfig } = activeLayer;
                return (
                  <LegendListItem
                    index={i}
                    key={lg.id}
                    layerGroup={lg}
                    toolbar={
                      <LegendItemToolbar {...rest}>
                        <LegendItemButtonLayers />
                        <LegendItemButtonOpacity />
                        <LegendItemButtonVisibility />
                        <LegendItemButtonInfo />
                        <LegendItemButtonRemove />
                      </LegendItemToolbar>
                    }
                  >
                    <LegendItemTypes />
                    {decodeParams &&
                      decodeParams.startDate && (
                        <Timeline
                          className="timeline"
                          handleChange={range =>
                            onChangeTimeline(activeLayer, range)
                          }
                          {...decodeParams}
                          customColor={
                            legendConfig &&
                            legendConfig.items &&
                            legendConfig.items[0].color
                          }
                        />
                      )}
                  </LegendListItem>
                );
              })}
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
  onChangeOrder: PropTypes.func,
  onChangeTimeline: PropTypes.func
};

export default MapLegend;
