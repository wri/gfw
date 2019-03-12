import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './styles.scss';

import drawConfig from './config';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getDrawProps } from './selectors';

class MapDraw extends PureComponent {
  componentDidMount() {
    if (this.props.drawing) {
      this.initDrawing();
    }
  }

  componentDidUpdate(prevProps) {
    const { drawing, geostoreId, setDrawnGeostore } = this.props;

    // start drawing
    if (drawing && !isEqual(drawing, prevProps.drawing)) {
      this.initDrawing();
    }

    // stop drawing
    if (!drawing && !isEqual(drawing, prevProps.drawing)) {
      this.closeDrawing();
    }

    // new closed shape
    if (geostoreId && !isEqual(geostoreId, prevProps.geostoreId)) {
      setDrawnGeostore(geostoreId);
    }
  }

  initDrawing = () => {
    const { map, getGeostoreId } = this.props;

    this.draw = new MapboxDraw(drawConfig);
    map.addControl(this.draw);

    if (this.draw.changeMode) {
      this.draw.changeMode('draw_polygon');
    }

    map.on('draw.create', (e) => {
      const geoJSON = e.features && e.features[0];
      if (geoJSON) {
        getGeostoreId(geoJSON);
      }
    });
  }

  closeDrawing = () => {
    const { map } = this.props;
    map.off('draw.create');
    map.removeControl(this.draw);
  }

  render() {
    return null;
  }
}

MapDraw.propTypes = {
  map: PropTypes.object,
  drawing: PropTypes.bool,
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
