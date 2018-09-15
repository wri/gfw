import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import 'leaflet-draw/dist/leaflet.draw';

// import Component from './component';

class MapDraw extends PureComponent {
  componentDidMount() {
    const { map } = this.props;
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    this.drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems
      }
    });
    map.addControl(this.drawControl);

    new L.Draw.Feature(map, {
      edit: {
        featureGroup: drawnItems
      }
    }).enable();
  }

  componentWillUnmount() {
    this.props.map.removeControl(this.drawControl);
  }

  render() {
    return null;
  }
}

MapDraw.propTypes = {
  map: PropTypes.object
};

export default MapDraw;
