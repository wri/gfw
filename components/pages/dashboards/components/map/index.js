import { connect } from 'react-redux';

import { handleLocationChange } from 'components/pages/dashboards/actions';
import Component from './component';

export default connect(null, {
  handleLocationChange,
})(Component);
