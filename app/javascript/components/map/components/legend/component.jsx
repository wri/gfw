import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {
  Legend,
  LegendListItem,
  LegendItemTypes,
  LegendItemToolbar,
  LegendItemButtonOpacity,
  LegendItemButtonInfo,
  LegendItemButtonRemove,
  Icons
} from 'vizzuality-components';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import SentenceSelector from 'components/sentence-selector';

import Timeline from './components/timeline';
import LayerListMenu from './components/layer-list-menu';
import LayerSelectorMenu from './components/layer-selector-menu';
import LayerStatement from './components/layer-statement';
import LayerMoreInfo from './components/layer-more-info';

import './styles.scss';
import './themes/vizzuality-legend.scss';

const MapLegend = ({
  layerGroups,
  onChangeOrder,
  onChangeTimeline,
  onChangeThreshold,
  onToggleLayer,
  onChangeLayer,
  onChangeParam,
  onChangeDecodeParam,
  onChangeInfo,
  loading,
  className,
  ...rest
}) => {
  const noLayers = !layerGroups || !layerGroups.length;

  return (
    <div className={cx('c-legend', { '-empty': noLayers }, className)}>
      <Icons />
      {loading && <Loader className="datasets-loader" />}
      {!loading && noLayers && <NoContent message="No layers selected" />}
      {!loading &&
        layerGroups &&
        !!layerGroups.length && (
        <Legend
          layerGroups={layerGroups}
          collapsable={false}
          onChangeOrder={onChangeOrder}
        >
          {layerGroups.map((lg, i) => {
            const {
              isSelectorLayer,
              isMultiLayer,
              isMultiSelectorLayer,
              selectorLayerConfig,
              color,
              metadata,
              id,
              layers,
              statementConfig,
              name
            } =
                lg || {};

            const activeLayer = layers && layers.find(l => l.active);
            const {
              params,
              paramsSelectorConfig,
              decodeParams,
              decodeParamsSelectorConfig,
              moreInfo,
              timelineParams
            } =
                activeLayer || {};

            return (
              <LegendListItem
                index={i}
                key={id}
                layerGroup={lg}
                toolbar={(
                  <LegendItemToolbar
                    {...rest}
                    enabledStyle={{
                      fill: color || '#97be32'
                    }}
                    defaultStyle={{
                      fill: '#999'
                    }}
                    disabledStyle={{
                      fill: '#d6d6d9'
                    }}
                    focusStyle={{
                      fill: '#676867'
                    }}
                    onChangeInfo={() => onChangeInfo(metadata)}
                  >
                    <LegendItemButtonOpacity
                      className="-plain"
                      handleStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        border: 0,
                        boxShadow: 'rgba(0, 0, 0, 0.29) 0px 1px 2px 0px'
                      }}
                      trackStyle={[
                        { backgroundColor: color || '#97be32' },
                        { backgroundColor: '#d6d6d9' }
                      ]}
                    />
                    {metadata && <LegendItemButtonInfo />}
                    <LegendItemButtonRemove />
                  </LegendItemToolbar>
                )}
              >
                <LegendItemTypes />
                {statementConfig && (
                  <LayerStatement
                    className="layer-statement"
                    {...statementConfig}
                  />
                )}
                {activeLayer &&
                    paramsSelectorConfig &&
                    params &&
                    paramsSelectorConfig.map(
                      paramConfig =>
                        (paramConfig.options ? (
                          <SentenceSelector
                            key={`${activeLayer.name}-${paramConfig.key}`}
                            name={name}
                            className="param-selector"
                            {...paramConfig}
                            value={
                              params[paramConfig.key] || paramConfig.default
                            }
                            onChange={e =>
                              onChangeParam(activeLayer, {
                                [paramConfig.key]: e
                              })}
                          />
                        ) : null)
                    )}
                {activeLayer &&
                    decodeParamsSelectorConfig &&
                    decodeParams &&
                    decodeParamsSelectorConfig.map(
                      paramConfig =>
                        (paramConfig.options ? (
                          <SentenceSelector
                            key={`${activeLayer.name}-${paramConfig.key}`}
                            name={name}
                            className="param-selector"
                            {...paramConfig}
                            value={
                              decodeParams[paramConfig.key] ||
                              paramConfig.default
                            }
                            onChange={e =>
                              onChangeDecodeParam(activeLayer, {
                                [paramConfig.key]: parseInt(e, 10)
                              })}
                          />
                        ) : null)
                    )}
                {(isSelectorLayer || isMultiSelectorLayer) &&
                    selectorLayerConfig && (
                    <LayerSelectorMenu
                      className="layer-selector"
                      layerGroup={lg}
                      name={name}
                      multi={isMultiSelectorLayer}
                      onChange={onChangeLayer}
                      {...selectorLayerConfig}
                    />
                )}
                {timelineParams && (
                  <Timeline
                    {...timelineParams}
                    handleChange={onChangeTimeline}
                  />
                )}
                {isMultiLayer && (
                  <LayerListMenu
                    className="sub-layer-menu"
                    layers={lg.layers}
                    onToggle={onToggleLayer}
                    onInfoClick={onChangeInfo}
                  />
                )}
                {moreInfo && (
                  <LayerMoreInfo className="more-info" {...moreInfo} />
                )}
              </LegendListItem>
            );
          })}
        </Legend>
      )}
    </div>
  );
}

MapLegend.propTypes = {
  className: PropTypes.string,
  layerGroups: PropTypes.array,
  loading: PropTypes.bool,
  onChangeOrder: PropTypes.func,
  onChangeTimeline: PropTypes.func,
  onChangeThreshold: PropTypes.func,
  onToggleLayer: PropTypes.func,
  onChangeParam: PropTypes.func,
  onChangeDecodeParam: PropTypes.func,
  onChangeLayer: PropTypes.func,
  onChangeInfo: PropTypes.func,
  layers: PropTypes.array
};

export default MapLegend;
