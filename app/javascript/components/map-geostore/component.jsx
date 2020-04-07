import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import cx from 'classnames';
import ContentLoader from 'react-content-loader';

import Map from 'components/ui/map';

import { getGeostoreProvider } from 'services/geostore';
import { buildGeostore } from 'utils/geoms';

import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl, fetch } from 'layer-manager';

import { TRANSITION_EVENTS } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';

import './styles.scss';

const DEFAULT_VIEWPORT = {
  zoom: 2,
  lat: 0,
  lng: 0
};

class MapGeostore extends Component {
  static propTypes = {
    basemap: PropTypes.object,
    className: PropTypes.string,
    padding: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    cursor: PropTypes.string,
    small: PropTypes.bool,
    location: PropTypes.object
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
    const { location } = this.props;
    if (location && location.adm0) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;

    if (location && !isEqual(location, prevLocation)) {
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
      getGeostoreProvider(this.props.location)
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
    if (map) {
      map.on('render', () => {
        if (map.areTilesLoaded() && this.mounted) {
          this.setState({ loading: false });
          map.off('render');
        }
      });
    }
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
    const { basemap, className, width, height, cursor, small } = this.props;
    const { loading, viewport, geostore, error } = this.state;

    return (
      <div
        id="recent-image-map"
        className={cx('c-recent-image-map', className, { small })}
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
          >
            {map => (
              <LayerManager
                map={map}
                plugin={PluginMapboxGl}
                providers={{
                  stories: (layerModel, layer, resolve, reject) => {
                    const { source } = layerModel;
                    const { provider } = source;

                    fetch('get', provider.url, provider.options, layerModel)
                      .then(response =>
                        resolve({
                          ...layer,
                          source: {
                            ...omit(layer.source, 'provider'),
                            data: {
                              type: 'FeatureCollection',
                              features: response.rows.map(r => ({
                                type: 'Feature',
                                properties: r,
                                geometry: {
                                  type: 'Point',
                                  coordinates: [r.lon, r.lat]
                                }
                              }))
                            }
                          }
                        })
                      )
                      .catch(e => {
                        reject(e);
                      });
                  }
                }}
              >
                {geostore && (
                  <Layer
                    id={geostore.id}
                    name="Geojson"
                    type="geojson"
                    source={{
                      data: geostore.geojson,
                      type: 'geojson'
                    }}
                    render={{
                      layers: [
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
                    }}
                    zIndex={1060}
                  />
                )}
                <Layer
                  key={basemap.url}
                  id={basemap.url}
                  name="Basemap"
                  type="raster"
                  source={{
                    type: 'raster',
                    tiles: [basemap.url]
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
