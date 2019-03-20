import { connect } from 'react-redux';

import { setMapSettings } from 'components/map/actions';
import Component from './component';
import { getPopupProps } from './selectors';

import './styles.scss';

const actions = {
  setMapSettings
};

export default connect(getPopupProps, actions)(Component);
