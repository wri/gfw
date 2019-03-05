import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';
import WebMercatorViewport from 'viewport-mercator-project';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import {
  setInteraction,
  clearInteractions
} from 'components/maps/map/components/popup/actions';
import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import { getMapProps } from './selectors';
import MapComponent from './component';

const actions = {
  setInteraction,
  clearInteractions,
  ...ownActions
};

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
      selectedInteraction
    } = this.props;

    // only set bounding box if action allows it
    if (canBound && bbox !== prevProps.bbox) {
      this.setBbox(bbox);
      this.props.clearInteractions();
    }

    if (this.state.bbox && this.state.bbox !== prevState.bbox) {
      this.fitBounds(this.state.bbox);
    }

    // if a new layer contains a bbox
    if (layerBbox && layerBbox !== prevProps.layerBbox) {
      setMapSettings({ bbox: layerBbox });
    }

    // if geostore changes
    if (geostoreBbox && geostoreBbox !== prevProps.geostoreBbox) {
      setMapSettings({ bbox: geostoreBbox });
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
  }

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

  setBbox = bbox => {
    this.setState({ bbox });
  };

  setMapRect = map => {
    if (map && !this.state.width && !this.state.height) {
      const mapEl = map.getBoundingClientRect();
      this.setState({ width: mapEl.width, height: mapEl.height });
    }
  };

  setMap = map => {
    this.setState({ map });
  };

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

  setMapViewport = debounce(view => {
    this.props.setMapSettings({
      ...view,
      canBound: false,
      bbox: null
    });
  }, 300);

  handleMapInteraction = e => {
    const { draw, menuSection } = this.props;
    if (!draw && !menuSection && e.features && e.features.length) {
      this.props.setInteraction(e);
    }
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      handleMapInteraction: this.handleMapInteraction,
      handleMapMove: this.handleMapMove,
      setBbox: this.setBbox,
      setMapRect: this.setMapRect,
      setMap: this.setMap
    });
  }
}

MapContainer.propTypes = {
  canBound: PropTypes.bool,
  bbox: PropTypes.array,
  geostoreBbox: PropTypes.array,
  setMapSettings: PropTypes.func,
  mapOptions: PropTypes.object,
  setInteraction: PropTypes.func,
  layerBbox: PropTypes.array,
  draw: PropTypes.bool,
  menuSection: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  zoom: PropTypes.number,
  clearInteractions: PropTypes.func,
  selectedInteraction: PropTypes.object
};

reducerRegistry.registerModule('map', {
  actions: ownActions,
  reducers,
  initialState
});

export default connect(getMapProps, actions)(MapContainer);
