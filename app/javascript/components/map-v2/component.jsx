import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import cx from 'classnames';

import Map from 'wri-api-components/dist/map';
import { LayerManager, Layer } from 'layer-manager/lib/react';
import { PluginLeaflet } from 'layer-manager/lib';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Icon from 'components/ui/icon';
import iconCross from 'assets/icons/close.svg';

import Popup from './components/popup';
import MapControlButtons from './components/map-controls';
import MapDraw from './components/draw';
import MapAttributions from './components/map-attributions';

import './styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
      L.control.scale({ maxWidth: 80 }).addTo(this.map); // eslint-disable-line
    });
  }

  renderDataTooltip = data => (
    <div>
      {Object.keys(data).map(key => (
        <p key={key}>
          <strong>{upperFirst(startCase(key).toLowerCase())}</strong>:{' '}
          {data[key]}
        </p>
      ))}
      <p className="view-more">Click to view more.</p>
    </div>
  );

  renderInfoTooltip = string => (
    <div>
      <p className="tooltip-info">{string}</p>
    </div>
  );

  render() {
    const {
      loading,
      error,
      activeLayers,
      mapOptions,
      basemap,
      label,
      handleMapMove,
      geostore,
      tileGeoJSON,
      setRecentImagerySettings,
      query,
      tooltipData,
      bbox,
      showTooltip,
      handleShowTooltip,
      handleRecentImageryTooltip,
      analysisActive,
      handleMapInteraction,
      oneClickAnalysisActive,
      draw,
      embed
    } = this.props;

    return (
      <div
        className={cx()}
        style={{ backgroundColor: basemap.color }}
        onMouseOver={() =>
          oneClickAnalysisActive &&
          handleShowTooltip(true, 'Click shape to analyze.')
        }
        onMouseOut={() => handleShowTooltip(false, '')}
      >
        <Tooltip
          theme="tip"
          hideOnClick
          html={
            <Tip
              className="map-hover-tooltip"
              text={
                typeof tooltipData === 'string'
                  ? this.renderInfoTooltip(tooltipData)
                  : this.renderDataTooltip(tooltipData)
              }
            />
          }
          position="top"
          followCursor
          animateFill={false}
          open={showTooltip}
        >
          <Map
            customClass={cx('c-map', { analysis: analysisActive }, { embed })}
            onReady={map => {
              this.map = map;
            }}
            mapOptions={mapOptions}
            basemap={basemap}
            label={label}
            bounds={
              bbox
                ? {
                  bbox,
                  options: {
                    padding: [200, 10]
                  }
                }
                : {}
            }
            events={{
              zoomend: handleMapMove,
              dragend: handleMapMove
            }}
          >
            {map => (
              <Fragment>
                <LayerManager map={map} plugin={PluginLeaflet}>
                  {layerManager => (
                    <Fragment>
                      {geostore &&
                        geostore.id && (
                          <Layer
                            id="geostore"
                            name="Geojson"
                            provider="leaflet"
                            layerConfig={{
                              id: geostore.id,
                              type: 'geoJSON',
                              body: geostore.geojson,
                              options: {
                                style: {
                                  stroke: true,
                                  color: '#4a4a4a',
                                  weight: 2,
                                  fill: false
                                }
                              }
                            }}
                            layerManager={layerManager}
                          />
                        )}
                      {tileGeoJSON && (
                        <Layer
                          id="recentImagery"
                          name="Geojson"
                          provider="leaflet"
                          layerConfig={{
                            type: 'geoJSON',
                            body: tileGeoJSON,
                            options: {
                              style: {
                                stroke: false,
                                fillOpacity: 0
                              }
                            }
                          }}
                          layerManager={layerManager}
                          // Interaction
                          interactivity
                          events={{
                            click: () => {
                              if (!draw) {
                                setRecentImagerySettings({ visible: true });
                              }
                            },
                            mouseover: e => {
                              if (!draw) handleRecentImageryTooltip(e);
                            },
                            mouseout: () => {
                              if (!draw) handleShowTooltip(false, {});
                            }
                          }}
                        />
                      )}
                      {activeLayers.map(l => {
                        const { interactionConfig } = l;
                        const { output, article } = interactionConfig || {};
                        const layer = {
                          ...l,
                          ...(!isEmpty(output) && {
                            interactivity: output.map(i => i.column),
                            events: {
                              click: e => {
                                if (!draw) {
                                  handleMapInteraction({
                                    e,
                                    layer: l,
                                    article,
                                    output
                                  });
                                }
                              }
                            }
                          })
                        };

                        return (
                          <Layer
                            key={l.id}
                            {...layer}
                            layerManager={layerManager}
                          />
                        );
                      })}
                    </Fragment>
                  )}
                </LayerManager>
                <Popup map={map} query={query} />
                <MapControlButtons
                  className="map-controls"
                  map={map}
                  embed={embed}
                />
                {draw && <MapDraw map={map} />}
              </Fragment>
            )}
          </Map>
        </Tooltip>
        <Icon className="icon-crosshair" icon={iconCross} />
        <MapAttributions className="map-attributions" />
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        {!loading &&
          error && (
            <NoContent message="An error occured. Please try again later." />
          )}
      </div>
    );
  }
}

MapComponent.propTypes = {
  loading: PropTypes.bool,
  activeLayers: PropTypes.array,
  error: PropTypes.bool,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  label: PropTypes.object,
  handleMapMove: PropTypes.func,
  bboxs: PropTypes.object,
  recentImagery: PropTypes.bool,
  recentTileBounds: PropTypes.array,
  setRecentImagerySettings: PropTypes.func,
  geostore: PropTypes.object,
  tileGeoJSON: PropTypes.object,
  query: PropTypes.object,
  tooltipData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bbox: PropTypes.array,
  showTooltip: PropTypes.bool,
  handleShowTooltip: PropTypes.func,
  handleRecentImageryTooltip: PropTypes.func,
  handleMapInteraction: PropTypes.func,
  analysisActive: PropTypes.bool,
  oneClickAnalysisActive: PropTypes.bool,
  draw: PropTypes.bool,
  embed: PropTypes.bool
};

export default MapComponent;
