import { connect } from 'react-redux';

import {
  clearMapInteractions,
  setMapInteractionSelected,
} from 'components/map/actions';
import Component from './component';
import { getPopupProps } from './selectors';

export default connect(getPopupProps, {
  clearMapInteractions,
  setMapInteractionSelected,
})(Component);
