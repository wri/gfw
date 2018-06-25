import { connect } from 'react-redux';

import actions from 'components/modals/share/share-actions';
import Component from './map-controls-component';

export default connect(null, actions)(Component);
