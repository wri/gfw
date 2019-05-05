import { connect } from 'react-redux';

import * as actions from './actions';
import { getMapProps } from './selectors';
import MapComponent from './component';

export default connect(getMapProps, actions)(MapComponent);
