
import { connect } from 'react-redux';

import actions from 'components/modals/meta/meta-actions';
import Component from './layer-toggle-component';

export default connect(null, actions)(Component);
