import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';
import { getAreaOfInterestProps } from './selectors';

export default connect(getAreaOfInterestProps, actions)(Component);
