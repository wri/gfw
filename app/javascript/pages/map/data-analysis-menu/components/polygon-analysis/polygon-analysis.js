import { connect } from 'react-redux';

import actions from 'pages/map/data-analysis-menu/actions';
import Component from './chose-analysis-component';

export default connect(null, actions)(Component);
