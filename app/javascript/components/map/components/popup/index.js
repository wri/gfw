import { connect } from 'react-redux';

import * as actions from 'components/map/actions';
import Component from './component';
import { getPopupProps } from './selectors';

import './styles.scss';

export default connect(getPopupProps, actions)(Component);
