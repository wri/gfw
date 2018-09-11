import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MapComponent from './component';
import { getMapProps } from './selectors';

import { setInteraction } from './components/popup/actions';
import { setRecentImagerySettings } from './components/recent-imagery/recent-imagery-actions';
import ownActions from './actions';

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

  componentDidUpdate({ mapOptions: { prevZoom } }) {
    const { basemap, mapOptions: { zoom } } = this.props;
    if (basemap.id === 'landsat' && prevZoom !== zoom) {
      this.props.setLandsatBasemap(basemap.year, basemap.defaultUrl);
    }
  }

  render() {
    return createElement(MapComponent, {
      ...this.props
    });
  }
}

export { actions };

export default connect(state => getMapProps(state), actions)(MapContainer);
