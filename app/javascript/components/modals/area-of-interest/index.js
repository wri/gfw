import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';
import { getAOIModalProps } from './selectors';

export default connect(getAOIModalProps, actions)(Component);
