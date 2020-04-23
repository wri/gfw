import { connect } from 'react-redux';

import { setMenuSettings } from 'components/map-menu/actions';

import Component from './component';
import * as actions from './actions';
import { getAOIModalProps } from './selectors';

export default connect(getAOIModalProps, { ...actions, setMenuSettings })(
  Component
);
