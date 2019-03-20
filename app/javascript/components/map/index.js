import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';
import WebMercatorViewport from 'viewport-mercator-project';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMapProps } from './selectors';
import MapComponent from './component';

class MapContainer extends PureComponent {
  state = {
    bbox: null,
    width: 0,
    height: 0,
    map: null,
    zoom: this.props.zoom,
    lat: this.props.lat,
    lng: this.props.lng
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      canBound,
      bbox,
      geostoreBbox,
      setMapSettings,
      layerBbox,
      selectedInteraction,
      clearMapInteractions,
      lat,
      lng,
      zoom
    } = this.props;

    // if a new layer contains a bbox set it
    if (layerBbox && layerBbox !== prevProps.layerBbox) {
      setMapSettings({ bbox: layerBbox });
    }

    // if geostore changes set the bbox
    if (geostoreBbox && geostoreBbox !== prevProps.geostoreBbox) {
      setMapSettings({ bbox: geostoreBbox });
    }

    // only set bounding box if action allows it
    if (canBound && bbox !== prevProps.bbox) {
      this.setBbox(bbox);
      clearMapInteractions();
    }

    // use state to prev bbox fit if canBound is false
    if (this.state.bbox && this.state.bbox !== prevState.bbox) {
      this.fitBounds(this.state.bbox);
    }

    // fit bounds on cluster if clicked
    if (
      selectedInteraction &&
      !isEqual(selectedInteraction, prevProps.selectedInteraction) &&
      selectedInteraction.data.cluster
    ) {
      const { data, layer, geometry } = selectedInteraction;
      this.state.map
        .getSource(layer.id)
        .getClusterExpansionZoom(data.cluster_id, (err, newZoom) => {
          if (err) return;
          const { coordinates } = geometry;
          this.setMapPosition(coordinates[1], coordinates[0], newZoom);
        });
    }

    // sync position props with state
    // on iOS you are only allowed 100 url changes per 30secs.
    // we use state to debounce the view port changes to the store
    if (
      lat !== prevProps.lat ||
      lng !== prevProps.lng ||
      zoom !== prevProps.zoom
    ) {
      this.setPositionState({
        zoom,
        lat,
        lng
      });
    }
  }

  /**
   * Set reference to map and state
   */
  setMap = map => {
    this.setState({ map });
  };

  // we need the map size in order to get find the viewport
  setMapRect = map => {
    if (map && !this.state.width && !this.state.height) {
      const mapEl = map.getBoundingClientRect();
      this.setState({ width: mapEl.width, height: mapEl.height });
    }
  };

  setPositionState = position => {
    this.setState(position);
  };

  setBbox = bbox => {
    this.setState({ bbox });
  };

  /**
   * Change map view based on new lat lng and zoom
   */
  setMapPosition = (lat, lng, zoom) => {
    const { setMapSettings } = this.props;
    const { width, height } = this.state;
    if (width && height) {
      const newViewport = new WebMercatorViewport({
        width,
        height,
        longitude: lng,
        latitude: lat,
        zoom,
        pitch: 0,
        bearing: 0
      });
      const { latitude, longitude } = newViewport;
      setMapSettings({
        center: {
          lat: latitude,
          lng: longitude
        },
        zoom: newViewport.zoom
      });
    }
  };

  /**
   * Fit bounds using viewport-web-mercator
   */
  fitBounds = bbox => {
    const { lat, lng, zoom, setMapSettings } = this.props;
    const { width, height } = this.state;
    if (bbox && width && height) {
      const viewport = new WebMercatorViewport({
        width,
        height,
        longitude: lng,
        latitude: lat,
        zoom,
        pitch: 0,
        bearing: 0
      });
      const newViewport = viewport.fitBounds(
        [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
        {
          padding: 50
        }
      );
      const { latitude, longitude } = newViewport;
      setMapSettings({
        center: {
          lat: latitude,
          lng: longitude
        },
        zoom: newViewport.zoom
      });
    }
  };

  /**
   * Change map view based on new lat lng and zoom
   */
  handleMapMove = viewport => {
    const { latitude, longitude, zoom } = viewport;
    const { mapOptions: { maxZoom, minZoom } } = this.props;
    let newZoom = zoom;
    if (zoom > maxZoom) newZoom = maxZoom;
    if (zoom < minZoom) newZoom = minZoom;

    this.setState({
      zoom: newZoom,
      lat: latitude,
      lng: longitude
    });

    this.setMapViewport({
      zoom: newZoom,
      center: {
        lat: latitude,
        lng: longitude
      }
    });

    this.setBbox(null);
  };

  /**
   * Debounce url updates for iOS devices
   */
  setMapViewport = debounce(view => {
    this.props.setMapSettings({
      ...view,
      canBound: false,
      bbox: null
    });
  }, 300);

  /**
   * Save all data onClick to store
   */
  handleMapInteraction = e => {
    const { drawing, setMapInteraction } = this.props;
    if (!drawing && e.features && e.features.length) {
      setMapInteraction(e);
    }
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      setMap: this.setMap,
      setMapRect: this.setMapRect,
      setBbox: this.setBbox,
      handleMapMove: this.handleMapMove,
      handleMapInteraction: this.handleMapInteraction
    });
  }
}

MapContainer.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  zoom: PropTypes.number,
  mapOptions: PropTypes.object,
  drawing: PropTypes.bool,
  canBound: PropTypes.bool,
  bbox: PropTypes.array,
  geostoreBbox: PropTypes.array,
  layerBbox: PropTypes.array,
  selectedInteraction: PropTypes.object,
  setMapSettings: PropTypes.func,
  setMapInteraction: PropTypes.func,
  clearMapInteractions: PropTypes.func
};

reducerRegistry.registerModule('map', {
  actions,
  reducers,
  initialState
});

export default connect(getMapProps, actions)(MapContainer);
