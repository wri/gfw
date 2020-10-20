import { connect } from 'react-redux';

import { handleLocationChange } from 'components/pagesdashboards/actions';
import Component from './component';

export default connect(null, {
  handleLocationChange
})(Component);
