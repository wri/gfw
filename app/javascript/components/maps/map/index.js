import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { track } from 'app/analytics';
import reducerRegistry from 'app/registry';

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

  handleMapInteraction = ({ lngLat, features }) => {
    const { draw, menuSection } = this.props;
    if (!draw && !menuSection) {
      this.props.setInteraction({
        data,
        ...e,
        label: layer.name,
        article,
        isBoundary: layer.isBoundary,
        id: layer.id,
        value: layer.id,
        config: output
      });
      track('mapInteraction', {
        label: layer.name
      });
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
