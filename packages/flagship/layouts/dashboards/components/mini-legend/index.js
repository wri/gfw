import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';
import { getMiniLegendProps } from './selectors';

export default connect(getMiniLegendProps, actions)(Component);
