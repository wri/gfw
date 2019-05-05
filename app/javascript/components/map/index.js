import { connect } from 'react-redux';
import {
  setMapViewport,
  setMapInteractions,
  setMapHoverInteractions
} from 'modules/map/actions';
import { setFullscreen } from 'modules/fullscreen/actions';

import MapComponent from './component';

export default connect(
  state => ({
    ...state.map
  }),
  {
    setFullscreen,
    setMapViewport,
    setMapInteractions,
    setMapHoverInteractions
  }
)(MapComponent);
