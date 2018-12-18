import { connect } from 'react-redux';

import * as ownActions from './actions';
import { getDashboardsProps } from './selectors';
import Component from './component';

export default connect(getDashboardsProps, {
  ...ownActions
})(Component);
