import { connect } from 'react-redux';
import WorldMap from './component';
import { getWorldMapProps } from './selectors';

export default connect(getWorldMapProps)(WorldMap);
