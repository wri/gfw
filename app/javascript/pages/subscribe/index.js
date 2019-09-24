import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setModalMetaSettings } from 'components/modals/meta/meta-actions';
import * as actions from 'components/modals/subscribe/actions';
import reducers, { initialState } from 'components/modals/subscribe/reducers';
import { getModalSubscribeProps } from 'components/modals/subscribe/selectors';
import PageComponent from './component';

reducerRegistry.registerModule('modalSubscribe', {
  actions,
  reducers,
  initialState
});
export default connect(getModalSubscribeProps, {
  ...actions,
  setModalMetaSettings
})(PageComponent);

// export default PageComponent;
