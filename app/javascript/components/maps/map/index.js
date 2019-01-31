import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';
import WebMercatorViewport from 'viewport-mercator-project';

import { setInteraction } from 'components/maps/map/components/popup/actions';
import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import { getMapProps } from './selectors';
import MapComponent from './component';

const actions = {
  setInteraction,
  ...ownActions
};

class MapContainer extends PureComponent {
  static propTypes = {
    basemap: PropTypes.object,
    mapOptions: PropTypes.object,
    setLandsatBasemap: PropTypes.func
  };

  state = {
    bbox: null
  };

  componentDidUpdate(prevProps) {
    const {
      basemap,
      mapOptions: { zoom },
      canBound,
      bbox,
      geostoreBbox,
      setMapSettings,
      layerBbox,
      setLandsatBasemap
    } = this.props;

    // update landsat basemap when changing zoom
    if (basemap.value === 'landsat' && zoom !== prevProps.zoom) {
      setLandsatBasemap({
        basemap,
        year: basemap.year,
        zoom
      });
    }

    // only set bounding box if action allows it
    if (canBound && bbox !== prevProps.bbox) {
      this.setBbox(bbox);
    }

    // if a new layer contains a bbox
    if (layerBbox && layerBbox !== prevProps.layerBbox) {
      setMapSettings({ bbox: layerBbox });
    }

    // if geostore changes
    if (geostoreBbox && geostoreBbox !== prevProps.geostoreBbox) {
      setMapSettings({ bbox: geostoreBbox });
    }
  }

  setBbox = bbox => {
    this.setState({ bbox });
    const { lat, lng, zoom, setMapSettings } = this.props;
    if (bbox) {
      const viewport = new WebMercatorViewport({ width: '100%', height: '100%', longitude: lng, latitude: lat, zoom, pitch: 0, bearing: 0 });
      const newViewport = viewport.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
        padding: 50
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

  handleMapMove = viewport => {
    const { latitude, longitude, zoom } = viewport;
    const { setMapSettings, mapOptions: { maxZoom, minZoom } } = this.props;
    let newZoom = zoom;
    if (zoom > maxZoom) newZoom = maxZoom;
    if (zoom < minZoom) newZoom = minZoom;

    setMapSettings({
      zoom: newZoom,
      center: {
        lat: latitude,
        lng: longitude
      },
      canBound: false,
      bbox: null
    });

    this.setBbox(null);
  };

  handleMapInteraction = (e) => {
    const { draw, menuSection } = this.props;
    if (!draw && !menuSection) {
      console.log('interacting...');
      // this.props.setInteraction({
      //   data,
      //   ...e,
      //   label: layer.name,
      //   article,
      //   isBoundary: layer.isBoundary,
      //   id: layer.id,
      //   value: layer.id,
      //   config: output
      // });
      // track('mapInteraction', {
      //   label: layer.name
      // });
    }
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      handleMapInteraction: this.handleMapInteraction,
      handleMapMove: this.handleMapMove,
      setBbox: this.setBbox
    });
  }
}

MapContainer.propTypes = {
  canBound: PropTypes.bool,
  bbox: PropTypes.array,
  geostoreBbox: PropTypes.array,
  setMapSettings: PropTypes.func,
  layerBbox: PropTypes.array,
  draw: PropTypes.bool,
  setInteraction: PropTypes.func,
  menuSection: PropTypes.string
};

reducerRegistry.registerModule('map', {
  actions: ownActions,
  reducers,
  initialState
});

export default connect(getMapProps, actions)(MapContainer);
