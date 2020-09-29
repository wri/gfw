import { connect } from 'react-redux';

import { setMapSettings, clearMapInteractions } from 'components/map/actions';
import Component from './component';
import { getPopupProps } from './selectors';

import './styles.scss';

export default connect(getPopupProps, { setMapSettings, clearMapInteractions })(
  Component
);
