import { connect } from 'react-redux';
import { selectActiveLang } from 'app/layouts/root/selectors';

import { setConfirmSubscriptionModalSettings } from 'components/modals/confirm-subscription/actions';

import Component from './component';

export default connect(state => ({
  lang: selectActiveLang(state)
}), { setConfirmSubscriptionModalSettings })(Component);
