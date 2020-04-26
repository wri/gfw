import { connect } from 'react-redux';

import { setAreaOfInterestModalSettings } from 'components/modals/area-of-interest/actions';
import { viewArea } from 'providers/areas-provider/actions';
import { setShareModal } from 'components/modals/share/actions';

import getAreasTableProps from './selectors';
import Component from './component';

export default connect(getAreasTableProps, {
  setAreaOfInterestModalSettings,
  viewArea,
  setShareModal,
})(Component);
