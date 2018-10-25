import { connect } from 'react-redux';

import { setModalMeta } from 'components/modals/meta/meta-actions';
import * as actions from './actions';
import ModalSubscribeComponent from './component';
import { getModalSubscribeProps } from './selectors';

export default connect(getModalSubscribeProps, { ...actions, setModalMeta })(
  ModalSubscribeComponent
);
