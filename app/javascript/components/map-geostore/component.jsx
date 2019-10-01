import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import ContentLoader from 'react-content-loader';

import Map from 'components/ui/map';

import { getGeostoreProvider } from 'services/geostore';
import { buildGeostore } from 'utils/geoms';

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

class MapGeostore extends Component {
  static propTypes = {
    basemap: PropTypes.object,
    geostoreId: PropTypes.string,
    className: PropTypes.string,
    padding: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    cursor: PropTypes.string
  };

  static defaultProps = {
    padding: 25,
    height: 140,
    width: 140,
    cursor: 'default'
  };

  state = {
    loading: true,
    error: false,
    viewport: DEFAULT_VIEWPORT,
    geostore: null
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    const { geostoreId } = this.props;
    if (geostoreId) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { geostoreId } = this.props;
    const { geostoreId: prevGeostoreId } = prevProps;

    if (geostoreId && !isEqual(geostoreId, prevGeostoreId)) {
      this.handleGetGeostore();
    }

    const { geostore } = this.state;
    const { geostore: prevGeostore } = prevState;

    if (!isEmpty(geostore) && !isEqual(geostore, prevGeostore)) {
      this.fitBounds();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleGetGeostore = () => {
    if (this.mounted) {
      this.setState({ error: false });
      getGeostoreProvider({ type: 'geostore', adm0: this.props.geostoreId })
        .then(response => {
          if (this.mounted) {
            const { data } = response.data || {};
            const geostore = buildGeostore(
              { id: data.id, ...data.attributes },
              this.props
            );
            this.setState({ geostore });
          }
        })
        .catch(err => {
          console.error(err);
          if (this.mounted) {
            this.setState({ error: true });
          }
        });
    }
  };

  onLoad = ({ map }) => {
    map.on('render', () => {
      if (map.areTilesLoaded() && this.mounted) {
        this.setState({ loading: false });
        map.off('render');
      }
    });
  };

  fitBounds = () => {
    const { viewport, geostore } = this.state;
    const { bbox } = geostore;

    const v = {
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
      ...viewport
    };

    const { longitude, latitude, zoom } = new WebMercatorViewport(v).fitBounds(
      [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
      { padding: this.props.padding }
    );

    if (this.mounted) {
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
    }
  };

  render() {
    const { basemap, className, width, height, cursor } = this.props;
    const { loading, viewport, geostore, error } = this.state;

    return (
      <div
        id="recent-image-map"
        className={cx('c-recent-image-map', className)}
        ref={r => {
          this.mapContainer = r;
        }}
      >
        {loading && (
          <ContentLoader
            width={width}
            height={height}
            style={{ width: '100%' }}
          >
            <rect x="0" y="0" width={width} height="100%" />
          </ContentLoader>
        )}
        {error &&
          !loading && (
          <p className="error-msg">we had trouble finding a recent image</p>
        )}
        {basemap && (
          <Map
            mapStyle={basemap.mapStyle}
            viewport={viewport}
            attributionControl={false}
            onLoad={this.onLoad}
            dragPan={false}
            dragRotate={false}
            scrollZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            touchRotate={false}
            keyboard={false}
            getCursor={() => cursor}
            reuseMaps
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
                  key={basemap.url}
                  id={basemap.url}
                  name="Basemap"
                  provider="leaflet"
                  layerConfig={{
                    body: {
                      url: basemap.url
                    }
                  }}
                  zIndex={100}
                />
              </LayerManager>
            )}
          </Map>
        )}
      </div>
    );
  }
}

export default MapGeostore;
