import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MapComponent from './component';
import { getMapProps } from './selectors';

import { setInteraction } from './components/popup/actions';
import { setRecentImagerySettings } from './components/recent-imagery/recent-imagery-actions';
import * as ownActions from './actions';

const actions = {
  setInteraction,
  setRecentImagerySettings,
  ...ownActions
};

class MapContainer extends PureComponent {
  static propTypes = {
    basemap: PropTypes.object,
    mapOptions: PropTypes.object,
    setLandsatBasemap: PropTypes.func
  };

  state = {
    showTooltip: false,
    tooltipData: {},
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
      layerBbox
    } = this.props;

    // update landsat basemap when changing zoom
    if (basemap.id === 'landsat' && zoom !== prevProps.zoom) {
      this.props.setLandsatBasemap(basemap.year, basemap.defaultUrl);
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

  handleShowTooltip = (show, data) => {
    this.setState({ showTooltip: show, tooltipData: data });
  };

  setBbox = bbox => {
    this.setState({ bbox });
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      handleShowTooltip: this.handleShowTooltip,
      setBbox: this.setBbox
    });
  }
}

MapContainer.propTypes = {
  canBound: PropTypes.bool,
  bbox: PropTypes.array,
  geostoreBbox: PropTypes.array,
  setMapSettings: PropTypes.func,
  layerBbox: PropTypes.array
};

export default connect(state => getMapProps(state), actions)(MapContainer);
