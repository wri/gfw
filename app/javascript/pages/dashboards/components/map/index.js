import { connect } from 'react-redux';

import { handleLocationChange } from 'pages/dashboards/actions';
import Component from './component';

export default connect(null, {
  handleLocationChange
})(Component);
