import { connect } from 'react-redux';

import ModalProfileComponent from './component';
import * as actions from './actions';
import { getProfileModalProps } from './selectors';

export default connect(getProfileModalProps, actions)(ModalProfileComponent);
