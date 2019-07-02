import { connect } from 'react-redux';

import { getUserProfleProps } from './selectors';
import Component from './component';

export default connect(getUserProfleProps)(Component);
