import { connect } from 'react-redux';

import { getRecentImageMapProps } from './selectors';
import MapComponent from './component';

export default connect(getRecentImageMapProps)(MapComponent);
