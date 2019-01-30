import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './styles.scss';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getDrawProps } from './selectors';

class MapDraw extends PureComponent {
  componentDidMount() {
    const { map, getGeostoreId } = this.props;

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#97be32',
            'line-width': 3
          }
        },
        // polygon fill
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': 'transparent'
          }
        },
        // polygon outline stroke
        // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#97be32',
            'line-width': 3
          }
        },
        // vertex point halos
        {
          id: 'gl-draw-polygon-and-line-vertex-halo-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 8,
            'circle-color': '#000'
          }
        },
        // vertex points
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 6,
            'circle-color': '#fff'
          }
        },

        // INACTIVE (static, already drawn)
        // line stroke
        {
          id: 'gl-draw-line-static',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#97be32',
            'line-width': 3
          }
        },
        // polygon fill
        {
          id: 'gl-draw-polygon-fill-static',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          paint: {
            'fill-color': '#000',
            'fill-outline-color': '#000',
            'fill-opacity': 0.1
          }
        },
        // polygon outline
        {
          id: 'gl-draw-polygon-stroke-static',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#000',
            'line-width': 3
          }
        },
        {
          id: 'gl-draw-point-static',
          type: 'circle',
          filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#ff0000'
          }
        }
      ]
    });
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

  componentDidUpdate(prevProps) {
    const { geostoreId, setDrawnGeostore } = this.props;

    if (geostoreId && !isEqual(geostoreId, prevProps.geostoreId)) {
      setDrawnGeostore(geostoreId);
    }
  }

  componentWillUnmount() {
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
