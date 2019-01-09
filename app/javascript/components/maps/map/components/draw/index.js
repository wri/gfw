import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';

import 'leaflet-draw/dist/leaflet.draw';
import './styles.scss';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getDrawProps } from './selectors';
import polygonConfig from './config';

class MapDraw extends PureComponent {
  componentDidMount() {
    const { map, getGeostoreId } = this.props;

    this.layers = new L.FeatureGroup(); // eslint-disable-line
    map.addLayer(this.layers);

    map.on(
      'draw:created',
      debounce(e => {
        const layer = e.layer;

        this.layers.addLayer(layer);
        getGeostoreId(layer.toGeoJSON());
      }),
      100
    );

    this.polygon = new L.Draw.Polygon(map, polygonConfig); // eslint-disable-line
    this.polygon.enable();
  }

  componentDidUpdate(prevProps) {
    const { geostoreId, setDrawnGeostore } = this.props;

    if (geostoreId && !isEqual(geostoreId, prevProps.geostoreId)) {
      setDrawnGeostore(geostoreId);
    }
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
  geostoreId: PropTypes.string,
  getGeostoreId: PropTypes.func,
  setDrawnGeostore: PropTypes.func
};

reducerRegistry.registerModule('draw', {
  actions,
  reducers,
  initialState
});

export default connect(getDrawProps, actions)(MapDraw);
