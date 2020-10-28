import { connect } from 'react-redux';
import { selectActiveLang } from 'utils/lang';

import { setConfirmSubscriptionModalSettings } from 'components/modals/confirm-subscription/actions';

import Component from './component';

export default connect(
  (state) => ({
    lang: selectActiveLang(state),
  }),
  { setConfirmSubscriptionModalSettings }
)(Component);
