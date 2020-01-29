import { connect } from 'react-redux';

import * as shareActions from 'components/modals/share/share-actions';
import { handleLocationChange } from 'pages/dashboards/actions';
import { setAreaOfInterestModalSettings } from 'components/modals/area-of-interest/actions';
import { getHeaderProps } from './selectors';
import HeaderComponent from './component';

const actions = {
  ...shareActions,
  handleLocationChange,
  setAreaOfInterestModalSettings
};

export default connect(getHeaderProps, actions)(HeaderComponent);
