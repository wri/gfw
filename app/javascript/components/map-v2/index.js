import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MapComponent from './component';
import { getMapProps } from './selectors';

import { setInteraction } from './components/popup/actions';
import ownActions from './actions';

const actions = {
  setInteraction,
  ...ownActions
};

const mapStateToProps = ({ location, datasets, geostore }) => ({
  ...getMapProps({
    geostore: geostore.geostore,
    query: location.query,
    datasets: datasets.datasets,
    loading: datasets.loading
  })
});

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

export default connect(mapStateToProps, actions)(MapContainer);
