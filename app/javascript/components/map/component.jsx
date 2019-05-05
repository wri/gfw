import React, { Component, Fragment } from './node_modules/react';
import PropTypes from './node_modules/prop-types';

import debounce from './node_modules/lodash/debounce';
import isEmpty from './node_modules/lodash/isEmpty';
import isEqual from './node_modules/lodash/isEqual';

import { Popup } from './node_modules/react-map-gl';

// Components
import { Map } from '../mapbox-map';
import LayerManager from './layer-manager';
import Legend from './legend';

// Styles
import './styles.scss';

class MapComponent extends Component {
  static propTypes = {
    viewport: PropTypes.shape().isRequired,
    bounds: PropTypes.shape(),
    interactions: PropTypes.shape(),
    mapStyle: PropTypes.string.isRequired,
    setMapViewport: PropTypes.func.isRequired,
    setMapInteractions: PropTypes.func.isRequired,
    mapLabels: PropTypes.array,
    mapRoads: PropTypes.array,
    setFullscreen: PropTypes.func,
    setMapHoverInteractions: PropTypes.func
  };

  static defaultProps = {
    bounds: {}
  };

  state = {
    popup: {}
  };

  componentDidUpdate(prevProps) {
    const {
      mapLabels,
      mapRoads,
      interactions,
      viewport,
      setMapViewport,
      setFullscreen
    } = this.props;
    const {
      mapLabels: prevMapLabels,
      mapRoads: prevMapRoads,
      interactions: prevInteractions
    } = prevProps;

    if (mapLabels !== prevMapLabels) {
      this.setLabels();
    }

    if (mapRoads !== prevMapRoads) {
      this.setRoads();
    }

    if (!isEqual(interactions, prevInteractions)) {
      Object.keys(interactions).map(k => {
        const { data, geometry } = interactions[k];

        if (data && (data.type === 'photo' || data.type === '360')) {
          setFullscreen({
            open: true,
            data: {
              ...data,
              files: JSON.parse(data.files)
            }
          });
        }

        if (data && data.type === 'video') {
          setFullscreen({
            open: true,
            data
          });
        }

        if (data && data.cluster) {
          const { zoom } = viewport;

          this.map
            .getSource(k)
            .getClusterExpansionZoom(data.cluster_id, (err, newZoom) => {
              if (err) return;
              const { coordinates } = geometry;
              const difference = Math.abs(zoom - newZoom);

              setMapViewport({
                latitude: coordinates[1],
                longitude: coordinates[0],
                zoom: newZoom,
                transitionDuration: 400 + difference * 100
              });
            });
        }

        return true;
      });
    }
  }

  onViewportChange = debounce(viewport => {
    const { setMapViewport } = this.props;
    setMapViewport(viewport);
  }, 250);

  onStyleLoad = () => {
    this.setLabels();
    this.setRoads();
  };

  onLoad = ({ map }) => {
    this.map = map;

    // Labels
    this.setLabels();
    this.setRoads();

    // Listeners
    this.map.on('style.load', this.onStyleLoad);
  };

  onClick = e => {
    if (e.features && e.features.length) {
      const { features, lngLat } = e;
      const { setMapInteractions } = this.props;
      setMapInteractions({ features, lngLat });
    }
  };

  onHover = debounce(e => {
    const { setMapHoverInteractions } = this.props;

    if (e.features && e.features.length) {
      const { features, lngLat } = e;
      setMapHoverInteractions({ features, lngLat });
    } else {
      setMapHoverInteractions({});
    }
  }, 50);

  setLabels = () => {
    const LABELS_GROUP = ['labels'];

    const { mapLabels } = this.props;
    const { layers, metadata } = this.map.getStyle();

    const groups = Object.keys(metadata['mapbox:groups']).filter(k => {
      const { name } = metadata['mapbox:groups'][k];
      const roadGroups = LABELS_GROUP.map(rgr =>
        name.toLowerCase().includes(rgr)
      );

      return roadGroups.some(bool => bool);
    });

    const labelLayers = layers.filter(l => {
      const labelMetadata = l.metadata;
      if (!labelMetadata) return false;

      const gr = labelMetadata['mapbox:group'];
      return groups.includes(gr);
    });

    labelLayers.forEach(l => {
      const visibility = mapLabels ? 'visible' : 'none';
      this.map.setLayoutProperty(l.id, 'visibility', visibility);
    });
  };

  setRoads = () => {
    const ROADS_GROUP = ['roads', 'bridges', 'tunnels'];

    const { mapRoads } = this.props;
    const { layers, metadata } = this.map.getStyle();

    const groups = Object.keys(metadata['mapbox:groups']).filter(k => {
      const { name } = metadata['mapbox:groups'][k];
      const roadGroups = ROADS_GROUP.map(rgr =>
        name.toLowerCase().includes(rgr)
      );

      return roadGroups.some(bool => bool);
    });

    const roadLayers = layers.filter(l => {
      const roadMetadata = l.metadata;
      if (!roadMetadata) return false;

      const gr = roadMetadata['mapbox:group'];
      return groups.includes(gr);
    });

    roadLayers.forEach(l => {
      const visibility = mapRoads ? 'visible' : 'none';
      this.map.setLayoutProperty(l.id, 'visibility', visibility);
    });
  };

  render() {
    const { mapStyle, viewport, bounds } = this.props;
    const { popup } = this.state;

    return (
      <div className="c-map">
        <Map
          mapStyle={mapStyle}
          viewport={viewport}
          bounds={bounds}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onViewportChange={this.onViewportChange}
          onClick={this.onClick}
          onHover={this.onHover}
          onLoad={this.onLoad}
          // interactiveLayerIds={['media']}
        >
          {map => (
            <Fragment>
              {/* POPUP */}
              {!isEmpty(popup) && (
                <Popup
                  {...popup}
                  closeButton
                  closeOnClick={false}
                  onClose={() => this.setState({ popup: {} })}
                >
                  <div>
                    You are lat: {popup.latitude} - lng: {popup.longitude}
                  </div>
                </Popup>
              )}

              {/* LAYER MANAGER */}
              <LayerManager map={map} />
            </Fragment>
          )}
        </Map>

        <Legend />
      </div>
    );
  }
}

export default MapComponent;
