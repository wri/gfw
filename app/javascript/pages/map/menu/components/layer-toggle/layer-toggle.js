import { connect } from 'react-redux';

import modalActions from 'components/modals/meta/meta-actions';
import mapActions from 'components/map/map-actions';
import Component from './layer-toggle-component';

const actions = {
  ...modalActions,
  ...mapActions
};

export default connect(null, actions)(Component);
