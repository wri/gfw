import { connect } from 'react-redux';

import { setShowMapMobile } from 'components/map/actions';
import * as ownActions from './actions';
import { getDashboardsProps } from './selectors';
import Component from './component';

export default connect(getDashboardsProps, { ...ownActions, setShowMapMobile })(
  Component
);
