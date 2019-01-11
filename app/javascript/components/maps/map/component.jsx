import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Map from 'wri-api-components/dist/map';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import iconCrosshair from 'assets/icons/crosshair.svg';
import LayerSpecProvider from 'providers/layerspec-provider';

import Popup from './components/popup';
import MapDraw from './components/draw';
import MapAttributions from './components/map-attributions';
import LayerManagerComponent from './components/layer-manager';

import './styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
      L.control.scale({ maxWidth: 80 }).addTo(this.map); // eslint-disable-line

      const vectorTileStyling = {
        water: {
          fill: true,
          weight: 1,
          fillColor: '#06cccc',
          color: '#06cccc',
          fillOpacity: 0.2,
          opacity: 0.4,
        },
        admin: {
          weight: 1,
          fillColor: 'pink',
          color: 'pink',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        waterway: {
          weight: 1,
          fillColor: '#2375e0',
          color: '#2375e0',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        landcover: {
          fill: true,
          weight: 1,
          fillColor: '#53e033',
          color: '#53e033',
          fillOpacity: 0.2,
          opacity: 0.4,
        },
        landuse: {
          fill: true,
          weight: 1,
          fillColor: '#e5b404',
          color: '#e5b404',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        park: {
          fill: true,
          weight: 1,
          fillColor: '#84ea5b',
          color: '#84ea5b',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        boundary: {
          weight: 1,
          fillColor: '#c545d3',
          color: '#c545d3',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        aeroway: {
          weight: 1,
          fillColor: '#51aeb5',
          color: '#51aeb5',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        road: {	// mapbox & nextzen only
          weight: 1,
          fillColor: '#f2b648',
          color: '#f2b648',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        tunnel: {	// mapbox only
          weight: 0.5,
          fillColor: '#f2b648',
          color: '#f2b648',
          fillOpacity: 0.2,
          opacity: 0.4,
  // 					dashArray: [4, 4]
        },
        bridge: {	// mapbox only
          weight: 0.5,
          fillColor: '#f2b648',
          color: '#f2b648',
          fillOpacity: 0.2,
          opacity: 0.4,
  // 					dashArray: [4, 4]
        },
        transportation: {	// openmaptiles only
          weight: 0.5,
          fillColor: '#f2b648',
          color: '#f2b648',
          fillOpacity: 0.2,
          opacity: 0.4,
  // 					dashArray: [4, 4]
        },
        transit: {	// nextzen only
          weight: 0.5,
          fillColor: '#f2b648',
          color: '#f2b648',
          fillOpacity: 0.2,
          opacity: 0.4,
  // 					dashArray: [4, 4]
        },
        building: {
          fill: true,
          weight: 1,
          fillColor: '#2b2b2b',
          color: '#2b2b2b',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        water_name: {
          weight: 1,
          fillColor: '#022c5b',
          color: '#022c5b',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        transportation_name: {
          weight: 1,
          fillColor: '#bc6b38',
          color: '#bc6b38',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        place: {
          weight: 1,
          fillColor: '#f20e93',
          color: '#f20e93',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        housenumber: {
          weight: 1,
          fillColor: '#ef4c8b',
          color: '#ef4c8b',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        poi: {
          weight: 1,
          fillColor: '#3bb50a',
          color: '#3bb50a',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        earth: {	// nextzen only
          fill: true,
          weight: 1,
          fillColor: '#c0c0c0',
          color: '#c0c0c0',
          fillOpacity: 0.2,
          opacity: 0.4
        },
        // Do not symbolize some stuff for mapbox
        country_label: [],
        marine_label: [],
        state_label: [],
        place_label: [],
        waterway_label: [],
        poi_label: [],
        road_label: [],
        housenum_label: [],
        // Do not symbolize some stuff for openmaptiles
        country_name: [],
        marine_name: [],
        state_name: [],
        place_name: [],
        waterway_name: [],
        poi_name: [],
        road_name: [],
        housenum_name: [],
      };
      // Monkey-patch some properties for nextzen layer names, because
      // instead of "building" the data layer is called "buildings" and so on
      vectorTileStyling.buildings  = vectorTileStyling.building;
      vectorTileStyling.boundaries = vectorTileStyling.boundary;
      vectorTileStyling.places     = vectorTileStyling.place;
      vectorTileStyling.pois       = vectorTileStyling.poi;
      vectorTileStyling.roads      = vectorTileStyling.road;

      const mapboxVectorTileOptions = {
        rendererFactory: L.canvas.tile,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>',
        vectorTileLayerStyles: vectorTileStyling,
        token: 'pk.eyJ1IjoiaXZhbnNhbmNoZXoiLCJhIjoiY2l6ZTJmd3FnMDA0dzMzbzFtaW10cXh2MSJ9.VsWCS9-EAX4_4W1K-nXnsA'
      };

      const mvtSource = new L.VectorGrid.Protobuf('https://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={token}', mapboxVectorTileOptions);
      this.map.addLayer(mvtSource);
    });
  }

  render() {
    const {
      className,
      loading,
      mapOptions,
      basemap,
      label,
      bbox,
      draw,
      handleMapMove,
      handleMapInteraction,
      customLayers
    } = this.props;

    return (
      <div
        className={cx('c-map', className)}
        style={{ backgroundColor: basemap.color }}
      >
        <Map
          customClass="map-wrapper"
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
                  padding: [50, 50]
                }
              }
              : {}
          }
          events={{
            moveend: handleMapMove
          }}
        >
          {map => (
            <Fragment>
              <LayerManagerComponent
                map={map}
                customLayers={customLayers}
                handleMapInteraction={handleMapInteraction}
              />
              <Popup map={map} />
              {draw && <MapDraw map={map} />}
            </Fragment>
          )}
        </Map>
        <Icon className="map-icon-crosshair" icon={iconCrosshair} />
        <MapAttributions className="map-attributions" />
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        <LayerSpecProvider />
      </div>
    );
  }
}

MapComponent.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  label: PropTypes.object,
  handleMapMove: PropTypes.func,
  bbox: PropTypes.array,
  handleMapInteraction: PropTypes.func,
  customLayers: PropTypes.array,
  draw: PropTypes.bool
};

export default MapComponent;
