import { connect } from 'react-redux';

import { setShareModal } from 'components/modals/share/share-actions';
import { setModalWelcomeOpen } from 'components/modals/welcome/actions';
import { setMenuSettings } from 'components/map-menu/actions';
import { setMapSettings } from 'components/map/actions';
import { setMainMapSettings } from 'layouts/map/actions';

import Component from './component';
import getMapControlsProps from './selectors';

export default connect(getMapControlsProps, {
  setShareModal,
  setMenuSettings,
  setModalWelcomeOpen,
  setMapSettings,
  setMainMapSettings
})(Component);
