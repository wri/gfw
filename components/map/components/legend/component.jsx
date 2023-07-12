import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icons from 'components/icons'
import Legend, { 
  LegendItemToolbar, 
  LegendItemButtonOpacity, 
  LegendListItem,
  LegendItemTypes,
  LegendItemTypeBasic,
  LegendItemTypeProportional,
  LegendItemButtonInfo,
  LegendItemButtonRemove,
  Icons,
} from 'vizzuality-components';

import { LegendItemToolbar, LegendItemButtonOpacity } from 'components/legend'

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import SentenceSelector from 'components/sentence-selector';
import WidgetAlert from 'components/widget/components/widget-alert';

import Timeline from './components/timeline';
import LayerListMenu from './components/layer-list-menu';
import LayerSelectMenu from './components/layer-select-menu';
import LayerSelectorMenu from './components/layer-selector-menu';
import LayerStatement from './components/layer-statement';
import LayerMoreInfo from './components/layer-more-info';
import LegendItemTypeGradient from './components/legend-item-type-gradient';
import LegendItemTypeChoropleth from './components/legend-item-type-choropleth';

import './styles.scss';
import './themes/vizzuality-legend.scss';

const MapLegend = ({
  layerGroups,
  onChangeOrder,
  onChangeTimeline,
  onChangeThreshold,
  onToggleLayer,
  onSelectLayer,
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
      {!loading && layerGroups && !!layerGroups.length && (
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
              isToggleLayer,
              selectorLayerConfig,
              color,
              metadata,
              id,
              layers,
              alerts,
              caution_gladL,
              caution_radd,
              name,
            } = lg || {};

            const activeLayer = layers && layers.find((l) => l.active);
            const getWarningLabel = () => {
              switch (activeLayer?.id) {
                case 'integrated-deforestation-alerts-8bit':
                  if (caution_gladL && caution_radd) {
                    return `${caution_gladL}<br /><br />${caution_radd}`;
                  }
                  return null;
                case 'integrated-deforestation-alerts-8bit-gladL':
                  if (caution_gladL) {
                    return caution_gladL;
                  }
                  return null;
                case 'integrated-deforestation-alerts-8bit-radd':
                  if (caution_radd) {
                    return caution_radd;
                  }
                  return null;
                default:
                  return null;
              }
            };
            const warningLabel = getWarningLabel();

            const {
              id: layerId,
              params,
              paramsSelectorConfig,
              decodeParams,
              decodeParamsSelectorConfig,
              moreInfo,
              timelineParams,
              statementConfig,
            } = activeLayer || {};
            return (
              <LegendListItem
                index={i}
                key={id}
                layerGroup={lg}
                toolbar={(
                  <LegendItemToolbar
                    {...rest}
                    enabledStyle={{
                      fill: color || '#97be32',
                    }}
                    defaultStyle={{
                      fill: '#999',
                    }}
                    disabledStyle={{
                      fill: '#d6d6d9',
                    }}
                    focusStyle={{
                      fill: '#676867',
                    }}
                    onChangeInfo={() => onChangeInfo(metadata)}
                  >
                    <LegendItemButtonOpacity
                      className="-plain"
                      handleStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        border: 0,
                        boxShadow: 'rgba(0, 0, 0, 0.29) 0px 1px 2px 0px',
                      }}
                      trackStyle={[
                        { backgroundColor: color || '#97be32' },
                        { backgroundColor: '#d6d6d9' },
                      ]}
                    />
                    {metadata && <LegendItemButtonInfo />}
                    <LegendItemButtonRemove />
                  </LegendItemToolbar>
                )}
              >
                <LegendItemTypes>
                  <LegendItemTypeBasic />
                  <LegendItemTypeChoropleth dataset={layerId} />
                  <LegendItemTypeProportional />
                  <LegendItemTypeGradient />
                </LegendItemTypes>

                {isMultiLayer && (
                  <LayerSelectMenu
                    className="sub-layer-menu"
                    layers={lg.layers}
                    onSelectLayer={onSelectLayer}
                    onInfoClick={onChangeInfo}
                  />
                )}

                {isToggleLayer && selectorLayerConfig && (
                  <LayerSelectorMenu
                    className="layer-selector"
                    layerGroup={lg}
                    name={name}
                    multi={isMultiSelectorLayer}
                    toggle={isToggleLayer}
                    onChange={onChangeLayer}
                    {...selectorLayerConfig}
                  />
                )}

                {activeLayer &&
                  paramsSelectorConfig &&
                  params &&
                  paramsSelectorConfig.map((paramConfig) =>
                    paramConfig.options ? (
                      <SentenceSelector
                        key={`${activeLayer.name}-${paramConfig.key}`}
                        name={name}
                        className="param-selector"
                        {...paramConfig}
                        value={params[paramConfig.key] || paramConfig.default}
                        onChange={(e) => {
                          onChangeParam(activeLayer, {
                            [paramConfig.key]: e,
                          });
                        }}
                      />
                    ) : null
                  )}
                {activeLayer &&
                  decodeParamsSelectorConfig &&
                  decodeParams &&
                  decodeParamsSelectorConfig.map((paramConfig) =>
                    paramConfig.options ? (
                      <SentenceSelector
                        key={`${activeLayer.name}-${paramConfig.key}`}
                        name={name}
                        className="param-selector"
                        {...paramConfig}
                        value={
                          decodeParams[paramConfig.key] || paramConfig.default
                        }
                        onChange={(e) => {
                          onChangeDecodeParam(activeLayer, {
                            [paramConfig.key]: parseInt(e, 10),
                          });
                        }}
                      />
                    ) : null
                  )}
                {(isSelectorLayer || isMultiSelectorLayer) &&
                  !isToggleLayer &&
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
                {statementConfig && (
                  <LayerStatement
                    className="layer-statement"
                    {...statementConfig}
                  />
                )}
                {alerts &&
                  alerts.map((a) => (
                    <WidgetAlert
                      locationType="map"
                      alert={{
                        ...a,
                        visible: [
                          'wdpa',
                          'country',
                          'aoi',
                          'geostore',
                          'dashboard',
                          'map',
                        ],
                      }}
                    />
                  ))}
                {warningLabel && (
                  <WidgetAlert
                    locationType="map"
                    alert={{
                      text: warningLabel,
                      visible: [
                        'wdpa',
                        'country',
                        'aoi',
                        'geostore',
                        'dashboard',
                        'map',
                      ],
                    }}
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
};

MapLegend.defaultProps = {
  maxHeight: 300,
  LegendItemToolbar: <LegendItemToolbar />,
  LegendItemTypes: <LegendItemTypes />,
};

MapLegend.propTypes = {
  maxHeight: PropTypes.number,
  LegendItemToolbar: PropTypes.node,
  LegendItemTypes: PropTypes.node,
  className: PropTypes.string,
  layerGroups: PropTypes.array,
  loading: PropTypes.bool,
  onChangeOrder: PropTypes.func,
  onChangeTimeline: PropTypes.func,
  onChangeThreshold: PropTypes.func,
  onToggleLayer: PropTypes.func,
  onSelectLayer: PropTypes.func,
  onChangeParam: PropTypes.func,
  onChangeDecodeParam: PropTypes.func,
  onChangeLayer: PropTypes.func,
  onChangeInfo: PropTypes.func,
  layers: PropTypes.array,
};

export default MapLegend;
