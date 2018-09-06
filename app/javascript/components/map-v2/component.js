import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Map from 'wri-api-components/dist/map';

import { LayerManager, Layer } from 'layer-manager/dist/react';
import { PluginLeaflet } from 'layer-manager';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Icon from 'components/ui/icon';
import iconCross from 'assets/icons/close.svg';

import Popup from './components/popup';
import MapControlButtons from './components/map-controls';
import MapAttributions from './components/map-attributions';

import './styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
      L.control.scale({ maxWidth: 80 }).addTo(this.map); // eslint-disable-line
    });
  }

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
      <Fragment>
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
            zoomend: (e, map) => {
              setMapSettings({ zoom: map.getZoom(), center: map.getCenter() });
            },
            dragend: (e, map) => {
              setMapSettings({ center: map.getCenter() });
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
                          click: e => {
                            e.originalEvent.preventDefault();
                            e.originalEvent.stopPropagation();
                            setRecentImagerySettings({ visible: true });
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
        <Icon className="icon-crosshair" icon={iconCross} />
        <MapAttributions className="map-attributions" />
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        {!loading &&
          error && (
            <NoContent message="An error occured. Please try again later." />
          )}
      </Fragment>
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
