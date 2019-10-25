import { connect } from 'react-redux';

import * as shareActions from 'components/modals/share/share-actions';
import { handleLocationChange } from 'pages/dashboards/actions';
import { setSaveAOISettings } from 'components/modals/save-aoi/actions';
import { getHeaderProps } from './selectors';
import HeaderComponent from './component';

const actions = {
  ...shareActions,
  handleLocationChange,
  setSaveAOISettings
};

export default connect(getHeaderProps, actions)(HeaderComponent);
