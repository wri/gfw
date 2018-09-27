import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import 'leaflet-draw/dist/leaflet.draw';
import './styles.scss';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import polygonConfig from './config';

class MapDraw extends PureComponent {
  componentDidMount() {
    const { map, getGeostoreId } = this.props;

    this.layers = new L.FeatureGroup(); // eslint-disable-line
    map.addLayer(this.layers);

    map.on('draw:created', e => {
      const layer = e.layer;

      this.layers.addLayer(layer);
      getGeostoreId(layer.toGeoJSON());
    });

    this.polygon = new L.Draw.Polygon(map, polygonConfig); // eslint-disable-line
    this.polygon.enable();
  }

  componentWillUnmount() {
    const { map } = this.props;
    this.polygon.disable();
    map.removeLayer(this.layers);
  }

  render() {
    return null;
  }
}

MapDraw.propTypes = {
  map: PropTypes.object,
  getGeostoreId: PropTypes.func
};

export const reduxModule = { actions, reducers, initialState };

export default connect(null, actions)(MapDraw);
