import { connect } from 'react-redux';

import {
  clearMapInteractions,
  setMapInteractionSelected,
} from 'components/map/actions';
import Component from './component';
import { getPopupProps } from './selectors';

import './styles.module.scss';

export default connect(getPopupProps, {
  clearMapInteractions,
  setMapInteractionSelected,
})(Component);
