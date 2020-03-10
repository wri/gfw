import { connect } from 'react-redux';
import Component from './component';

import mapStateToProps from './selectors';

export default connect(mapStateToProps, null)(Component);
