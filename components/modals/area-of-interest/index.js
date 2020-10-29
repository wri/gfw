import { connect } from 'react-redux';

import { setMenuSettings } from 'components/map-menu/actions';
import { setAreaOfInterestModalSettings } from './actions';

import Component from './component';
import { getAOIModalProps } from './selectors';

export default connect(getAOIModalProps, {
  setMenuSettings,
  setAreaOfInterestModalSettings,
})(Component);
