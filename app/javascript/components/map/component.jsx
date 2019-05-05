import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { handleMapLatLonTrack } from 'app/analytics';

// import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import Map from 'components/mapbox-map';

import iconCrosshair from 'assets/icons/crosshair.svg';

// import MapScale from './components/scale';
// import Popup from './components/popup';
// import MapDraw from './components/draw';
// import MapAttributions from './components/map-attributions';

// Components
import LayerManager from './components/layer-manager';

// Styles
import './styles.scss';

class MapComponent extends Component {
  static propTypes = {
    viewport: PropTypes.shape().isRequired,
    bounds: PropTypes.shape(),
    mapStyle: PropTypes.string.isRequired,
    setMapSettings: PropTypes.func.isRequired,
    setMapInteractions: PropTypes.func.isRequired,
    mapLabels: PropTypes.array,
    mapRoads: PropTypes.array,
    location: PropTypes.object,
    interactiveLayerIds: PropTypes.array,
    draw: PropTypes.bool,
    canBound: PropTypes.bool,
    dataBbox: PropTypes.array,
    geostoreBbox: PropTypes.array,
    selectedInteraction: PropTypes.object,
    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired
  };

  static defaultProps = {
    bounds: {}
  };

  state = {
    bounds: {}
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      mapLabels,
      mapRoads,
      setMapSettings,
      canBound,
      dataBbox,
      geostoreBbox,
      selectedInteraction,
      viewport
    } = this.props;
    const {
      mapLabels: prevMapLabels,
      mapRoads: prevMapRoads,
      dataBbox: prevDataBbox,
      geostoreBbox: prevGeostoreBbox,
      selectedInteraction: prevSelectInteraction
    } = prevProps;

    if (mapLabels !== prevMapLabels) {
      this.setLabels();
    }

    if (mapRoads !== prevMapRoads) {
      this.setRoads();
    }

    // if bbox is change by action fit bounds
    if (canBound && dataBbox !== prevDataBbox) {
      // eslint-disable-next-line
      this.setState({ bounds: { bbox: dataBbox, options: { padding: 50 } } });
    }

    // if geostore changes
    if (canBound && geostoreBbox && geostoreBbox !== prevGeostoreBbox) {
      // eslint-disable-next-line
      this.setState({
        bounds: { bbox: geostoreBbox, options: { padding: 50 } }
      });
    }

    // reset canBound after fitting bounds
    if (this.state.bounds && this.state.bounds !== prevState.bounds) {
      setMapSettings({ canBound: false });
    }

    // fit bounds on cluster if clicked
    if (
      selectedInteraction &&
      !isEqual(selectedInteraction, prevSelectInteraction) &&
      selectedInteraction.data.cluster
    ) {
      const { data, layer, geometry } = selectedInteraction;
      this.map
        .getSource(layer.id)
        .getClusterExpansionZoom(data.cluster_id, (err, newZoom) => {
          if (err) return;
          const { coordinates } = geometry;
          const difference = Math.abs(viewport.zoom - newZoom);
          setMapSettings({
            viewport: {
              latitude: coordinates[1],
              longitude: coordinates[0],
              zoom: newZoom,
              transitionDuration: 400 + difference * 100
            }
          });
        });
    }
  }

  onViewportChange = debounce(viewport => {
    const { setMapSettings, location } = this.props;
    const { latitude, longitude, bearing, pitch, zoom } = viewport;
    setMapSettings({
      viewport: {
        latitude,
        longitude,
        bearing,
        pitch,
        zoom
      }
    });
    handleMapLatLonTrack(location);
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
    const { draw } = this.props;
    if (!draw && e.features && e.features.length) {
      const { features, lngLat } = e;
      const { setMapInteractions } = this.props;
      setMapInteractions({ features, lngLat });
    }
  };

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
    const {
      mapStyle,
      viewport,
      minZoom,
      maxZoom,
      interactiveLayerIds
      // loading,
      // loadingMessage,
      // smallView
    } = this.props;

    return (
      <div className="c-map">
        <Map
          mapStyle={mapStyle}
          viewport={viewport}
          bounds={this.state.bounds}
          onViewportChange={this.onViewportChange}
          onClick={this.onClick}
          onLoad={this.onLoad}
          interactiveLayerIds={interactiveLayerIds}
          attributionControl={false}
          minZoom={minZoom}
          maxZoom={maxZoom}
        >
          {map => (
            <Fragment>
              {/* POPUP */}

              {/* LAYER MANAGER */}
              <LayerManager map={map} />
            </Fragment>
          )}
        </Map>
        <Icon className="map-icon-crosshair" icon={iconCrosshair} />
        {/* <MapAttributions className="map-attributions" smallView={smallView} />
        <MapScale className="map-scale" map={this.map} viewport={viewport} />
        {loading && (
          <Loader
            className="map-loader"
            theme="theme-loader-light"
            message={loadingMessage}
          />
        )} */}
      </div>
    );
  }
}

export default MapComponent;
