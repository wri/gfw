import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import { format } from 'd3-format';

import Map from 'wri-api-components/dist/map';

import { LayerManager, Layer } from 'layer-manager/dist/react';
import { PluginLeaflet } from 'layer-manager';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Icon from 'components/ui/icon';
import iconCross from 'assets/icons/close.svg';

import Popup from './components/popup';
import MapControlButtons from './components/map-controls';
import MapAttributions from './components/map-attributions';

import './styles.scss';

class MapComponent extends PureComponent {
  state = {
    showTooltip: false,
    tooltipData: {}
  };

  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
      L.control.scale({ maxWidth: 80 }).addTo(this.map); // eslint-disable-line
    });
  }

  renderTooltip = data => (
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

  handleShowTooltip = (show, data) => {
    this.setState({ showTooltip: show, tooltipData: data });
  };

  render() {
    const {
      loading,
      error,
      activeLayers,
      mapOptions,
      basemap,
      label,
      setMapSettings,
      bbox,
      geostore,
      setInteraction,
      tileGeoJSON,
      setRecentImagerySettings
    } = this.props;

    return (
      <div style={{ backgroundColor: basemap.color }}>
        <Tooltip
          theme="tip"
          hideOnClick
          html={
            <Tip
              className="map-hover-tooltip"
              text={this.renderTooltip(this.state.tooltipData)}
            />
          }
          position="top"
          followCursor
          animateFill={false}
          open={this.state.showTooltip}
        >
          <Map
            customClass="c-map"
            onReady={map => {
              this.map = map;
            }}
            mapOptions={mapOptions}
            basemap={basemap}
            label={label}
            bounds={bbox}
            events={{
              moveend: (e, map) => {
                setMapSettings({
                  zoom: map.getZoom(),
                  center: map.getCenter()
                });
              }
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
                            id={geostore.id}
                            name="Geojson"
                            provider="leaflet"
                            layerConfig={{
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
                              setRecentImagerySettings({ visible: true });
                            },
                            mouseover: e => {
                              const data = e.layer.feature.properties;
                              const { cloudScore, instrument, dateTime } = data;
                              this.handleShowTooltip(true, {
                                instrument: startCase(instrument),
                                date: moment(dateTime)
                                  .format('DD MMM YYYY, HH:mm')
                                  .toUpperCase(),
                                cloudCoverage: `${format('.0f')(cloudScore)}%`
                              });
                            },
                            mouseout: () => {
                              this.handleShowTooltip(false, {});
                            }
                          }}
                        />
                      )}
                      {activeLayers.map(l => {
                        const { interactionConfig, isBoundary } = l;
                        const { output, article } = interactionConfig || {};
                        const layer = {
                          ...l,
                          ...(!isEmpty(output) && {
                            interactivity: output.map(i => i.column),
                            events: {
                              click: e => {
                                if (!this.state.showTooltip) {
                                  setInteraction({
                                    ...e,
                                    label: l.name,
                                    article,
                                    isBoundary,
                                    id: l.id,
                                    value: l.id,
                                    config: output
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
                <Popup map={map} />
                <MapControlButtons className="map-controls" map={map} />
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
  setMapSettings: PropTypes.func,
  setInteraction: PropTypes.func,
  bbox: PropTypes.object,
  recentImagery: PropTypes.bool,
  recentTileBounds: PropTypes.array,
  setRecentImagerySettings: PropTypes.func,
  geostore: PropTypes.object,
  tileGeoJSON: PropTypes.object
};

export default MapComponent;
