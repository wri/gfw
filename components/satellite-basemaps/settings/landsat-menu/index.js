import { connect } from 'react-redux';

import Component from './component';
import planetMenuSelectors from './selectors';

export default connect(planetMenuSelectors)(Component);
