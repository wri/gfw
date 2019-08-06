import { connect } from 'react-redux';

import {
  goToAOI,
  setSaveAOISettings
} from 'components/modals/save-aoi/actions';

import Component from './component';
import { getMyGFWProps } from './selectors';

export default connect(getMyGFWProps, {
  goToAOI,
  setSaveAOISettings
})(Component);
