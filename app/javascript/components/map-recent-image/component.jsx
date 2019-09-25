import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';

import Loader from 'components/ui/loader';
import Map from 'components/ui/map';

import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';

import { TRANSITION_EVENTS } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';

// Styles
import './styles.scss';

const DEFAULT_VIEWPORT = {
  zoom: 2,
  lat: 0,
  lng: 0
};

class MapComponent extends Component {
  static propTypes = {
    basemap: PropTypes.object.isRequired,
    geostore: PropTypes.object.isRequired,
    className: PropTypes.string,
    onLoad: PropTypes.object.isRequired
  };

  static defaultProps = {
    bounds: {}
  };

  state = {
    loading: true,
    viewport: DEFAULT_VIEWPORT
  };

  componentDidMount() {
    const { geostore } = this.props;
    if (!isEmpty(geostore)) {
      this.fitBounds();
    }
  }

  componentDidUpdate(prevProps) {
    const { geostore } = this.props;
    const { geostore: prevGeostore } = prevProps;

    if (!isEmpty(geostore) && !isEqual(geostore, prevGeostore)) {
      this.fitBounds();
    }
  }

  onLoad = ({ map }) => {
    map.on('render', () => {
      if (map.areTilesLoaded()) {
        this.setState({ loading: false });
        this.props.onLoad(this.mapContainer);
        window.WEBSHOT_READY = true;
        map.off('render');
      }
    });
  };

  fitBounds = () => {
    const { viewport } = this.state;
    const { geostore } = this.props;
    const { bbox } = geostore;

    const v = {
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
      ...viewport
    };

    const { longitude, latitude, zoom } = new WebMercatorViewport(v).fitBounds(
      [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
      { padding: 50 }
    );

    this.setState({
      viewport: {
        ...this.state.viewport,
        longitude,
        latitude,
        zoom,
        transitionDuration: 0,
        transitionInterruption: TRANSITION_EVENTS.UPDATE
      }
    });
  };

  render() {
    const { basemap, geostore, className } = this.props;
    const { loading, viewport } = this.state;

    return (
      <div
        id="recent-image-map"
        className={cx('c-recent-image-map', className)}
        ref={r => {
          this.mapContainer = r;
        }}
      >
        {loading && <Loader className="tile-loader" />}
        <Map
          mapStyle={basemap.mapStyle}
          viewport={viewport}
          onViewportChange={() => {}}
          attributionControl={false}
          onLoad={this.onLoad}
          dragPan={false}
          dragRotate={false}
          scrollZoom={false}
          getCursor={() => 'default'}
          // visible={!loading}
        >
          {map => (
            <LayerManager map={map} plugin={PluginMapboxGl}>
              {geostore && (
                <Layer
                  id={geostore.id}
                  name="Geojson"
                  provider="geojson"
                  layerConfig={{
                    data: geostore.geojson,
                    body: {
                      vectorLayers: [
                        {
                          type: 'fill',
                          paint: {
                            'fill-color': 'transparent'
                          }
                        },
                        {
                          type: 'line',
                          paint: {
                            'line-color': '#C0FF24',
                            'line-width': 3,
                            'line-offset': 2
                          }
                        },
                        {
                          type: 'line',
                          paint: {
                            'line-color': '#000',
                            'line-width': 2
                          }
                        }
                      ]
                    }
                  }}
                  zIndex={1060}
                />
              )}
              <Layer
                id="https://tiles.planet.com/basemaps/v1/planet-tiles/global_quarterly_2019q2_mosaic/gmap/{z}/{x}/{y}.png?api_key=6c3405821fb84e659550848226615428"
                name="Basemap"
                provider="leaflet"
                layerConfig={{
                  body: {
                    url:
                      'https://tiles.planet.com/basemaps/v1/planet-tiles/global_quarterly_2019q2_mosaic/gmap/{z}/{x}/{y}.png?api_key=6c3405821fb84e659550848226615428'
                  }
                }}
                zIndex={100}
              />
            </LayerManager>
          )}
        </Map>
      </div>
    );
  }
}

export default MapComponent;
