import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';

export default connect(null, actions)(Component);
