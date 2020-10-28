import { connect } from 'react-redux';

import { setAreaOfInterestModalSettings } from 'components/modals/area-of-interest/actions';

import * as shareActions from 'components/modals/share/actions';
import { handleLocationChange } from 'layouts/dashboards/actions';
import { getHeaderProps } from './selectors';
import HeaderComponent from './component';

const actions = {
  ...shareActions,
  handleLocationChange,
  setAreaOfInterestModalSettings,
};

export default connect(getHeaderProps, actions)(HeaderComponent);
