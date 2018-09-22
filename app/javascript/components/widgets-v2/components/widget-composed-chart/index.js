import { connect } from 'react-redux';

import * as actions from 'components/widgets-v2/actions';
import Component from './component';

export default connect(null, actions)(Component);
