import { connect } from 'react-redux';

import { setMainMapSettings } from 'components/maps/main-map/actions';
import { setMapSettings } from 'components/maps/map/actions';
import { setMenuSettings } from 'components/maps/components/menu/menu-actions';
import * as actions from './actions';
import Component from './component';

import { getMapPromptsProps } from './selectors';

export default connect(getMapPromptsProps, {
  ...actions,
  setMainMapSettings,
  setMenuSettings,
  setMapSettings
})(Component);
