import { connect } from 'react-redux';

import ModalProfileComponent from './component';
import * as actions from './actions';
import getModalAOIProps from './selectors';

export default connect(getModalAOIProps, actions)(ModalProfileComponent);
