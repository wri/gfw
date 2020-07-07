import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';
import { getConfirmSubscriptionModalProps } from './selectors';

export default connect(getConfirmSubscriptionModalProps, actions)(
  Component
);
