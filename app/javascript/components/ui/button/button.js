import { connect } from 'react-redux';

import Component from './button-component';
import * as actions from './button-actions';

export default connect(null, actions)(Component);
