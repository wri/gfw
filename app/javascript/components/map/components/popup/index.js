import { connect } from 'react-redux';

import { setMapSettings, clearMapInteractions } from 'components/map/actions';

import Component from './component';
import { getPopupProps } from './selectors';

import './styles.scss';

const actions = {
  clearMapInteractions,
  setMapSettings
};

export default connect(getPopupProps, actions)(Component);
