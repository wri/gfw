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

import Timeline from './components/timeline';
import LayerListMenu from './components/layer-list-menu';
import ThresholdSelector from './components/threshold-selector';
import LayerSelectorMenu from './components/layer-selector-menu';

import './legend-styles.scss';

class MapLegend extends Component {
  render() {
    const {
      layerGroups,
      layers,
      onChangeOrder,
      onChangeTimeline,
      onChangeThreshold,
      onToggleLayer,
      onChangeLayer,
      onChangeInfo,
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
                const activeLayer = lg.layers.find(l => !!l.active);
                const { legendConfig, params, timelineConfig } = activeLayer;

                return (
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
                    {activeLayer &&
                      params &&
                      (params.thresh || params.threshold) && (
                        <ThresholdSelector
                          className="threshold"
                          threshold={params.thresh || params.threshold}
                          onChange={onChangeThreshold}
                          layer={activeLayer}
                        />
                      )}
                    {lg.layers &&
                      lg.layers.length > 1 && (
                        <LayerSelectorMenu
                          className="layer-selector"
                          layerGroup={lg}
                          layers={layers}
                          onChange={onChangeLayer}
                        />
                      )}
                    {timelineConfig && (
                      <Timeline
                        className="timeline"
                        handleChange={range =>
                          onChangeTimeline(activeLayer, range)
                        }
                        {...timelineConfig}
                        customColor={
                          legendConfig &&
                          legendConfig.items &&
                          legendConfig.items[0].color
                        }
                      />
                    )}
                    {lg.layers &&
                      lg.layers.length > 1 && (
                        <LayerListMenu
                          className="sub-layer-menu"
                          layers={lg.layers}
                          onToggle={onToggleLayer}
                          onInfoClick={onChangeInfo}
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
  onChangeTimeline: PropTypes.func,
  onChangeThreshold: PropTypes.func,
  onToggleLayer: PropTypes.func,
  onChangeLayer: PropTypes.func,
  onChangeInfo: PropTypes.func,
  layers: PropTypes.array
};

export default MapLegend;
