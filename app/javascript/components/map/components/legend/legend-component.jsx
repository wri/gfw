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
import Timeline from 'components/timeline';
import Dropdown from 'components/ui/dropdown';
import LayerToggle from 'pages/map/menu/components/layer-toggle';

import './legend-styles.scss';

const thresholdOptions = [
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
  { label: '20%', value: 20 },
  { label: '25%', value: 25 },
  { label: '30%', value: 30 },
  { label: '50%', value: 50 },
  { label: '75%', value: 75 }
];

class MapLegend extends Component {
  render() {
    const {
      layerGroups,
      onChangeOrder,
      onChangeTimeline,
      onChangeThreshold,
      onToggleLayer,
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
                const {
                  decodeParams,
                  legendConfig,
                  decodeFunction,
                  params
                } = activeLayer;

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
                    {lg.layers &&
                      lg.layers.length > 1 && (
                        <div className="multi-layer-menu">
                          {lg.layers.map((l, index) => (index ? (
                            <div className="layer-toggle" key={l.id}>
                              <LayerToggle
                                data={{ ...l, layer: l.id }}
                                onToggle={onToggleLayer}
                              />
                            </div>
                          ) : null))}
                        </div>
                      )}
                    {params &&
                      (params.thresh || params.threshold) && (
                        <div className="threshold">
                          <span >{`Displaying ${activeLayer.name.toLowerCase()} with`}</span>
                          <Dropdown
                            className="thresh-dropdown"
                            theme="theme-dropdown-button-small"
                            value={params.thresh || params.threshold}
                            options={thresholdOptions}
                            onChange={value =>
                              onChangeThreshold(activeLayer, value.value)
                            }
                          />
                          <span>canopy density.</span>
                        </div>
                      )}
                    {decodeFunction &&
                      decodeParams &&
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
  onChangeTimeline: PropTypes.func,
  onChangeThreshold: PropTypes.func,
  onToggleLayer: PropTypes.func
};

export default MapLegend;
