import { connect } from 'react-redux';

import { logUserIn } from 'providers/mygfw-provider/actions';
import * as ownActions from './actions';
import Component from './component';

export default connect(null, { ...ownActions, logUserIn })(Component);
