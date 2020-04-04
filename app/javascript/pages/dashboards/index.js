import { connect } from 'react-redux';

import { setMapSettings } from 'components/map/actions';
import { setDashboardPromptsSettings } from 'components/prompts/dashboard-prompts/actions';
import * as ownActions from './actions';
import { getDashboardsProps } from './selectors';
import Component from './component';

export default connect(getDashboardsProps, {
  ...ownActions,
  setMapSettings,
  setDashboardPromptsSettings
})(Component);
