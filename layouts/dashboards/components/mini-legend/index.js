import { connect } from 'react-redux';
import { setMapSettings } from 'components/map/actions';

import Component from './component';
import * as actions from './actions';

import { getMiniLegendProps } from './selectors';

export default connect(getMiniLegendProps, {
  ...actions,
  setMapSettings,
})(Component);
