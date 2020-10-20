import { connect } from 'react-redux';

import Component from './component';
import { getMyGFWProps } from './selectors';

export default connect(getMyGFWProps)(Component);
