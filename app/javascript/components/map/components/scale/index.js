import { connect } from 'react-redux';

import { getMapScaleProps } from './selectors';
import Component from './component';

export default connect(getMapScaleProps)(Component);
