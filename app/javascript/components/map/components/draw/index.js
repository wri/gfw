import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { logEvent } from 'app/analytics';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import drawConfig from './config';

class Draw extends PureComponent {
  componentDidMount() {
    if (this.props.drawing) {
      this.initDrawing();
    }
  }

  componentDidUpdate(prevProps) {
    const { drawing } = this.props;

    // start drawing
    if (drawing && !isEqual(drawing, prevProps.drawing)) {
      this.initDrawing();
    }

    // stop drawing
    if (!drawing && !isEqual(drawing, prevProps.drawing)) {
      this.closeDrawing();
    }
  }

  initDrawing = () => {
    const { map, onDrawComplete } = this.props;

    this.draw = new MapboxDraw(drawConfig);
    map.addControl(this.draw);

    if (this.draw.changeMode) {
      this.draw.changeMode('draw_polygon');
    }

    map.on('draw.create', e => {
      const geoJSON = e.features && e.features[0];
      if (geoJSON) {
        onDrawComplete(geoJSON);
        logEvent('analysisDrawComplete');
      }
    });
  };

  closeDrawing = () => {
    const { map } = this.props;
    map.off('draw.create');
    map.removeControl(this.draw);
  };

  render() {
    return null;
  }
}

Draw.propTypes = {
  map: PropTypes.object,
  drawing: PropTypes.bool,
  onDrawComplete: PropTypes.func
};

export default Draw;
